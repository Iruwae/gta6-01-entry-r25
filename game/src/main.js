import * as THREE from 'three';
import { createBus } from './core/bus.js';
import { createInput } from './core/input.js';
import { makeRng } from './core/rng.js';
import { createPlan } from './world/cityPlan.js';
import { createCollision } from './world/collision.js';
import { createSky } from './world/sky.js';
import { createPost } from './world/post.js';
import { createCity } from './world/cityBuilder.js';
import { createFleet } from './vehicles/vehicleFleet.js';
import { createPlayer } from './characters/player.js';
import { createPedestrians } from './characters/pedestrians.js';
import { createLoadout } from './combat/weapons.js';
import { createCombat } from './combat/combat.js';
import { createDispatch } from './police/dispatch.js';
import { createWanted } from './police/wanted.js';
import { createMissionRunner } from './missions/missionRunner.js';
import { createActivities } from './missions/activities.js';
import { createRespect, RANKS } from './missions/respect.js';
import { INTRO_LINES, MISSIONS } from './missions/story.js';
import { createSaveGame } from './save/saveGame.js';
import { createEffects } from './effects/effects.js';
import { createChaseCamera } from './camera/chaseCamera.js';
import { createRadio } from './audio/radio.js';
import { createHud } from './ui/hud.js';
import { createMenus } from './ui/menus.js';
import { createMinimap } from './ui/minimap.js';
const params=new URLSearchParams(location.search);
const SEED=parseInt(params.get('seed')||'7',10)||7;
const rng=makeRng(SEED);
const bus=createBus();
const input=createInput();
const renderer=new THREE.WebGLRenderer({antialias:true});
document.getElementById('app').appendChild(renderer.domElement);
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.NoToneMapping;
renderer.outputColorSpace=THREE.LinearSRGBColorSpace;
const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0xa06a55,0.0011);
const camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,0.1,2000);
camera.position.set(-320,8,110);
const hemi=new THREE.HemisphereLight(0xffd9a0,0x3a2a26,0.75);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffb070,2.4);
sun.position.set(-120,90,-180);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-380;sun.shadow.camera.right=380;
sun.shadow.camera.top=380;sun.shadow.camera.bottom=-380;
sun.shadow.camera.near=10;sun.shadow.camera.far=900;
sun.shadow.bias=-0.0004;sun.shadow.normalBias=0.6;
scene.add(sun);
const plan=createPlan(SEED);
const collision=createCollision();
const sky=createSky(scene,rng,renderer);
const city=createCity(scene,plan,collision,rng);
const fleet=createFleet(scene,plan,rng,collision);
const player=createPlayer(scene,collision);
const pedestrians=createPedestrians(scene,plan,collision,rng);
const loadout=createLoadout();
player.loadout=loadout;
loadout.give('pistol',24);loadout.give('rifle',60);
const effects=createEffects(scene,rng);
const combat=createCombat(scene,bus,rng,effects,player,pedestrians,fleet);
const dispatch=createDispatch(scene,fleet,plan,rng,bus);
const wanted=createWanted(bus);
const missions=createMissionRunner(bus,player,fleet,pedestrians,plan);
const activities=createActivities(scene,plan,rng,bus,player);
const respect=createRespect(bus);
const saveGame=createSaveGame('teluk-senja-save');
const hud=createHud();
const menus=createMenus(bus);
const minimap=createMinimap(document.getElementById('minimap'),plan);
const pauseMap=createMinimap(document.getElementById('pauseMap'),plan,{circle:false});
const chase=createChaseCamera(camera);
const radio=createRadio();
const post=createPost(renderer,scene,camera,innerWidth,innerHeight);
const G={bus,input,rng,plan,collision,sky,city,fleet,player,pedestrians,loadout,combat,dispatch,wanted,missions,activities,respect,saveGame,effects,camera:chase,radio,hud,menus,minimap,post,scene,renderer};
let mode='title';
let introShown=false;
let objectiveText='Tekan M untuk memilih misi.';
let missionTitle='',missionDesc='',missionReward=0;
let clockMin=17*60+42;
let saveTimer=0;
const stats={missions:0,kills:0,carsStolen:0,coins:0,earned:0};
bus.on('objective',d=>{objectiveText=d.text});
bus.on('mission-start',d=>{missionTitle=d.mission.title;missionDesc=d.mission.desc;missionReward=d.mission.reward;hud.notice('Misi baru: '+d.mission.title)});
bus.on('mission-complete',d=>{stats.missions++;hud.notice('Misi selesai! +Rp '+d.reward.toLocaleString('id-ID'));hud.banner('MISI SELESAI · +Rp '+d.reward.toLocaleString('id-ID'));saveNow()});
bus.on('respect-add',d=>respect.add(d.amount));
bus.on('rank-up',d=>{hud.banner('NAIK PANGKAT · '+d.rank);hud.notice('Respect naik: '+d.rank)});
bus.on('coin',d=>{stats.coins=d.count;hud.notice('Koin +Rp 2.500 ('+d.count+'/24)')});
bus.on('kill',()=>{stats.kills=player.stats.kills;wanted.add(8)});
bus.on('explosion',()=>chase.shake(0.6));
bus.on('wanted-up',d=>{hud.notice('Polisi mengejarmu! ★'+d.level);while(dispatch.count()<d.level)dispatch.spawnUnit(playerPos(),d.level)});
bus.on('wanted-set',d=>{if(d.level===0)dispatch.clear()});
bus.on('evaded',()=>{hud.notice('Kamu lolos dari kejaran polisi.');dispatch.clear()});
bus.on('race-gate',d=>hud.notice('Gerbang '+d.gate+'/'+d.total));
bus.on('race-complete',d=>hud.banner('BALAPAN MENANG! +Rp '+d.reward.toLocaleString('id-ID')));
bus.on('mission-pick',d=>{missions.start(d.id)});
bus.on('start-game',()=>{menus.hideTitle();mode='play';radio.ensure();radio.startMusic();if(!introShown){introShown=true;INTRO_LINES.forEach((l,i)=>setTimeout(()=>hud.notice(l),i*2600));missions.start('first-errand')}});
bus.on('resume-game',()=>{menus.hidePause();mode='play'});
bus.on('restart-game',()=>{saveGame.clear();location.reload()});
bus.on('quit-to-title',()=>{mode='title';menus.showTitle()});
bus.on('save-game',()=>{saveNow();hud.notice('Permainan disimpan.')});
bus.on('shop-open',()=>hud.notice('Bengkel & Toko segera hadir.'));
bus.on('empty-click',()=>hud.notice('Peluru habis!'));
function playerPos(){
if(player.state.inVehicle&&player.state.vehicle)return{x:player.state.vehicle.phys.s.x,z:player.state.vehicle.phys.s.z};
return{x:player.state.x,z:player.state.z};
}
function playerVel(){
if(player.state.inVehicle&&player.state.vehicle){const v=player.state.vehicle;return{x:v.velocity.x,z:v.velocity.z}}
return{x:0,z:0};
}
function saveNow(){
saveGame.save({money:player.state.money,rp:respect.rp,stats,mission:missions.current?missions.current.id:null});
}
function mapState(){
const p=playerPos();
const heading=player.state.inVehicle&&player.state.vehicle?player.state.vehicle.phys.s.heading:player.state.heading;
const cur=missions.current;
let objective=null;
if(cur&&missions.active){const s=cur.steps[missions.active.stepIdx];if(s&&s.x!==undefined)objective={x:s.x,z:s.z}}
return{player:{x:p.x,z:p.z,heading},vehicles:fleet.vehicles.map(v=>({x:v.phys.s.x,z:v.phys.s.z,type:v.type})),npcs:pedestrians.npcs,objective};
}
function step(dt){
const inCar=player.state.inVehicle;
const driving=inCar?player.state.vehicle:null;
player.update(dt,input);
fleet.update(dt,input,driving);
pedestrians.update(dt);
dispatch.update(dt,playerPos(),playerVel());
missions.update(dt);
activities.update(dt);
wanted.decay(dt);
if(wanted.level===0&&dispatch.count()>0)dispatch.clear();
effects.update(dt);
city.update(dt);
sky.update(dt);
loadout.tick(dt);
clockMin=(clockMin+dt*0.5)%1440;
saveTimer+=dt;
if(saveTimer>30){saveTimer=0;saveNow()}
}
function frame(dt){
step(dt);
const p=playerPos();
const t={x:p.x,z:p.z,heading:player.state.inVehicle&&player.state.vehicle?player.state.vehicle.phys.s.heading:player.state.heading,speed:player.state.inVehicle&&player.state.vehicle?player.state.vehicle.phys.s.speed:player.state.speed,inVehicle:player.state.inVehicle};
chase.update(dt,t);
radio.setEngine(t.inVehicle?Math.abs(t.speed):0);
radio.setSiren(wanted.level>0);
const cur=missions.current;
hud.update({
money:player.state.money,wanted:wanted.level,rank:respect.rank,rp:respect.rp,rpProgress:respect.progress(),
health:player.state.health,armor:player.state.armor,
weapon:loadout.weapon.name,ammo:loadout.ammo(loadout.selected),
weapons:[{id:'fists',name:'Tinju',ammo:Infinity,selected:loadout.selected==='fists'},{id:'pistol',name:'Pistol',ammo:loadout.ammo('pistol'),selected:loadout.selected==='pistol'},{id:'rifle',name:'Senapan',ammo:loadout.ammo('rifle'),selected:loadout.selected==='rifle'}],
speed:t.speed,inVehicle:t.inVehicle,carName:t.inVehicle?(player.state.vehicle.type==='comet'?'GARUDA GT':player.state.vehicle.type==='interceptor'?'PATROLI':'MOBIL'):'BERJALAN KAKI',
district:plan.districtAt(p.x,p.z),street:plan.streetAt(p.x),
objective:objectiveText,radio:radio.muted?'SENJA 97.5 (senyap)':'SENJA 97.5 · Orkes Melati',
clock:String(Math.floor(clockMin/60)).padStart(2,'0')+':'+String(Math.floor(clockMin%60)).padStart(2,'0'),
missionTitle,missionDesc,missionReward,
dispatch:dispatch.units,crew:[{name:'Sari',role:'Kurir · Pasar Senja'},{name:'Hendra',role:'Mekanik · Bengkel Sari'},{name:'Agus',role:'Pengintai · Pantai Merpati'}],
});
minimap.draw(mapState());
input.end();
}
function render(){post.render()}
function handleKeys(){
if(input.hit('pause')||input.hit('esc')){
if(mode==='play'){mode='pause';menus.showPause({...stats,rank:respect.rank,rp:respect.rp})}
else if(mode==='pause'){mode='play';menus.hidePause()}
return;
}
if(mode!=='play')return;
if(input.hit('mission')){
if(menus.mode==='mission')menus.hideMissions();
else menus.showMissions(Object.values(MISSIONS));
return;
}
if(input.hit('race')){activities.startRace();hud.notice('Balapan dimulai! Lewati 14 gerbang.');return}
if(input.hit('aim')){player.setArmed(!player.state.armed);hud.notice(player.state.armed?'Senjata siap.':'Senjata disimpan.');return}
if(input.mouse.down&&player.state.armed&&!player.state.inVehicle){combat.shoot();effects.muzzle(player.state.x+Math.sin(player.state.heading)*1.2,player.state.z+Math.cos(player.state.heading)*1.2);return}
if(input.hit('enter')){
if(player.state.inVehicle){player.exitVehicle();return}
const npc=pedestrians.nearest(player.state.x,player.state.z,3);
if(npc){
const lines=missions.linesFor(npc.name);
hud.showDialogue(npc.name,lines[Math.floor(Math.random()*lines.length)]);
missions.onTalk(npc);
setTimeout(()=>hud.hideDialogue(),4200);
return;
}
const v=fleet.nearest(player.state.x,player.state.z,4.5);
if(v){player.enterVehicle(v);missions.onSteal(v);hud.notice('Kamu naik '+v.type.toUpperCase()+'.');return}
}
}
let last=performance.now();
function loop(now){
const dt=Math.min(0.05,(now-last)/1000);last=now;
handleKeys();
if(mode==='play'||mode==='title')frame(dt);
else{sky.update(dt);city.update(dt)}
render();
requestAnimationFrame(loop);
}
function stage(name){
if(name==='chase'){
menus.hideTitle();mode='play';introShown=true;
let comet=fleet.vehicles.find(v=>v.type==='comet');
if(!comet)comet=fleet.spawn('comet',-300,90,Math.PI/2);
comet.parked=false;
player.placeAt(-300,90,Math.PI/2);
if(!player.state.inVehicle)player.enterVehicle(comet);
missions.start('balap-senja');
const u=dispatch.spawnUnit({x:-300,z:90},2);
const cop=u.vehicle;
cop.phys.place(-306,92.5,Math.PI/2);
wanted.set(2);
for(let i=0;i<30;i++){comet.phys.setSpeed(20);step(1/60)}
const cp=cop.phys.s;
chase.snap({x:cp.x-Math.sin(cp.heading)*10,z:cp.z-Math.cos(cp.heading)*10,y:5},cp.heading);
}
else if(name==='talk'){
menus.hideTitle();mode='play';introShown=true;
player.placeAt(-180,97,0);
if(player.state.inVehicle)player.exitVehicle();
player.setArmed(false);
const spots=[['Ratna',-176,100.5,Math.PI],['Hendra',-184,100.5,Math.PI],['Agus',-180,101,Math.PI]];
for(const[nm,x,z,h]of spots){
let n=pedestrians.npcs.find(p=>p.name===nm);
if(!n)n=pedestrians.spawn(x,z,'civilian',nm);
n.x=x;n.z=z;n.heading=h;n.wait=99;n.mesh.position.set(x,0,z);n.mesh.rotation.y=h;
}
hud.showDialogue('Ratna','Akhirnya kamu datang juga. Paket ini harus sampai sebelum gelap.');
chase.snap({x:-180,z:90,y:3.6},0);
}
else if(name==='stats'){
mode='pause';
player.state.money=285000;player.stats.kills=7;player.stats.carsStolen=3;player.stats.earned=185000;
respect.add(120);
menus.showPause({missions:3,kills:7,carsStolen:3,coins:9,earned:185000,rank:respect.rank,rp:respect.rp});
pauseMap.draw(mapState());
chase.snap({x:-300,z:104,y:6},Math.PI/2);
}
else if(name==='title'){
mode='title';menus.showTitle();
chase.snap({x:-40,z:170,y:30},Math.PI);
}
window.__shotReady=true;
render();
}
window.__game={bus,input,rng,plan,collision,sky,city,fleet,player,pedestrians,loadout,combat,dispatch,wanted,missions,activities,respect,saveGame,effects,camera:chase,radio,hud,menus,minimap,post,scene,renderer,mode:'title',introShown:false,stage,render,fixedStep:(dt)=>step(dt),snapshot:()=>({mode,money:player.state.money,rp:respect.rp,rank:respect.rank,wanted:wanted.level,vehicles:fleet.vehicles.length,npcs:pedestrians.npcs.length,objective:objectiveText}),get mode(){return mode},set mode(m){mode=m},get introShown(){return introShown},set introShown(v){introShown=v}};
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);post.setSize(innerWidth,innerHeight)});
fleet.spawnTraffic(14);
for(let i=0;i<8;i++){const j=plan.junctions[Math.floor(rng.next()*plan.junctions.length)];fleet.spawn(rng.pick(['sedan','van','taxi']),j.x+rng.range(-4,4),j.z+rng.range(-4,4),rng.range(0,Math.PI*2))}
pedestrians.spawnCrowd(26);
player.placeAt(-300,90,Math.PI/2);
const saved=saveGame.load();
if(saved){player.state.money=saved.money||150000;respect.add(saved.rp||0)}
const shot=params.get('shot');
if(shot){stage(shot)}
else{menus.showTitle();mode='title'}
requestAnimationFrame(loop);
