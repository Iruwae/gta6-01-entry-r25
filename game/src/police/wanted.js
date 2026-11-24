export function createWanted(bus){
let heat=0;
function level(){if(heat<10)return 0;if(heat<30)return 1;if(heat<50)return 2;if(heat<70)return 3;if(heat<90)return 4;return 5}
function add(n){const before=level();heat=Math.min(100,heat+n);if(level()>before)bus.emit('wanted-up',{level:level()})}
function set(l){heat=[0,15,35,55,75,95][Math.max(0,Math.min(5,l))]||0;bus.emit('wanted-set',{level:l})}
function decay(dt){heat=Math.max(0,heat-dt*1.2)}
function evade(){heat=Math.max(0,heat-25);bus.emit('evaded',{})}
function reset(){heat=0;bus.emit('wanted-set',{level:0})}
return{add,set,decay,evade,reset,get heat(){return heat},get level(){return level()}};
}
