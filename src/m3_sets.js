/* ===== MÓDULO 3 — ambientes internos visitáveis (reconstruções), montados sob demanda ===== */
const tx=(t,rx,ry)=>{const c=t.clone();c.repeat.set(rx,ry);c.needsUpdate=true;return c;};
function panelTex(base,dark,hi){return ctex(128,128,(c,w,h)=>{c.fillStyle=base;c.fillRect(0,0,w,h);for(let i=0;i<60;i++){c.fillStyle='rgba(0,0,0,'+(Math.random()*.06)+')';c.fillRect(Math.random()*w,0,1+Math.random()*2,h);}c.strokeStyle=dark;c.lineWidth=3;c.strokeRect(10,8,w-20,h-34);c.strokeStyle=hi;c.lineWidth=1;c.strokeRect(15,13,w-30,h-44);c.strokeStyle=dark;c.strokeRect(10,h-20,w-20,12);c.fillStyle=dark;c.fillRect(0,0,2,h);});}
const oakT=panelTex('#8a5a2e','#4a2c12','#b98a55'),mahT=panelTex('#6e2f1c','#32130a','#9a5a3a'),whiteT=panelTex('#ece7da','#b9b29f','#ffffff'),pineT=panelTex('#e8e6df','#c9c6bc','#f6f5f0');
const tileT=ctex(64,64,(c,w,h)=>{c.fillStyle='#e6dcc3';c.fillRect(0,0,w,h);c.fillStyle='#1d1b18';c.beginPath();c.moveTo(32,22);c.lineTo(42,32);c.lineTo(32,42);c.lineTo(22,32);c.fill();c.strokeStyle='rgba(0,0,0,.25)';c.strokeRect(0,0,w,h);});
const carpetT=ctex(64,64,(c,w,h)=>{c.fillStyle='#7a1f28';c.fillRect(0,0,w,h);c.strokeStyle='#b88a3a';c.lineWidth=2;c.beginPath();c.arc(32,32,14,0,7);c.stroke();c.fillStyle='#b88a3a';c.fillRect(0,0,4,4);c.fillRect(60,60,4,4);});
const linoT=ctex(64,64,(c,w,h)=>{c.fillStyle='#b9a27a';c.fillRect(0,0,w,h);c.fillStyle='#8c7550';c.fillRect(0,0,32,32);c.fillRect(32,32,32,32);});
const blueT=ctex(64,64,(c,w,h)=>{c.fillStyle='#2c4f7a';c.fillRect(0,0,w,h);c.fillStyle='#c9a85a';c.fillRect(28,28,8,8);c.strokeStyle='#a33';c.strokeRect(8,8,48,48);});
const redFlT=ctex(32,32,(c,w,h)=>{c.fillStyle='#7c4638';c.fillRect(0,0,w,h);c.fillStyle='rgba(0,0,0,.12)';c.fillRect(0,0,w,1);});
const leadT=ctex(64,96,(c,w,h)=>{c.fillStyle='#f2e6b8';c.fillRect(0,0,w,h);c.strokeStyle='#3a3a3a';for(let i=-96;i<160;i+=12){c.beginPath();c.moveTo(i,0);c.lineTo(i+96,96);c.stroke();c.beginPath();c.moveTo(i+96,0);c.lineTo(i,96);c.stroke();}c.lineWidth=4;c.strokeRect(0,0,w,h);});
const grilleT=ctex(64,96,(c,w,h)=>{c.fillStyle='#2a1c10';c.fillRect(0,0,w,h);c.strokeStyle='#caa25a';for(let x=4;x<w;x+=8){c.beginPath();c.moveTo(x,6);c.lineTo(x,h-6);c.stroke();}c.lineWidth=3;c.strokeRect(2,2,w-4,h-4);});
const clockT=ctex(256,128,(c,w,h)=>{c.fillStyle='#7a4c24';c.fillRect(0,0,w,h);c.strokeStyle='#3d2410';c.lineWidth=5;c.strokeRect(4,4,w-8,h-8);c.fillStyle='#5a3618';[[60,70],[196,70]].forEach(p=>{c.beginPath();c.ellipse(p[0],p[1],22,42,0,0,7);c.fill();c.beginPath();c.arc(p[0],22,11,0,7);c.fill();});c.fillStyle='#caa25a';c.beginPath();c.arc(128,58,30,0,7);c.fill();c.fillStyle='#f6f1e0';c.beginPath();c.arc(128,58,25,0,7);c.fill();c.strokeStyle='#111';c.lineWidth=2;c.beginPath();c.moveTo(128,58);c.lineTo(128,39);c.moveTo(128,58);c.lineTo(141,63);c.stroke();});
const chartT=ctex(256,160,(c,w,h)=>{c.fillStyle='#efe6cc';c.fillRect(0,0,w,h);c.strokeStyle='rgba(60,80,120,.35)';for(let x=0;x<w;x+=32){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}for(let y=0;y<h;y+=32){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}c.fillStyle='#c9bb8c';c.fillRect(0,0,34,70);c.fillRect(214,20,42,60);c.strokeStyle='#8a1a12';c.lineWidth=2;c.beginPath();c.moveTo(214,62);c.quadraticCurveTo(120,120,34,84);c.stroke();});
const domeT=ctex(256,64,(c,w,h)=>{c.fillStyle='#f6efd6';c.fillRect(0,0,w,h);c.strokeStyle='#4a3a22';c.lineWidth=2;for(let x=0;x<w;x+=16){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}[14,34,52].forEach(y=>{c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();});});
const mT=(t,rx,ry,o)=>new T.MeshStandardMaterial(Object.assign({map:tx(t,rx,ry),roughness:.7},o||{}));
function wall(w,h,m,x,y,z,ry,g){const p=new T.Mesh(new T.PlaneGeometry(w,h),m);p.position.set(x,y,z);p.rotation.y=ry;g.add(p);return p;}
function room(w,h,d,wt,ft,g,ox,oz,ceil){ox=ox||0;oz=oz||0;const f=new T.Mesh(new T.PlaneGeometry(w,d),mT(ft,w/1,d/1));f.rotation.x=-PI/2;f.position.set(ox,0,oz);g.add(f);
 wall(d,h,mT(wt,d/1.2,h/1.6),ox+w/2,h/2,oz,-PI/2,g);wall(d,h,mT(wt,d/1.2,h/1.6),ox-w/2,h/2,oz,PI/2,g);wall(w,h,mT(wt,w/1.2,h/1.6),ox,h/2,oz+d/2,PI,g);wall(w,h,mT(wt,w/1.2,h/1.6),ox,h/2,oz-d/2,0,g);
 if(ceil){const c=new T.Mesh(new T.PlaneGeometry(w,d),M(0xf2eee2));c.rotation.x=PI/2;c.position.set(ox,h,oz);g.add(c);}}
const glow=(c,i)=>new T.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:i||1});
/* luminária pendente presa ao forro (haste de latão e cúpula de vidro fosco), no lugar da esfera de luz flutuante;
   a luz continua no mesmo ponto. As cúpulas somem quando a câmera olha de cima de uma sala sem forro */
const LAMPS=[];let _lampG=null,_lampS=null;
function lamp(x,y,z,g,i,d){if(!_lampG){_lampG=new T.LatheGeometry([[.025,.06],[.07,.04],[.13,-.03],[.15,-.08],[.12,-.1],[0,-.105]].map(q=>new T.Vector2(q[0],q[1])),20);_lampS=new T.MeshStandardMaterial({color:0xfff5e2,emissive:0xffe2b0,emissiveIntensity:.8,roughness:.45});}
 const f=G();f.position.set(x,y,z);g.add(f);cyl(.007,.007,.52,mBrass,0,.32,0,f,null,6);cyl(.055,.055,.014,mBrass,0,.58,0,f,null,14);cyl(.03,.035,.035,mBrass,0,.07,0,f,null,12);f.add(new T.Mesh(_lampG,_lampS));
 const l=new T.PointLight(0xffdca0,i||.7,d||14,1.5);l.position.set(x,y-.12,z);g.add(l);LAMPS.push(f);}
