
/* ===== MÓDULO 3d — acabamentos dos interiores públicos e das cabines (revisão de 2026) =====
   Acrescenta detalhes aos cenários já existentes (sem refazê-los) e cria a sala de recepção do convés D.
   Tudo aqui é reconstrução aproximada; as fontes e o que é suposição estão em CREDITOS.md. */
function enrich(id,fn){const s=SETS[id];if(!s)return;const b=s.build;s.build=g=>{b(g);fn(g,s);};}
/* forro em gesso com nervuras geométricas (estilo jacobino), visto só de baixo */
function strapCeil(g,w,d,x,y,z){const t=ctex(256,256,(c,W,H)=>{c.fillStyle='#f4f1e8';c.fillRect(0,0,W,H);c.strokeStyle='#d9d3c3';c.lineWidth=10;c.strokeRect(0,0,W,H);
  c.lineWidth=6;c.beginPath();c.moveTo(W/2,0);c.lineTo(W,H/2);c.lineTo(W/2,H);c.lineTo(0,H/2);c.closePath();c.stroke();c.beginPath();c.arc(W/2,H/2,46,0,PI*2);c.stroke();
  c.strokeStyle='#e8e2d2';c.lineWidth=3;c.beginPath();c.arc(W/2,H/2,30,0,PI*2);c.stroke();[[0,0],[W,0],[0,H],[W,H]].forEach(p=>{c.beginPath();c.arc(p[0],p[1],34,0,PI*2);c.stroke();});},w/2.2,d/2.2);
 const m=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshStandardMaterial({map:t,roughness:.8}));m.rotation.x=PI/2;m.position.set(x,y,z);g.add(m);return m;}
/* piso de ladrilhos de linóleo em padrão geométrico */
const linoTile=ctex(256,256,(c,w,h)=>{c.fillStyle='#e9e1cc';c.fillRect(0,0,w,h);c.fillStyle='#a8705a';c.fillRect(0,0,w/2,h/2);c.fillRect(w/2,h/2,w/2,h/2);c.fillStyle='#4a5a5e';
 [[w/2,h/2],[0,0],[w,0],[0,h],[w,h]].forEach(p=>{c.beginPath();c.moveTo(p[0],p[1]-26);c.lineTo(p[0]+26,p[1]);c.lineTo(p[0],p[1]+26);c.lineTo(p[0]-26,p[1]);c.closePath();c.fill();});c.strokeStyle='rgba(60,40,20,.35)';c.lineWidth=2;c.strokeRect(0,0,w,h);});
function floorOver(g,w,d,x,z,tex,r){const t=tex.clone();t.needsUpdate=true;t.repeat.set(w/(r||1.2),d/(r||1.2));const m=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshStandardMaterial({map:t,roughness:.55}));m.rotation.x=-PI/2;m.position.set(x,.004,z);g.add(m);return m;}
/* louça e copos em instâncias (uma chamada de desenho por tipo de peça) */
function tableware(g,places,opt){opt=opt||{};const m4=new T.Matrix4(),n=places.length;
 const pl=new T.InstancedMesh(new T.CylinderGeometry(.12,.1,.015,16),new T.MeshStandardMaterial({color:0xfbfaf4,roughness:.25}),n);
 const rim=opt.rim?new T.InstancedMesh(new T.TorusGeometry(.1,.0035,4,24),new T.MeshStandardMaterial({color:0xc9a24a,metalness:.8,roughness:.3}),n):null;
 const gl=opt.glass?new T.InstancedMesh(new T.LatheGeometry([[0,0],[.03,0],[.004,.01],[.004,.08],[.035,.1],[.04,.16],[0,.16]].map(q=>new T.Vector2(q[0],q[1])),10),new T.MeshStandardMaterial({color:0xdfeaf0,transparent:true,opacity:.45,roughness:.05}),n):null;
 const cup=opt.cup?new T.InstancedMesh(new T.CylinderGeometry(.045,.04,.09,10),new T.MeshStandardMaterial({color:0xf4f2ea,roughness:.3}),n):null;
 const y=opt.y||.8,q=new T.Quaternion(),e=new T.Euler(PI/2,0,0),sc=new T.Vector3(1,1,1),v=new T.Vector3();
 places.forEach((p,i)=>{m4.makeTranslation(p[0],y+.008,p[1]);pl.setMatrixAt(i,m4);if(rim){q.setFromEuler(e);m4.compose(v.set(p[0],y+.017,p[1]),q,sc);rim.setMatrixAt(i,m4);}
  const gx=p[0]+(p[2]||0)*.17,gz=p[1]+(p[3]||0)*.17;if(gl){m4.makeTranslation(gx,y,gz);gl.setMatrixAt(i,m4);}if(cup){m4.makeTranslation(gx,y+.045,gz);cup.setMatrixAt(i,m4);}});
 [pl,rim,gl,cup].forEach(o=>{if(o)g.add(o);});}
