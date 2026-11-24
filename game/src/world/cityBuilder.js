import * as THREE from 'three';
import { makeFacadeAtlas, makeStorefront, makeFrond, makeBlob, makeGlow, makeSign } from './textures.js';
const SHOPS=['TOKO SARI','BENGKEL SARI','KOPI SENJA','WARUNG MANGGA','TOKO KELONTONG','ROTI SENJA','ES KELAPA','FOTO KILAT'];
export function createCity(scene,plan,collision,rng){
const g=new THREE.Group();scene.add(g);
const loader=new THREE.TextureLoader();
function photo(url,mats,rep){loader.load(url,t=>{t.colorSpace=THREE.SRGBColorSpace;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1])}for(const m of mats){m.map=t;if(m.emissive&&m.emissive.getHex()!==0)m.emissiveMap=t;m.needsUpdate=true}},undefined,()=>{})}
function pbr(col,nor,rgh,mats,rep){
function one(url,srgb,cb){loader.load(url,t=>{if(srgb)t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);cb(t)},undefined,()=>{})}
one(col,true,ct=>{for(const m of mats){m.map=ct;if(m.emissive&&m.emissive.getHex()!==0)m.emissiveMap=ct;m.needsUpdate=true}});
one(nor,false,nt=>{for(const m of mats){m.normalMap=nt;m.needsUpdate=true}});
one(rgh,false,rt=>{for(const m of mats){m.roughnessMap=rt;m.needsUpdate=true}});
}
const glowTex=makeGlow();
function glowSprite(scale,color,op){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:op||0.7}));if(color)s.material.color.set(color);s.scale.set(scale,scale,1);return s}
const asphaltMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,metalness:0,envMapIntensity:0.3});
const asphaltMatV=new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,metalness:0,envMapIntensity:0.3});
const sandMat=new THREE.MeshStandardMaterial({color:0xf0c890,roughness:1,metalness:0,envMapIntensity:0.3});
pbr('./tex5r-asphalt.jpg','./tex5r-asphalt-nor.jpg','./tex5r-asphalt-rough.jpg',[asphaltMat],[110,2]);
pbr('./tex5r-asphalt.jpg','./tex5r-asphalt-nor.jpg','./tex5r-asphalt-rough.jpg',[asphaltMatV],[2,110]);
pbr('./tex5r-sand.jpg','./tex5r-sand-nor.jpg','./tex5r-sand-rough.jpg',[sandMat],[60,4]);
const sideMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,metalness:0,envMapIntensity:0.25});
pbr('./tex5r-paving.jpg','./tex5r-paving-nor.jpg','./tex5r-paving-rough.jpg',[sideMat],[100,1]);
const baseMat=new THREE.MeshStandardMaterial({color:0x2a2320,roughness:1,metalness:0});
const base=new THREE.Mesh(new THREE.PlaneGeometry(1100,900),baseMat);
base.rotation.x=-Math.PI/2;base.position.set(0,-0.2,150);base.receiveShadow=true;g.add(base);
const road=new THREE.Mesh(new THREE.PlaneGeometry(920,13),asphaltMat);
road.rotation.x=-Math.PI/2;road.position.set(0,0,90);road.receiveShadow=true;g.add(road);
for(const z of[186,260,334]){const r=new THREE.Mesh(new THREE.PlaneGeometry(920,13),asphaltMat);r.rotation.x=-Math.PI/2;r.position.set(0,0,z);r.receiveShadow=true;g.add(r)}
for(const x of plan.xs){const r=new THREE.Mesh(new THREE.PlaneGeometry(13,340),asphaltMatV);r.rotation.x=-Math.PI/2;r.position.set(x,0,210);r.receiveShadow=true;g.add(r)}
const sand=new THREE.Mesh(new THREE.PlaneGeometry(920,46),sandMat);
sand.rotation.x=-Math.PI/2;sand.position.set(0,0.05,62);sand.receiveShadow=true;g.add(sand);
for(const z of[99.5,80.5]){const sw=new THREE.Mesh(new THREE.PlaneGeometry(920,7),sideMat);sw.rotation.x=-Math.PI/2;sw.position.set(0,0.08,z);sw.receiveShadow=true;g.add(sw)}
const dashMat=new THREE.MeshStandardMaterial({color:0xf5f0dc,roughness:0.8});
for(let x=-440;x<450;x+=16){const d=new THREE.Mesh(new THREE.BoxGeometry(6,0.06,0.7),dashMat);d.position.set(x,0.12,90);g.add(d)}
for(const j of plan.junctions){if(j.z!==90)continue;for(let k=-1;k<2;k++){const s=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.06,11),dashMat);s.position.set(j.x+k*4.4,0.12,90);g.add(s)}}
const atlas=makeFacadeAtlas(rng);
const atlasMats=atlas.map(t=>new THREE.MeshStandardMaterial({map:t,roughness:0.85,metalness:0.05,emissiveMap:t,emissive:0xffffff,emissiveIntensity:0.08,envMapIntensity:0.4}));
const heroUrls=['./tex5-brick.png','./tex5-concrete.png','./tex5-glass.png'];
const heroMats=heroUrls.map(()=>new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,metalness:0.05,emissive:0xffffff,emissiveIntensity:0.08,envMapIntensity:0.4}));
pbr('./tex5r-brick.jpg','./tex5r-brick-nor.jpg','./tex5r-brick-rough.jpg',[heroMats[0]],[5,6]);
pbr('./tex5r-concrete.jpg','./tex5r-concrete-nor.jpg','./tex5r-concrete-rough.jpg',[heroMats[1]],[5,6]);
photo('./tex5-glass.png',[heroMats[2]]);
const barberMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.8,metalness:0.05,emissive:0xffffff,emissiveIntensity:0.08,envMapIntensity:0.4});
photo('./tex5-barber.png',[barberMat]);
const roofMat=new THREE.MeshStandardMaterial({color:0x2e2a28,roughness:1});
const glassMat=new THREE.MeshStandardMaterial({color:0x8fb8d8,roughness:0.15,metalness:0.7,envMapIntensity:1});
const storeMats=SHOPS.map(n=>{const m=new THREE.MeshStandardMaterial({map:makeStorefront(n),roughness:0.7,metalness:0.05,emissiveMap:makeStorefront(n),emissive:0xffffff,emissiveIntensity:0.12,envMapIntensity:0.3});return m});
const signMats=SHOPS.map(n=>new THREE.MeshStandardMaterial({map:makeSign(n),roughness:0.6,metalness:0.1,emissiveMap:makeSign(n),emissive:0xffffff,emissiveIntensity:0.25}));
const shopMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.8,metalness:0.05,emissive:0xffffff,emissiveIntensity:0.15,envMapIntensity:0.4});
photo('./tex5-shop.jpg',[shopMat]);
const allB=[];
for(const b of plan.blocks)for(const bd of b.blds)allB.push(bd);
allB.sort((a,b)=>(Math.abs(a.z-90))-(Math.abs(b.z-90)));
const heroes=allB.slice(0,16);
for(const bd of allB){
const hero=heroes.includes(bd);
let mat;
if(hero){mat=bd.h<20?heroMats[0]:bd.h<36?heroMats[1]:heroMats[2]}
else mat=atlasMats[bd.v];
const m=new THREE.Mesh(new THREE.BoxGeometry(bd.w,bd.h,bd.d),mat);
m.position.set(bd.x+bd.w/2,bd.h/2,bd.z+bd.d/2);m.castShadow=true;m.receiveShadow=true;g.add(m);
collision.add(bd.x,bd.z,bd.x+bd.w,bd.z+bd.d);
const roof=new THREE.Mesh(new THREE.BoxGeometry(bd.w*0.7,1.2,bd.d*0.7),roofMat);
roof.position.set(bd.x+bd.w/2,bd.h+0.6,bd.z+bd.d/2);g.add(roof);
const rr=rng.next();
if(bd.h>30&&rr<0.3){const tw=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.2,4,8),roofMat);tw.position.set(bd.x+bd.w*0.25,bd.h+3.2,bd.z+bd.d*0.3);g.add(tw);const tc=new THREE.Mesh(new THREE.ConeGeometry(2.6,2,8),roofMat);tc.position.set(bd.x+bd.w*0.25,bd.h+6.2,bd.z+bd.d*0.3);g.add(tc)}
else if(bd.h>36&&rr<0.6){const fin=new THREE.Mesh(new THREE.BoxGeometry(0.8,6,bd.d*0.5),glassMat);fin.position.set(bd.x+bd.w/2,bd.h+3,bd.z+bd.d/2);g.add(fin)}
else if(bd.h>44){const sp=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.8,9,6),roofMat);sp.position.set(bd.x+bd.w/2,bd.h+5,bd.z+bd.d/2);g.add(sp);const bc=new THREE.Mesh(new THREE.SphereGeometry(0.7,8,6),new THREE.MeshStandardMaterial({color:0x330000,emissive:0xff2020,emissiveIntensity:2}));bc.position.set(bd.x+bd.w/2,bd.h+9.8,bd.z+bd.d/2);g.add(bc)}
if(bd.z<190){
const si=allB.indexOf(bd)%SHOPS.length;
const st=new THREE.Mesh(new THREE.BoxGeometry(Math.min(bd.w,22),5,1.2),storeMats[si]);
st.position.set(bd.x+bd.w/2,2.5,bd.z-0.6);g.add(st);
const sg=new THREE.Mesh(new THREE.BoxGeometry(14,2.2,0.8),signMats[si]);
sg.position.set(bd.x+bd.w/2,6.4,bd.z-0.8);g.add(sg);
}
}
const shopB={x:plan.shop.x-11,z:plan.shop.z-6,w:22,d:12,h:9};
const sm=new THREE.Mesh(new THREE.BoxGeometry(shopB.w,shopB.h,shopB.d),barberMat);
sm.position.set(shopB.x+shopB.w/2,shopB.h/2,shopB.z+shopB.d/2);sm.castShadow=true;sm.receiveShadow=true;g.add(sm);
collision.add(shopB.x,shopB.z,shopB.x+shopB.w,shopB.z+shopB.d);
const shopFront=new THREE.Mesh(new THREE.BoxGeometry(20,5.4,0.6),shopMat);
shopFront.position.set(plan.shop.x,2.7,plan.shop.z-6.2);g.add(shopFront);
const shopSign=new THREE.Mesh(new THREE.BoxGeometry(16,2.4,0.7),signMats[0]);
shopSign.position.set(plan.shop.x,7.6,plan.shop.z-6.3);g.add(shopSign);
const poleMat=new THREE.MeshStandardMaterial({color:0x2a2a2e,roughness:0.6,metalness:0.6});
const lampHeadMat=new THREE.MeshStandardMaterial({color:0x332211,emissive:0xffc06a,emissiveIntensity:2.2});
const poolTex=makeGlow('rgba(255,190,110,0.5)','rgba(255,150,80,0)');
for(let x=-430;x<=430;x+=46){
for(const z of[82,98]){
const p=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.24,7,6),poleMat);p.position.set(x,3.5,z);g.add(p);
const hd=new THREE.Mesh(new THREE.SphereGeometry(0.55,10,8),lampHeadMat);hd.position.set(x,7.1,z);g.add(hd);
const gl=glowSprite(7,0xffc06a,0.55);gl.position.set(x,7.1,z);g.add(gl);
const pool=new THREE.Mesh(new THREE.PlaneGeometry(14,14),new THREE.MeshBasicMaterial({map:poolTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0.4}));
pool.rotation.x=-Math.PI/2;pool.position.set(x,0.15,z);g.add(pool);
}
}
const frondTex=makeFrond();
const frondMat=new THREE.MeshStandardMaterial({map:frondTex,alphaMap:frondTex,alphaTest:0.3,side:THREE.DoubleSide,roughness:0.9,metalness:0,envMapIntensity:0.35});
const trunkMat=new THREE.MeshStandardMaterial({color:0x6a4a2a,roughness:1,metalness:0});
const coreMat=new THREE.MeshStandardMaterial({color:0x2a4a22,roughness:1});
function palm(x,z,s){
const h=9+rng.range(0,4)*s;const lean=rng.range(-0.06,0.06);
const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.42,h,7),trunkMat);
tr.position.set(x,h/2,z);tr.rotation.z=lean;tr.castShadow=true;g.add(tr);
const crown=new THREE.Mesh(new THREE.SphereGeometry(2.3,10,8),coreMat);
crown.scale.y=0.55;crown.position.set(x+lean*h,h+1.1,z);crown.castShadow=true;g.add(crown);
for(let l=0;l<2;l++){
for(let k=0;k<3;k++){
const f=new THREE.Mesh(new THREE.PlaneGeometry(8.5-l*1.5,8.5-l*1.5),frondMat);
const a=k*Math.PI/3+l*0.5;
f.position.set(x+lean*h+Math.cos(a)*1.4,h+1.3+l*1.0,z+Math.sin(a)*1.4);
f.rotation.set(-0.85-l*0.15,a+Math.PI/2,0);f.castShadow=true;g.add(f);
}
}
collision.add(x-0.5,z-0.5,x+0.5,z+0.5);
}
for(let x=-430;x<=430;x+=26){if(rng.chance(0.85))palm(x+rng.range(-4,4),82.5,rng.range(0.85,1.2))}
for(let x=-410;x<=410;x+=52){if(rng.chance(0.7))palm(x+rng.range(-6,6),100.5,rng.range(0.8,1.1))}
for(let i=0;i<14;i++){const x=rng.range(-420,420);palm(x,rng.range(48,72),rng.range(0.9,1.3))}
const blobTex=makeBlob();
const blobMat=new THREE.MeshStandardMaterial({map:blobTex,alphaMap:blobTex,alphaTest:0.4,side:THREE.DoubleSide,roughness:1,metalness:0,envMapIntensity:0.3});
function tree(x,z){
const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.3,3.4,6),trunkMat);tr.position.set(x,1.7,z);tr.castShadow=true;g.add(tr);
for(let k=0;k<2;k++){const c=new THREE.Mesh(new THREE.PlaneGeometry(5.4,5.4),blobMat);c.position.set(x,4.6,z);c.rotation.y=k*Math.PI/2;g.add(c)}
}
for(const j of plan.junctions){if(j.z===90)continue;if(rng.chance(0.6))tree(j.x+9,j.z+9)}
const gateMat=new THREE.MeshStandardMaterial({color:0x0a3a30,emissive:0x2affd8,emissiveIntensity:1.4,roughness:0.4});
const gateWallMat=new THREE.MeshBasicMaterial({color:0x2affd8,transparent:true,opacity:0.16,side:THREE.DoubleSide,depthWrite:false});
const gatePostMat=new THREE.MeshStandardMaterial({color:0x1a2a28,roughness:0.5,metalness:0.4});
const gates=[];
for(const gt of plan.gates){
const grp=new THREE.Group();grp.position.set(gt.x,0,gt.z);
for(const dz of[-6.5,6.5]){const p=new THREE.Mesh(new THREE.BoxGeometry(0.9,11,0.9),gatePostMat);p.position.set(0,5.5,dz);grp.add(p)}
const beam=new THREE.Mesh(new THREE.BoxGeometry(1.1,1.1,14.4),gateMat.clone());beam.position.set(0,11,0);grp.add(beam);
const wall=new THREE.Mesh(new THREE.PlaneGeometry(13,10.4),gateWallMat.clone());wall.position.set(0,5.4,0);wall.rotation.y=Math.PI/2;grp.add(wall);
const gl=glowSprite(16,0x2affd8,0.5);gl.position.set(0,11,0);grp.add(gl);
g.add(grp);gates.push({group:grp,beam:beam.material,wall:wall.material,x:gt.x,z:gt.z,id:gt.id});
}
const umbCols=[0xffd23e,0xff5a3c,0x2ec8c8,0xff8ac2];
for(let i=0;i<9;i++){
const x=-400+i*95+rng.range(-20,20),z=rng.range(50,74);
const p=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,3,5),poleMat);p.position.set(x,1.5,z);g.add(p);
const c=new THREE.Mesh(new THREE.ConeGeometry(2.6,1.4,8),new THREE.MeshStandardMaterial({color:umbCols[i%4],roughness:0.8}));c.position.set(x,3.4,z);g.add(c);
}
for(let i=0;i<3;i++){
const x=-300+i*260,z=-20-i*14;
const hull=new THREE.Mesh(new THREE.BoxGeometry(10,1.6,3.4),new THREE.MeshStandardMaterial({color:0x7a4a28,roughness:0.8}));hull.position.set(x,1,z);g.add(hull);
const mast=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,7,5),poleMat);mast.position.set(x,5,z);g.add(mast);
const sail=new THREE.Mesh(new THREE.PlaneGeometry(4.4,5.4),new THREE.MeshStandardMaterial({color:0xf5efe0,roughness:0.9,side:THREE.DoubleSide}));sail.position.set(x+1.6,4.6,z);g.add(sail);
}
return{group:g,gates,shopPos:{x:plan.shop.x,z:plan.shop.z-8},update(dt){const t=Date.now()*0.002;for(const gt of gates){const on=gt.id===1;gt.beam.emissiveIntensity=on?1.6+Math.sin(t*3)*0.7:1.1;gt.wall.opacity=on?0.2+Math.sin(t*3)*0.08:0.12}}};
}