function balustrade(segs,g,mRail){segs.forEach(s=>{const a=V(s[0],s[1],s[2]),b=V(s[3],s[4],s[5]);
  const r=rod(a.clone().setY(a.y+.95),b.clone().setY(b.y+.95),.07,.07,mRail,g,8);part(r,'balaustrada');[a,b].forEach(p=>lathe([[.11,0],[.09,.1],[.07,1],[.12,1.06],[.1,1.16],[0,1.2]],mRail,p.x,p.y,p.z,g,10));});
 /* painéis de ferro forjado (volutas em C, estilo Luís XIV, com rosetas douradas) entre o corrimão de carvalho e o piso, como na Grande Escadaria;
    desenho aproximado a partir de fotografias do Olympic */
 const pos=[],uv=[],ix=[];segs.forEach(q=>{const a=V(q[0],q[1],q[2]),b=V(q[3],q[4],q[5]),u=a.distanceTo(b)/.55,k=pos.length/3;
  pos.push(a.x,a.y+.06,a.z, b.x,b.y+.06,b.z, b.x,b.y+.9,b.z, a.x,a.y+.9,a.z);uv.push(0,0,u,0,u,1,0,1);ix.push(k,k+1,k+2,k,k+2,k+3);});
 const gg=new T.BufferGeometry();gg.setAttribute('position',new T.Float32BufferAttribute(pos,3));gg.setAttribute('uv',new T.Float32BufferAttribute(uv,2));gg.setIndex(ix);gg.computeVertexNormals();
 const gm=new T.Mesh(gg,grilleMat());part(gm,'balaustrada');g.add(gm);}
let _grM=null;function grilleMat(){if(_grM)return _grM;const t=ctex(256,384,(c,w,h)=>{c.clearRect(0,0,w,h);const iron='#1f1b17',gold='#c9a24a';c.lineCap='round';
 c.strokeStyle=iron;c.lineWidth=14;c.strokeRect(7,7,w-14,h-14);c.lineWidth=9;
 const S=(x,y,r,a0,a1,cw)=>{c.beginPath();c.arc(x,y,r,a0,a1,cw);c.stroke();};
 /* volutas em C espelhadas, em cima e embaixo, e eixo central */
 [[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([sx,sy])=>{c.save();c.translate(w/2,h/2);c.scale(sx,sy);c.strokeStyle=iron;c.lineWidth=9;
  c.beginPath();c.moveTo(0,-20);c.bezierCurveTo(10,-80,90,-60,95,-120);c.stroke();S(70,-132,26,0,PI*1.6,false);S(70,-132,10,0,PI*2,false);
  c.beginPath();c.moveTo(18,0);c.bezierCurveTo(60,10,105,-10,104,-50);c.stroke();S(86,-52,18,PI*.1,PI*1.5,true);c.restore();});
 c.beginPath();c.moveTo(w/2,14);c.lineTo(w/2,h-14);c.stroke();
 /* medalhão oval e rosetas douradas */
 c.lineWidth=8;c.beginPath();c.ellipse(w/2,h/2,34,46,0,0,PI*2);c.stroke();c.fillStyle=gold;c.beginPath();c.ellipse(w/2,h/2,18,26,0,0,PI*2);c.fill();
 [[w/2,40],[w/2,h-40],[40,h/2],[w-40,h/2]].forEach(p=>{c.beginPath();c.arc(p[0],p[1],9,0,PI*2);c.fill();});});
 t.wrapS=T.RepeatWrapping;t.anisotropy=4;_grM=new T.MeshStandardMaterial({map:t,alphaTest:.45,transparent:false,side:DS,metalness:.55,roughness:.45});return _grM;}
function chairs(list,g,col){const s=new T.InstancedMesh(new T.BoxGeometry(.45,.08,.45),M(col),list.length),b=new T.InstancedMesh(new T.BoxGeometry(.45,.5,.06),M(col),list.length),l=new T.InstancedMesh(new T.BoxGeometry(.4,.45,.4),M(0x3a2414),list.length),m4=new T.Matrix4();
 list.forEach((p,i)=>{m4.makeTranslation(p[0],.47,p[1]);s.setMatrixAt(i,m4);m4.makeTranslation(p[0],.76,p[1]+(p[2]||0)*.22);b.setMatrixAt(i,m4);m4.makeTranslation(p[0],.22,p[1]);l.setMatrixAt(i,m4);});g.add(s,b,l);}
function teleg(x,z,g,key){const t=part(G(),'telegrafoP');lathe([[.26,0],[.12,.12],[.09,.95],[.17,1.05],[0,1.05]],mBrass,x,0,z,t,12);const dm=M(0xffffff,{map:dialTex()});cyl(.3,.3,.2,dm,x,1.3,z,t,'z',24);const h=G();h.position.set(x,1.3,z);box(.04,.5,.04,mBrass,0,.25,.13,h);sph(.05,M(0x3a2414),0,.52,.13,h);box(.04,.5,.04,mBrass,0,.25,-.13,h);t.add(h);g.add(t);(g.userData.handles=g.userData.handles||[]).push(h);}

/* ===== Querubim da Grande Escadaria: malha do modelo enviado pelo autor (anjo alado com lâmpada), carregada sob demanda ===== */
const QB={state:0,q:[],gltf:null};
function stB64(s){const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;}
function querubimLoad(cb){if(QB.state===2){cb(QB.gltf);return;}if(QB.state===3){cb(null);return;}QB.q.push(cb);if(QB.state===1)return;QB.state=1;
 const done=o=>{QB.state=o?2:3;QB.gltf=o;const q=QB.q;QB.q=[];q.forEach(f=>f(o));};
 if(!T.GLTFLoader||typeof MeshoptDecoder==='undefined'){done(null);return;}
 const sc=document.createElement('script');sc.src='assets/models/querubim_glb.js';sc.async=true;sc.onerror=()=>done(null);
 sc.onload=()=>{try{const u=stB64(window.QUERUBIM_B64);window.QUERUBIM_B64=null;const L=new T.GLTFLoader();L.setMeshoptDecoder(MeshoptDecoder);L.parse(u.buffer,'',gl=>done(gl.scene),()=>done(null));}catch(e){done(null);}};
 document.head.appendChild(sc);}
/* piso caminhável: degraus reais (altura em patamares, sem rampas). Escada central: 9 degraus de .5 m e .178 m; lances laterais: 9 degraus do patamar até o nível superior */
const stCen=p=>{const k=Math.floor((1-p.x)/.5);return k<0?NaN:Math.min(9,k+1)*.178;};
const stSide=p=>{const k=Math.floor((p.x+3.5)/.5);return k<0?NaN:1.6+Math.min(9,k+1)*.178;};

function woodGrainT(base,rx,ry){return ctex(256,256,(c,w,h)=>{c.fillStyle=base;c.fillRect(0,0,w,h);for(let i=0;i<320;i++){const x=Math.random()*w,l=.5+Math.random()*2,a=Math.random()*.2;c.fillStyle=(Math.random()<.5?'rgba(40,20,6,':'rgba(235,190,120,')+a+')';c.fillRect(x,0,l,h);}
  for(let k=0;k<7;k++){const x=Math.random()*w,y=Math.random()*h;c.strokeStyle='rgba(50,25,8,.22)';c.lineWidth=1;for(let r=2;r<14;r+=3){c.beginPath();c.ellipse(x,y,r*.7,r*2.8,0,0,7);c.stroke();}}},rx,ry);}
/* textura "triplanar": projeta a madeira pelas coordenadas do mundo, sem depender de UV (vale para qualquer caixa/degrau) */
function triMat(map,sc,o){const m=new T.MeshStandardMaterial(Object.assign({map:map},o||{}));
 m.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('void main() {','varying vec3 vOP;varying vec3 vON;void main() {vOP=(modelMatrix*vec4(position,1.)).xyz;vON=normalize(mat3(modelMatrix)*normal);');sh.fragmentShader=sh.fragmentShader.replace('void main() {','varying vec3 vOP;varying vec3 vON;void main() {')
  .replace('#include <map_fragment>','vec3 an=pow(abs(normalize(vON)),vec3(6.));an/=(an.x+an.y+an.z+1e-4);vec4 tc=texture2D(map,vOP.zy*'+sc.toFixed(3)+')*an.x+texture2D(map,vec2(vOP.x,vOP.z)*'+sc.toFixed(3)+')*an.y+texture2D(map,vOP.xy*'+sc.toFixed(3)+')*an.z;diffuseColor*=tc;');};
 m.customProgramCacheKey=()=>'tri'+sc;return m;}
