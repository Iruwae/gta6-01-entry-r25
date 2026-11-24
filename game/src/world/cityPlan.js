import { makeRng } from '../core/rng.js';
export const DISTRICTS=['PANTAI MERPATI','PASAR SENJA','KOTA LAMA','MENARA KACA','KAMPUNG MANGGA','PELABUHAN','BUKIT HIJAU','PULAU KARANG'];
export const STREETS=['JL. MERPATI','JL. KARANG','JL. SENJA','JL. MANGGA','JL. PELABUHAN','JL. BUKIT'];
export function createPlan(seed=7){
const rng=makeRng(seed);
const xs=[-420,-346,-272,-198,-124,-50,24,98,172,246,320,394];
const zs=[90,186,260,334];
const junctions=[];
for(let j=0;j<zs.length;j++)for(let i=0;i<xs.length;i++)junctions.push({id:'j'+i+'-'+j,x:xs[i],z:zs[j]});
const blocks=[];
for(let j=0;j<zs.length-1;j++)for(let i=0;i<xs.length-1;i++){
const x0=xs[i]+8,z0=zs[j]+8,x1=xs[i+1]-8,z1=zs[j+1]-8;
const n=rng.int(1,3),blds=[];
for(let k=0;k<n;k++){
const w=rng.range(18,30),d=rng.range(16,26);
const bx=x0+6+rng.range(0,Math.max(1,(x1-x0)-w-12));
const bz=z0+6+rng.range(0,Math.max(1,(z1-z0)-d-12));
blds.push({x:bx,z:bz,w,d,h:rng.range(12,58),v:rng.int(0,7),hero:false});
}
blocks.push({x0,z0,x1,z1,blds});
}
const gates=[];for(let i=0;i<14;i++)gates.push({x:-390+i*60,z:90,id:i+1});
const shop={x:-180,z:108,name:'TOKO SARI'};
function nearestJunction(x,z){let best=junctions[0],bd=1e18;for(const j of junctions){const dx=j.x-x,dz=j.z-z,d=dx*dx+dz*dz;if(d<bd){bd=d;best=j}}return best}
function districtAt(x,z){
if(z<40)return'PULAU KARANG';
if(z<112)return x<-150?'PANTAI MERPATI':x<100?'PASAR SENJA':'PELABUHAN';
if(z<200)return x<-150?'KOTA LAMA':x<100?'MENARA KACA':'KAMPUNG MANGGA';
return'BUKIT HIJAU';
}
function streetAt(x){return STREETS[Math.max(0,Math.min(5,Math.floor((x+450)/150)))]}
function randomJunction(){return junctions[Math.floor(Math.random()*junctions.length)]}
return{xs,zs,junctions,blocks,gates,shop,nearestJunction,districtAt,streetAt,randomJunction,beachZ:90,seaZ:40,seed};
}
