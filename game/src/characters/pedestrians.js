import * as THREE from 'three';
import { makeHuman } from './player.js';
const NAMES=['Ratna','Hendra','Agus','Budi','Wulan','Sari','Joko','Maya'];
const SHIRTS=[0x2a6ac0,0x3a8a4a,0xe8a020,0x8a4a9a,0xc05a2a,0x4a9a9a,0xd8d0c0,0x6a5a8a];
function nameTag(name){
const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');
x.fillStyle='rgba(20,12,8,0.85)';x.fillRect(0,0,256,64);
x.strokeStyle='#c9a227';x.lineWidth=3;x.strokeRect(3,3,250,58);
x.fillStyle='#ffd75e';x.font='bold 34px Arial';x.textAlign='center';x.textBaseline='middle';x.fillText(name,128,34);
const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));
s.scale.set(2.4,0.6,1);return s;
}
export function createPedestrians(scene,plan,collision,rng){
const npcs=[];
function spawn(x,z,kind,name){
const nm=name||(kind==='guard'?'Penjaga':NAMES[Math.floor(rng.next()*NAMES.length)]);
const colors=kind==='guard'?{shirt:0x2a2a30,pants:0x1a1a1a,skin:0xc89060}:{shirt:SHIRTS[Math.floor(rng.next()*SHIRTS.length)],pants:0x3a3a44};
const h=makeHuman(colors);
const tag=nameTag(nm);tag.position.y=2.5;h.group.add(tag);
scene.add(h.group);
const n={mesh:h.group,parts:h,x,z,heading:rng.range(0,Math.PI*2),kind,name:nm,target:null,wait:rng.range(0,3),speed:kind==='guard'?0:1.4,phase:rng.range(0,6)};
n.mesh.position.set(x,0,z);n.mesh.rotation.y=n.heading;
npcs.push(n);return n;
}
function spawnCrowd(n){
for(let i=0;i<n;i++){
const x=rng.range(-430,430);
const z=rng.chance(0.5)?rng.range(96,106):rng.range(76,84);
spawn(x,z,rng.chance(0.12)?'guard':'civilian');
}
}
function update(dt){
for(const n of npcs){
if(n.wait>0){n.wait-=dt;continue}
if(!n.target){
const a=rng.range(0,Math.PI*2);const d=rng.range(6,20);
n.target={x:n.x+Math.sin(a)*d,z:n.z+Math.cos(a)*d};
}
const dx=n.target.x-n.x,dz=n.target.z-n.z;const dist=Math.hypot(dx,dz);
if(dist<1){n.target=null;n.wait=rng.range(1,4);continue}
const want=Math.atan2(dx,dz);
let dh=want-n.heading;while(dh>Math.PI)dh-=Math.PI*2;while(dh<-Math.PI)dh+=Math.PI*2;
n.heading+=Math.max(-2*dt,Math.min(2*dt,dh));
n.x+=Math.sin(n.heading)*n.speed*dt;
n.z+=Math.cos(n.heading)*n.speed*dt;
const c=collision.collide(n.x,n.z,0.5);n.x=c.x;n.z=c.z;
n.phase+=n.speed*dt*1.6;
const sw=Math.sin(n.phase)*0.45;
n.parts.legL.rotation.x=sw;n.parts.legR.rotation.x=-sw;
n.mesh.position.set(n.x,0,n.z);n.mesh.rotation.y=n.heading;
}
}
return{npcs,spawn,spawnCrowd,update,nearest(x,z,r){let best=null,bd=r*r;for(const n of npcs){const dx=n.x-x,dz=n.z-z,d=dx*dx+dz*dz;if(d<bd){bd=d;best=n}}return best}};
}
