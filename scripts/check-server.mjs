import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { request as httpRequest } from 'node:http';

function launch(publicOrigin = '') {
  const child = spawn(process.execPath, ['scripts/server.mjs'], {
    cwd:new URL('../', import.meta.url),
    env:{...process.env, HOST:'127.0.0.1', PORT:'0', PUBLIC_ORIGIN:publicOrigin, OPENAI_API_KEY:'禁止使用的测试环境密钥'},
    stdio:['ignore','pipe','pipe']
  });
  const output = {stdout:'', stderr:''};
  child.stdout.setEncoding('utf8'); child.stderr.setEncoding('utf8');
  child.stdout.on('data', text => { output.stdout += text; });
  child.stderr.on('data', text => { output.stderr += text; });
  return {child, output};
}

async function withServer(publicOrigin, test) {
  const {child, output} = launch(publicOrigin);
  try {
    const url = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('本地服务器未能及时启动。')), 10000);
      child.once('exit', () => { clearTimeout(timer); reject(new Error('本地服务器提前退出。')); });
      child.once('error', () => { clearTimeout(timer); reject(new Error('无法启动本地服务器。')); });
      child.stdout.on('data', () => {
        const match = output.stdout.match(/http:\/\/127\.0\.0\.1:\d+/);
        if (match) { clearTimeout(timer); resolve(match[0]); }
      });
    });
    await test(url, output);
    assert.ok(!output.stdout.includes('这段话只是测试输入'));
    assert.ok(!output.stdout.includes('禁止使用的测试环境密钥'));
    assert.equal(output.stderr, '');
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      const exited = once(child, 'close');
      child.kill();
      await exited;
    }
  }
}

function rawRequest(url, {method = 'GET', headers = {}, body} = {}) {
  return new Promise((resolve, reject) => {
    const req = httpRequest(url, {method, headers}, res => {
      let text = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { text += chunk; });
      res.on('end', () => resolve({status:res.statusCode, text}));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.end(body);
  });
}

await withServer('', async url => {
  assert.equal((await fetch(url)).status, 200);
  assert.equal((await fetch(`${url}/app.js`)).status, 200);
  assert.equal((await fetch(`${url}/.env.local`)).status, 404);
  let response = await fetch(`${url}/api/analyze`, {method:'POST',headers:{'content-type':'application/json',origin:url},body:JSON.stringify({answers:'这段话只是测试输入。'})});
  assert.equal(response.status, 400);
  assert.match(await response.text(), /密钥/);
  response = await fetch(`${url}/api/analyze`, {method:'POST',headers:{'content-type':'application/json',origin:'https://other.test'},body:'{}'});
  assert.equal(response.status, 403);
  assert.equal((await rawRequest(url, {headers:{host:'malicious.test'}})).status, 403);
  assert.equal((await rawRequest(url, {headers:{host:'malicious.test','x-forwarded-host':'localhost'}})).status, 403);
});

await withServer('https://relationship.example.test', async url => {
  const headers = {host:'relationship.example.test',origin:'https://relationship.example.test','content-type':'application/json'};
  const body = JSON.stringify({answers:'这段话只是测试输入。'});
  assert.equal((await rawRequest(url, {headers:{host:headers.host}})).status, 200);
  let response = await rawRequest(`${url}/api/analyze`, {method:'POST',headers,body});
  assert.equal(response.status, 400, '安全反向代理来源应通过校验，到达缺少访客密钥的检查');
  assert.match(response.text, /密钥/);
  for (const origin of ['https://other.test','http://relationship.example.test','null']) {
    response = await rawRequest(`${url}/api/analyze`, {method:'POST',headers:{...headers,origin},body});
    assert.equal(response.status, 403);
  }
  response = await rawRequest(`${url}/api/analyze`, {method:'POST',headers:{...headers,'x-forwarded-proto':'http','x-forwarded-host':'malicious.test'},body});
  assert.equal(response.status, 400, '任意转发请求头不能改变已配置的来源');
  response = await rawRequest(`${url}/api/analyze`, {method:'POST',headers:{...headers,host:'malicious.test','x-forwarded-host':headers.host},body});
  assert.equal(response.status, 403);
  response = await rawRequest(`${url}/api/analyze`, {method:'POST',headers:{...headers,host:'relationship.example.test:8443'},body});
  assert.equal(response.status, 403);
  response = await rawRequest(`${url}/api/analyze`, {method:'POST',headers:{...headers,origin:'https://other.test','x-forwarded-proto':'https','x-forwarded-host':'other.test'},body});
  assert.equal(response.status, 403);
  assert.equal((await fetch(url)).status, 403, '配置公开来源后必须保留配置中的主机头');
});

await withServer('http://localhost:3000/', async url => {
  const response = await rawRequest(`${url}/api/analyze`, {method:'POST',headers:{host:'localhost:3000',origin:'http://localhost:3000','content-type':'application/json'},body:JSON.stringify({answers:'这段话只是测试输入。'})});
  assert.equal(response.status, 400, '本机来源允许普通连接');
  assert.match(response.text, /密钥/);
});

for (const configured of ['http://public.example.test', 'https://user:password@example.test', 'https://example.test/path', 'https://example.test/a/..', 'https://example.test/?q=1', 'https://example.test/#fragment', 'ftp://example.test', ' https://example.test']) {
  const {child, output} = launch(configured);
  const timer = setTimeout(() => child.kill(), 10000);
  const [code] = await once(child, 'close');
  clearTimeout(timer);
  assert.notEqual(code, 0, '无效公开来源必须拒绝启动');
  assert.match(output.stderr, /公开访问地址配置无效/);
  assert.ok(!output.stdout.includes('本地网页已启动'));
}
console.log('本地与反向代理检查通过：来源和主机校验有效，不信任转发头，不读取环境密钥，不暴露私有文件。');