/* ---- salões de jantar ---- */
enrich('jantar',g=>{
 /* 1ª classe (convés D): forro jacobino em relevo, piso de linóleo em ladrilhos, louça de borda dourada, copos e aparadores */
 strapCeil(g,14,10,0,3.08,0);floorOver(g,14,10,0,0,linoTile,.5);
 const p1=[];for(let x=-5;x<=5;x+=2.5)for(let z=-3.4;z<=3.4;z+=2.27){p1.push([x-.33,z,.6,-.6],[x+.33,z,-.6,.6],[x,z-.32,.6,.6],[x,z+.32,-.6,-.6]);}tableware(g,p1,{rim:true,glass:true,y:.79});
 [-6.5,6.5].forEach(x=>{const a=G();a.position.set(x,0,0);pc(a,bx(.55,.9,2.4),km(0xe9e6de),0,.45,0);pc(a,bx(.6,.05,2.45),km(0x6e2f1c),0,.92,0);pc(a,bx(.02,.6,2.2),km(0xd8d2c2),x<0?.28:-.28,.45,0);g.add(a);});
 /* 2ª classe (convés D, a ré): louça simples nas mesas compridas */
 const p2=[];[-2.4,0,2.4].forEach(z=>{for(let x=-4;x<=4;x+=.8)p2.push([x,13+z-.24,0,-.8],[x,13+z+.24,0,.8]);});tableware(g,p2,{cup:true,y:.79});
 /* 3ª classe (convés F): pratos e canecas esmaltadas, sem toalha */
 const p3=[];[-2.7,-.9,.9,2.7].forEach(z=>{for(let x=-4.4;x<=4.4;x+=.62)p3.push([x,24+z-.2,0,-.9],[x,24+z+.2,0,.9]);});tableware(g,p3,{cup:true,y:.79});});
/* ---- sala de recepção (convés D): ao pé da Grande Escadaria, antes do salão de jantar ---- */
SETS.recepcao={n:'Sala de recepção da 1ª classe (convés D)',ph:'Titanic reception room D deck',c:[0,1.2,0],r:22,spawn:[7,0,0,PI/2],build(g){
 const w=18,d=12,h=3.1;room(w,h,d,whiteT,carpetP,g,0,0);
 /* tapete em tom escuro e discreto (cor e desenho não documentados) */
 floorOver(g,w,d,0,0,ctex(128,128,(c,W,H)=>{c.fillStyle='#5a2e26';c.fillRect(0,0,W,H);c.strokeStyle='#7a4a34';c.lineWidth=3;c.strokeRect(10,10,W-20,H-20);c.fillStyle='#6e3c2e';c.beginPath();c.arc(W/2,H/2,18,0,PI*2);c.fill();}),1.4).position.y=.002;strapCeil(g,w,d,0,h-.02,0);
 /* tapetes sob os grupos de poltronas */
 [[-4.5,-2.5],[-4.5,2.5],[1.5,-2.5],[1.5,2.5]].forEach(p=>floorOver(g,3.2,2.4,p[0],p[1],carpetG,1.6));
 /* janelas de vidro chumbado nas duas paredes laterais (vidro iluminado por trás, como no salão de jantar) */
 [-6,-2,2,6].forEach(x=>{win(g,x,1.8,d/2-.03,PI,1.3,1.8);win(g,x,1.8,-d/2+.03,0,1.3,1.8);});
 /* pé da escadaria: primeiros degraus e corrimãos na parede de vante */
 const oak=km(0x8a5a2c);for(let i=0;i<4;i++)pc(g,bx(.32,.17*(i+1),4),oak,-w/2+.25+(3-i)*.32,.085*(i+1),0);
 balustrade([[-w/2+1.45,0,-2.1,-w/2+.15,.68,-2.1],[-w/2+1.45,0,2.1,-w/2+.15,.68,2.1]],g,km(0x6e4220));
 /* poltronas, sofás, mesinhas e palmeiras em vasos */
 [[-4.5,-2.5],[-4.5,2.5],[1.5,-2.5],[1.5,2.5]].forEach((p,i)=>{grp(g,p[0],p[1],4,i%2?GRN:0x8a5a3a,MAHc,1.05);});
 [[-1.5,-d/2+.5,0],[-1.5,d/2-.5,PI],[4.6,-d/2+.5,0],[4.6,d/2-.5,PI]].forEach(p=>sofa(g,p[0],p[2]?p[1]:p[1],p[2],GRN,2));
 [[-7.6,-5],[-7.6,5],[7.5,-5],[7.5,5],[-1.5,0]].forEach(p=>palm(g,p[0],p[1]));
 [-5,0,5].forEach(x=>lamp(x,h-.1,0,g,.9,16));},
 surf:[[-8.6,8.6,-5.6,5.6,0]]};
