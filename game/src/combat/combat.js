export function createCombat(scene,bus,rng,effects,player,pedestrians,fleet){
function explodeAt(p){
effects.explosion(p.x,p.z);
bus.emit('explosion',p);
for(const n of pedestrians.npcs){
const d=Math.hypot(n.x-p.x,n.z-p.z);
if(d<9){bus.emit('kill',{npc:n});player.stats.kills++}
}
for(const v of fleet.vehicles){
const d=Math.hypot(v.phys.s.x-p.x,v.phys.s.z-p.z);
if(d<8&&v!==player.state.vehicle){v.phys.s.speed=0}
}
}
function shoot(){
const f=player.state.inVehicle?null:player;
const ox=f?f.state.x:0,oz=f?f.state.z:0;
const h=f?f.state.heading:0;
const dir={x:Math.sin(h),z:Math.cos(h)};
const res=player.loadout?player.loadout.fire():null;
if(!res)return null;
if(res.empty){bus.emit('empty-click',{});return res}
let best=null,bd=res.range*res.range;
for(const n of pedestrians.npcs){
const dx=n.x-ox,dz=n.z-oz;const along=dx*dir.x+dz*dir.z;
if(along<0||along>res.range)continue;
const perp=Math.abs(dx*dir.z-dz*dir.x);
if(perp<1.2&&along*along<bd){bd=along*along;best=n}
}
effects.tracer({x:ox,z:oz},{x:ox+dir.x*res.range,z:oz+dir.z*res.range});
if(best){bus.emit('kill',{npc:best});player.stats.kills++;effects.blood(best.x,best.z)}
bus.emit('shot',{weapon:res.weapon});
}
return{explodeAt,shoot};
}
