import * as THREE from 'three';
import { makeGlow } from '../world/textures.js';
export function createEffects(scene,rng){
const live=[];
const glowTex=makeGlow('rgba(255,220,140,0.95)','rgba(255,120,30,0)');
function explosion(x,z){
const grp=new THREE.Group();grp.position.set(x,1.5,z);
const cols=[0xffd23e,0xff8a2a,0xff5a1a,0x8a8a8a,0x4a4a4a];
const parts=[];
for(let i=0;i<6;i++){
const r=rng.range(1.2,3.2);
const m=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),new THREE.MeshBasicMaterial({color:cols[i%cols.length],transparent:true,opacity:0.9}));
m.position.set(rng.range(-1.5,1.5),rng.range(0,2.5),rng.range(-1.5,1.5));
grp.add(m);parts.push({mesh:m,init:0.9,life:0.9+rng.range(0,0.4),max:1.2,scale0:r,grow:rng.range(1.5,2.5)});
}
const light=new THREE.PointLight(0xff8a2a,60,45,1.8);light.position.y=2;grp.add(light);
const flash=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0.95}));
flash.scale.set(16,16,1);grp.add(flash);
scene.add(grp);
live.push({kind:'boom',grp,parts,light,flash,life:1.2,max:1.2});
}
function tracer(from,to){
const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(from.x,1.4,from.z),new THREE.Vector3(to.x,1.4,to.z)]);
const m=new THREE.LineBasicMaterial({color:0xffe9a0,transparent:true,opacity:0.9});
const line=new THREE.Line(g,m);scene.add(line);
live.push({kind:'tracer',obj:line,life:0.09,max:0.09});
}
function blood(x,z){
const grp=new THREE.Group();grp.position.set(x,1,z);scene.add(grp);
const parts=[];
for(let i=0;i<8;i++){
const p=new THREE.Mesh(new THREE.SphereGeometry(0.12,6,5),new THREE.MeshBasicMaterial({color:0xa02020,transparent:true,opacity:0.9}));
p.position.set(0,0,0);grp.add(p);
parts.push({mesh:p,vx:rng.range(-2,2),vy:rng.range(1,4),vz:rng.range(-2,2),life:0.6,max:0.6});
}
live.push({kind:'blood',grp,parts,life:0.6,max:0.6});
}
function muzzle(x,z){
const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0.9}));
s.position.set(x,1.5,z);s.scale.set(2.5,2.5,1);scene.add(s);
live.push({kind:'muzzle',obj:s,life:0.06,max:0.06});
}
function clear(){for(const e of live){if(e.grp)scene.remove(e.grp);if(e.obj)scene.remove(e.obj)}live.length=0}
function update(dt){
for(let i=live.length-1;i>=0;i--){
const e=live[i];e.life-=dt;
const k=Math.max(0,e.life/e.max);
if(e.kind==='boom'){
for(const p of e.parts){p.mesh.material.opacity=p.init*k;const s=p.scale0*(1+(1-k)*p.grow);p.mesh.scale.set(s,s,s)}
e.light.intensity=60*k;e.flash.material.opacity=0.95*k;
if(e.life<=0){scene.remove(e.grp);live.splice(i,1)}
}
else if(e.kind==='tracer'){e.obj.material.opacity=0.9*k;if(e.life<=0){scene.remove(e.obj);live.splice(i,1)}}
else if(e.kind==='blood'){for(const p of e.parts){p.mesh.position.x+=p.vx*dt;p.mesh.position.y+=p.vy*dt;p.mesh.position.z+=p.vz*dt;p.vy-=9*dt;p.mesh.material.opacity=0.9*k}if(e.life<=0){scene.remove(e.grp);live.splice(i,1)}}
else if(e.kind==='muzzle'){e.obj.material.opacity=0.9*k;if(e.life<=0){scene.remove(e.obj);live.splice(i,1)}}
}
}
return{explosion,tracer,blood,muzzle,clear,update};
}