/* painel do relógio: baixo-relevo em madeira (duas figuras aladas ladeando o relógio, arco, grinaldas), desenhado por código */
function clockPanelT(){return ctex(512,832,(c,w,h)=>{
 const g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,'#8a5427');g.addColorStop(.5,'#b57a3c');g.addColorStop(1,'#8a5427');c.fillStyle=g;c.fillRect(0,0,w,h);
 for(let i=0;i<500;i++){c.fillStyle=(Math.random()<.5?'rgba(45,22,6,':'rgba(240,195,125,')+(Math.random()*.14)+')';c.fillRect(Math.random()*w,0,.6+Math.random()*1.6,h);}
 const sh=(a,b)=>{c.save();a();c.restore();};
 /* arco e moldura */
 c.strokeStyle='#4a2810';c.lineWidth=10;c.beginPath();c.moveTo(34,810);c.lineTo(34,260);c.arc(256,260,222,PI,0);c.lineTo(478,810);c.stroke();
 c.strokeStyle='#d6a45e';c.lineWidth=3;c.beginPath();c.moveTo(46,800);c.lineTo(46,262);c.arc(256,262,210,PI,0);c.lineTo(466,800);c.stroke();
 /* frontão com volutas */
 c.fillStyle='#6e4020';c.beginPath();c.ellipse(256,140,150,70,0,PI,0);c.fill();
 for(let i=0;i<11;i++){const a=PI+(i+.5)*PI/11;c.strokeStyle='rgba(240,200,130,.55)';c.lineWidth=3;c.beginPath();c.moveTo(256+40*Math.cos(a),140+20*Math.sin(a));c.quadraticCurveTo(256+110*Math.cos(a+.2),140+50*Math.sin(a+.2),256+145*Math.cos(a),140+68*Math.sin(a));c.stroke();}
 c.fillStyle='rgba(30,14,4,.45)';c.beginPath();c.arc(256,128,22,0,7);c.fill();c.strokeStyle='#e0b472';c.lineWidth=2;c.beginPath();c.arc(256,128,22,0,7);c.stroke();
 /* cornija com dentículos */
 c.fillStyle='#5a3418';c.fillRect(60,214,392,26);for(let x=66;x<446;x+=14){c.fillStyle='#d6a45e';c.fillRect(x,218,8,10);}
 /* moldura interna */
 c.fillStyle='#4a2810';c.fillRect(110,250,292,430);c.fillStyle='#a56c34';c.fillRect(120,260,272,410);
 /* figuras aladas */
 const fig=(cx,dir)=>{c.save();c.translate(cx,0);c.scale(dir,1);
  c.fillStyle='rgba(245,205,140,.55)';c.beginPath();c.moveTo(26,420);c.bezierCurveTo(70,320,96,290,70,262);c.bezierCurveTo(112,300,102,380,64,440);c.fill();/* asa */
  c.fillStyle='#8a5428';c.beginPath();c.ellipse(0,330,19,25,0,0,7);c.fill();/* cabeça */
  c.fillStyle='#7a4a22';c.beginPath();c.moveTo(-26,352);c.bezierCurveTo(-34,440,-40,540,-30,636);c.lineTo(46,636);c.bezierCurveTo(52,540,44,430,26,352);c.closePath();c.fill();/* túnica */
  c.strokeStyle='rgba(30,14,4,.55)';c.lineWidth=2;for(let k=-20;k<=36;k+=11){c.beginPath();c.moveTo(k,372);c.bezierCurveTo(k-6,470,k-10,560,k-4,632);c.stroke();}
  c.strokeStyle='rgba(250,215,150,.6)';c.lineWidth=2;for(let k=-14;k<=40;k+=11){c.beginPath();c.moveTo(k,372);c.bezierCurveTo(k-4,470,k-8,560,k-2,632);c.stroke();}
  c.strokeStyle='#7a4a22';c.lineWidth=14;c.lineCap='round';c.beginPath();c.moveTo(-8,400);c.quadraticCurveTo(-40,360,-52,300);c.stroke();/* braço erguido */
  c.restore();};
 fig(168,1);fig(344,-1);
 /* palma no alto e coroa embaixo */
 c.strokeStyle='#e0b472';c.lineWidth=3;c.beginPath();c.moveTo(150,290);c.quadraticCurveTo(256,250,360,290);c.stroke();for(let i=0;i<9;i++){const x=170+i*20;c.beginPath();c.moveTo(x,282-Math.sin(i/8*PI)*18);c.lineTo(x-6,300-Math.sin(i/8*PI)*18);c.stroke();}
 c.strokeStyle='#6a3e1a';c.lineWidth=12;c.beginPath();c.arc(342,620,36,0,7);c.stroke();c.strokeStyle='#e0b472';c.lineWidth=2;c.beginPath();c.arc(342,620,36,0,7);c.stroke();
 /* pedestal do relógio */
 c.fillStyle='#6e4020';c.fillRect(236,470,40,150);c.fillStyle='#d6a45e';c.fillRect(226,612,60,12);
 /* grinaldas laterais */
 [70,442].forEach(x=>{for(let y=270;y<800;y+=26){c.fillStyle=(y/26|0)%2?'#9a6330':'#6a3e1a';c.beginPath();c.ellipse(x,y,9,15,0,0,7);c.fill();}});
 /* embasamento almofadado */
 c.fillStyle='#4a2810';c.fillRect(30,690,452,120);c.fillStyle='#9a6330';c.fillRect(54,708,404,84);c.strokeStyle='#d6a45e';c.lineWidth=2;c.strokeRect(54,708,404,84);
 /* iluminação do relevo */
 const l=c.createLinearGradient(0,0,w,h);l.addColorStop(0,'rgba(255,230,170,.16)');l.addColorStop(1,'rgba(0,0,0,.28)');c.fillStyle=l;c.fillRect(0,0,w,h);});}
/* mostrador do relógio: usa a hora do navegador do visitante, atualizado a cada segundo */
const CLK={cv:null,tex:null,ctx:null};
function clockFace(){if(CLK.tex)return CLK.tex;const cv=document.createElement('canvas');cv.width=cv.height=256;CLK.cv=cv;CLK.ctx=cv.getContext('2d');CLK.tex=new T.CanvasTexture(cv);CLK.tex.encoding=T.sRGBEncoding;clockDraw();setInterval(clockDraw,1000);return CLK.tex;}
function clockDraw(){const c=CLK.ctx,w=256,d=new Date(),sec=d.getSeconds()+d.getMilliseconds()/1000,mi=d.getMinutes()+sec/60,hr=(d.getHours()%12)+mi/60;
 c.clearRect(0,0,w,w);let g=c.createRadialGradient(128,128,90,128,128,126);g.addColorStop(0,'#d9b25c');g.addColorStop(1,'#8f6a22');c.fillStyle=g;c.beginPath();c.arc(128,128,126,0,7);c.fill();
 c.fillStyle='#f4efdd';c.beginPath();c.arc(128,128,106,0,7);c.fill();c.strokeStyle='#5a4018';c.lineWidth=3;c.beginPath();c.arc(128,128,106,0,7);c.stroke();
 const R=['XII','I','II','III','IIII','V','VI','VII','VIII','IX','X','XI'];c.fillStyle='#1c1810';c.font='bold 21px serif';c.textAlign='center';c.textBaseline='middle';
 for(let i=0;i<12;i++){const a=i*PI/6-PI/2;c.save();c.translate(128+80*Math.cos(a),128+80*Math.sin(a));c.rotate(a+PI/2);c.fillText(R[i],0,0);c.restore();}
 for(let i=0;i<60;i++){const a=i*PI/30,l=i%5?4:9;c.strokeStyle='#2a2216';c.lineWidth=i%5?1:2;c.beginPath();c.moveTo(128+100*Math.cos(a),128+100*Math.sin(a));c.lineTo(128+(100-l)*Math.cos(a),128+(100-l)*Math.sin(a));c.stroke();}
 const hand=(ang,len,wd,col)=>{c.strokeStyle=col;c.lineWidth=wd;c.lineCap='round';c.beginPath();c.moveTo(128-len*.16*Math.sin(ang),128+len*.16*Math.cos(ang));c.lineTo(128+len*Math.sin(ang),128-len*Math.cos(ang));c.stroke();};
 hand(hr*PI/6,56,7,'#1a1409');hand(mi*PI/30,82,5,'#1a1409');hand(sec*PI/30,90,2,'#9b1c1c');c.fillStyle='#1a1409';c.beginPath();c.arc(128,128,6,0,7);c.fill();CLK.tex.needsUpdate=true;}


