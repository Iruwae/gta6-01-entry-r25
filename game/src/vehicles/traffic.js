export function createTraffic(plan,rng){
const cars=[];
function pickTarget(from){let t;do{t=plan.junctions[Math.floor(rng.next()*plan.junctions.length)]}while(Math.abs(t.x-from.x)<40&&Math.abs(t.z-from.z)<40);return t}
function addCar(x,z){
const j=plan.nearestJunction(x,z);
const c={x,z,heading:rng.range(0,Math.PI*2),speed:rng.range(7,11),target:pickTarget(j),wait:0};
cars.push(c);return c;
}
function update(dt,playerPos){
for(const c of cars){
const dx=c.target.x-c.x,dz=c.target.z-c.z;
const dist=Math.hypot(dx,dz);
if(dist<6){c.target=pickTarget(c.target);c.wait=rng.range(0,1.5);continue}
if(c.wait>0){c.wait-=dt;continue}
const want=Math.atan2(dx,dz);
let dh=want-c.heading;
while(dh>Math.PI)dh-=Math.PI*2;while(dh<-Math.PI)dh+=Math.PI*2;
c.heading+=Math.max(-1.6*dt,Math.min(1.6*dt,dh));
if(playerPos){const pdx=playerPos.x-c.x,pdz=playerPos.z-c.z;const pd=Math.hypot(pdx,pdz);
if(pd<9){const ahead=Math.sin(c.heading)*pdx+Math.cos(c.heading)*pdz;if(ahead>0){c.speed=Math.max(0,c.speed-14*dt);}}
else c.speed=Math.min(11,c.speed+4*dt);
}
c.x+=Math.sin(c.heading)*c.speed*dt;
c.z+=Math.cos(c.heading)*c.speed*dt;
}
}
return{cars,addCar,update,count:()=>cars.length};
}
