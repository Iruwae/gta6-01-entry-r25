import * as THREE from 'three';
const VERT=`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}`;
const BRIGHT=`uniform sampler2D tD;uniform float th;varying vec2 vUv;void main(){vec3 c=texture2D(tD,vUv).rgb;vec3 b=max(c-vec3(th),vec3(0.0));gl_FragColor=vec4(b/(1.0-th),1.0);}`;
const BLUR=`uniform sampler2D tD;uniform vec2 dir;varying vec2 vUv;void main(){vec3 s=texture2D(tD,vUv).rgb*0.227027;vec2 o=dir;s+=texture2D(tD,vUv+o*1.0).rgb*0.1945946;s+=texture2D(tD,vUv-o*1.0).rgb*0.1945946;s+=texture2D(tD,vUv+o*2.0).rgb*0.1216216;s+=texture2D(tD,vUv-o*2.0).rgb*0.1216216;s+=texture2D(tD,vUv+o*3.0).rgb*0.054054;s+=texture2D(tD,vUv-o*3.0).rgb*0.054054;s+=texture2D(tD,vUv+o*4.0).rgb*0.016216;s+=texture2D(tD,vUv-o*4.0).rgb*0.016216;gl_FragColor=vec4(s,1.0);}`;
const COMP=`uniform sampler2D tS;uniform sampler2D tB;uniform float str;varying vec2 vUv;
vec3 aces(vec3 x){return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.0,1.0);}
void main(){vec3 c=texture2D(tS,vUv).rgb+texture2D(tB,vUv).rgb*str;c=aces(c);c*=vec3(1.05,1.0,0.96);c=pow(c,vec3(1.0/2.2));gl_FragColor=vec4(c,1.0);}`;
function rt(w,h,samples){const t=new THREE.WebGLRenderTarget(w,h,{type:THREE.HalfFloatType,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,depthBuffer:true});if(samples)t.samples=samples;return t}
export function createPost(renderer,scene,camera,w,h){
let W=w,H=h;
let rtS=rt(W,H,4),rtB=rt(W,H,0),rtX=rt(W,H,0);
const quadCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const quadScene=new THREE.Scene();
const quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.ShaderMaterial({vertexShader:VERT,fragmentShader:BRIGHT,uniforms:{tD:{value:null},th:{value:0.82}}}));
quad.frustumCulled=false;quadScene.add(quad);
function pass(mat,target){quad.material=mat;renderer.setRenderTarget(target);renderer.render(quadScene,quadCam)}
const brightMat=new THREE.ShaderMaterial({vertexShader:VERT,fragmentShader:BRIGHT,uniforms:{tD:{value:null},th:{value:0.82}}});
const blurMat=new THREE.ShaderMaterial({vertexShader:VERT,fragmentShader:BLUR,uniforms:{tD:{value:null},dir:{value:new THREE.Vector2(1/W,0)}}});
const compMat=new THREE.ShaderMaterial({vertexShader:VERT,fragmentShader:COMP,uniforms:{tS:{value:null},tB:{value:null},str:{value:0.38}}});
let ok=true;
function render(){
if(!ok){renderer.render(scene,camera);return}
try{
renderer.setRenderTarget(rtS);renderer.render(scene,camera);
brightMat.uniforms.tD.value=rtS.texture;pass(brightMat,rtB);
blurMat.uniforms.tD.value=rtB.texture;blurMat.uniforms.dir.value.set(1/W,0);pass(blurMat,rtX);
blurMat.uniforms.tD.value=rtX.texture;blurMat.uniforms.dir.value.set(0,1/H);pass(blurMat,rtB);
compMat.uniforms.tS.value=rtS.texture;compMat.uniforms.tB.value=rtB.texture;
quad.material=compMat;renderer.setRenderTarget(null);renderer.render(quadScene,quadCam);
}catch(e){ok=false;try{renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.outputColorSpace=THREE.SRGBColorSpace}catch(_){}renderer.setRenderTarget(null);renderer.render(scene,camera)}
}
function setSize(nw,nh){W=nw;H=nh;for(const t of[rtS,rtB,rtX])t.setSize(nw,nh)}
return{render,setSize};
}