enrich('recepcao',(g,s)=>{addDoor(g,s,9,0,-2.5,-1,0,'jantar');addDoor(g,s,9,0,2.5,-1,0,'lift');addDoor(g,s,-9,0,-4.5,1,0,'escadaria');});
{const i=Object.keys(SETS).indexOf('recepcao');SETS.recepcao.O=V((i%6)*160-400,-600-Math.floor(i/6)*200,0);}
DLBL.recepcao='Sala de recepção';
LIFT.forEach(q=>{if(q[0]==='D'){q[1]='Convés D — sala de recepção e salão de jantar';q[2]='recepcao';}});
/* o salão de jantar ganha uma porta de volta para a recepção */
enrich('jantar',(g,s)=>addDoor(g,s,-7,0,2.5,1,0,'recepcao'));
/* ---- lounge da 1ª classe (convés A, estilo Luís XV): lustre central de bronze e a estatueta de Ártemis (Diana de Versalhes) sobre a lareira ---- */
enrich('lounge',(g,s)=>{const br=M(0xb8924a,{metalness:.8,roughness:.35}),bulb=glow(0xfff1c8,1.2),h=3.7;
 const ch=G();ch.position.set(0,h,0);cyl(.012,.012,.5,br,0,-.25,0,ch);lathe([[.0,0],[.18,-.05],[.26,-.25],[.2,-.45],[.08,-.55],[0,-.6]],br,0,-.5,0,ch,16);
 for(let k=0;k<2;k++){const R=.55-k*.22,n=12-k*4,y=-.85+k*.2;const ring=new T.Mesh(new T.TorusGeometry(R,.015,6,40),br);ring.rotation.x=PI/2;ring.position.y=y;ch.add(ring);for(let i=0;i<n;i++){const a=i/n*PI*2;sph(.045,bulb,R*Math.cos(a),y+.06,R*Math.sin(a),ch);}}
 const pl=new T.PointLight(0xffe7b8,.3,9);pl.position.y=-1.1;ch.add(pl);g.add(ch);
 const st=G();st.position.set(-8.72,1.35,0);st.rotation.y=PI/2;const bz=M(0x6f5a3a,{metalness:.7,roughness:.4});
 cyl(.09,.1,.06,M(0x3a2a1c),0,.03,0,st,null,12);lathe([[0,0],[.07,0],[.09,.18],[.06,.32],[.05,.4],[0,.42]],bz,0,.06,0,st,12);sph(.04,bz,0,.52,0,st);cyl(.012,.012,.22,bz,.06,.38,.02,st).rotation.z=-.6;g.add(st);});
/* ---- sala de leitura e escrita (convés A, estilo georgiano, branca): tinteiros, mata-borrões e papel de carta nas escrivaninhas ---- */
enrich('leitura',(g,s)=>{const d=9;[-4,-1.5,1.5,4].forEach(x=>{const z=d/2-.8;pc(g,bx(.5,.01,.35),km(0x2f4a3a),x,.795,z);pc(g,bx(.21,.003,.28),km(0xf4efe0),x+.12,.802,z+.02);cyl(.03,.035,.05,M(0x1a1a22,{roughness:.2}),x-.35,.815,z-.1,g,null,10);cyl(.004,.004,.14,M(0xd8c8a0),x-.32,.86,z-.08,g).rotation.z=.4;});});
/* ---- Café Parisien (convés B): trepadeiras subindo pela treliça ---- */
enrich('cafe',(g,s)=>{const w=13,d=5,h=2.9;const lv=new T.InstancedMesh(new T.SphereGeometry(.06,5,4),M(0x3f6e34,{roughness:.8}),360),m4=new T.Matrix4();let k=0;
 for(let x=-w/2+.6;x<w/2-.4&&k<360;x+=1.3){if(Math.abs(Math.abs(x)-3)<.8)continue;for(let i=0;i<30&&k<360;i++){const y=.3+i*.085,zz=-d/2+.05+Math.random()*.03;m4.makeTranslation(x+Math.sin(i*.9)*.18,y,zz);lv.setMatrixAt(k++,m4);}}
 lv.count=k;g.add(lv);});
/* ---- cabines das três classes: coletes salva-vidas de cortiça guardados na cabine, vigias, cortinas dos beliches da 2ª classe,
   tapete e campainha do camareiro na 1ª. Posições aproximadas. ---- */
