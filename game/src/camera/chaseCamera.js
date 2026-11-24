import * as THREE from 'three';
export function createChaseCamera(camera){
let shakeAmt=0;
const cur=new THREE.Vector3(0,8,-12);
const look=new THREE.Vector3(0,1,0);
function snap(p,heading){
const fx=Math.sin(heading),fz=Math.cos(heading);
cur.set(p.x-fx*11,p.y, p.z-fz*11);
camera.position.copy(cur);
look.set(p.x+fx*6,1.5,p.z+fz*6);
camera.lookAt(look);
}
function shake(a){shakeAmt=Math.min(1.2,shakeAmt+a)}
function reset(p,heading){snap(p,heading);shakeAmt=0}
function update(dt,t){
const fx=Math.sin(t.heading),fz=Math.cos(t.heading);
const dist=t.inVehicle?11:7.5;
const height=t.inVehicle?4.6:3.4;
const tx=t.x-fx*dist,ty=height,tz=t.z-fz*dist;
const k=1-Math.exp(-5*dt);
cur.x+=(tx-cur.x)*k;cur.y+=(ty-cur.y)*k;cur.z+=(tz-cur.z)*k;
look.set(t.x+fx*7,1.6,t.z+fz*7);
if(shakeAmt>0.001){
cur.x+=(Math.random()-0.5)*shakeAmt;cur.y+=(Math.random()-0.5)*shakeAmt*0.6;cur.z+=(Math.random()-0.5)*shakeAmt;
shakeAmt*=Math.pow(0.02,dt);
}
camera.position.copy(cur);
camera.lookAt(look);
}
return{snap,shake,reset,update};
}
