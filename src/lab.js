(() => {
 const canvas=document.getElementById('wave-canvas'),ctx=canvas.getContext('2d');
 if(!ctx)return;
 const phase=document.getElementById('phase'),amplitude=document.getElementById('amplitude'),pause=document.getElementById('wave-pause');
 let paused=matchMedia('(prefers-reduced-motion: reduce)').matches,time=0,last=0,frame=0;
 function pauseLabel(){pause.textContent=paused?'播放动画':'暂停动画';pause.setAttribute('aria-pressed',String(paused));}
 function draw(){
   const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
   if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
   ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
   const style=getComputedStyle(document.documentElement),b=Number(amplitude.value),p=Number(phase.value)*Math.PI/180;
   ctx.strokeStyle=style.getPropertyValue('--line');ctx.lineWidth=1;ctx.beginPath();
   for(let x=0;x<=w;x+=w/12){ctx.moveTo(x,0);ctx.lineTo(x,h);}for(let y=0;y<=h;y+=h/6){ctx.moveTo(0,y);ctx.lineTo(w,y);}ctx.stroke();
   const colors=['--wave-a','--wave-b','--accent'];
   for(let wave=0;wave<3;wave++){ctx.beginPath();ctx.strokeStyle=style.getPropertyValue(colors[wave]);ctx.lineWidth=wave===2?3:1.7;ctx.setLineDash(wave===1?[5,5]:[]);for(let x=0;x<=w;x+=2){const a=x/w*Math.PI*6-time;const y=h/2-(wave===0?Math.sin(a):wave===1?b*Math.sin(a+p):Math.sin(a)+b*Math.sin(a+p))*h/6; if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}ctx.setLineDash([]);
 }
 function update(){
  document.getElementById('phase-value').textContent=phase.value+'°';document.getElementById('amplitude-value').textContent=Number(amplitude.value).toFixed(1);
  const b=Number(amplitude.value),p=Number(phase.value)*Math.PI/180;const result=Math.sqrt(Math.max(0,1+b*b+2*b*Math.cos(p)));
  document.getElementById('wave-insight').textContent=result<0.001?'此刻，两道波等幅反相，恰好完全抵消。合振幅为 0。':`当前合振幅为 ${result.toFixed(2)}。${Number(phase.value)%360===0?'两道波同相，振幅直接相加。':'试着改变相位，观察两道波怎样增强或削弱彼此。'}`;
  draw();
 }
 function tick(now){frame=0;if(paused||document.hidden)return;if(last)time+=(now-last)/1000*1.2;last=now;draw();frame=requestAnimationFrame(tick);}
 function sync(){cancelAnimationFrame(frame);frame=0;last=0;if(!paused&&!document.hidden)frame=requestAnimationFrame(tick);}
 phase.addEventListener('input',update);amplitude.addEventListener('input',update);
 pause.addEventListener('click',()=>{paused=!paused;pauseLabel();sync();});
 document.querySelectorAll('[data-phase]').forEach(button=>button.addEventListener('click',()=>{phase.value=button.dataset.phase;amplitude.value='1';update();}));
 document.getElementById('wave-reset').addEventListener('click',()=>{phase.value='0';amplitude.value='1';time=0;update();});
 new ResizeObserver(draw).observe(canvas);document.addEventListener('themechange',draw);document.addEventListener('visibilitychange',sync);matchMedia('(prefers-color-scheme: dark)').addEventListener('change',draw);
 pauseLabel();update();sync();
})();