const oakH=panelTex('#b8884e','#7a5228','#d6aa6c'),tileW=ctex(64,64,(c,w,h)=>{c.fillStyle='#f0ece2';c.fillRect(0,0,w,h);c.fillStyle='#161412';c.beginPath();c.moveTo(32,18);c.lineTo(46,32);c.lineTo(32,46);c.lineTo(18,32);c.fill();c.strokeStyle='rgba(60,50,40,.22)';c.strokeRect(0,0,w,h);});
const SETS={
escadaria:{n:'Grande Escadaria (1ª classe)',c:[-1,3.4,0],r:26,spawn:[5.4,0,1.2,PI/2+.1],build(g){
 const oak=mT(oakT,1,1),oakS=triMat(woodGrainT('#a87a44',1,1),.55,{roughness:.4,metalness:.04}),tread=triMat(woodGrainT('#b88a52',1,1),.7,{roughness:.36,metalness:.04}),marble=M(0xe9e4d6,{roughness:.3}),brs=new T.MeshStandardMaterial({color:0xc9a447,metalness:.85,roughness:.3});
 const f=new T.Mesh(new T.PlaneGeometry(16,18),mT(tileW,16,18));f.rotation.x=-PI/2;g.add(f);
 wall(18,6.3,mT(oakH,12,3),8,3.15,0,-PI/2,g);wall(18,6.3,mT(oakH,12,3),-8,3.15,0,PI/2,g);wall(16,6.3,mT(oakH,10,3),0,3.15,9,PI,g);wall(16,6.3,mT(oakH,10,3),0,3.15,-9,0,g);
 const cs=new T.Shape();cs.moveTo(-8,-9);cs.lineTo(8,-9);cs.lineTo(8,9);cs.lineTo(-8,9);cs.lineTo(-8,-9);const hp=new T.Path();hp.absarc(-1,0,4,0,PI*2,true);cs.holes.push(hp);const ce=new T.Mesh(new T.ShapeGeometry(cs,32),M(0xf2ecdc,{side:T.BackSide}));ce.rotation.x=-PI/2;ce.position.y=6.3;g.add(ce);
 const dm=part(new T.Mesh(new T.SphereGeometry(4,32,12,0,PI*2,0,PI/2),new T.MeshStandardMaterial({map:tx(domeT,2,1),side:DS,emissive:0xfff0c8,emissiveMap:tx(domeT,2,1),emissiveIntensity:.75})),'cupula');dm.scale.y=.55;dm.position.set(-1,6.3,0);g.add(dm);

 for(let i=0;i<9;i++){const h=(i+1)*.178;box(.5,h,5,tread,1-(i+.5)*.5,h*.5,0,g);box(.5,.014,5.02,marble,1-(i+.5)*.5,h+.007,0,g);box(.05,.022,5.04,brs,1-i*.5-.03,h+.012,0,g);[-3.6,3.6].forEach(z=>{const y=1.6+h;box(.5,.22,1.8,tread,-3.5+(i+.5)*.5,y-.11,z,g);box(.5,.014,1.82,marble,-3.5+(i+.5)*.5,y+.007,z,g);box(.05,.022,1.84,brs,-3.5+i*.5+.03,y+.012,z,g);});}
 box(2,1.6,9,tread,-4.5,.8,0,g);[-1,1].forEach(s=>{const st=box(4.9,.5,.1,oakS,-1.25,2.2,s*2.72,g);st.rotation.z=.34;const s2=box(4.9,.5,.1,oakS,-1.25,2.2,s*4.5,g);s2.rotation.z=.34;});
 [[-6.75,0,2.5,18],[6.25,0,3.5,18],[-.5,6.8,10,4.4],[-.5,-6.8,10,4.4],[2.75,3.6,3.5,2],[2.75,-3.6,3.5,2]].forEach(r=>box(r[2],.25,r[3],oakS,r[0],3.075,r[1],g));
 const pn=part(new T.Mesh(new T.PlaneGeometry(2.6,4.2),new T.MeshStandardMaterial({map:clockPanelT(),roughness:.55})),'relogio');pn.position.set(-5.47,3.75,0);pn.rotation.y=PI/2;g.add(pn);{const cf=new T.Mesh(new T.CircleGeometry(.52,40),new T.MeshStandardMaterial({map:clockFace(),roughness:.35,emissive:0x2a2418,emissiveMap:CLK.tex,emissiveIntensity:.5}));cf.position.set(-5.44,4.07,0);cf.rotation.y=PI/2;part(cf,'relogio');g.add(cf);}wall(9,6.3,mT(oakH,6,2),-5.49,3.15,0,PI/2,g);
 balustrade([[1,0,2.5,-3.5,1.6,2.5],[1,0,-2.5,-3.5,1.6,-2.5],[-3.5,1.6,2.72,1,3.2,2.72],[-3.5,1.6,-2.72,1,3.2,-2.72],[-5.5,3.2,4.6,1,3.2,4.6],[-5.5,3.2,-4.6,1,3.2,-4.6],[4.5,3.2,-2.6,4.5,3.2,2.6],[1,3.2,2.6,4.5,3.2,2.6],[1,3.2,-2.6,4.5,3.2,-2.6]],g,oakS);
 const q=part(G(),'querubim');lathe([[.26,0],[.22,.12],[.15,.2],[.13,1.0],[.2,1.12],[.22,1.2],[.18,1.26]],M(0x6a4a2a,{metalness:.2,roughness:.5}),1.25,0,0,q,14);g.add(q);
 querubimLoad(o=>{if(!o){const bd=sph(.085,M(0x8a6a3a,{metalness:.6,roughness:.4}),1.25,1.55,0,q);bd.scale.set(1,1.7,1);return;}const c=o.clone(true);c.traverse(m=>{if(m.isMesh){const mm=m.material;mm.metalness=.6;mm.roughness=.4;mm.color=new T.Color(0x8a6238);mm.emissive=new T.Color(0x1c1209);m.frustumCulled=false;}});const k=new T.Group();k.add(c);k.rotation.y=PI/2;const bb=new T.Box3().setFromObject(c),sc=1.5/(bb.max.y-bb.min.y);c.scale.setScalar(sc);bb.setFromObject(c);c.position.set(-(bb.min.x+bb.max.x)/2,-bb.min.y,-(bb.min.z+bb.max.z)/2);k.position.set(1.25,1.26,0);q.add(k);
 /* tocha acesa: chama branco-amarelada no ponto mais alto da escultura + luz quente */
 q.updateMatrixWorld(true);const iq=new T.Matrix4().copy(q.matrixWorld).invert(),vv=new T.Vector3();let tip=null;c.updateMatrixWorld(true);c.traverse(m=>{if(m.isMesh&&m.geometry.attributes.position){const P=m.geometry.attributes.position,W=new T.Matrix4().multiplyMatrices(iq,m.matrixWorld);for(let i=0;i<P.count;i++){vv.fromBufferAttribute(P,i);if(P.normalized){const a=P.array,dv=a instanceof Int16Array?32767:a instanceof Int8Array?127:a instanceof Uint16Array?65535:a instanceof Uint8Array?255:1;vv.multiplyScalar(1/dv);}vv.applyMatrix4(W);if(!tip||vv.y>tip.y)tip=vv.clone();}}});
 if(tip){const fl=new T.Mesh(new T.SphereGeometry(.07,12,10),new T.MeshBasicMaterial({color:0xfff1c4}));fl.scale.set(1,1.8,1);fl.position.set(tip.x,tip.y-.02,tip.z);q.add(fl);const cv=document.createElement('canvas');cv.width=cv.height=64;{const x=cv.getContext('2d'),gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,240,200,.95)');gr.addColorStop(.3,'rgba(255,215,140,.4)');gr.addColorStop(1,'rgba(255,200,110,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);}const hl=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cv),transparent:true,depthWrite:false,blending:T.AdditiveBlending}));hl.scale.set(.6,.6,1);hl.position.copy(fl.position);q.add(hl);const pl=new T.PointLight(0xffe2a8,1.3,15,1.5);pl.position.set(tip.x,tip.y+.2,tip.z);q.add(pl);}});
 [[4.5,2.6],[4.5,-2.6],[-5.5,4.6],[-5.5,-4.6],[1,4.6],[1,-4.6]].forEach(p=>{lathe([[.2,0],[.2,.25],[.14,.35],[.13,2.85],[.2,2.98],[.2,3.08]],oakS,p[0],0,p[1],g,14);});
 [-2.4,0,2.4].forEach(z=>{const d=part(new T.Mesh(new T.PlaneGeometry(1.6,2.3),new T.MeshStandardMaterial({map:grilleT})),'elevador');d.position.set(7.96,1.2,z);d.rotation.y=-PI/2;g.add(d);});
 [-6,6].forEach(z=>{const w=new T.Mesh(new T.PlaneGeometry(1.4,2.2),new T.MeshStandardMaterial({map:leadT,emissive:0xfff0c0,emissiveMap:leadT,emissiveIntensity:.6}));w.position.set(z>0?0:0,4.6,z>0?8.96:-8.96);w.rotation.y=z>0?PI:0;g.add(w);});
 {const l=new T.PointLight(0xffdca0,1.2,34,1.5);l.position.set(-1,5.6,0);g.add(l);}lamp(5,2.6,6,g,.5,16);lamp(5,2.6,-6,g,.5,16);lamp(-6.8,5.4,0,g,.5,16);},
 surf:[[-8,8,-9,9,0],[-3.5,1,-2.5,2.5,stCen],[-5.5,-3.5,-4.5,4.5,1.6],[-3.5,1,2.7,4.5,stSide],[-3.5,1,-4.5,-2.7,stSide],[-8,-5.5,-9,9,3.2],[4.5,8,-9,9,3.2],[-5.5,4.5,4.6,9,3.2],[-5.5,4.5,-9,-4.6,3.2],[1,4.5,2.6,4.6,3.2],[1,4.5,-4.6,-2.6,3.2]]},

