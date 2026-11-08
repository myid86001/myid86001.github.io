import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import assert from 'node:assert/strict';
async function walk(dir){const result=[];for(const e of await readdir(dir,{withFileTypes:true})){const f=join(dir,e.name);if(e.isDirectory())result.push(...await walk(f));else result.push(f);}return result;}
const root=resolve('dist'), files=await walk(root),htmlFiles=files.filter(f=>f.endsWith('.html'));
for(const file of htmlFiles){const html=await readFile(file,'utf8');assert.match(html,/<html lang="zh-CN">/);assert.match(html,/<title>[^<]+<\/title>/);assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file+' needs exactly one h1');
 assert(!/C:\\Users\\|ChatGPT|Codex|TODO|FIXME|lorem ipsum|一篇新记录|用一句话介绍/i.test(html),'Unexpected residue: '+file);
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){const href=match[1];if(/^(?:https?:|data:|mailto:)/.test(href))continue;const target=href.startsWith('/')?resolve(root,'.'+href):resolve(dirname(file),href);assert(target.startsWith(root),'Outside output: '+href);const info=await stat(target).catch(()=>null);assert(info,'Broken link '+href+' in '+file);if(info.isDirectory())assert((await stat(join(target,'index.html'))).isFile());}}
const index=JSON.parse(await readFile(root+'/search-index.json','utf8'));assert(index.length>=5);assert.equal(new Set(index.map(e=>e.href)).size,index.length);assert(index.every(e=>!e.draft));
console.log(`Checked ${htmlFiles.length} HTML pages: local links, titles, headings, search index and publication residue.`);
