export const RANKS=['ANAK BARU','ANAK JALANAN','PENJAGA PANTAI','JURAGAN SENJA','TETUA TELUK'];
const TH=[0,60,150,300,480];
export function createRespect(bus){
let rp=0;
function rank(){let r=0;for(let i=0;i<TH.length;i++)if(rp>=TH[i])r=i;return r}
function add(n){
const before=rank();rp=Math.min(500,rp+n);
if(rank()>before)bus.emit('rank-up',{rank:RANKS[rank()],index:rank()});
}
return{add,get rp(){return rp},get rank(){return RANKS[rank()]},get rankIndex(){return rank()},get next(){return rank()<4?TH[rank()+1]:500},progress:()=>rank()<4?(rp-TH[rank()])/(TH[rank()+1]-TH[rank()]):1};
}
