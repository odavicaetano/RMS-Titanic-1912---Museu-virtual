
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
