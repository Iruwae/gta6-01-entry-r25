import * as THREE from 'three';
import { makeGlow } from '../world/textures.js';
function makeHuman(colors){
const g=new THREE.Group();
const skin=new THREE.MeshStandardMaterial({color:colors.skin||0xd8a070,roughness:0.7});
const shirt=new THREE.MeshStandardMaterial({color:colors.shirt||0xc02028,roughness:0.85});
const pants=new THREE.MeshStandardMaterial({color:colors.pants||0x2a3040,roughness:0.9});
const hairM=new THREE.MeshStandardMaterial({color:colors.hair||0x1a1210,roughness:0.9});
const legL=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.8,0.3),pants);legL.position.set(-0.17,0.4,0);legL.castShadow=true;g.add(legL);
const legR=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.8,0.3),pants);legR.position.set(0.17,0.4,0);legR.castShadow=true;g.add(legR);
const torso=new THREE.Mesh(new THREE.BoxGeometry(0.72,0.85,0.42),shirt);torso.position.y=1.22;torso.castShadow=true;g.add(torso);
const armL=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.75,0.24),shirt);armL.position.set(-0.48,1.2,0);armL.castShadow=true;g.add(armL);
const armR=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.75,0.24),shirt);armR.position.set(0.48,1.2,0);armR.castShadow=true;g.add(armR);
const head=new THREE.Mesh(new THREE.SphereGeometry(0.26,12,10),skin);head.position.y=1.92;head.castShadow=true;g.add(head);
const hair=new THREE.Mesh(new THREE.SphereGeometry(0.28,12,8,0,Math.PI*2,0,Math.PI*0.55),hairM);hair.position.y=1.97;g.add(hair);
const glowTex=makeGlow();
const sh=new THREE.Mesh(new THREE.PlaneGeometry(1.3,1.3),new THREE.MeshBasicMaterial({map:glowTex,transparent:true,opacity:0.4,depthWrite:false,color:0x000000}));
sh.rotation.x=-Math.PI/2;sh.position.y=0.05;g.add(sh);
return{group:g,legL,legR,armL,armR,head};
}
export function createPlayer(scene,collision){
const h=makeHuman({shirt:0xc02028,pants:0x2a3040});
scene.add(h.group);
const gun=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.14,0.5),new THREE.MeshStandardMaterial({color:0x1a1a1a,roughness:0.4,metalness:0.6}));
gun.position.set(0.48,0.85,0.3);gun.visible=false;h.group.add(gun);
const st={x:0,z:0,heading:0,speed:0,inVehicle:false,vehicle:null,money:150000,health:100,armor:0,walkPhase:0,armed:false};
const stats={kills:0,carsStolen:0,copsEvaded:0,earned:0};
function placeAt(x,z,heading){st.x=x;st.z=z;st.heading=heading;st.speed=0;sync()}
function sync(){h.group.position.set(st.x,0,st.z);h.group.rotation.y=st.heading}
function enterVehicle(v){st.inVehicle=true;st.vehicle=v;v.parked=false;h.group.visible=false;stats.carsStolen++}
function exitVehicle(){if(!st.vehicle)return;const v=st.vehicle;st.inVehicle=false;st.vehicle=null;st.x=v.phys.s.x-Math.sin(v.phys.s.heading)*2.5;st.z=v.phys.s.z-Math.cos(v.phys.s.heading)*2.5;st.heading=v.phys.s.heading;h.group.visible=true;sync()}
function update(dt,input){
if(st.inVehicle)return;
const run=input.down('boost')?9:6;
let mv=0;
if(input.down('up'))mv=1;else if(input.down('down'))mv=-0.6;
const turn=((input.down('left')?1:0)-(input.down('right')?1:0));
st.heading+=turn*2.6*dt;
st.speed=mv*run;
st.x+=Math.sin(st.heading)*st.speed*dt;
st.z+=Math.cos(st.heading)*st.speed*dt;
const c=collision.collide(st.x,st.z,0.5);st.x=c.x;st.z=c.z;
st.walkPhase+=Math.abs(st.speed)*dt*1.6;
const sw=Math.sin(st.walkPhase)*0.55;
h.legL.rotation.x=sw;h.legR.rotation.x=-sw;
h.armL.rotation.x=-sw*0.7;h.armR.rotation.x=sw*0.7;
sync();
}
return{group:h.group,state:st,stats,placeAt,enterVehicle,exitVehicle,update,setArmed(v){st.armed=v;gun.visible=v},heal(v){st.health=Math.min(100,st.health+v)},position:{get x(){return st.x},get z(){return st.z}},heading:{get value(){return st.heading}}};
}
export { makeHuman };