enrich('cabines',g=>{const lb=(x,y,z,ry,n)=>{for(let i=0;i<n;i++){const a=G();a.position.set(x+Math.sin(ry)*i*.06,y+i*.07,z+Math.cos(ry)*i*.06);a.rotation.y=ry;pc(a,bx(.5,.06,.34),km(0xefe9d8),0,0,0);for(let j=-1;j<=1;j++)pc(a,bx(.012,.064,.34),km(0xb9b2a0),j*.16,0,0);g.add(a);}};
 const port=(x,y,z,ry)=>{const r=new T.Mesh(new T.TorusGeometry(.17,.03,8,24),mBrass);r.position.set(x,y,z);r.rotation.y=ry;g.add(r);const gl=new T.Mesh(new T.CircleGeometry(.16,24),new T.MeshStandardMaterial({color:0xa9c8da,emissive:0x5a7f96,emissiveIntensity:.6,roughness:.1}));gl.position.set(x+Math.sin(ry)*-.005,y,z+Math.cos(ry)*-.005);gl.rotation.y=ry;g.add(gl);};
 /* 1ª classe */
 lb(-1.6,2.04,1.8,0,2);port(1.5,1.65,-2.08,0);floorOver(g,2.2,1.4,.6,.3,ctex(128,128,(c,W,H)=>{c.fillStyle='#6a2a30';c.fillRect(0,0,W,H);c.strokeStyle='#c9a24a';c.lineWidth=4;c.strokeRect(8,8,W-16,H-16);}),2.2).position.y=.003;
 pc(g,bx(.07,.1,.02),mBrass,-.35,.95,-2.08);sph(.015,km(0xf4f1e2),-.35,.95,-2.065,g);
 /* 2ª classe: cortinas meio fechadas na frente dos dois leitos, vigia sobre o sofá e coletes no alto */
 const ct=new T.MeshStandardMaterial({map:ctex(64,128,(c,W,H)=>{c.fillStyle='#2f4a6a';c.fillRect(0,0,W,H);for(let x=0;x<W;x+=8){c.fillStyle='rgba(0,0,0,.18)';c.fillRect(x,0,3,H);}}),side:DS,roughness:.9});
 [.45,1.35].forEach(y=>{const m=new T.Mesh(new T.PlaneGeometry(.7,.75),ct);m.position.set(-1.05,y+.55,6.58);g.add(m);pc(g,bx(2,.02,.02),mBrass,-.45,y+.93,6.58);});
 port(-.3,1.6,8.28,PI);pc(g,bx(.38,.03,.6),km(0x6e2f1c),-1.3,1.955,7.4);lb(-1.3,2.0,7.4,PI/2,2);
 /* 3ª classe: coletes numa prateleira alta */
 pc(g,bx(.9,.03,.36),km(0xdcdcd6),0,2.0,11.6);lb(0,2.05,11.6,0,3);});
/* ---- biblioteca da 2ª classe (convés C): cortinas de seda presas nas laterais das janelas, com bandô ---- */
enrich('biblioteca',g=>{const d=9,cm=new T.MeshStandardMaterial({map:ctex(64,128,(c,W,H)=>{c.fillStyle='#7d8a5e';c.fillRect(0,0,W,H);for(let x=0;x<W;x+=10){c.fillStyle='rgba(255,255,255,.12)';c.fillRect(x,0,3,H);c.fillStyle='rgba(0,0,0,.14)';c.fillRect(x+5,0,3,H);}}),side:DS,roughness:.6});
 [-3.5,0,3.5].forEach(x=>[[d/2-.06,PI],[-d/2+.06,0]].forEach(([z,ry])=>{[-1,1].forEach(sd=>{const m=new T.Mesh(new T.PlaneGeometry(.38,2.1),cm);m.position.set(x+sd*.78,1.72,z);m.rotation.y=ry;g.add(m);});
  const v=new T.Mesh(new T.PlaneGeometry(1.95,.28),cm);v.position.set(x,2.78,z+(z>0?-.01:.01));v.rotation.y=ry;g.add(v);}));});
/* ---- sala geral da 3ª classe (convés C, popa): piano de armário, relógio e quadro de avisos ---- */
enrich('geral3',g=>{const w=11,d=9;
 cyl(.2,.2,.05,km(0x6e2f1c),-w/2+.04,1.95,-2.8,g,'x',20);const f=new T.Mesh(new T.CircleGeometry(.17,24),new T.MeshStandardMaterial({color:0xf3efe2}));f.position.set(-w/2+.075,1.95,-2.8);f.rotation.y=PI/2;g.add(f);
 [[.12,.9],[.08,2.6]].forEach(([l,a])=>{const hd=pc(g,bx(.01,.02,l),km(0x111111),-w/2+.085,1.95,-2.8);hd.geometry=hd.geometry.clone();hd.geometry.translate(0,0,-l/2);hd.rotation.x=a;});
 const nb=new T.Mesh(new T.PlaneGeometry(1,.7),new T.MeshStandardMaterial({map:ctex(160,112,(c,W,H)=>{c.fillStyle='#6a4a2a';c.fillRect(0,0,W,H);c.fillStyle='#efe6cc';[[10,10],[60,14],[110,8],[22,60],[80,58]].forEach(p=>{c.fillRect(p[0],p[1],42,40);c.fillStyle='#888';for(let y=p[1]+8;y<p[1]+36;y+=6)c.fillRect(p[0]+4,y,34,1);c.fillStyle='#efe6cc';});})}));nb.position.set(0,1.6,d/2-.03);nb.rotation.y=PI;g.add(nb);});

/* ---- piano de armário tocável (sala geral da 3ª classe): 88 teclas (lá 0 a dó 8) em duas instâncias, caixa de nogueira com
   painel vazado, estante com partitura, pedais e rodízios. Toque/clique nas teclas toca a nota; o som sai pelo canal de efeitos. ---- */
