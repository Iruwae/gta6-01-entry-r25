export function createCarPhysics(opts={}){
const o={maxSpeed:38,accel:22,brake:30,turnRate:1.9,maxReverse:10,...opts};
const s={x:0,z:0,heading:0,speed:0};
function update(dt,inp){
if(inp.down('up'))s.speed+=o.accel*dt;
else if(inp.down('down'))s.speed-=o.brake*dt;
else s.speed*=Math.pow(0.35,dt);
if(inp.down('brake'))s.speed*=Math.pow(0.04,dt);
if(inp.down('boost'))s.speed+=o.accel*0.45*dt;
s.speed=Math.max(-o.maxReverse,Math.min(o.maxSpeed,s.speed));
const turn=((inp.down('left')?1:0)-(inp.down('right')?1:0));
s.heading+=turn*o.turnRate*dt*Math.min(1,Math.abs(s.speed)/8)*(s.speed<0?-1:1);
s.x+=Math.sin(s.heading)*s.speed*dt;
s.z+=Math.cos(s.heading)*s.speed*dt;
}
function place(x,z,heading){s.x=x;s.z=z;s.heading=heading;s.speed=0}
function stop(){s.speed=0}
function setSpeed(v){s.speed=v}
return{s,update,place,stop,setSpeed};
}
