import * as THREE from 'three';
function gradCanvas(w,h,stops){
const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
const g=x.createLinearGradient(0,0,0,h);for(const[o,col]of stops)g.addColorStop(o,col);
x.fillStyle=g;x.fillRect(0,0,w,h);return c;
}
function blobCanvas(size,inner,outer){
const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');
const g=x.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
g.addColorStop(0,inner);g.addColorStop(1,outer);x.fillStyle=g;x.fillRect(0,0,size,size);return c;
}
export function createSky(scene,rng,renderer){
const g=new THREE.Group();scene.add(g);
const domeTex=new THREE.CanvasTexture(gradCanvas(16,512,[[0,'#4a3f66'],[0.35,'#7d5568'],[0.6,'#c07a58'],[0.78,'#ffa05e'],[0.88,'#ffc27a'],[1,'#2a1a2a']]));
domeTex.colorSpace=THREE.SRGBColorSpace;
const dome=new THREE.Mesh(new THREE.SphereGeometry(950,24,16),new THREE.MeshBasicMaterial({map:domeTex,side:THREE.BackSide,fog:false,depthWrite:false}));
g.add(dome);
const glowTex=new THREE.CanvasTexture(blobCanvas(256,'rgba(255,190,110,0.9)','rgba(255,150,80,0)'));
const sun=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,fog:false,opacity:0.95}));
sun.position.set(-260,110,-620);sun.scale.set(420,420,1);g.add(sun);
const sunCore=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,fog:false,opacity:0.9,color:0xfff2cc}));
sunCore.position.set(-260,110,-620);sunCore.scale.set(150,150,1);g.add(sunCore);
const cloudTex=new THREE.CanvasTexture(blobCanvas(256,'rgba(255,220,220,0.55)','rgba(255,200,200,0)'));
const clouds=[];
for(let i=0;i<30;i++){
const s=new THREE.Sprite(new THREE.SpriteMaterial({map:cloudTex,transparent:true,depthWrite:false,opacity:rng.range(0.25,0.55),fog:false}));
s.position.set(rng.range(-700,700),rng.range(140,300),rng.range(-700,-100));
s.scale.set(rng.range(120,320),rng.range(30,70),1);s.userData.v=rng.range(0.5,1.6);
clouds.push(s);g.add(s);
}
const seaMat=new THREE.MeshStandardMaterial({color:0x2f7f8c,roughness:0.12,metalness:0.35,envMapIntensity:1.2});
const sea=new THREE.Mesh(new THREE.PlaneGeometry(1600,520),seaMat);
sea.rotation.x=-Math.PI/2;sea.position.set(0,0.4,-300);sea.receiveShadow=true;g.add(sea);
const shoreMat=new THREE.MeshStandardMaterial({color:0x6fb3a8,roughness:0.2,metalness:0.2,envMapIntensity:1});
const shore=new THREE.Mesh(new THREE.PlaneGeometry(1600,90),shoreMat);
shore.rotation.x=-Math.PI/2;shore.position.set(0,0.6,-75);shore.receiveShadow=true;g.add(shore);
const islMat=new THREE.MeshStandardMaterial({color:0x5a6a58,roughness:1,metalness:0});
for(const[ix,iz,s]of[[-420,-420,150],[-80,-480,190],[260,-430,130],[520,-380,90]]){
const isl=new THREE.Mesh(new THREE.SphereGeometry(s,20,12),islMat);
isl.scale.y=0.32;isl.position.set(ix,0,iz);g.add(isl);
}
const fadeC=document.createElement('canvas');fadeC.width=256;fadeC.height=256;
const fx=fadeC.getContext('2d');
const fg=fx.createLinearGradient(0,0,0,256);fg.addColorStop(0,'#000');fg.addColorStop(0.25,'#fff');fg.addColorStop(1,'#fff');
fx.fillStyle=fg;fx.fillRect(0,0,256,256);
const fg2=fx.createLinearGradient(0,0,256,0);fg2.addColorStop(0,'rgba(0,0,0,0)');fg2.addColorStop(0.12,'rgba(255,255,255,1)');fg2.addColorStop(0.88,'rgba(255,255,255,1)');fg2.addColorStop(1,'rgba(0,0,0,0)');
fx.globalCompositeOperation='destination-in';fx.fillStyle=fg2;fx.fillRect(0,0,256,256);
const fadeTex=new THREE.CanvasTexture(fadeC);
const backMat=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(gradCanvas(64,256,[[0,'#a05a8a'],[0.5,'#ffb37a'],[1,'#ffcf9a']])),alphaMap:fadeTex,transparent:true,fog:false,depthWrite:false});
const back=new THREE.Mesh(new THREE.PlaneGeometry(1700,950),backMat);
back.position.set(0,220,-420);g.add(back);
const pmrem=new THREE.PMREMGenerator(renderer);
let envDone=false;
function gradEnv(){
const es=new THREE.Scene();
const eg=new THREE.Mesh(new THREE.SphereGeometry(50,16,12),new THREE.MeshBasicMaterial({map:domeTex,side:THREE.BackSide}));
es.add(eg);
const eb=new THREE.Mesh(new THREE.SphereGeometry(6,12,8),new THREE.MeshBasicMaterial({color:0xffe0a0}));
eb.position.set(-20,12,-40);es.add(eb);
return es;
}
try{
const rt=pmrem.fromScene(gradEnv(),0.04);
scene.environment=rt.texture;if('environmentIntensity' in scene)scene.environmentIntensity=0.55;envDone=true;
}catch(e){envDone=false}
new THREE.TextureLoader().load('./tex5-sky.jpg',t=>{
t.colorSpace=THREE.SRGBColorSpace;
backMat.map=t;backMat.needsUpdate=true;
},undefined,()=>{});
new THREE.TextureLoader().load('./tex5r-env.jpg',t=>{
t.mapping=THREE.EquirectangularReflectionMapping;t.colorSpace=THREE.SRGBColorSpace;
try{const rt=pmrem.fromEquirectangularTexture(t);scene.environment=rt.texture;if('environmentIntensity' in scene)scene.environmentIntensity=0.55;}catch(e){}
},undefined,()=>{});
return{group:g,update(dt){for(const c of clouds){c.position.x+=c.userData.v*dt;if(c.position.x>750)c.position.x=-750}sun.material.opacity=0.9+Math.sin(Date.now()*0.0006)*0.05},envReady:()=>envDone};
}
