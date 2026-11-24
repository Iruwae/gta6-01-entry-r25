import * as THREE from 'three';
import { createCarPhysics } from './carPhysics.js';
import { createTraffic } from './traffic.js';
import { makeGlow } from '../world/textures.js';
const COLORS={comet:0xc02028,sedan:0x3a6a8a,van:0xd8d0c0,taxi:0xf5c020,interceptor:0x1a1a1a};
export function makeCarMesh(color,type){
const g=new THREE.Group();
const paint=new THREE.MeshStandardMaterial({color,roughness:0.32,metalness:0.62,envMapIntensity:1});
const glass=new THREE.MeshStandardMaterial({color:0x18222e,roughness:0.08,metalness:0.9,envMapIntensity:1.2});
const dark=new THREE.MeshStandardMaterial({color:0x14161a,roughness:0.7,metalness:0.2});
const body=new THREE.Mesh(new THREE.BoxGeometry(4.4,0.85,2),paint);body.position.y=0.75;body.castShadow=true;g.add(body);
const nose=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.55,1.9),paint);nose.position.set(2.6,0.62,0);nose.castShadow=true;g.add(nose);
const cabin=new THREE.Mesh(new THREE.BoxGeometry(2.1,0.7,1.8),glass);cabin.position.set(-0.3,1.45,0);cabin.castShadow=true;g.add(cabin);
const roof=new THREE.Mesh(new THREE.BoxGeometry(2.0,0.1,1.7),paint);roof.position.set(-0.3,1.85,0);g.add(roof);
const wheelG=new THREE.CylinderGeometry(0.42,0.42,0.3,12);
for(const[wx,wz]of[[1.45,0.95],[1.45,-0.95],[-1.45,0.95],[-1.45,-0.95]]){
const w=new THREE.Mesh(wheelG,dark);w.rotation.x=Math.PI/2;w.position.set(wx,0.42,wz);w.castShadow=true;g.add(w);
}
const hlMat=new THREE.MeshStandardMaterial({color:0x332200,emissive:0xfff2b0,emissiveIntensity:2.4});
for(const wz of[0.6,-0.6]){const hl=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.25,0.4),hlMat);hl.position.set(3.16,0.75,wz);g.add(hl)}
const tlMat=new THREE.MeshStandardMaterial({color:0x330000,emissive:0xff2020,emissiveIntensity:1.8});
for(const wz of[0.6,-0.6]){const tl=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.22,0.4),tlMat);tl.position.set(-2.26,0.8,wz);g.add(tl)}
if(type==='interceptor'){
const bar=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.28,1.6),dark);bar.position.set(-0.3,2.05,0);g.add(bar);
const r=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.3,0.6),new THREE.MeshStandardMaterial({color:0x330000,emissive:0xff2020,emissiveIntensity:3}));r.position.set(-0.3,2.22,0.45);g.add(r);
const b=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.3,0.6),new THREE.MeshStandardMaterial({color:0x000033,emissive:0x2244ff,emissiveIntensity:3}));b.position.set(-0.3,2.22,-0.45);g.add(b);
const stripe=new THREE.Mesh(new THREE.BoxGeometry(4.42,0.3,2.02),new THREE.MeshStandardMaterial({color:0xf5f0e0,roughness:0.5}));stripe.position.set(0,0.95,0);g.add(stripe);
}
const glowTex=makeGlow();
const sh=new THREE.Mesh(new THREE.PlaneGeometry(5.4,3.1),new THREE.MeshBasicMaterial({map:glowTex,transparent:true,opacity:0.42,depthWrite:false,color:0x000000}));
sh.rotation.x=-Math.PI/2;sh.position.y=0.06;g.add(sh);
return g;
}
export function createFleet(scene,plan,rng,collision){
const vehicles=[];let idc=0;
const traffic=createTraffic(plan,rng);
function spawn(type,x,z,heading){
const color=COLORS[type]||0x888888;
const mesh=makeCarMesh(color,type);
scene.add(mesh);
const v={id:++idc,type,mesh,color,parked:true,phys:createCarPhysics(type==='comet'?{maxSpeed:44,accel:26}:type==='interceptor'?{maxSpeed:46,accel:30}:{maxSpeed:26,accel:16}),position:{get x(){return v.phys.s.x},get z(){return v.phys.s.z}},heading:{get value(){return v.phys.s.heading}},speed:0,velocity:{x:0,z:0}};
v.phys.place(x,z,heading);
mesh.position.set(x,0,z);mesh.rotation.y=heading-Math.PI/2;
vehicles.push(v);return v;
}
function spawnTraffic(n){
for(let i=0;i<n;i++){
const j=plan.junctions[Math.floor(rng.next()*plan.junctions.length)];
const v=spawn(rng.pick(['sedan','sedan','van','taxi']),j.x+rng.range(-3,3),j.z+rng.range(-3,3),rng.range(0,Math.PI*2));
v.parked=false;const t=traffic.addCar(v.phys.s.x,v.phys.s.z);v.traffic=t;
}
}
function update(dt,input,driving){
for(const v of vehicles){
if(v.traffic){
v.phys.s.x=v.traffic.x;v.phys.s.z=v.traffic.z;v.phys.s.heading=v.traffic.heading;v.phys.s.speed=v.traffic.speed;
}
else if(driving&&v===driving){
v.phys.update(dt,input);
const c=collision.collide(v.phys.s.x,v.phys.s.z,2.1);
v.phys.s.x=c.x;v.phys.s.z=c.z;
}
v.speed=v.phys.s.speed;
v.velocity.x=Math.sin(v.phys.s.heading)*v.phys.s.speed;
v.velocity.z=Math.cos(v.phys.s.heading)*v.phys.s.speed;
v.mesh.position.set(v.phys.s.x,0,v.phys.s.z);
v.mesh.rotation.y=v.phys.s.heading-Math.PI/2;
}
const pp=driving?{x:driving.phys.s.x,z:driving.phys.s.z}:null;
traffic.update(dt,pp);
}
function nearest(x,z,r){let best=null,bd=r*r;for(const v of vehicles){const dx=v.phys.s.x-x,dz=v.phys.s.z-z,d=dx*dx+dz*dz;if(d<bd){bd=d;best=v}}return best}
return{vehicles,spawn,spawnTraffic,update,traffic,nearest};
}
