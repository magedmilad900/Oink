const CATS=[
 {id:'food',e:'🍔',n:'Eating out',u:'meals',p:12},
 {id:'coffee',e:'☕',n:'Coffee & drinks',u:'cups',p:5},
 {id:'ride',e:'🚌',n:'Transport',u:'rides',p:3},
 {id:'fun',e:'🎮',n:'Fun & outings',u:'outings',p:25},
 {id:'study',e:'📚',n:'Study stuff',u:'books',p:20},
 {id:'other',e:'🛍️',n:'Other things',u:'treats',p:15}];
const ICONS={
 receipt:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M17 8h30v43l-6-4-6 4-6-4-6 4-6-4Z"/><path d="M25 20h14M25 29h14M25 38h9"/><path d="M21 13h22"/></svg>',
 food:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 34h40c-2 13-9 20-20 20S14 47 12 34Z"/><path d="M18 34c0-12 6-20 14-20s14 8 14 20M31 14v-5M25 17l-4-5M39 17l4-5"/></svg>',
 coffee:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M17 24h30v17a9 9 0 0 1-9 9H26a9 9 0 0 1-9-9Z"/><path d="M47 29h4a7 7 0 0 1 0 14h-4M25 17c-3-4 3-6 0-10M35 17c-3-4 3-6 0-10"/></svg>',
 ride:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="m13 39 6-16h26l6 16"/><path d="M16 39h32v10H16zM22 23l4-9h12l4 9"/><circle cx="23" cy="49" r="4"/><circle cx="43" cy="49" r="4"/><path d="M23 31h18"/></svg>',
 fun:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 20h36a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4Z"/><path d="M24 29v12l10-6-10-6ZM42 29h4M42 36h4M42 43h4"/></svg>',
 study:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M13 14h27a6 6 0 0 1 6 6v31H19a6 6 0 0 1-6-6Z"/><path d="M46 20v31H20M23 25h15M23 33h15M23 41h10"/></svg>',
 other:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M13 22h38l-4 34H17Z"/><path d="M22 22a10 10 0 0 1 20 0M25 32v14M39 32v14"/></svg>',
 target:'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="12"/><path d="m32 32 13-13M45 19h-8M45 19v8"/></svg>'
};
const FACES={
 happy:'<svg class="mood-svg" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13"/><circle cx="11" cy="13" r="1.4"/><circle cx="21" cy="13" r="1.4"/><path d="M10 18q6 7 12 0"/></svg>',
 calm:'<svg class="mood-svg" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13"/><path d="M9 13h4M19 13h4M11 20h10"/></svg>',
 worry:'<svg class="mood-svg" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13"/><circle cx="11" cy="14" r="1.4"/><circle cx="21" cy="14" r="1.4"/><path d="M10 22q6-5 12 0M9 9l4 2M23 9l-4 2"/></svg>',
 broke:'<svg class="mood-svg" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13"/><path d="M10 13l3 2M22 13l-3 2M11 23q5-5 10 0"/></svg>'
};
const $=id=>document.getElementById(id),$$=s=>[...document.querySelectorAll(s)];
const f=n=>Math.round(n).toLocaleString('en-US');
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
let items=[{id:1,c:'food',a:420},{id:2,c:'food',a:360},{id:3,c:'coffee',a:240},{id:4,c:'ride',a:300},{id:5,c:'fun',a:350},{id:6,c:'study',a:200}];
let uid=10,stash=[],shown=0,seen=0;
const save=()=>{try{localStorage.setItem('oink',JSON.stringify({items,uid,stash,seen:1,total:$('total').value,days:$('days').value,today:$('today').value,gname:$('gname').value,gtarget:$('gtarget').value}))}catch(e){}};
try{const s=JSON.parse(localStorage.getItem('oink')||'null');if(s){items=s.items;uid=s.uid;stash=s.stash||[];seen=s.seen;['total','days','today','gname','gtarget'].forEach(k=>s[k]&&($(k).value=s[k]))}}catch(e){}

/* confetti / coins */
function rain(list,n){if(calm)return;for(let i=0;i<n;i++){const s=document.createElement('span');s.className='fall';s.setAttribute('aria-hidden','true');s.textContent=list[i%list.length];s.style.left=Math.random()*96+'vw';s.style.animationDuration=(1.4+Math.random()*1.4)+'s';s.style.animationDelay=Math.random()*.5+'s';document.body.appendChild(s);setTimeout(()=>s.remove(),3500)}}