ponte:{n:'Ponte de comando',c:[0,1.2,0],r:24,spawn:[-.4,0,5.5,-PI/2],build(g){
 const f=new T.Mesh(new T.PlaneGeometry(11,28),mT(plankT,3,7));f.rotation.x=-PI/2;f.position.x=-.5;g.add(f);const rf=new T.Mesh(new T.PlaneGeometry(11,28),M(0xf2eee2));rf.rotation.x=PI/2;rf.position.set(-.5,2.6,0);g.add(rf);
 box(.12,1.25,28,mWhite,4.9,.62,0,g);for(let z=-13.5;z<=13.5;z+=1.5)cyl(.04,.04,1.35,mWhite,4.9,1.92,z,g);const gl=new T.Mesh(new T.PlaneGeometry(28,1.3),new T.MeshStandardMaterial({color:0x9fc3d6,transparent:true,opacity:.18,side:DS}));gl.position.set(4.9,1.9,0);gl.rotation.y=PI/2;g.add(gl);
 const gm=new T.MeshStandardMaterial({color:0x9fc3d6,transparent:true,opacity:.2,side:DS,depthWrite:false});
 [[2.2,0,.1,6.8],[.5,3.4,3.4,.1],[.5,-3.4,3.4,.1]].forEach(w=>{box(w[2],1,w[3],mT(mahT,3,1),w[0],.5,w[1],g);box(w[2],1.6,w[3],gm,w[0],1.8,w[1],g);});
 box(.1,2.6,9,mT(whiteT,6,2),-1.25,1.3,0,g);box(.1,2.6,9,mT(whiteT,6,2),-5.9,1.3,0,g);[-4.5,4.5].forEach(z=>box(4.6,2.6,.1,mT(whiteT,3,2),-3.6,1.3,z,g));
 teleg(3.7,-7.5,g);teleg(3.7,-4.6,g);teleg(3.7,4.6,g);teleg(3.7,7.5,g);
 const bin=(x,z)=>{const b=part(G(),'bussola');lathe([[.3,0],[.22,.1],[.2,1],[.28,1.1],[.28,1.25],[0,1.25]],M(0x6e2f1c,{roughness:.4}),x,0,z,b,14);const hd=new T.Mesh(new T.SphereGeometry(.26,14,8,0,PI*2,0,PI/2),mBrass);hd.position.set(x,1.25,z);b.add(hd);[-1,1].forEach(s=>sph(.11,M(s>0?0x2a8a3a:0xa02a22),x,1.15,z+s*.42,b));g.add(b);};
 const wheel=(x,z)=>{const w=part(G(),'timao');lathe([[.2,0],[.1,.1],[.08,1],[0,1]],mBrass,x,0,z,w,10);const wg=G();wg.position.set(x-.15,1.1,z);const rim=new T.Mesh(new T.TorusGeometry(.5,.045,8,24),M(0x6e2f1c,{roughness:.4}));rim.rotation.y=PI/2;wg.add(rim);for(let i=0;i<8;i++){const sp=box(.03,1.25,.03,M(0x6e2f1c),0,0,0,wg);sp.rotation.x=i*PI/4;}cyl(.08,.08,.1,mBrass,0,0,0,wg,'x');w.add(wg);g.add(w);(g.userData.wheels=g.userData.wheels||[]).push(wg);};
 bin(3.6,0);wheel(2.9,0);bin(1.5,0);wheel(.6,0);
 const tm=part(G(),'telemotor');lathe([[.22,0],[.16,.2],[.16,.85],[.22,.95],[0,.95]],mBrass,.95,0,0,tm,12);cyl(.1,.1,.2,mBrass,.95,1.05,0,tm);g.add(tm);
 const ph=part(G(),'telefone');[-1.6,-1,1,1.6].forEach(z=>{box(.14,.34,.24,M(0x3a2414),-1.12,1.5,z,ph);cyl(.04,.05,.12,mBrass,-1.02,1.5,z,ph,'x');});g.add(ph);
 const tb=part(G(),'cartas');box(1.5,.06,2.6,M(0x6e2f1c),-3.6,.92,0,tb);const cht=new T.Mesh(new T.PlaneGeometry(2.3,1.3),new T.MeshStandardMaterial({map:chartT}));cht.rotation.x=-PI/2;cht.rotation.z=PI/2;cht.position.set(-3.6,.96,0);tb.add(cht);box(1.4,.9,2.4,M(0x5a2a18),-3.6,.45,0,tb);
 box(.2,.14,.2,M(0x6e2f1c),-3.2,1.03,1,tb);cyl(.07,.07,.02,mBrass,-3.2,1.11,1,tb);rod(V(-3.9,.98,-.6),V(-3.5,.98,-.9),.008,.008,mBrass,tb,5);rod(V(-3.9,.98,-.6),V(-3.6,.98,-.4),.008,.008,mBrass,tb,5);box(.5,.01,.05,M(0x222222),-3.8,.97,.5,tb);g.add(tb);
 const ck=part(cyl(.2,.2,.06,M(0xf3efe2),-5.82,1.9,0,g,'x',18),'relogioN');box(.5,1.6,1.6,M(0x5a2a18),-5.6,.8,3,g);
 [-13.2,13.2].forEach(z=>{box(2.4,1.25,.1,mWhite,3.7,.62,z+(z>0?.75:-.75),g);});lamp(-3.6,2.3,0,g,.7,12);lamp(1,2.3,0,g,.6,12);},
 surf:[[-5.8,4.6,-13.8,13.8,0]]},
