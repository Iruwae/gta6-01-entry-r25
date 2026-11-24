export function createMinimap(canvas,plan,opts={}){
const circle=opts.circle!==false;
const ctx=canvas.getContext('2d');
const W=canvas.width,H=canvas.height;
const X0=-470,X1=470,Z0=-70,Z1=390;
function px(x){return (x-X0)/(X1-X0)*W}
function py(z){return (z-Z0)/(Z1-Z0)*H}
function draw(p){
ctx.save();
ctx.clearRect(0,0,W,H);
if(circle){ctx.beginPath();ctx.arc(W/2,H/2,W/2-2,0,Math.PI*2);ctx.clip()}
ctx.fillStyle='#141a20';ctx.fillRect(0,0,W,H);
ctx.fillStyle='#2f7f8c';ctx.fillRect(0,0,W,py(40));
ctx.fillStyle='#c9a86a';ctx.fillRect(0,py(40),W,py(84)-py(40));
ctx.fillStyle='#3a3532';
for(const z of[90,186,260,334])ctx.fillRect(0,py(z)-3,W,6);
for(const x of plan.xs)ctx.fillRect(px(x)-3,0,6,H);
ctx.fillStyle='#f5f0dc';
for(let x=-440;x<450;x+=16)ctx.fillRect(px(x)-1,py(90)-0.5,2,1);
ctx.fillStyle='rgba(0,0,0,0.5)';
for(const b of plan.blocks)for(const bd of b.blds){
ctx.fillRect(px(bd.x),py(bd.z),Math.max(2,(bd.w/(X1-X0))*W),Math.max(2,(bd.d/(Z1-Z0))*H));
}
if(p.objective){ctx.fillStyle='#ffd75e';ctx.beginPath();ctx.arc(px(p.objective.x),py(p.objective.z),5,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#ffd75e';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(px(p.objective.x),py(p.objective.z),9,0,Math.PI*2);ctx.stroke();
}
for(const n of p.npcs||[]){ctx.fillStyle='#ffffff';ctx.fillRect(px(n.x)-1.5,py(n.z)-1.5,3,3)}
for(const v of p.vehicles||[]){
ctx.fillStyle=v.type==='interceptor'?'#ff4040':'#9fb8cc';
ctx.beginPath();ctx.arc(px(v.x),py(v.z),3.4,0,Math.PI*2);ctx.fill();
}
if(p.player){
ctx.fillStyle='#ffd75e';
ctx.save();ctx.translate(px(p.player.x),py(p.player.z));ctx.rotate(-p.player.heading+Math.PI);
ctx.beginPath();ctx.moveTo(0,-7);ctx.lineTo(5,5);ctx.lineTo(-5,5);ctx.closePath();ctx.fill();ctx.restore();
}
ctx.restore();
if(circle){
ctx.strokeStyle='#c9a227';ctx.lineWidth=3;
ctx.beginPath();ctx.arc(W/2,H/2,W/2-2,0,Math.PI*2);ctx.stroke();
ctx.fillStyle='#ffd75e';ctx.font='bold 11px Arial';ctx.textAlign='center';
ctx.fillText('N',W/2,14);
}else{
ctx.strokeStyle='#c9a227';ctx.lineWidth=2;ctx.strokeRect(1,1,W-2,H-2);
}
}
return{draw};
}
