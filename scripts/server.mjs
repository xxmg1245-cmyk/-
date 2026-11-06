import './build-worker.mjs';
import { createServer } from 'node:http';
import { Readable } from 'node:stream';
const {default:worker} = await import('../build/worker.js');

const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('端口必须是零到六万五千五百三十五之间的整数。');
const localOnly = ['127.0.0.1', 'localhost', '::1'].includes(host);
const loopbackNames = ['localhost','127.0.0.1','[::1]'];
let publicOrigin = null;
if (process.env.PUBLIC_ORIGIN) {
  try {
    const configured = process.env.PUBLIC_ORIGIN;
    const parsed = new URL(configured);
    if (!/^https?:\/\/[^/?#]+\/?$/.test(configured) || parsed.username || parsed.password ||
        parsed.pathname !== '/' || parsed.search || parsed.hash ||
        !['http:','https:'].includes(parsed.protocol) ||
        (parsed.protocol === 'http:' && !loopbackNames.includes(parsed.hostname))) throw new Error();
    publicOrigin = parsed;
  } catch {
    throw new Error('公开访问地址配置无效：PUBLIC_ORIGIN 只能填写完整站点来源，不含账号、路径、查询或片段；公网地址必须使用安全连接。');
  }
}

const server = createServer(async (req, res) => {
  const abort = new AbortController();
  req.once('aborted', () => abort.abort());
  res.once('close', () => { if (!res.writableEnded) abort.abort(); });
  try {
    const incomingHost = req.headers.host;
    let received = null;
    if (typeof incomingHost === 'string' && /^[^\s/?#@\\]+$/.test(incomingHost)) {
      try { received = new URL(`${publicOrigin?.protocol || 'http:'}//${incomingHost}`); } catch { /* 下方统一拒绝非法主机名。 */ }
    }
    if (!received || received.username || received.password ||
        (publicOrigin ? received.host !== publicOrigin.host : localOnly && !loopbackNames.includes(received.hostname))) {
      res.writeHead(403, {'content-type':'text/plain; charset=utf-8','cache-control':'no-store'});
      res.end(publicOrigin ? '访问地址与服务器配置不一致。' : '本地服务只接受本机地址访问。');
      return;
    }
    // 仅信任显式配置，不采用任意转发来源或转发协议请求头。
    const base = publicOrigin || received;
    const url = new URL(req.url, base);
    if (url.origin !== base.origin) {
      res.writeHead(400, {'content-type':'text/plain; charset=utf-8'});
      res.end('请求地址不正确。');
      return;
    }
    const request = new Request(url, {
      method:req.method,
      headers:req.headers,
      body:['GET','HEAD'].includes(req.method) ? undefined : Readable.toWeb(req),
      duplex:'half', signal:abort.signal
    });
    const response = await worker.fetch(request);
    if (res.destroyed) return;
    res.writeHead(response.status, Object.fromEntries(response.headers));
    if (req.method === 'HEAD' || !response.body) res.end();
    else {
      const body = Readable.fromWeb(response.body);
      body.once('error', () => res.destroy());
      body.pipe(res);
    }
  } catch {
    // 故意不打印请求、异常正文或请求头，避免密钥和回答进入日志。
    if (res.destroyed) return;
    if (!res.headersSent) res.writeHead(500, {'content-type':'application/json; charset=utf-8','cache-control':'no-store'});
    res.end(JSON.stringify({error:'服务暂时无法处理本次请求，请稍后再试。'}));
  }
});
server.requestTimeout = 20000;
server.headersTimeout = 10000;
server.timeout = 145000;
server.on('error', () => { console.error('服务无法启动，请检查监听地址或端口是否被占用。'); process.exitCode = 1; });
server.listen(port, host, () => {
  const address = server.address();
  const displayHost = host.includes(':') ? `[${host}]` : host;
  console.log(`本地网页已启动：http://${displayHost}:${address.port}`);
  console.log('分析仅使用本次请求中的访客密钥；服务不会保存密钥或回答。');
});
const stop = () => { server.close(); server.closeAllConnections(); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