radio:{n:'Estação Marconi — sala de operação, sala silenciosa e camarote',c:[0,1.1,0],r:10,spawn:[-.3,0,.9,0],build(g){
 /* Reconstrução aproximada da estação no convés dos Botes (na linha de centro, a ré da chaminé de vante, dentro da casa dos oficiais).
    Três compartimentos lado a lado: camarote dos operadores (oeste, x<-1.8), sala de operação (centro) e sala silenciosa do
    transmissor (leste, x>1.8), forrada para abafar o estalo da centelha. Medidas e disposição plausíveis, não tiradas de planta. */
 const H=2.4,D=3,wd=M(0x6e2f1c,{roughness:.6}),wdD=M(0x4a2c12,{roughness:.6}),cond=M(0x8e8e86,{metalness:.5,roughness:.45}),ebo=M(0x1b1712,{roughness:.35}),marb=M(0xd9d4c4,{roughness:.3});
 const pw=mT(whiteT,1.2,1.4);
 const quilt=new T.MeshStandardMaterial({map:ctex(128,128,(c,w,h)=>{c.fillStyle='#6f6a5c';c.fillRect(0,0,w,h);c.strokeStyle='#57524a';c.lineWidth=3;for(let i=0;i<=4;i++){c.beginPath();c.moveTo(i*w/4,0);c.lineTo(i*w/4,h);c.stroke();c.beginPath();c.moveTo(0,i*h/4);c.lineTo(w,i*h/4);c.stroke();}c.fillStyle='#3e3a33';for(let i=0;i<4;i++)for(let j=0;j<4;j++){c.beginPath();c.arc((i+.5)*w/4,(j+.5)*h/4,3,0,7);c.fill();}}),roughness:.95});
 const qm=(w,h)=>{const m=quilt.clone();m.map=quilt.map.clone();m.map.wrapS=m.map.wrapT=T.RepeatWrapping;m.map.repeat.set(w/.6,h/.6);m.map.needsUpdate=true;return m;};
 const fl=(w,ox)=>{const f=new T.Mesh(new T.PlaneGeometry(w,D),mT(linoT,w,D));f.rotation.x=-PI/2;f.position.set(ox,0,0);g.add(f);const c=new T.Mesh(new T.PlaneGeometry(w,D),M(0xf2eee2));c.rotation.x=PI/2;c.position.set(ox,H,0);g.add(c);};
 fl(2.4,-3);fl(3.6,0);fl(2.6,3.1);
 /* paredes externas (planos voltados para dentro) */
 wall(2.4,H,pw,-3,H/2,-D/2,0,g);wall(2.4,H,pw,-3,H/2,D/2,PI,g);wall(D,H,pw,-4.2,H/2,0,PI/2,g);
 wall(3.6,H,pw,0,H/2,-D/2,0,g);wall(3.6,H,pw,0,H/2,D/2,PI,g);
 wall(2.6,H,qm(2.6,H),3.1,H/2,-D/2,0,g);wall(2.6,H,qm(2.6,H),3.1,H/2,D/2,PI,g);wall(D,H,qm(D,H),4.4,H/2,0,-PI/2,g);
 /* divisórias com vão de porta (z de .55 a 1.25), batentes e porta aberta encostada */
 [-1.8,1.8].forEach(x=>{const seg=(z0,z1,y0,y1)=>box(.08,y1-y0,z1-z0,pw,x,(y0+y1)/2,(z0+z1)/2,g);seg(-D/2,.55,0,H);seg(1.25,D/2,0,H);seg(.55,1.25,2.02,H);
  [.55,1.25].forEach(z=>box(.12,2.05,.05,wd,x,1.02,z,g));box(.12,.06,.76,wd,x,2.05,.9,g);box(.68,2,.04,wdD,x+(x<0?-.36:.36),1,.53,g);});
 /* lado silencioso da divisória leste: forro acolchoado */
 [[-D/2,.55],[1.25,D/2]].forEach(([z0,z1])=>wall(z1-z0,H,qm(z1-z0,H),1.845,H/2,(z0+z1)/2,PI/2,g));
 /* rodapés e eletrodutos na sala de operação */
 box(3.6,.12,.02,wd,0,.06,-D/2+.01,g);box(3.6,.12,.02,wd,0,.06,D/2-.01,g);
 [2.15,2.25].forEach(y=>box(3.5,.025,.025,cond,0,y,-D/2+.03,g));box(.025,1.3,.025,cond,1.6,1.55,-D/2+.03,g);box(.025,1.3,.025,cond,1.68,1.55,-D/2+.03,g);
 /* ---- sala de operação: mesa de mogno ao longo da antepara ---- */
 box(2.5,.05,.75,wd,-.25,.8,-1.12,g);box(2.4,.75,.68,wdD,-.25,.39,-1.14,g);
 const k=part(G(),'chaveMorse');box(.24,.03,.12,M(0x2a1c10),-.5,.85,-.95,k);box(.2,.015,.03,mBrass,-.5,.9,-.95,k);cyl(.03,.03,.04,ebo,-.58,.93,-.95,k);g.add(k);g.userData.key=k.children[1];
 const rc=part(G(),'receptor');box(.6,.26,.3,M(0x6e2f1c),.3,.96,-1.3,rc);[-.14,.14].forEach(o=>cyl(.1,.1,.04,mBrass,.3+o,1.1,-1.3,rc));box(.55,.4,.3,M(0x4a2c12),.85,1.03,-1.3,rc);for(let i=0;i<3;i++)cyl(.04,.04,.05,mBrass,.68+i*.17,1.05,-1.13,rc,'z');
 /* fiação até a parede e comutador de antena (transmitir / receber) em placa de mármore */
 box(.02,.02,.32,cond,.85,1.24,-1.42,rc);const sw=G();sw.position.set(.3,1.55,-D/2+.05);box(.42,.5,.03,marb,0,0,0,sw);[-.12,.12].forEach(x=>{box(.03,.2,.03,mBrass,x,.05,.04,sw);cyl(.025,.025,.06,ebo,x,.17,.06,sw,'z');});box(.3,.03,.03,mBrass,0,-.12,.06,sw);rc.add(sw);g.add(rc);
 const hp=part(G(),'fones');const hb2=new T.Mesh(new T.TorusGeometry(.1,.012,6,14,PI),mDark);hb2.position.set(-1.05,.91,-1.0);hp.add(hb2);[-.1,.1].forEach(o=>cyl(.05,.05,.03,mDark,-1.05+o,.86,-1.0,hp,'x'));g.add(hp);
 /* formulários, espeto de mensagens, lápis e livro de registro */
 const form=new T.MeshStandardMaterial({map:ctex(128,96,(c,w,h)=>{c.fillStyle='#f4efdc';c.fillRect(0,0,w,h);c.fillStyle='#8a3a2a';c.font='bold 11px Georgia';c.fillText('MARCONI',8,16);c.fillStyle='#444';for(let y=28;y<h-6;y+=9)c.fillRect(8,y,w-16,1);})});
 [[-.1,-.85],[.05,-.82]].forEach(p=>{const f=new T.Mesh(new T.PlaneGeometry(.21,.16),form);f.rotation.x=-PI/2;f.rotation.z=p[0]*.8;f.position.set(p[0],.828,p[1]);g.add(f);});
 cyl(.004,.004,.14,mBright,-.85,.89,-1.3,g);cyl(.05,.05,.01,mDark,-.85,.83,-1.3,g);for(let i=0;i<5;i++)box(.13,.003,.1,M(0xf1ebd6),-.85,.84+i*.006,-1.3,g);
 cyl(.004,.004,.15,M(0xc9a23a),.15,.83,-.86,g,'x');box(.26,.04,.34,M(0x2f3f2a),-1.2,.845,-1.25,g);
 /* transmissor de emergência (bobina de indução alimentada por baterias), na ponta da mesa, com as baterias embaixo */
 box(.35,.3,.25,wd,1.25,.95,-1.2,g);cyl(.06,.06,.3,M(0x222222),1.25,1.16,-1.2,g,'x');[-.1,.1].forEach(o=>cyl(.015,.015,.06,mBrass,1.25+o,1.14,-1.1,g));
 box(.5,.3,.35,M(0x2b2b2b),1.3,.15,-1.1,g);for(let i=0;i<3;i++)cyl(.03,.03,.04,M(0x444444),1.15+i*.15,.32,-1.1,g);
 /* relógio de parede */
 cyl(.17,.17,.05,wd,-.25,1.9,-D/2+.04,g,'z',20);const cf=new T.Mesh(new T.CircleGeometry(.14,24),new T.MeshStandardMaterial({map:ctex(128,128,(c,w,h)=>{c.fillStyle='#f3efe2';c.fillRect(0,0,w,h);c.strokeStyle='#222';c.lineWidth=3;for(let i=0;i<12;i++){const a=i/12*PI*2;c.beginPath();c.moveTo(64+Math.sin(a)*50,64-Math.cos(a)*50);c.lineTo(64+Math.sin(a)*58,64-Math.cos(a)*58);c.stroke();}c.beginPath();c.moveTo(64,64);c.lineTo(94,52);c.moveTo(64,64);c.lineTo(56,20);c.stroke();})}));cf.position.set(-.25,1.9,-D/2+.07);g.add(cf);
 /* cadeiras giratórias de madeira */
 [[-.5,-.35],[.35,-.3]].forEach(p=>{cyl(.21,.21,.05,wd,p[0],.47,p[1],g,null,16);cyl(.03,.03,.42,mIron,p[0],.23,p[1],g);cyl(.2,.24,.03,mIron,p[0],.02,p[1],g,null,12);box(.38,.3,.04,wd,p[0],.68,p[1]+.2,g);});
 /* quadro de avisos na parede sul */
 box(.6,.45,.02,M(0x3d2a17),1.1,1.5,D/2-.02,g);[[.95,1.55],[1.2,1.45]].forEach(p=>{const f=new T.Mesh(new T.PlaneGeometry(.18,.13),form);f.position.set(p[0],p[1],D/2-.035);f.rotation.y=PI;g.add(f);});
 lamp(-.25,H-.05,-.4,g,.7,8);
 /* ---- sala silenciosa: motor-gerador, transformador, condensadores, centelhador rotativo, bobina de sintonia e quadro ---- */
 const t=part(G(),'transmissor');const disc=G();disc.position.set(3.6,1,-1.0);cyl(.34,.34,.05,mBrass,0,0,0,disc,'z',20);for(let i=0;i<8;i++)box(.05,.05,.1,mBright,.3*Math.cos(i*PI/4),.3*Math.sin(i*PI/4),0,disc);t.add(disc);g.userData.disc=disc;
 box(.9,.7,.6,M(0x2c4a3a),3.6,.36,-1.0,t);const sp=sph(.07,glow(0x9fd8ff,0),3.6,1.38,-1.0,t);g.userData.spark=sp;const sl=new T.PointLight(0x9fd8ff,0,6);sl.position.set(3.6,1.4,-.9);t.add(sl);g.userData.sparkL=sl;
 box(1.1,.12,.45,mIron,2.45,.06,-1.1,t);cyl(.2,.2,.45,M(0x3a4a3e,{metalness:.4,roughness:.5}),2.25,.33,-1.1,t,'x',18);cyl(.18,.18,.4,M(0x3a4a3e,{metalness:.4,roughness:.5}),2.72,.31,-1.1,t,'x',18);cyl(.05,.05,.12,mBright,2.49,.32,-1.1,t,'x');
 box(.5,.6,.4,M(0x2a2a2a,{metalness:.3}),4.05,.3,-1.15,t);[3.95,4.15].forEach(x=>cyl(.04,.04,.12,M(0xe8e0c8),x,.66,-1.15,t));
 box(1.3,.04,.6,wd,2.95,1.0,-1.2,t);const ji=new T.InstancedMesh(new T.CylinderGeometry(.08,.08,.42,10),new T.MeshStandardMaterial({color:0x9fc3d6,transparent:true,opacity:.55}),12),m4=new T.Matrix4();for(let i=0;i<12;i++){m4.makeTranslation(2.45+(i%6)*.2,1.23,-1.3+(i/6|0)*.26);ji.setMatrixAt(i,m4);}t.add(ji);
 for(let i=0;i<10;i++){const r=new T.Mesh(new T.TorusGeometry(.16,.008,4,20),mBrass);r.rotation.x=PI/2;r.position.set(4.05,1.25+i*.05,-1.15);t.add(r);}cyl(.012,.012,H-1.75,cond,4.05,(H+1.75)/2,-1.15,t);cyl(.05,.05,.08,M(0xe8e0c8),4.05,H-.05,-1.15,t);
 box(.08,1.3,1.4,marb,4.36,1.4,.5,t);for(let i=0;i<4;i++)cyl(.1,.1,.05,mBrass,4.3,1.75,.1+i*.27,t,'x',14);for(let i=0;i<3;i++){box(.04,.18,.04,mBrass,4.3,1.25,.2+i*.3,t);cyl(.02,.02,.08,ebo,4.27,1.36,.2+i*.3,t,'x');}g.add(t);
 lamp(3.1,H-.05,0,g,.5,7);
 /* ---- camarote dos operadores: beliche, lavatório com espelho, armário, cadeira e uniformes no cabide ---- */
 [.35,1.3].forEach(y=>{box(1.9,.16,.75,M(0xf2efe6),-3.1,y+.12,-1.07,g);box(1.95,.1,.8,wd,-3.1,y,-1.07,g);box(1.95,.18,.03,wd,-3.1,y+.12,-.68,g);});[-4.08,-2.12].forEach(x=>box(.06,1.6,.8,wd,x,.8,-1.07,g));
 [.5,1.45].forEach(y=>box(.45,.1,.3,M(0xffffff),-3.85,y+.25,-1.15,g));box(.5,.85,.45,wd,-3.95,.42,.9,g);box(.52,.03,.47,marb,-3.95,.86,.9,g);cyl(.13,.1,.08,M(0xffffff),-3.95,.92,.9,g);box(.03,.45,.35,M(0xbcd0d8,{metalness:.9,roughness:.1}),-4.17,1.4,.9,g);
 box(.55,1.9,.5,mT(mahT,1,1),-2.4,.95,1.2,g);box(.4,.45,.4,wd,-3.1,.22,.6,g);box(.4,.4,.04,wd,-3.1,.62,.78,g);
 [-3.5,-3.25].forEach(x=>cyl(.012,.012,.08,mBrass,x,1.8,D/2-.05,g,'z'));box(.38,.6,.08,M(0x1e2433),-3.38,1.45,D/2-.1,g);
 lamp(-3,H-.05,.2,g,.45,6);},
 surf:[[-1.55,1.55,-.62,1.25,0],[2.05,4.1,-.55,1.25,0],[-3.95,-2.05,-.55,.6,0],[-3.4,-2.05,.6,.95,0],[-2.1,-1.5,.55,1.25,0],[1.5,2.1,.55,1.25,0]]},