const PNO={keys:[],press:[],raf:0,voices:[]};
function pianoUp(g,x,z,ry){const a=G();a.position.set(x,0,z);a.rotation.y=ry||0;
 const wt=woodGrainT('#3b2416');wt.repeat.set(2,2);const wood=new T.MeshStandardMaterial({map:wt,roughness:.35,metalness:.05}),dark=M(0x1e130b,{roughness:.4}),brass=M(0xc9a24a,{metalness:.85,roughness:.3});
 const W=1.48,KW=1.22,KY=.735;
 /* caixa, tampo, rodapé e montantes laterais que sustentam o teclado */
 pc(a,bx(W,1.28,.34),wood,0,.66,-.13);pc(a,bx(W+.04,.04,.4),wood,0,1.32,-.12);pc(a,bx(W,.1,.42),dark,0,.05,-.1);
 [-1,1].forEach(s=>{pc(a,bx(.07,.82,.62),wood,s*(KW/2+.06),.41,.04);pc(a,bx(.09,.06,.66),wood,s*(KW/2+.06),.84,.05);pc(a,bx(.1,.12,.12),dark,s*(KW/2+.06),.06,.3);cyl(.025,.025,.03,brass,s*(KW/2+.06),.015,.33,a,'x',10);});
 /* teclado: base, frente do teclado e régua de feltro atrás das teclas */
 pc(a,bx(KW+.02,.05,.3),wood,0,KY-.035,.17);pc(a,bx(KW+.02,.05,.025),wood,0,KY-.02,.315);pc(a,bx(KW,.012,.02),M(0x7a1a1a,{roughness:.9}),0,KY+.022,.02);
 /* painel superior vazado com fundo de seda e estante com partitura */
 const fret=new T.MeshStandardMaterial({map:ctex(256,96,(c,w,h)=>{c.fillStyle='#6a1f1f';c.fillRect(0,0,w,h);c.strokeStyle='#2a170c';c.lineWidth=7;c.strokeRect(4,4,w-8,h-8);c.lineWidth=5;for(let i=0;i<5;i++){const cx=26+i*51;c.beginPath();c.ellipse(cx,h/2,20,30,0,0,PI*2);c.stroke();c.beginPath();c.moveTo(cx-20,h/2);c.quadraticCurveTo(cx,10,cx+20,h/2);c.quadraticCurveTo(cx,h-10,cx-20,h/2);c.stroke();}}),roughness:.6});
 const fp=new T.Mesh(new T.PlaneGeometry(1.05,.36),fret);fp.position.set(0,1.08,.042);a.add(fp);pc(a,bx(1.12,.04,.03),wood,0,.88,.045);
 const desk=pc(a,bx(.7,.02,.16),wood,0,.92,.1);desk.rotation.x=-.25;const sm=new T.Mesh(new T.PlaneGeometry(.42,.28),new T.MeshStandardMaterial({map:ctex(128,96,(c,w,h)=>{c.fillStyle='#efe6cc';c.fillRect(0,0,w,h);c.fillStyle='#333';for(let s=0;s<3;s++)for(let l=0;l<5;l++)c.fillRect(8,14+s*26+l*3,w-16,1);for(let i=0;i<24;i++)c.fillRect(10+i*4.5,12+(i%3)*26+(i*7%9),2.5,2.5);})}));sm.position.set(0,1.05,.07);sm.rotation.x=-.25;a.add(sm);
 /* tampa do teclado aberta, encostada, e pedais de latão */
 const fb=pc(a,bx(KW,.015,.12),wood,0,KY+.11,-.02);fb.rotation.x=-1.25;
 [-.09,0,.09].forEach(px=>{pc(a,bx(.035,.015,.12),brass,px,.07,.27);});pc(a,bx(.3,.03,.05),dark,0,.05,.22);
 /* teclas: 52 brancas e 36 pretas */
 const bl=[1,3,6,8,10],ww=KW/52,wk=[],bk=[];let wi=0;for(let m=21;m<=108;m++){const isB=bl.includes(m%12);if(isB)bk.push([m,-KW/2+wi*ww]);else{wk.push([m,-KW/2+(wi+.5)*ww]);wi++;}}
 const wm=new T.InstancedMesh(new T.BoxGeometry(ww*.93,.022,.15),new T.MeshStandardMaterial({color:0xf4efe2,roughness:.28}),wk.length),bm=new T.InstancedMesh(new T.BoxGeometry(ww*.56,.024,.092),new T.MeshStandardMaterial({color:0x14110e,roughness:.22}),bk.length),m4=new T.Matrix4();
 wk.forEach((k,i)=>{m4.makeTranslation(k[1],KY,.235);wm.setMatrixAt(i,m4);});bk.forEach((k,i)=>{m4.makeTranslation(k[1],KY+.021,.19);bm.setMatrixAt(i,m4);});
 wm.userData.pkey=wk;bm.userData.pkey=bk;wm.userData.base=[KY,.235];bm.userData.base=[KY+.021,.19];a.add(wm,bm);part(a,'piano3');g.add(a);a.userData.keys=[wm,bm];wm.userData.pgrp=a;bm.userData.pgrp=a;return a;}
