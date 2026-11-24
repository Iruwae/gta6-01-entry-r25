export const MISSIONS={
'first-errand':{id:'first-errand',title:'KETEMU SARI',desc:'Sari menunggumu di depan toko. Temui dia, lalu antar paketnya ke pelabuhan.',reward:50000,rp:20,steps:[
{type:'goto',x:-180,z:100,label:'Temui Sari di depan toko'},
{type:'talk',npc:'Sari',label:'Bicara dengan Sari'},
{type:'deliver',x:380,z:90,label:'Antar paket ke Pelabuhan'}]},
'gold-paint':{id:'gold-paint',title:'GARUDA EMAS',desc:'Curi GARUDA GT di Menara Kaca dan bawa ke bengkel untuk dicat emas.',reward:120000,rp:35,steps:[
{type:'steal',car:'comet',label:'Curi GARUDA GT'},
{type:'deliver',x:-272,z:186,label:'Bawa ke Bengkel Sari'}]},
'komet-hilang':{id:'komet-hilang',title:'KOMET HILANG',desc:'Sebuah komet hilang di Kampung Mangga. Temukan dan bawa pulang.',reward:80000,rp:25,steps:[
{type:'goto',x:172,z:260,label:'Cari di Kampung Mangga'},
{type:'steal',car:'comet',label:'Ambil komet itu'},
{type:'deliver',x:-300,z:90,label:'Bawa ke Pantai Merpati'}]},
'paket-pelabuhan':{id:'paket-pelabuhan',title:'PAKET PELABUHAN',desc:'Ambil paket di pelabuhan dan antar ke Kota Lama sebelum senja habis.',reward:60000,rp:20,steps:[
{type:'goto',x:394,z:90,label:'Ambil paket di Pelabuhan'},
{type:'deliver',x:-198,z:186,label:'Antar ke Kota Lama'}]},
'utang-kopi':{id:'utang-kopi',title:'UTANG KOPI',desc:'Hendra berutang kopi ke warung. Tagih dia, baik-baik dulu.',reward:40000,rp:15,steps:[
{type:'talk',npc:'Hendra',label:'Tagih Hendra'},
{type:'deliver',x:-124,z:186,label:'Bawa uangnya ke Warung Mangga'}]},
'balap-senja':{id:'balap-senja',title:'BALAP SENJA',desc:'Balapan dari Pantai Merpati ke Pelabuhan. Lewati semua gerbang, jangan sampai polisi menangkapmu.',reward:150000,rp:40,steps:[
{type:'race',label:'Lewati 14 gerbang sampai Pelabuhan'}]},
'titipan-maya':{id:'titipan-maya',title:'TITIPAN MAYA',desc:'Maya menitipkan bungkusan untuk Wulan di Bukit Hijau.',reward:70000,rp:22,steps:[
{type:'talk',npc:'Maya',label:'Ambil titipan dari Maya'},
{type:'deliver',x:24,z:334,label:'Antar ke Bukit Hijau'}]},
'jemputan-terakhir':{id:'jemputan-terakhir',title:'JEMPUTAN TERAKHIR',desc:'Jemput Joko di Pasar Senja sebelum kapal terakhir berangkat.',reward:90000,rp:28,steps:[
{type:'talk',npc:'Joko',label:'Jemput Joko'},
{type:'deliver',x:380,z:90,label:'Antar Joko ke Pelabuhan'}]},
};
export const DIALOGUES={
Sari:['Akhirnya kamu datang juga. Paket ini harus sampai sebelum gelap.','Jangan ngebut di jalan pantai, banyak anak main di sana.','Kalau polisi nanya, bilang saja kamu cuma kurir biasa.'],
Hendra:['Utang kopi? Ah, itu sudah lunas minggu lalu... ya sudahlah, ini uangnya.','Kamu ini penagih paling sopan di Teluk Senja.','Besok aku traktir kopi, janji.'],
Agus:['Jalan pantai ini milik kita semua, tapi hati-hati sama patroli.','Kemarin ada yang balapan sampai ke pelabuhan. Gila.','Kalau butuh mobil cepat, cari di Menara Kaca.'],
Ratna:['Senja di teluk ini tidak pernah mengecewakan, ya?','Aku sudah tinggal di sini sejak kecil. Semua orang saling kenal.','Hati-hati, ombak besar sore ini.'],
Maya:['Titipan ini penting. Jangan dibuka, ya.','Wulan menunggumu di bukit. Dia baik, tapi jangan terlambat.'],
Joko:['Kapal terakhir jam sembilan. Kalau ketinggalan, aku tidur di pelabuhan.','Kamu nyetirnya halus sekali. Lain kali ajak aku balapan.'],
};
export const INTRO_LINES=[
'Selamat datang di Teluk Senja. Kota ini milikmu, Rak.',
'Sari menunggumu di depan toko. Misi pertama sudah menunggu.',
'Ingat: polisi di sini cepat. Jangan buat keributan kalau tidak perlu.',
];
export const RADIO_LINES=[
'Senja di Teluk — Orkes Melati',
'Selamat sore, Teluk Senja. Ini SENJA 97.5.',
'Cuaca cerah, ombak tenang. Cocok untuk balapan pantai.',
];
