export function createMenus(bus){
const el=id=>document.getElementById(id);
const title=el('title'),pause=el('pause'),mlist=el('mission-list'),mlistItems=el('mission-items');
const hudEl=document.getElementById('hud');
let mode='title';
function show(e){if(e)e.classList.remove('hidden')}
function hide(e){if(e)e.classList.add('hidden')}
function setMode(m){
mode=m;
if(hudEl)hudEl.style.display=(m==='play')?'':'none';
if(m==='title'){show(title);hide(pause);hide(mlist)}
else if(m==='pause'){hide(title);show(pause);hide(mlist)}
else if(m==='mission'){hide(title);hide(pause);show(mlist)}
else{hide(title);hide(pause);hide(mlist)}
document.body.dataset.mode=m;
}
function showTitle(){setMode('title')}
function hideTitle(){setMode('play')}
function showPause(stats){
setMode('pause');
const rows=el('statRows');
if(rows)rows.innerHTML=[
['Misi selesai',stats.missions],
['Musuh tumbang',stats.kills],
['Mobil dicuri',stats.carsStolen],
['Koin terkumpul',stats.coins+' / 24'],
['Uang terkumpul','Rp '+stats.earned.toLocaleString('id-ID')],
['Respect',stats.rank+' ('+stats.rp+' RP)'],
].map(([k,v])=>`<div class="srow"><span>${k}</span><b>${v}</b></div>`).join('');
const standing=el('standingRows');
if(standing)standing.innerHTML=[
['PANTAI MERPATI','Dikenal'],
['PASAR SENJA','Dikenal'],
['KOTA LAMA','Netral'],
['MENARA KACA','Waspada'],
].map(([k,v])=>`<div class="srow"><span>${k}</span><b>${v}</b></div>`).join('');
const pd=el('pauseDistricts');
if(pd)pd.textContent='8 distrik · 14 gerbang balap · 24 koin tersebar';
}
function hidePause(){setMode('play')}
function showMissions(list){
setMode('mission');
if(!mlistItems)return;
mlistItems.innerHTML='';
for(const m of list){
const b=document.createElement('button');b.className='mission-btn';
b.innerHTML=`<b>${m.title}</b><span>${m.desc}</span><i>Hadiah Rp ${m.reward.toLocaleString('id-ID')} · ${m.rp} RP</i>`;
b.addEventListener('click',()=>{bus.emit('mission-pick',{id:m.id});hideMissions()});
mlistItems.appendChild(b);
}
const x=document.createElement('button');x.className='mission-btn close';x.textContent='Tutup (M)';
x.addEventListener('click',()=>hideMissions());
mlistItems.appendChild(x);
}
function hideMissions(){setMode('play')}
const btnNew=el('btnNew');
if(btnNew)btnNew.addEventListener('click',()=>bus.emit('start-game',{}));
const btnContinue=el('btnContinue');
if(btnContinue)btnContinue.addEventListener('click',()=>bus.emit('start-game',{}));
const btnResume=el('btnResume');
if(btnResume)btnResume.addEventListener('click',()=>bus.emit('resume-game',{}));
const btnQuit=el('btnQuit');
if(btnQuit)btnQuit.addEventListener('click',()=>bus.emit('quit-to-title',{}));
const btnSave=el('btnSave');
if(btnSave)btnSave.addEventListener('click',()=>bus.emit('save-game',{}));
const btnShop=el('btnShop');
if(btnShop)btnShop.addEventListener('click',()=>bus.emit('shop-open',{}));
return{showTitle,hideTitle,showPause,hidePause,showMissions,hideMissions,setMode,get mode(){return mode}};
}