/* tecla tocada: afunda 8 mm e volta; o som é sintetizado na hora */
function pianoHit(o,id,lk){const L=o.userData.pkey;if(!L||id===undefined||!L[id])return false;pianoNote(L[id][0]);if(!lk&&!S.pianoLock){PNO.last=o.userData.pgrp;pianoUI('invite');}PNO.press.push({o:o,i:id,t:0});if(!PNO.raf)PNO.raf=requestAnimationFrame(pianoAnim);return true;}
function pianoAnim(){const m4=new T.Matrix4(),dt=1/60;PNO.press=PNO.press.filter(p=>{p.t+=dt;const b=p.o.userData.base,x=p.o.userData.pkey[p.i][1],d=p.t<.06?p.t/.06:p.t<.22?1:Math.max(0,1-(p.t-.22)/.1);m4.makeTranslation(x,b[0]-.008*d,b[1]);p.o.setMatrixAt(p.i,m4);p.o.instanceMatrix.needsUpdate=true;return p.t<.33;});PNO.raf=PNO.press.length?requestAnimationFrame(pianoAnim):0;}
/* síntese de piano: duas cordas por nota levemente desafinadas, parciais inarmônicas com decaimento mais rápido nos agudos,
   filtro que escurece ao longo da nota, batida curta do martelo e abafador depois de ~1,6 s. Sem efeitos além de um pouco de sala. */
function pianoNote(m){if(!S.snd||!ac())return;const a=AC,t=a.currentTime+.005,f=440*Math.pow(2,(m-69)/12),B=.00035*Math.pow(f/261.6,1.2);
 PNO.voices=PNO.voices.filter(v=>v.end>a.currentTime);if(PNO.voices.length>=14){const v=PNO.voices.shift();try{v.g.gain.cancelScheduledValues(a.currentTime);v.g.gain.setTargetAtTime(0,a.currentTime,.03);}catch(_){}}
 const g=a.createGain(),lp=a.createBiquadFilter();lp.type='lowpass';lp.Q.value=.5;const br=Math.min(9000,f*9+600);lp.frequency.setValueAtTime(br,t);lp.frequency.exponentialRampToValueAtTime(Math.max(400,f*2.2),t+1.4);
 const tau=Math.max(.35,Math.min(3.2,2.6*Math.sqrt(220/f))),hold=Math.min(1.6,tau*1.1),vol=.11*Math.min(1,Math.pow(261.6/f,.18));
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.004);g.gain.setTargetAtTime(vol*.55,t+.004,.09);g.gain.setTargetAtTime(0,t+.25,tau);g.gain.setTargetAtTime(0,t+hold,.12);
 const n=f>1800?3:f>700?5:7;for(let k=1;k<=n;k++){const fk=k*f*Math.sqrt(1+B*k*k);if(fk>14000)break;[-1,1].forEach(sg=>{const o=a.createOscillator(),og=a.createGain();o.frequency.value=fk*(1+sg*.0004);og.gain.setValueAtTime(.5/Math.pow(k,1.35),t);og.gain.setTargetAtTime(0,t,tau/(1+.55*(k-1)));o.connect(og);og.connect(lp);o.start(t);o.stop(t+hold+.6);});}
 /* martelo: ruído curto filtrado */
 try{const nb=a.createBuffer(1,a.sampleRate*.03|0,a.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);const ns=a.createBufferSource(),nf=a.createBiquadFilter(),ng=a.createGain();ns.buffer=nb;nf.type='bandpass';nf.frequency.value=Math.min(5000,f*4+800);nf.Q.value=1.2;ng.gain.value=.05;ns.connect(nf);nf.connect(ng);ng.connect(lp);ns.start(t);}catch(_){}
 lp.connect(g);g.connect(out());try{const r=a.createGain();r.gain.value=.12;g.connect(r);r.connect(rev());}catch(_){}PNO.voices.push({g:g,end:t+hold+.6});}
/* ---- modo piano: câmera travada diante do teclado para tocar (descoberto ao tocar uma tecla) ----
   Entrar: convite que aparece depois da primeira nota, ou botão na ficha do piano. Dentro: tocar/arrastar nas teclas (glissando),
   teclado do computador A S D F G H J K (brancas) e W E T Y U (pretas), ◀ ▶ mudam de oitava, Esc ou “Sair” devolvem a câmera. */
{const st=document.createElement('style');st.textContent=`#pnoUI{position:fixed;left:0;right:0;margin:0 auto;width:max-content;bottom:118px;z-index:40;display:none;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;
 max-width:min(94vw,640px);padding:8px 10px;border-radius:12px;background:rgba(10,17,32,.92);border:1px solid rgba(201,162,74,.55);box-shadow:0 6px 24px rgba(0,0,0,.45);font-family:Barlow,system-ui,sans-serif;color:#efe6cc}
 #pnoUI.show{display:flex}#pnoUI.inv{bottom:auto;top:92px;flex-wrap:nowrap}#pnoUI button{font:600 14px Barlow,system-ui,sans-serif;color:#0a1120;background:#c9a24a;border:0;border-radius:8px;padding:9px 14px;cursor:pointer;min-height:40px}
 #pnoUI button.sec{background:rgba(255,255,255,.1);color:#efe6cc;border:1px solid rgba(255,255,255,.18)}#pnoUI small{flex-basis:100%;text-align:center;font-size:12px;color:#b9c3d0;line-height:1.35}
 body.pnoOn #dpad{display:none!important}body.pnoOn #hint{opacity:0!important}`;document.head.appendChild(st);
 const ui=document.createElement('div');ui.id='pnoUI';document.body.appendChild(ui);PNO.ui=ui;
 ui.addEventListener('pointerdown',e=>e.stopPropagation());ui.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.p;
  if(k==='go')pianoEnter(PNO.last);else if(k==='x'){ui.classList.remove('show');}else if(k==='out')pianoExit();else if(k==='song')pianoSong();});}