/* carousel */
function carousel(root,onChange){
 const track=root.querySelector('.track'),dots=root.querySelector('.dots');let i=0,x0=null;
 const n=()=>track.children.length;
 function go(k,silent){i=Math.max(0,Math.min(n()-1,k));track.style.transform=`translateX(${-i*100}%)`;
  [...dots.children].forEach((d,j)=>d.setAttribute('aria-selected',j===i));
  root.querySelectorAll('.arrow').forEach((a,j)=>a.disabled=(j===0&&i===0)||(j===1&&i===n()-1));
  if(!silent&&onChange)onChange(i)}
 function build(){dots.innerHTML='';for(let j=0;j<n();j++){const b=document.createElement('button');b.setAttribute('role','tab');b.setAttribute('aria-label','Slide '+(j+1));b.onclick=()=>go(j);dots.appendChild(b)}go(Math.min(i,n()-1),true)}
 root.querySelectorAll('.arrow').forEach(a=>a.onclick=()=>go(i+ +a.dataset.d));
 root.addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(i+1);if(e.key==='ArrowLeft')go(i-1)});
 root.addEventListener('pointerdown',e=>x0=e.clientX);
 root.addEventListener('pointerup',e=>{if(x0!==null&&Math.abs(e.clientX-x0)>40)go(i+(e.clientX<x0?1:-1));x0=null});
 build();return{go,build,get i(){return i}};
}

/* pages */
function page(p){$$('.page').forEach(s=>s.classList.toggle('active',s.id===p));$$('.tabs button').forEach(b=>b.toggleAttribute('aria-current',b.dataset.p===p)||b.removeAttribute('aria-current'));
 $$('.tabs button').forEach(b=>b.dataset.p===p?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current'));
 if(location.hash!=='#'+p)history.replaceState(null,'','#'+p);window.scrollTo({top:0,behavior:calm?'auto':'smooth'})}
$$('.tabs button').forEach(b=>b.onclick=()=>page(b.dataset.p));

/* pig */
const pig=$('pig');
document.addEventListener('pointermove',e=>{const r=pig.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),d=Math.hypot(dx,dy)||1,k=Math.min(4,d/40);
 [['e1',78],['e2',146]].forEach(([id,cx])=>{$(id).setAttribute('cx',cx+dx/d*k);$(id).setAttribute('cy',98+dy/d*k)})});
function hi(){pig.classList.remove('jump');void pig.offsetWidth;pig.classList.add('jump');rain(['🪙'],6);const m=$('mood'),old=m.textContent;m.textContent='Oink oink! 🐽';setTimeout(()=>m.textContent=old,1600)}
pig.onclick=hi;pig.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();hi()}};

