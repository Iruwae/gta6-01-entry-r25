import * as THREE from 'three';
export function createActivities(scene,plan,rng,bus,player){
const coins=[];let collected=0;
const coinGeo=new THREE.CylinderGeometry(0.55,0.55,0.12,16);
const coinMat=new THREE.MeshStandardMaterial({color:0xc9a227,metalness:0.9,roughness:0.25,emissive:0x8a6d1a,emissiveIntensity:0.5});
for(let i=0;i<24;i++){
const m=new THREE.Mesh(coinGeo,coinMat);
const x=rng.range(-420,420);const z=rng.chance(0.5)?rng.range(84,96):rng.range(96,106);
m.position.set(x,1.1,z);m.rotation.x=Math.PI/2;scene.add(m);
coins.push({mesh:m,x,z,taken:false});
}
let race=null;
function startRace(){
race={gate:0,time:0};
bus.emit('race-start',{gates:plan.gates.length});
return race;
}
function update(dt){
const p=player.state.inVehicle&&player.state.vehicle?{x:player.state.vehicle.phys.s.x,z:player.state.vehicle.phys.s.z}:{x:player.state.x,z:player.state.z};
for(const c of coins){
if(c.taken)continue;
c.mesh.rotation.z+=dt*2;c.mesh.position.y=1.1+Math.sin(Date.now()*0.003+c.x)*0.15;
if(Math.hypot(c.x-p.x,c.z-p.z)<2.2){
c.taken=true;c.mesh.visible=false;collected++;
player.state.money+=2500;player.stats.earned+=2500;
bus.emit('coin',{count:collected,amount:2500});
}
}
if(race){
race.time+=dt;
const g=plan.gates[race.gate];
if(g&&Math.abs(p.x-g.x)<8&&Math.abs(p.z-90)<8){
race.gate++;
bus.emit('race-gate',{gate:race.gate,total:plan.gates.length});
if(race.gate>=plan.gates.length){
const t=race.time;race=null;
player.state.money+=150000;player.stats.earned+=150000;
bus.emit('race-complete',{time:t,reward:150000});
bus.emit('respect-add',{amount:40});
}
}
}
}
return{coins,startRace,update,remaining:()=>coins.filter(c=>!c.taken).length,get collected(){return collected},get race(){return race}};
}
