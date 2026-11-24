export function createHud(){
const el=id=>document.getElementById(id);
const money=el('money'),stars=el('stars'),rankName=el('rankName'),rankXp=el('rankXp'),
hpBar=el('hpBar'),armBar=el('armBar'),weaponSlots=el('weaponSlots'),
speedNum=el('speedNum'),carName=el('carName'),condFill=el('condFill'),
districtName=el('districtName'),districtStreet=el('districtStreet'),
objective=el('objective'),radioLine=el('radioLine'),notices=el('notices'),
dlg=el('dialogue'),dlgName=el('dlgName'),dlgText=el('dlgText'),dlgPortrait=el('dlgPortrait'),
bannerEl=el('banner'),jobTitle=el('jobTitle'),jobNext=el('jobNext'),jobSub=el('jobSub'),
dispatchUnits=el('dispatchUnits'),dispatchCount=el('dispatchCount'),crewCards=el('crewCards'),clockEl=el('clock');
function fmt(n){return 'Rp '+Math.floor(n).toLocaleString('id-ID')}
function update(s){
if(money)money.textContent=fmt(s.money);
if(stars)stars.textContent='★'.repeat(s.wanted)+'☆'.repeat(Math.max(0,5-s.wanted));
if(rankName)rankName.textContent=s.rank;
if(rankXp)rankXp.textContent=s.rp+' RP';
if(hpBar)hpBar.style.width=Math.max(0,s.health)+'%';
if(armBar)armBar.style.width=Math.max(0,s.armor)+'%';
if(weaponSlots&&s.weapons)weaponSlots.innerHTML=s.weapons.map(w=>`<div class="wslot${w.selected?' sel':''}"><span>${w.name}</span><span class="ammo">${w.ammo===Infinity?'∞':w.ammo}</span></div>`).join('');
if(speedNum)speedNum.textContent=Math.round(Math.abs(s.speed)*3.6);
if(carName)carName.textContent=s.carName||'BERJALAN KAKI';
if(condFill)condFill.style.width=(s.inVehicle?97:100)+'%';
if(districtName)districtName.textContent=s.district;
if(districtStreet)districtStreet.textContent=s.street;
if(objective)objective.textContent='★ '+(s.objective||'—');
if(radioLine)radioLine.textContent=s.radio||'SENJA 97.5 — Senja di Teluk — Orkes Melati';
if(clockEl)clockEl.textContent=s.clock||'17:42';
if(jobTitle)jobTitle.textContent=s.missionTitle?('MISI · '+s.missionTitle):'TELUK SENJA';
if(jobNext)jobNext.textContent=s.missionDesc||'Tekan M untuk memilih misi.';
if(jobSub)jobSub.textContent=s.missionReward?('▸ Hadiah: '+fmt(s.missionReward)):'▸ Bebas berkeliling kota';
if(dispatchUnits)dispatchUnits.innerHTML=s.dispatch.map(u=>`<div class="dunit"><span>${u.name}</span><span class="chip">${u.tactic}</span><span>${Math.round(u.along*100)}%</span></div>`).join('')||'<div class="dunit"><span>Tidak ada unit mengejar</span></div>';
if(dispatchCount)dispatchCount.textContent=String(s.dispatch.length);
if(crewCards)crewCards.innerHTML=s.crew.map(c=>`<div class="crewCard"><b>${c.name}</b><br><span>${c.role}</span></div>`).join('');
}
function notice(text){
if(!notices)return;
const d=document.createElement('div');d.className='toast';d.textContent=text;
notices.appendChild(d);
while(notices.children.length>4)notices.removeChild(notices.firstChild);
setTimeout(()=>{d.style.transition='opacity .6s';d.style.opacity='0';setTimeout(()=>d.remove(),650)},4600);
}
function showDialogue(name,text){
if(!dlg)return;
if(dlgName)dlgName.textContent=name;
if(dlgText)dlgText.textContent=text;
if(dlgPortrait)dlgPortrait.textContent=name.charAt(0);
dlg.classList.add('on');
}
function hideDialogue(){if(dlg)dlg.classList.remove('on')}
let bannerTimer=null;
function banner(text,ms){
if(!bannerEl)return;
bannerEl.textContent=text;bannerEl.style.display='block';
if(bannerTimer)clearTimeout(bannerTimer);
bannerTimer=setTimeout(()=>{bannerEl.style.display='none'},ms||2600);
}
function flash(text){banner(text,1200)}
return{update,notice,showDialogue,hideDialogue,banner,flash};
}