/* counter */
function count(el,to){const from=shown;shown=to;if(calm||from===to){el.textContent=f(to);return}const t0=performance.now();(function s(t){const k=Math.min(1,(t-t0)/700);el.textContent=f(from+(to-from)*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(s)})(t0)}

function mood(r,left){
 const M={happy:[`Penny is happy ${FACES.happy}`,'Nice! At this pace your money lasts, with some to spare.','M92 150 Q110 172 128 150',0],
  ok:[`Penny is calm ${FACES.calm}`,'Doing okay. Keep an eye on the little spends.','M94 154 Q110 160 126 154',0],
  worry:[`Penny is nervous ${FACES.worry}`,'Your money will run out before the month does. Ease off a little!','M92 160 Q110 146 128 160',1],
  broke:[`Penny is crying ${FACES.broke}`,'The money is gone. Time for smart fixes!','M90 164 Q110 142 130 164',1]};
 const k=left<=0?'broke':r>=1.1?'happy':r>=.85?'ok':'worry',m=M[k];
 $('mood').innerHTML=m[0];$('verdict').textContent=m[1];$('mouth').setAttribute('d',m[2]);$('sweat').style.opacity=m[3];
 pig.classList.toggle('worried',m[3]===1);pig.dataset.k=k;
}
const num=(id,d)=>Math.max(1,parseFloat($(id).value)||d);
let story;
function render(){
 const total=num('total',3000),days=num('days',30),today=Math.min(num('today',1),days);
 const spent=items.reduce((s,i)=>s+i.a,0),left=total-spent,daysLeft=Math.max(days-today+1,1),avg=spent/today;
 const run=left<=0?0:avg>0?Math.min(left/avg,99):daysLeft;
 count($('runway'),run);$('left').textContent='$'+f(left);$('daily').textContent='$'+f(Math.max(left,0)/daysLeft);$('spent').textContent='$'+f(spent);
 const pct=Math.min(100,spent/total*100);$('meterFill').style.width=pct+'%';$('meterTxt').textContent=`You've used ${f(pct)}% of your money and ${f(today/days*100)}% of the month.`;
 mood(run/daysLeft,left);
 /* list */
 $('list').innerHTML=items.length?items.slice().reverse().slice(0,8).map(i=>{const c=CATS.find(x=>x.id===i.c);return `<li class="li"><span class="e" aria-hidden="true">${ICONS[c.id]||ICONS.other}</span><span class="t">${c.n}: $${f(i.a)}</span><button data-id="${i.id}" aria-label="Remove ${c.n} $${f(i.a)}">Remove</button></li>`}).join(''):'<li class="empty">Nothing yet. Add your first spend! 🎈</li>';
 /* story slides */
 const per=total/days,rows=CATS.map(c=>({c,s:items.filter(i=>i.c===c.id).reduce((a,i)=>a+i.a,0)})).filter(r=>r.s>0).sort((a,b)=>b.s-a.s);
 let h=`<div class="slide"><div class="emo">${ICONS.receipt}</div><h2>So far you spent</h2><div class="num">$${f(spent)}</div><p>That's <b>${f(spent/per)} days</b> of your normal daily budget ($${f(per)} a day).</p></div>`;
 h+=rows.map(({c,s},j)=>`<div class="slide"><div class="emo">${ICONS[c.id]||ICONS.other}</div><h2>${c.n}</h2><div class="num">${f(s/per)} days</div><p>$${f(s)} of your budget, that's ${f(s/spent*100)}% of everything you spent.</p><span class="small">≈ ${f(s/c.p)} ${c.u}</span>${j===0?'<p>👆 Your biggest one!</p>':''}</div>`).join('');
 h+=`<div class="slide"><div class="emo">${ICONS.target}</div><h2>From now on</h2><div class="num">$${f(Math.max(left,0)/daysLeft)}/day</div><p>Stay under this and Penny stays happy until day ${days}.</p></div>`;
 $('storyTrack').innerHTML=h;story.build();
 /* goal */
 const tg=num('gtarget',400),sv=stash.reduce((a,b)=>a+b,0),gp=Math.min(100,sv/tg*100);
 $('water').style.height=gp+'%';$('gpct').textContent=f(gp)+'%';$('jar').setAttribute('aria-label',`Savings jar ${f(gp)} percent full`);
 $('gtxt').textContent=gp>=100?`🎉 You did it! ${$('gname').value} is yours.`:`$${f(sv)} saved for ${$('gname').value}. Only $${f(tg-sv)} to go!`;
 save();
}
story=carousel($('storyC'));
const intro=carousel($('introC'),i=>{});
$('addBtn').onclick=()=>{const a=parseFloat($('amount').value);
 if(!a||a<=0){$('toast').textContent='Type an amount above zero first.';$('amount').focus();return}
 const c=document.querySelector('input[name=cat]:checked').value;items.push({id:uid++,c,a});$('amount').value='';
 $('toast').textContent=`Added $${f(a)} ✔ Penny noticed.`;rain(['💸'],8);render();$('amount').focus()};
$('amount').addEventListener('keydown',e=>{if(e.key==='Enter')$('addBtn').click()});
$$('[data-q]').forEach(b=>b.onclick=()=>{$('amount').value=b.dataset.q;$('amount').focus()});
$('list').onclick=e=>{const b=e.target.closest('button');if(!b)return;items=items.filter(i=>i.id!=b.dataset.id);$('toast').textContent='Removed ✔';render()};
$$('[data-s]').forEach(b=>b.onclick=()=>{const before=stash.reduce((a,c)=>a+c,0),tg=num('gtarget',400);stash.push(+b.dataset.s);rain(['🪙'],8);render();if(before<tg&&before+ +b.dataset.s>=tg)setTimeout(()=>rain(['🎉','✨','🎊','🐷'],40),500)});
$('gundo').onclick=()=>{stash.pop();render()};
['total','days','today','gname','gtarget'].forEach(k=>$(k).addEventListener('input',render));
[['contrast','hc'],['big','big']].forEach(([id,cl])=>$(id).onclick=()=>{$(id).setAttribute('aria-pressed',document.body.classList.toggle(cl))});
 $('chips').innerHTML=CATS.map((c,i)=>`<label class="chip"><input type="radio" name="cat" value="${c.id}" ${i?'':'checked'}><span>${ICONS[c.id]||ICONS.other}<b>${c.n}</b></span></label>`).join('');
/* intro */
const el=$('intro');
function closeIntro(){el.classList.remove('show');seen=1;save();pig.focus({preventScroll:true})}
$('go').onclick=closeIntro;
if(!seen){el.classList.add('show');$('go').focus()}
render();
const start=location.hash.slice(1);if(['home','add','story','goal'].includes(start))page(start);else page('home');