function pianoUI(mode){const u=PNO.ui;clearTimeout(PNO.uiT);if(!mode){u.classList.remove('show');return;}u.classList.toggle('inv',mode==='invite');
 if(mode==='invite'){u.innerHTML='<button data-p="go"><svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;vertical-align:-3px;margin-right:6px"><path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></svg>Tocar o piano</button><button class="sec" data-p="x" aria-label="Fechar">✕</button>';PNO.uiT=setTimeout(()=>{if(!S.pianoLock)u.classList.remove('show');},12000);}
 else u.innerHTML='<button class="sec" data-p="song">'+(PNO.songT?'■ Parar':'<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;vertical-align:-3px;margin-right:6px"><path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></svg>Nearer, My God, to Thee')+'</button><button data-p="out">Sair do piano</button><small>Toque nas teclas para tocar</small>';
 u.classList.add('show');}
/* nota → [malha, índice] para o teclado do computador */
function pianoFind(a,m){for(const o of a.userData.keys){const L=o.userData.pkey;for(let i=0;i<L.length;i++)if(L[i][0]===m)return [o,i];}return null;}
function pianoKeyX(a,m){const r=pianoFind(a,m);return r?r[0].userData.pkey[r[1]][1]:0;}
function pianoCam(){const a=PNO.cur;if(!a)return;a.updateMatrixWorld(true);const x=pianoKeyX(a,60+12*PNO.oct)+.08,dz=cam.aspect<1?1.15:.72,ey=cam.aspect<1?1.5:1.28,eye=a.localToWorld(new T.Vector3(x,ey,.235+dz)),fr=new T.Vector3(0,0,1).transformDirection(a.matrixWorld);
 F.p.set(eye.x,eye.y-1.62,eye.z);F.ys=F.p.y;F.yaw=Math.atan2(fr.x,fr.z);F.pitch=Math.atan2(.735-ey,dz);F.fovT=cam.aspect<1?44:50;}
function pianoEnter(a){if(!a||S.pianoLock)return;PNO.cur=a;PNO.prev={p:F.p.clone(),yaw:F.yaw,pitch:F.pitch,fov:F.fovT,fp:S.fp,ys:F.ys};if(window.__joyEnd)window.__joyEnd();keys.w=keys.a=keys.s=keys.d=false;
 if(S.tab)closeSheet();S.fp=true;S.pianoLock=true;PNO.oct=0;pianoCam();document.body.classList.add('pnoOn');applyLook();pianoUI('lock');}
function pianoExit(quiet){if(!S.pianoLock)return;pianoSongStop();S.pianoLock=false;document.body.classList.remove('pnoOn');pianoUI(null);const p=PNO.prev;PNO.act=null;
 if(!quiet&&p){F.p.copy(p.p);F.yaw=p.yaw;F.pitch=p.pitch;F.fovT=p.fov;F.ys=undefined;S.fp=p.fp;applyLook();}}
/* toque/arrasto nas teclas enquanto travado */
const _pr=new T.Raycaster(),_pn=new T.Vector2();
function pianoRay(e){const r=cv.getBoundingClientRect();_pn.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);_pr.setFromCamera(_pn,cam);const h=_pr.intersectObjects(PNO.cur.userData.keys,false)[0];return h&&h.instanceId!==undefined?[h.object,h.instanceId]:null;}
cv.addEventListener('pointerdown',e=>{if(!S.pianoLock)return;const k=pianoRay(e);PNO.act={id:e.pointerId,k:k?k[0].uuid+k[1]:null};if(k)pianoHit(k[0],k[1],true);});
cv.addEventListener('pointermove',e=>{const A=PNO.act;if(!S.pianoLock||!A||A.id!==e.pointerId)return;const k=pianoRay(e);const key=k?k[0].uuid+k[1]:null;if(key&&key!==A.k){A.k=key;pianoHit(k[0],k[1],true);}});
['pointerup','pointercancel'].forEach(v=>cv.addEventListener(v,e=>{if(PNO.act&&PNO.act.id===e.pointerId)PNO.act=null;}));
/* teclado do computador */
const PKM={a:0,w:1,s:2,e:3,d:4,f:5,t:6,g:7,y:8,h:9,u:10,j:11,k:12,o:13,l:14,p:15,';':16};
window.addEventListener('keydown',e=>{if(!S.pianoLock)return;if(e.target&&e.target.tagName==='INPUT')return;const k=e.key.toLowerCase();
 if(k==='escape'){pianoExit();e.preventDefault();e.stopImmediatePropagation();return;}
 if(PKM[k]!==undefined){e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;const r=pianoFind(PNO.cur,60+12*PNO.oct+PKM[k]);if(r)pianoHit(r[0],r[1],true);}},true);
