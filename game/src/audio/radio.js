const SCALE=[0,3,5,7,10,12,15,17,19,22,24];
const MELODY=[0,2,4,7,9,7,4,2,5,7,9,12,9,7,5,4];
export function createRadio(){
let ctx=null,master=null,engOsc=null,engGain=null,sirenOsc=null,sirenGain=null,muted=false,step=0,timer=null;
function ensure(){
try{
if(!ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ctx=new AC();master=ctx.createGain();master.gain.value=muted?0:0.14;master.connect(ctx.destination)}
if(ctx.state==='suspended')ctx.resume();
}catch(e){}
}
function note(freq,t,dur,type,vol){
if(!ctx)return;
const o=ctx.createOscillator(),g=ctx.createGain();
o.type=type||'triangle';o.frequency.value=freq;
g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol||0.18,t+0.02);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+0.05);
}
function startMusic(){
if(!ctx||timer)return;
timer=setInterval(()=>{
if(!ctx||muted)return;
const t=ctx.currentTime+0.05;
const n=SCALE[MELODY[step%MELODY.length]%SCALE.length];
const f=220*Math.pow(2,n/12);
note(f,t,0.32,'triangle',0.16);
note(f/2,t,0.4,'sine',0.1);
step++;
},260);
}
function setEngine(speed){
if(!ctx)return;
try{
if(!engOsc){engOsc=ctx.createOscillator();engGain=ctx.createGain();engOsc.type='sawtooth';engGain.gain.value=0;engOsc.connect(engGain);engGain.connect(master);engOsc.start()}
engOsc.frequency.value=50+Math.abs(speed)*3.2;
engGain.gain.value=Math.min(0.06,Math.abs(speed)*0.0016);
}catch(e){}
}
function setSiren(on){
if(!ctx)return;
try{
if(on&&!sirenOsc){sirenOsc=ctx.createOscillator();sirenGain=ctx.createGain();sirenOsc.type='sine';sirenOsc.frequency.value=700;sirenGain.gain.value=0.05;sirenOsc.connect(sirenGain);sirenGain.connect(master);sirenOsc.start();
let hi=false;setInterval(()=>{if(sirenOsc)sirenOsc.frequency.value=hi?950:700;hi=!hi},420);
}
if(!on&&sirenOsc){try{sirenOsc.stop()}catch(e){}sirenOsc=null}
}catch(e){}
}
function toggleMute(){muted=!muted;if(master)master.gain.value=muted?0:0.14;return muted}
function stopMusic(){if(timer){clearInterval(timer);timer=null}}
return{ensure,startMusic,stopMusic,setEngine,setSiren,toggleMute,get muted(){return muted}};
}