cabines:{n:'Cabines das três classes',c:[0,1,6],r:24,spawn:[1.6,0,0,PI/2],build(g){
 /* 1ª classe (convés B/C) */
 room(5,2.6,4.2,whiteT,carpetT,g,0,0);part(g.children[g.children.length-1],'cab1');
 const c1=part(G(),'cab1');box(2.05,.35,1.5,M(0xf2efe6),-1.3,.55,-1.2,c1);box(2.1,.3,1.55,M(0x6e2f1c),-1.3,.25,-1.2,c1);box(.08,1.2,1.55,mBrass,-2.36,.7,-1.2,c1);box(.06,.8,1.55,mBrass,-.26,.5,-1.2,c1);box(.5,.14,.4,M(0xffffff),-2.05,.78,-1.2,c1);
 box(1.8,.45,.7,M(0x6a2a30),1.2,.3,1.7,c1);box(1.8,.5,.14,M(0x6a2a30),1.2,.7,2,c1);cyl(.45,.45,.04,M(0x6e2f1c),.9,.72,.2,c1);cyl(.05,.2,.7,M(0x6e2f1c),.9,.35,.2,c1);
 box(1.2,2,.55,mT(mahT,1,1),-1.6,1,1.8,c1);box(.9,.85,.5,M(0x6e2f1c),2.2,.42,-1.4,c1);box(.95,.04,.55,M(0xe8e4dc),2.2,.87,-1.4,c1);box(.04,.8,.6,M(0xbcd0d8,{metalness:.9,roughness:.1}),2.47,1.6,-1.4,c1);cyl(.18,.14,.1,M(0xffffff),2.2,.94,-1.4,c1);
 box(.5,.4,.2,mBrass,.4,.25,-2,c1);box(.9,1.4,.06,M(0x7a1f28),0,1.7,-2.06,c1);g.add(c1);lamp(2.44,1.9,.4,g,.5,8);lamp(-2.44,1.9,0,g,.5,8);
 /* 2ª classe */
 room(3,2.4,2.6,pineT,linoT,g,0,7);const c2=part(G(),'cab2');[.45,1.35].forEach(y=>{box(1.95,.18,.78,M(0xf2efe6),-.45,y+.12,5.95+.2,c2);box(2,.12,.82,M(0x6e2f1c),-.45,y,6.15,c2);});[-1.42,.52].forEach(x=>box(.06,1.7,.82,M(0x6e2f1c),x,.85,6.15,c2));
 box(1.7,.4,.6,M(0x4a3a5a),-.3,.28,7.9,c2);box(.55,1.15,.4,M(0x6e2f1c),1.15,.58,6.1,c2);box(.5,.5,.04,M(0xbcd0d8,{metalness:.9,roughness:.1}),1.15,1.5,5.74,c2);g.add(c2);lamp(0,2.1,7,g,.5,6);
 /* 3ª classe */
 room(2.8,2.3,2.2,pineT,redFlT,g,0,12.5);const c3=part(G(),'cab3');[-.95,.95].forEach(x=>{[.4,1.3].forEach(y=>{box(.7,.12,1.9,M(0xe9e6dc),x,y+.1,12.5,c3);box(.74,.05,1.94,M(0xdcdcd6),x,y,12.5,c3);});[[-.36,-.95],[.36,-.95],[-.36,.95],[.36,.95]].forEach(o=>cyl(.022,.022,1.75,M(0xdcdcd6),x+o[0],.875,12.5+o[1],c3,null,6));});
 box(.4,.12,.3,M(0xffffff),0,.85,11.55,c3);box(.03,.5,.4,M(0xdcdcd6),0,1.6,11.42,c3);g.add(c3);lamp(0,2,12.5,g,.4,5);},
 surf:[[-2.3,2.3,-1.9,1.9,0],[-1.3,1.3,5.9,8.1,0],[-.5,.5,11.6,13.4,0]]},
