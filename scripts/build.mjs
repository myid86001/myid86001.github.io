import { mkdir, readFile, readdir, writeFile, cp, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import katex from 'katex';
import { layout, home, listing, about, lab, heading, esc, url } from '../src/templates.mjs';
const out = resolve('dist');
if (out !== resolve(process.cwd(), 'dist')) throw new Error('Unexpected output directory');
await rm(out, {recursive:true, force:true});
await mkdir(out, {recursive:true});
await cp('public',out,{recursive:true});
await mkdir(out+'/assets',{recursive:true});
for (const file of ['styles.css','app.js','theme.js','lab.js']) await cp('src/'+file,out+'/assets/'+file);
await cp('node_modules/katex/dist',out+'/assets/katex',{recursive:true});
const math = (name,level,pattern) => ({name,level,start:src=>src.indexOf('$'),tokenizer(src){const m=pattern.exec(src);if(m)return{type:name,raw:m[0],text:m[1]};},renderer(t){return katex.renderToString(t.text,{displayMode:level==='block',throwOnError:true});}});
marked.use({extensions:[math('blockMath','block',/^\$\$\s*\n([\s\S]+?)\n\$\$(?:\n|$)/),math('inlineMath','inline',/^\$([^\n$]+?)\$/)]});
let headings=[];
marked.use({renderer:{heading({tokens,depth}){const text=this.parser.parseInline(tokens);const plain=text.replace(/<[^>]+>/g,'');const id='section-'+(headings.length+1);headings.push({depth,text:plain,id});return `<h${depth} id="${id}">${text}</h${depth}>`}}});
async function entries(kind){
 const files=(await readdir('content/'+kind)).filter(f=>f.endsWith('.md')); const items=[];
 for(const file of files){const {data,content}=matter(await readFile('content/'+kind+'/'+file,'utf8'));if(data.draft!==false)continue;
 const slug=file.slice(0,-3);if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw new Error('Use a lowercase Latin filename: '+file);
 if(typeof data.title!=='string'||typeof data.description!=='string'||!data.date)throw new Error('Missing front matter: '+file);
 const date=new Date(data.date);if(!Number.isFinite(date.valueOf()))throw new Error('Invalid date: '+file);
 if(data.tags&&!Array.isArray(data.tags))throw new Error('Tags must be a list: '+file);
 headings=[];const html=marked.parse(content);items.push({slug,title:data.title,description:data.description,date:date.toISOString().slice(0,10),tags:(data.tags||[]).map(String),html,headings:[...headings]});}
 return items.sort((a,b)=>b.date.localeCompare(a.date));
}
const notes=await entries('notes'),projects=await entries('projects');
async function page(path,title,body,extra=''){const file=out+'/'+(path?path+'index.html':'index.html');await mkdir(dirname(file),{recursive:true});await writeFile(file,layout(title,body,path,extra));}
await page('','首页',home(notes.length));
await page('notes/','记录',listing('notes',notes));
await page('projects/','项目',listing('projects',projects));
await page('lab/','试验场',lab());
await page('about/','关于',about());
for(const [kind,items] of [['notes',notes],['projects',projects]])for(const e of items){
 await page(kind+'/'+e.slug+'/',e.title,heading(`${esc(e.date)} / ${esc(e.tags.join(' · '))}`,esc(e.title),esc(e.description))+`<div class="article-layout"><article class="prose">${e.html}</article><aside class="toc" aria-label="文章目录"><p class="eyebrow">本页目录</p>${e.headings.filter(h=>h.depth<=3).map(h=>`<a class="level-${h.depth}" href="#${h.id}">${esc(h.text)}</a>`).join('')}<a class="back-link" href="${url(kind+'/')}">← 返回${kind==='notes'?'记录':'项目'}</a></aside></div>`,`<link rel="stylesheet" href="${url('assets/katex/katex.min.css')}">`);
}
await writeFile(out+'/404.html',layout('页面走丢了',heading('404 / NOT FOUND','这条小路，还没有通向哪里。','你可以回到首页，换个方向继续探索。')+`<a class="button primary" href="${url('')}">回到首页 →</a>`));
const index=[{title:'首页',description:'探索地图与最近记录',href:url(''),tags:[]},{title:'记录',description:'学习笔记、问题与随想',href:url('notes/'),tags:[]},{title:'项目',description:'作品与实践',href:url('projects/'),tags:[]},{title:'试验场',description:'波形叠加、相位与振幅的互动实验',href:url('lab/'),tags:['波','实验']},{title:'关于',description:'未定集的起点',href:url('about/'),tags:[]},...notes.map(e=>({...e,href:url('notes/'+e.slug+'/'),html:undefined,headings:undefined})),...projects.map(e=>({...e,href:url('projects/'+e.slug+'/'),html:undefined,headings:undefined}))];
await writeFile(out+'/search-index.json',JSON.stringify(index));
await writeFile(out+'/.nojekyll','');
console.log(`Built ${index.length} pages and 404 page. ${notes.length} notes, ${projects.length} projects.`);
