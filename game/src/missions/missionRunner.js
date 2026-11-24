import { MISSIONS, DIALOGUES } from './story.js';
export function createMissionRunner(bus,player,fleet,pedestrians,plan){
let active=null;let stepIdx=0;
function start(id){
const def=MISSIONS[id];if(!def)return false;
active={def,stepIdx:0};stepIdx=0;
bus.emit('mission-start',{mission:def});
bus.emit('objective',{text:def.steps[0].label});
return true;
}
function step(){return active?active.def.steps[active.stepIdx]:null}
function advance(){
stepIdx++;if(!active)return;
if(stepIdx>=active.def.steps.length){complete();return}
active.stepIdx=stepIdx;
bus.emit('objective',{text:active.def.steps[stepIdx].label});
}
function complete(){
const def=active.def;active=null;stepIdx=0;
player.state.money+=def.reward;player.stats.earned+=def.reward;
bus.emit('mission-complete',{mission:def,reward:def.reward});
bus.emit('respect-add',{amount:def.rp});
bus.emit('objective',{text:'Misi selesai. Pilih misi baru di menu (M).'});
}
function pos(){return player.state.inVehicle&&player.state.vehicle?{x:player.state.vehicle.phys.s.x,z:player.state.vehicle.phys.s.z}:{x:player.state.x,z:player.state.z}}
function update(dt){
if(!active)return;
const s=step();if(!s)return;
const p=pos();
if(s.type==='goto'||s.type==='deliver'){
if(Math.hypot(s.x-p.x,s.z-p.z)<6)advance();
}
else if(s.type==='race'){
if(p.x>360&&Math.abs(p.z-90)<10)advance();
}
}
function onTalk(npc){
if(!active)return;
const s=step();if(!s)return;
if(s.type==='talk'&&npc.name===s.npc){advance();return true}
return false;
}
function onSteal(v){
if(!active)return;
const s=step();if(!s)return;
if(s.type==='steal'&&v.type===s.car){advance();return true}
return false;
}
function linesFor(name){return DIALOGUES[name]||DIALOGUES.Ratna}
function abandon(){active=null;stepIdx=0;bus.emit('objective',{text:'Misi dibatalkan.'})}
return{start,update,onTalk,onSteal,linesFor,abandon,step,get active(){return active},get current(){return active?active.def:null}};
}