jantar:{n:'Salões de jantar das três classes',c:[0,1.2,12],r:38,spawn:[5.5,0,0,PI/2],build(g){
 const tabs=(list,w,d,col)=>{const im=new T.InstancedMesh(new T.BoxGeometry(w,.06,d),M(col),list.length),lg=new T.InstancedMesh(new T.BoxGeometry(w*.5,.72,d*.3),M(0x3a2414),list.length),m4=new T.Matrix4();list.forEach((p,i)=>{m4.makeTranslation(p[0],.76,p[1]);im.setMatrixAt(i,m4);m4.makeTranslation(p[0],.36,p[1]);lg.setMatrixAt(i,m4);});g.add(im,lg);};
 /* 1ª: jacobino branco, mesas pequenas, cadeiras de couro verde, vitrais */
 room(14,3.1,10,whiteT,blueT,g,0,0);part(g.children[g.children.length-5],'jan1');const t1=[],c1=[];for(let x=-5;x<=5;x+=2.5)for(let z=-3.4;z<=3.4;z+=2.27){t1.push([x,z]);c1.push([x-.75,z,0],[x+.75,z,0],[x,z-.7,-1],[x,z+.7,1]);}tabs(t1,1.05,1.05,0xfaf8f2);chairs(c1,g,0x2f5a3a);
 [-4.5,-1.5,1.5,4.5].forEach(x=>[-4.96,4.96].forEach(z=>{const w=new T.Mesh(new T.PlaneGeometry(1.3,1.8),new T.MeshStandardMaterial({map:leadT,emissive:0xfff0c0,emissiveMap:leadT,emissiveIntensity:.7}));w.position.set(x,1.7,z);w.rotation.y=z>0?PI:0;g.add(w);}));
 [[-3.7,-1.1],[-3.7,1.1],[3.7,-1.1],[3.7,1.1],[0,-1.1],[0,1.1]].forEach(p=>lathe([[.16,0],[.16,.3],[.1,.4],[.1,2.8],[.17,2.95],[.17,3.1]],mWhite,p[0],0,p[1],g,12));lamp(0,2.8,0,g,1,22);lamp(-5,2.8,0,g,.5,12);lamp(5,2.8,0,g,.5,12);
 /* 2ª: painéis de carvalho, mesas longas, cadeiras giratórias fixas */
 room(12,2.8,8,oakT,linoT,g,0,13);const t2=[],c2=[];[-2.4,0,2.4].forEach(z=>{t2.push([0,13+z]);for(let x=-4;x<=4;x+=.8){c2.push([x,13+z-.65,-1],[x,13+z+.65,1]);}});tabs(t2,9,.8,0xfaf8f2);chairs(c2,g,0x8a2a2a);box(1.5,1.2,.6,M(0x4a2c12),-5.2,.6,13,g);lamp(0,2.5,13,g,.9,18);
 /* 3ª: esmalte branco, mesas longas, cadeiras de madeira */
 room(12,2.5,8,pineT,redFlT,g,0,24);const t3=[],c3=[];[-2.7,-.9,.9,2.7].forEach(z=>{t3.push([0,24+z]);for(let x=-4.4;x<=4.4;x+=.62){c3.push([x,24+z-.55,-1],[x,24+z+.55,1]);}});tabs(t3,9.6,.7,0xcfae7c);chairs(c3,g,0x9a7447);
 for(let x=-5;x<=5;x+=1)box(.04,.04,.1,mIron,x,1.7,20.06,g);lamp(-3,2.2,24,g,.6,12);lamp(3,2.2,24,g,.6,12);},
 surf:[[-6.6,6.6,-4.6,4.6,0],[-5.6,5.6,9.4,16.6,0],[-5.6,5.6,20.4,27.6,0]]}
};
Object.keys(SETS).forEach((k,i)=>{SETS[k].O=V(i*140-280,-600,0);});
/* superfícies de caminhada dentro do navio (casa de máquinas e caldeiras) */
const WALK={maquinas:{spawn:[-36.5,1.8,0,PI/2],surf:[[-70,-34,-11.5,11.5,1.8]]},caldeiras:{spawn:[9.7,1.8,0,PI/2],surf:[[-21,64,-11.5,11.5,1.8]]}};
