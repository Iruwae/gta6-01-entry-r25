export function createSaveGame(key){
function save(state){
try{localStorage.setItem(key,JSON.stringify(state));return true}catch(e){return false}
}
function load(){
try{const s=localStorage.getItem(key);return s?JSON.parse(s):null}catch(e){return null}
}
function clear(){try{localStorage.removeItem(key)}catch(e){}}
function exists(){try{return localStorage.getItem(key)!==null}catch(e){return false}}
return{save,load,clear,exists};
}
