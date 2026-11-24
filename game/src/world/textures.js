import * as THREE from 'three';
function cv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return[c,c.getContext('2d')]}
function tex(c){const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t}
export function makeGlow(inner='rgba(255,190,110,0.9)',outer='rgba(255,150,80,0)'){
const[c,x]=cv(128,128);const g=x.createRadialGradient(64,64,0,64,64,64);
g.addColorStop(0,inner);g.addColorStop(1,outer);x.fillStyle=g;x.fillRect(0,0,128,128);return tex(c);
}
export function makeBlob(){
const[c,x]=cv(256,256);const cols=['#2f6b2f','#4a8a3a','#6aa84a','#245a26'];
for(let i=0;i<16;i++){const px=40+Math.random()*176,py=50+Math.random()*150,r=22+Math.random()*30;
x.fillStyle=cols[Math.floor(Math.random()*cols.length)];x.globalAlpha=0.9;
x.beginPath();x.arc(px,py,r,0,7);x.fill()}
x.globalAlpha=1;return tex(c);
}
export function makeFrond(){
const[c,x]=cv(512,512);x.clearRect(0,0,512,512);
x.lineCap='round';
function frond(bx,by,tx,ty){
x.strokeStyle='#4a7a2e';x.lineWidth=9;
x.beginPath();x.moveTo(bx,by);x.quadraticCurveTo(bx+(tx-bx)*0.35,by+(ty-by)*0.25,tx,ty);x.stroke();
for(let i=0;i<30;i++){
const t=i/30;
const px=bx+(tx-bx)*t,py=by+(ty-by)*t-Math.sin(t*Math.PI)*28;
const len=55+Math.sin(t*3.1)*30;
const ang=Math.atan2(ty-by,tx-bx);
for(const s of[1,-1]){
const a2=ang+s*(0.9+t*0.5);
const gx=x.createLinearGradient(px,py,px+Math.cos(a2)*len,py+Math.sin(a2)*len);
gx.addColorStop(0,'#9ccb5e');gx.addColorStop(1,'#3d6b2a');
x.strokeStyle=gx;x.lineWidth=7;
x.beginPath();x.moveTo(px,py);
x.quadraticCurveTo(px+Math.cos(a2)*len*0.5,py+Math.sin(a2)*len*0.5+14,px+Math.cos(a2)*len,py+Math.sin(a2)*len+26);x.stroke();
}
}
}
frond(256,500,440,90);
frond(256,500,72,110);
return tex(c);
}
const FACADES=[
['#7a6a58','#5a4a3a'],['#3a4a5a','#2a3542'],['#8a7a5a','#6a5a42'],['#c9b896','#a89878'],
['#9a8a72','#7a6a52'],['#6a6a6a','#4a4a4a'],['#a86a4a','#8a4a30'],['#5a5a48','#3a3a30']];
export function makeFacadeAtlas(rng){
const out=[];
for(let v=0;v<8;v++){
const[c,x]=cv(256,512);const[base,dark]=FACADES[v];
x.fillStyle=base;x.fillRect(0,0,256,512);
x.fillStyle=dark;x.fillRect(0,0,256,10);
for(let f=0;f<8;f++){const fy=14+f*62;x.fillStyle='rgba(0,0,0,0.18)';x.fillRect(0,fy+56,256,6);
for(let col=0;col<4;col++){const wx=14+col*62,wy=fy+8;
const r=rng.next();
if(r<0.42)x.fillStyle='#ffd27a';else if(r<0.62)x.fillStyle='#9fd4ff';else if(r<0.78)x.fillStyle='#2a2f3a';else x.fillStyle='#1c2230';
x.fillRect(wx,wy,44,44);
x.fillStyle='rgba(255,255,255,0.25)';x.fillRect(wx,wy,44,4);
if(v===3&&f===7){x.fillStyle='#8a6a3a';x.fillRect(wx,wy+44,44,6)}
if(v===4){x.fillStyle='rgba(0,0,0,0.25)';x.fillRect(wx-4,wy+48,52,5)}
}
}
if(v===7){x.fillStyle='rgba(120,60,20,0.35)';for(let i=0;i<20;i++)x.fillRect(rng.range(0,240),rng.range(0,500),16+rng.range(0,20),3)}
out.push(tex(c));
}
return out;
}
export function makeStorefront(name){
const[c,x]=cv(512,128);
x.fillStyle='#1c1410';x.fillRect(0,0,512,34);
x.fillStyle='#e8c34a';x.font='bold 24px Arial';x.textAlign='center';x.fillText(name,256,24);
x.fillStyle='#7a2a2a';for(let i=0;i<8;i++){x.fillRect(i*64,34,32,14);x.fillStyle=i%2?'#e8c34a':'#7a2a2a';}
x.fillStyle='#7a2a2a';x.fillRect(0,34,512,14);
for(let p=0;p<3;p++){const gx=x.createLinearGradient(0,48,0,128);
gx.addColorStop(0,'#ffdf9a');gx.addColorStop(1,'#c98a3a');
x.fillStyle=gx;x.fillRect(14+p*166,52,146,66);
x.fillStyle='rgba(120,70,20,0.5)';x.fillRect(14+p*166,52,146,10);
x.strokeStyle='#3a2410';x.lineWidth=3;x.strokeRect(14+p*166,52,146,66);
}
x.fillStyle='#4a3018';x.fillRect(236,52,40,66);
return tex(c);
}
export function makeSign(name,fg='#ffd75e',bg='#1c1410'){
const[c,x]=cv(512,96);x.fillStyle=bg;x.fillRect(0,0,512,96);
x.strokeStyle='#c9a227';x.lineWidth=4;x.strokeRect(4,4,504,88);
x.fillStyle=fg;x.font='bold 52px Arial';x.textAlign='center';x.textBaseline='middle';x.fillText(name,256,50);
return tex(c);
}
export function makeRoughNoise(seed){
const[c,x]=cv(128,128);const img=x.createImageData(128,128);
for(let i=0;i<img.data.length;i+=4){const v=118+Math.floor(Math.random()*40);img.data[i]=v;img.data[i+1]=v;img.data[i+2]=v;img.data[i+3]=255}
x.putImageData(img,0,0);return tex(c);
}
export function makeChecker(c1,c2,n=8){
const[c,x]=cv(128,128);const s=128/n;
for(let i=0;i<n;i++)for(let j=0;j<n;j++){x.fillStyle=(i+j)%2?c1:c2;x.fillRect(i*s,j*s,s,s)}
return tex(c);
}
