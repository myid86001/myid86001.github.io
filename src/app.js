(() => {
 const themeButton = document.getElementById('theme-toggle');
 themeButton.addEventListener('click', () => {
   const current = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
   const next = current === 'dark' ? 'light' : 'dark';
   document.documentElement.dataset.theme = next;
   try { localStorage.setItem('weiding-theme',next); } catch {}
   document.dispatchEvent(new Event('themechange'));
 });
 const map = document.getElementById('idea-map'), toggle = document.getElementById('map-toggle');
 toggle?.addEventListener('click', () => {
   const list = map.classList.toggle('as-list');
   toggle.setAttribute('aria-pressed',String(list)); toggle.textContent = list ? '切换为地图' : '切换为列表';
 });
 const dialog=document.getElementById('search-dialog'), input=document.getElementById('global-search'), results=document.getElementById('search-results');
 let index=null;
 const base=new URL('../../', document.currentScript.src);
 function renderResults(){
   if(!index)return;
   const query=input.value.trim().toLocaleLowerCase();
   const found=index.filter(e=>(e.title+' '+e.description+' '+e.tags.join(' ')).toLocaleLowerCase().includes(query));
   results.replaceChildren();
   for(const e of found){const a=document.createElement('a');a.className='search-result';a.href=e.href;const title=document.createElement('strong');title.textContent=e.title;const desc=document.createElement('small');desc.textContent=e.description;a.append(title,desc);results.append(a);}
   if(!found.length)results.textContent='没有找到匹配内容，换个关键词试试。';
 }
 async function openSearch(){
   if(!dialog.open)dialog.showModal();input.focus();
   if(!index){results.textContent='正在加载…';try{const r=await fetch(new URL('search-index.json',base));if(!r.ok)throw new Error();index=await r.json();}catch{results.textContent='暂时无法加载搜索，请使用顶部导航。';return;}}
   renderResults();
 }
 document.getElementById('search-open').addEventListener('click',openSearch);
 document.getElementById('search-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 input.addEventListener('input',renderResults);
 input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();results.querySelector('a')?.focus();}if(e.key==='Enter')results.querySelector('a')?.click();});
 document.addEventListener('keydown',e=>{const typing=/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)||e.target.isContentEditable;if((e.key==='/'&&!typing)||((e.ctrlKey||e.metaKey)&&e.key==='k')){e.preventDefault();openSearch();}});
 const filter=document.getElementById('entry-filter');
 filter?.addEventListener('input',()=>{let count=0;document.querySelectorAll('.entry-row').forEach(e=>{e.hidden=!e.dataset.search.toLocaleLowerCase().includes(filter.value.trim().toLocaleLowerCase());if(!e.hidden)count++;});document.getElementById('filter-empty').hidden=count>0;});
})();
