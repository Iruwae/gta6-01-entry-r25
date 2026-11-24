export const WEAPONS={
fists:{name:'Tinju',damage:12,range:2.2,rate:0.45,auto:false},
pistol:{name:'Pistol',damage:25,range:32,rate:0.35,auto:false,ammo:true},
rifle:{name:'Senapan',damage:40,range:60,rate:0.12,auto:true,ammo:true},
};
export function createLoadout(){
const owned={fists:{ammo:Infinity}};
let selected='fists';let cd=0;
function give(id,ammo){if(!WEAPONS[id])return;if(!owned[id])owned[id]={ammo:0};if(ammo!==undefined)owned[id].ammo+=ammo}
function select(id){if(owned[id])selected=id}
function canFire(){return cd<=0}
function fire(){if(cd>0)return null;const w=WEAPONS[selected];cd=w.rate;
if(w.ammo){if(owned[selected].ammo<=0)return{empty:true,weapon:selected};owned[selected].ammo--}
return{weapon:selected,damage:w.damage,range:w.range};
}
function tick(dt){if(cd>0)cd-=dt}
function has(id){return !!owned[id]}
return{owned,give,select,canFire,fire,tick,has,get selected(){return selected},get weapon(){return WEAPONS[selected]},ammo(id){return owned[id]?owned[id].ammo:0}};
}
