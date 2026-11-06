import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../build/worker.js', import.meta.url), 'utf8');
const {default:worker} = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const originalFetch = globalThis.fetch;
const keyA = 'sk-test-only-not-a-real-secret-alpha';
const keyB = 'sk-test-only-not-a-real-secret-bravo';
const answer = {answers:'我希望保留自己的朋友，也愿意认真关心对方。', apiKey:keyA};
const env = {OPENAI_API_KEY:'禁止使用的站长测试密钥', OPENAI_MODEL:'禁止使用的环境模型', DB:{prepare(){throw new Error('不应访问数据库');}}};
const request = (data=answer, headers={}, options={}) => new Request('https://example.test/api/analyze', {
  method:'POST', headers:{'content-type':'application/json', origin:'https://example.test', ...headers},
  body:JSON.stringify(data), ...options
});
const completed = (analysis='这是测试生成的分析。', extra={}) => new Response(JSON.stringify({
  status:'completed',model:'gpt-6.1-sol',reasoning:{effort:'high'},
  output:[{type:'message',content:[{type:'output_text',text:analysis}]}], ...extra
}), {headers:{'content-type':'application/json'}});
let calls = [];
const success = async (url, init) => { calls.push({url, init, payload:JSON.parse(init.body)}); return completed(); };

try {
  globalThis.fetch = success;
  let response = await worker.fetch(request(), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  let result = await response.json();
  assert.equal(result.analysis, '这是测试生成的分析。');
  assert.equal(result.model, 'gpt-6.1-sol');
  assert.equal(result.reasoningEffort, 'high');
  assert.equal(result.analysisRevision, 3);
  const call = calls[0];
  assert.equal(call.url, 'https://api.openai.com/v1/responses');
  assert.equal(call.init.redirect, 'error');
  assert.equal(call.init.headers.authorization, `Bearer ${keyA}`);
  assert.equal(call.payload.model, 'gpt-6.1-sol');
  assert.equal(call.payload.store, false);
  assert.equal(call.payload.reasoning.effort, 'high');
  assert.equal(call.payload.max_output_tokens, 12000);
  assert.equal(call.payload.input[1].content, answer.answers);
  assert.ok(!JSON.stringify(call.payload).includes(keyA));
  assert.match(call.payload.input[0].content, /整体总结/);
  assert.match(call.payload.input[0].content, /大麦哥/);

  calls = [];
  const invalid = [null, [], {}, {answers:answer.answers}, {...answer, apiKey:env.OPENAI_API_KEY}, {...answer, apiKey:'sk-短'}, {...answer, apiKey:`${keyA}\nInjected: yes`}, {...answer, apiKey:{key:keyA}}, {...answer, answers:'甲'.repeat(25001)}, {...answer, answers:42}, {...answer, model:{}}, {...answer, model:'https://evil.test'}, {...answer, model:'a'.repeat(101)}, {...answer, model:''}];
  for (const data of invalid) assert.equal((await worker.fetch(request(data), env)).status, 400);
  assert.equal(calls.length, 0, '无访客密钥时不能回退到任何环境密钥');
  assert.equal((await worker.fetch(request(answer, {origin:'https://other.test'}))).status, 403);
  assert.equal((await worker.fetch(request(answer, {origin:'null'}))).status, 403);
  assert.equal((await worker.fetch(request(answer, {'sec-fetch-site':'cross-site'}))).status, 403);
  assert.equal((await worker.fetch(request(answer, {'content-type':'application/json-malformed'}))).status, 415);
  assert.equal((await worker.fetch(request(answer, {'content-length':'100001'}))).status, 400);
  assert.equal((await worker.fetch(request(answer, {'content-length':'invalid'}))).status, 400);
  assert.equal((await worker.fetch(request(answer, {}, {body:'{未完成'}))).status, 400);
  assert.equal(calls.length, 0);

  const huge = new ReadableStream({start(controller) { controller.enqueue(new Uint8Array(100001)); controller.close(); }});
  assert.equal((await worker.fetch(request(answer, {}, {body:huge,duplex:'half'}))).status, 400);
  const broken = new ReadableStream({start(controller) { controller.error(new Error('模拟读取中断')); }});
  assert.equal((await worker.fetch(request(answer, {}, {body:broken,duplex:'half'}))).status, 400);
  const abort = new AbortController(); abort.abort();
  assert.equal((await worker.fetch(request(answer, {}, {signal:abort.signal}))).status, 400);
  assert.equal(calls.length, 0);

  const cliRequest = request(); cliRequest.headers.delete('origin');
  assert.equal((await worker.fetch(cliRequest)).status, 200);
  calls = [];
  await Promise.all(Array.from({length:8}, (_, i) => worker.fetch(request({...answer, apiKey:i%2 ? keyB:keyA, model:i%2 ? 'gpt-6.1-terra':'gpt-6.1-sol', endpoint:'https://malicious.invalid'}), env)));
  assert.equal(calls.length, 8);
  for (const call of calls) {
    const expectedKey = call.payload.model === 'gpt-6.1-terra' ? keyB : keyA;
    assert.equal(call.init.headers.authorization, `Bearer ${expectedKey}`);
    assert.equal(call.url, 'https://api.openai.com/v1/responses');
    assert.equal(call.payload.input[1].content, answer.answers);
  }

  for (const [upstream, expected] of [[400,400],[401,401],[403,403],[404,404],[429,429],[500,502],[302,502]]) {
    let errorCalls = 0;
    globalThis.fetch = async () => { errorCalls++; return new Response(`错误正文含有 ${keyA} 和账户资料`, {status:upstream}); };
    response = await worker.fetch(request(), env);
    assert.equal(response.status, expected);
    const text = await response.text();
    assert.ok(!text.includes(keyA));
    assert.ok(!text.includes('账户资料'));
    assert.equal(errorCalls, 1, '失败后不能自动重试产生额外费用');
  }
  globalThis.fetch = async () => completed('部分分析', {status:'incomplete'});
  result = await (await worker.fetch(request())).json();
  assert.equal(result.incomplete, true);
  assert.equal(result.analysis, '部分分析');
  globalThis.fetch = async () => completed('', {output:[{type:'reasoning',summary:[]}]});
  assert.equal((await worker.fetch(request())).status, 502);
  globalThis.fetch = async () => new Response('不是合法的返回内容');
  assert.equal((await worker.fetch(request())).status, 504);
  globalThis.fetch = async () => { throw new Error(`模拟网络异常 ${keyA}`); };
  response = await worker.fetch(request());
  assert.equal(response.status, 504);
  assert.ok(!(await response.text()).includes(keyA));
  globalThis.fetch = async () => completed(`不应输出 ${keyA}`, {model:keyA, reasoning:{effort:keyA}});
  result = await (await worker.fetch(request())).json();
  assert.ok(!JSON.stringify(result).includes(keyA));
  assert.equal(result.model, null);
  assert.equal(result.reasoningEffort, null);

  response = await worker.fetch(new Request('https://example.test/'));
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-security-policy'), /connect-src 'self'/);
  const page = await response.text();
  assert.match(page, /爱与我们/);
  assert.ok(!page.includes(keyA));
  assert.equal((await worker.fetch(new Request('https://example.test/.env.local'))).status, 404);
  assert.equal((await worker.fetch(new Request('https://example.test/api/analyze'))).status, 405);
  const head = await worker.fetch(new Request('https://example.test/', {method:'HEAD'}));
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  console.log('接口检查通过：访客密钥隔离、禁止环境回退、请求限制、错误脱敏、部分结果和静态页面均正常。');
} finally {
  globalThis.fetch = originalFetch;
}
