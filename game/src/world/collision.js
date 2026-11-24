export function createCollision(){
const boxes=[];const cell=40;const grid=new Map();
function key(cx,cz){return cx+','+cz}
function add(x0,z0,x1,z1){const b={x0,z0,x1,z1};boxes.push(b);
for(let cx=Math.floor(x0/cell);cx<=Math.floor(x1/cell);cx++)for(let cz=Math.floor(z0/cell);cz<=Math.floor(z1/cell);cz++){const k=key(cx,cz);if(!grid.has(k))grid.set(k,[]);grid.get(k).push(b)}
return b}
function near(x,z){const out=[];const cx=Math.floor(x/cell),cz=Math.floor(z/cell);
for(let a=cx-1;a<=cx+1;a++)for(let b=cz-1;b<=cz+1;b++){const l=grid.get(key(a,b));if(l)for(const bx of l)if(!out.includes(bx))out.push(bx)}
return out}
function collide(x,z,r){
for(const b of near(x,z)){
const cx=Math.max(b.x0,Math.min(x,b.x1)),cz=Math.max(b.z0,Math.min(z,b.z1));
const dx=x-cx,dz=z-cz,d2=dx*dx+dz*dz;
if(d2<r*r){if(d2<1e-6){x=b.x1+r;continue}const d=Math.sqrt(d2);x=cx+dx/d*r;z=cz+dz/d*r}
}
return{x,z}
}
function inside(x,z){for(const b of near(x,z))if(x>=b.x0&&x<=b.x1&&z>=b.z0&&z<=b.z1)return true;return false}
function clear(){boxes.length=0;grid.clear()}
return{add,collide,inside,clear,boxes};
}
