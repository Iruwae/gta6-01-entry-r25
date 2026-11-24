export function createInput(){
const held=new Set(),pressed=new Set();let mx=0,my=0,mDown=false;
const keyMap={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',Space:'brake',ShiftLeft:'boost',ShiftRight:'boost',KeyE:'enter',KeyF:'aim',KeyM:'mission',KeyR:'race',KeyT:'taxi',Escape:'esc',KeyP:'pause'};
function kd(e){const k=keyMap[e.code];if(!k)return;if(e.code==='Space'||e.code.startsWith('Arrow'))e.preventDefault();if(!held.has(k))pressed.add(k);held.add(k)}
function ku(e){const k=keyMap[e.code];if(k)held.delete(k)}
function md(e){mDown=true;pressed.add('fire')}
function mu(){mDown=false}
function mm(e){mx=e.clientX;my=e.clientY}
window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);
window.addEventListener('mousedown',md);window.addEventListener('mouseup',mu);window.addEventListener('mousemove',mm);
return{held,pressed,down:k=>held.has(k),hit:k=>pressed.has(k),any:()=>held.size>0,end(){pressed.clear()},mouse:{get x(){return mx},get y(){return my},get down(){return mDown}}};
}
