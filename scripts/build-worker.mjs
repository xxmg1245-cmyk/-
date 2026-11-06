import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const files = [['/index.html','text/html; charset=utf-8'], ['/style.css','text/css; charset=utf-8'], ['/app.js','text/javascript; charset=utf-8']];
const assets = Object.fromEntries(await Promise.all(files.map(async ([name, type]) => [name, {
  type, content: await readFile(resolve(root, 'dist', name.slice(1)), 'utf8')
}])));
const template = await readFile(resolve(root, 'worker/handler.template.js'), 'utf8');
if ((template.match(/__INLINE_ASSETS__/g) || []).length !== 1) throw new Error('页面打包位置不正确。');
await mkdir(resolve(root, 'build'), {recursive:true});
await writeFile(resolve(root, 'build/worker.js'), template.replace('__INLINE_ASSETS__', () => JSON.stringify(assets)), 'utf8');
console.log('网页和分析接口已完成打包。');
