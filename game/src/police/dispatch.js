const TACTICS=['MENGEJAR','MENGEPUNG','MENABRAK'];
const NAMES=['TIDE-12','SURF-07','REEF-22','CORAL-05','OMBAK-11'];
export function createDispatch(scene,fleet,plan,rng,bus){
const units=[];
function spawnUnit(near,level){
const name=NAMES[units.length%NAMES.length];
const tactic=TACTICS[Math.floor(rng.next()*TACTICS.length)];
const a=rng.range(0,Math.PI*2);const d=25+rng.range(0,20);
const x=near.x+Math.sin(a)*d,z=near.z+Math.cos(a)*d;
const v=fleet.spawn('interceptor',x,z,rng.range(0,Math.PI*2));
v.parked=false;
const u={name,vehicle:v,from:{x,z},to:{x:near.x,z:near.z},along:0,tactic,lead:tactic==='MENGEJAR'?0.4:tactic==='MENGEPUNG'?1.2:2.2,ram:false};
units.push(u);bus.emit('dispatch',{unit:u});return u;
}
function update(dt,playerPos,playerVel){
for(const u of units){
const v=u.vehicle;const p=v.phys.s;
const lead={x:playerPos.x+(playerVel?playerVel.x:0)*u.lead,z:playerPos.z+(playerVel?playerVel.z:0)*u.lead};
const dx=lead.x-p.x,dz=lead.z-p.z;const dist=Math.hypot(dx,dz);
u.to={x:lead.x,z:lead.z};u.along=Math.max(0,Math.min(1,1-dist/60));
const want=Math.atan2(dx,dz);
let dh=want-p.heading;while(dh>Math.PI)dh-=Math.PI*2;while(dh<-Math.PI)dh+=Math.PI*2;
const turn=Math.max(-1.9*dt,Math.min(1.9*dt,dh*2));
p.heading+=turn;
const targetSpeed=dist<5?6:u.tactic==='MENABRAK'?46:40;
p.speed+=(targetSpeed-p.speed)*Math.min(1,dt*1.2);
p.x+=Math.sin(p.heading)*p.speed*dt;
p.z+=Math.cos(p.heading)*p.speed*dt;
u.ram=dist<5;
}
}
function clear(){for(const u of units){scene.remove(u.vehicle.mesh)}units.length=0}
function nearest(x,z){let best=null,bd=1e18;for(const u of units){const dx=u.vehicle.phys.s.x-x,dz=u.vehicle.phys.s.z-z,d=dx*dx+dz*dz;if(d<bd){bd=d;best=u}}return best}
return{units,spawnUnit,update,clear,nearest,count:()=>units.length};
}