window.addEventListener('keyup',e=>{if(S.pianoLock&&PKM[e.key.toLowerCase()]!==undefined)e.stopImmediatePropagation();},true);
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-piano]');if(b){e.preventDefault();const s=S.visit&&SETS[S.visit];let a=null;if(s&&s.g)s.g.traverse(o=>{if(o.userData.keys)a=o;});if(a)pianoEnter(a);}});
/* ---- modo contemplação: esconde toda a interface e deixa só o navio ----
   Entrar: botão de moldura na coluna da esquerda. Dentro: girar e aproximar continuam; ao mexer o mouse ou tocar na tela aparece
   um único botão “Mostrar interface”, que some sozinho depois de 2,5 s parado. Esc também sai. Toques no navio não abrem fichas. */
{const st=document.createElement('style');st.textContent=`
 #top,#hud,#cutbar,#deckbar,#where,#side,#dpad,#sheet,#hint,#bottom,#labels,#pwaI,#pnoUI{transition:opacity .6s ease}
 body.zen #top,body.zen #hud,body.zen #cutbar,body.zen #deckbar,body.zen #where,body.zen #side,body.zen #dpad,body.zen #sheet,body.zen #hint,body.zen #bottom,body.zen #labels,body.zen #pwaI{opacity:0!important;pointer-events:none!important}
 #zenB{position:fixed;left:0;right:0;bottom:calc(26px + env(safe-area-inset-bottom));margin:0 auto;width:max-content;z-index:60;display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:999px;
  background:rgba(10,17,32,.55);color:#efe6cc;border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font:600 14px Barlow,system-ui,sans-serif;letter-spacing:.02em;
  cursor:pointer;opacity:0;pointer-events:none;transform:translateY(8px);transition:opacity .45s ease,transform .45s ease}
 #zenB svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
 body.zen.zenAct #zenB{opacity:1;pointer-events:auto;transform:none}
 #zenTip{position:fixed;left:0;right:0;top:40%;margin:0 auto;width:max-content;max-width:86vw;text-align:center;z-index:60;padding:10px 16px;border-radius:12px;background:rgba(10,17,32,.5);color:#efe6cc;
  font:500 14px Barlow,system-ui,sans-serif;opacity:0;pointer-events:none;transition:opacity .6s ease}#zenTip.on{opacity:1}`;document.head.appendChild(st);
 const b=document.createElement('button');b.id='zenB';b.type='button';b.innerHTML='<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>Mostrar interface';document.body.appendChild(b);
 const tip=document.createElement('div');tip.id='zenTip';tip.textContent=(matchMedia('(pointer:fine)').matches?'Mova o mouse':'Toque na tela')+' para trazer o botão de voltar';document.body.appendChild(tip);
 let tm=0;const wake=()=>{if(!S.zen)return;document.body.classList.add('zenAct');clearTimeout(tm);tm=setTimeout(()=>document.body.classList.remove('zenAct'),2500);};
 ['pointermove','pointerdown','wheel','touchstart'].forEach(v=>window.addEventListener(v,wake,{passive:true}));
 window.zenOn=()=>{if(S.zen)return;if(S.tab)closeSheet();if(S.pianoLock)pianoExit();S.zen=true;document.body.classList.add('zen');document.body.classList.remove('zenAct');
  if(!localStorage.getItem('zenTip')){tip.classList.add('on');setTimeout(()=>tip.classList.remove('on'),3200);try{localStorage.setItem('zenTip','1');}catch(_){}}};
 window.zenOff=()=>{if(!S.zen)return;S.zen=false;clearTimeout(tm);document.body.classList.remove('zen','zenAct');tip.classList.remove('on');};
 b.addEventListener('pointerdown',e=>e.stopPropagation());b.addEventListener('click',e=>{e.stopPropagation();zenOff();});
 window.addEventListener('keydown',e=>{if(S.zen&&e.key==='Escape'){zenOff();e.preventDefault();}});
 $('#bZen').addEventListener('click',()=>zenOn());}
/* “Nearer, My God, to Thee”, melodia Bethany (Lowell Mason, 1856, domínio público), com um baixo simples.
   Relatos de sobreviventes dizem que a banda tocou hinos no fim; se este foi tocado, e em qual melodia, é debatido. */
const PSONG=(()=>{const G4=67,A4=69,B4=71,E4=64,D4=62,G2=43,C3=48,D3=50,G3=55;const ph=[[B4,2,G2],[A4,1],[G4,2],[G4,1],[E4,2,C3],[D4,4,D3],[D4,1],[G4,2,G2],[B4,1],[A4,3,D3]];
 return ph.concat([[G4,3,G2]],ph,[[G4,6,G2]]);})();
function pianoSongStop(){clearTimeout(PNO.songT);PNO.songT=0;}
function pianoSong(){if(PNO.songT){pianoSongStop();pianoUI('lock');return;}const a=PNO.cur;if(!a)return;let i=0;const q=.58;
 const step=()=>{if(i>=PSONG.length||!S.pianoLock){pianoSongStop();if(S.pianoLock)pianoUI('lock');return;}const n=PSONG[i++];[n[0],n[2]].forEach(m=>{if(!m)return;const k=pianoFind(a,m);if(k)pianoHit(k[0],k[1],true);});PNO.songT=setTimeout(step,n[1]*q*1000);};
 PNO.songT=1;pianoUI('lock');step();}
