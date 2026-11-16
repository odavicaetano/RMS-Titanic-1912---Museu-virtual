/* ================= COMANDO: casa do leme, salas de cartas e de navegação, asas da ponte, telefones, portas estanques ================= */
/* Os espaços ficam no lugar real, dentro do modelo: entra-se pelas portas do próprio navio, que se abrem quando o visitante se aproxima.
   Só a sala do comandante e a sala Marconi, mais a ré, continuam sendo cenários à parte (com transição). */
const CMD={doors:[],ring:0,ringT:0,call:false,ringN:null,hook:null,gong:null,ham:null,wtd:{a:.62,tg:.62,closed:false,lv:null},lights:[],tip:null,tipT:''};
const _cmv=new T.Vector3();
/* itens criados depois do registro inicial: entram na lista de seleção (toque/clique) */
function regItem(it){if(!it)return it;it.o.traverse(o=>{if(!o.isMesh||meshes.indexOf(o)>=0)return;o.userData.real=o.material;o.userData.it=it;let p=o,id=null;while(p){if(p.userData.part){id=p.userData.part;break;}p=p.parent;}o.userData.pid=id;(byPart[id]=byPart[id]||[]).push(o);meshes.push(o);});return it;}
/* texturas de acabamento */
function grainT(base,dark,light){return ctex(256,256,(c,w,h)=>{c.fillStyle=base;c.fillRect(0,0,w,h);for(let i=0;i<70;i++){const y=Math.random()*h,a=Math.random()*.16;c.strokeStyle=(Math.random()<.5?dark:light);c.globalAlpha=a;c.lineWidth=1+Math.random()*2.5;c.beginPath();c.moveTo(0,y);for(let x=0;x<=w;x+=16)c.lineTo(x,y+Math.sin(x*.03+i)*3+Math.sin(x*.11+i*2)*1.2);c.stroke();}c.globalAlpha=1;});}
const cmdMah=grainT('#5e2615','#2a0e05','#8a4426'),cmdTeak=grainT('#8a5a2e','#4a2c12','#b98a55');
const cmdPaint=ctex(256,256,(c,w,h)=>{c.fillStyle='#efeadf';c.fillRect(0,0,w,h);for(let x=0;x<w;x+=32){c.fillStyle='rgba(120,110,90,.16)';c.fillRect(x,0,2,h);c.fillStyle='rgba(255,255,255,.5)';c.fillRect(x+2,0,1,h);}for(let i=0;i<500;i++){c.fillStyle='rgba(90,80,60,'+(Math.random()*.035).toFixed(3)+')';c.fillRect(Math.random()*w,Math.random()*h,2+Math.random()*5,1+Math.random()*3);}},2,1);
const cmdLino=ctex(256,256,(c,w,h)=>{c.fillStyle='#7a4a2c';c.fillRect(0,0,w,h);for(let i=0;i<2600;i++){const v=Math.random();c.fillStyle=v<.5?'rgba(40,20,8,.22)':'rgba(170,110,70,.18)';c.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*3,1+Math.random()*2);}c.strokeStyle='rgba(30,15,5,.35)';c.lineWidth=2;for(let x=0;x<=w;x+=128){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();c.beginPath();c.moveTo(0,x);c.lineTo(w,x);c.stroke();}},3,3);
const cmdChart=ctex(512,384,(c,w,h)=>{c.fillStyle='#ece3c8';c.fillRect(0,0,w,h);c.strokeStyle='rgba(60,90,120,.35)';c.lineWidth=1;for(let x=0;x<w;x+=40){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}for(let y=0;y<h;y+=40){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}
 c.fillStyle='#d9c99c';c.strokeStyle='#6a5a3a';c.lineWidth=1.6;[[[0,40],[60,70],[90,140],[70,210],[110,260],[60,330],[0,360]],[[512,20],[470,60],[440,120],[480,170],[430,230],[470,300],[512,330]]].forEach(L=>{c.beginPath();c.moveTo(L[0][0],L[0][1]);L.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(L[0][0]<1?0:w,L[L.length-1][1]);c.closePath();c.fill();c.stroke();});
 c.strokeStyle='#9a2a1a';c.lineWidth=2;c.setLineDash([8,6]);c.beginPath();c.moveTo(440,150);c.bezierCurveTo(340,170,230,180,100,175);c.stroke();c.setLineDash([]);c.fillStyle='#2a2a2a';c.font='italic 15px Georgia';c.fillText('NORTH ATLANTIC OCEAN',190,90);c.font='11px Georgia';c.fillText('41°46′N  50°14′W',250,200);
 c.strokeStyle='#2a2a2a';c.beginPath();c.arc(420,300,38,0,7);c.stroke();for(let k=0;k<32;k++){const a=k/32*6.283;c.beginPath();c.moveTo(420+Math.cos(a)*(k%8?32:26),300+Math.sin(a)*(k%8?32:26));c.lineTo(420+Math.cos(a)*38,300+Math.sin(a)*38);c.stroke();}});
const cmdClock=ctex(256,256,(c,w,h)=>{c.fillStyle='#f6f1e3';c.beginPath();c.arc(128,128,124,0,7);c.fill();c.fillStyle='#1d1d1d';c.font='600 26px Georgia';c.textAlign='center';c.textBaseline='middle';for(let i=1;i<=12;i++){const a=i/12*6.283-1.5708;c.fillText(['I','II','III','IIII','V','VI','VII','VIII','IX','X','XI','XII'][i-1],128+Math.cos(a)*96,128+Math.sin(a)*96);}for(let i=0;i<60;i++){const a=i/60*6.283;c.fillRect(128+Math.cos(a)*112-1,128+Math.sin(a)*112-1,i%5?2:4,i%5?2:4);}c.lineWidth=6;c.strokeStyle='#1d1d1d';c.lineCap='round';c.beginPath();c.moveTo(128,128);c.lineTo(128+Math.cos(-1.9)*60,128+Math.sin(-1.9)*60);c.stroke();c.lineWidth=4;c.beginPath();c.moveTo(128,128);c.lineTo(128+Math.cos(-.35)*92,128+Math.sin(-.35)*92);c.stroke();});
function plateT2(txt,bg,fg){return ctex(256,52,(c,w,h)=>{c.fillStyle=bg;c.fillRect(0,0,w,h);c.strokeStyle=fg;c.lineWidth=2;c.strokeRect(4,4,w-8,h-8);c.fillStyle=fg;c.font='700 '+(txt.length>14?20:24)+'px Georgia,serif';c.textAlign='center';c.textBaseline='middle';c.fillText(txt,w/2,h/2+1);});}
/* livros: lombadas com tiras douradas, em volumes de verdade (melhora todas as estantes do museu) */
{const cv=document.createElement('canvas');cv.width=256;cv.height=64;const c=cv.getContext('2d');c.fillStyle='#2a1a10';c.fillRect(0,0,256,64);
 for(let x=0;x<256;){const bw=7+Math.random()*10,ht=44+Math.random()*18,col=['#6a2a22','#24402f','#2d2f4c','#6a4c22','#4a2433','#5a1f19','#1f3a2e','#3c2a18'][Math.random()*8|0];c.fillStyle=col;c.fillRect(x,64-ht,bw-1,ht);c.fillStyle='rgba(255,255,255,.08)';c.fillRect(x+1,64-ht,2,ht);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(x+bw-3,64-ht,2,ht);c.fillStyle='#c9a85a';[8,ht-10].forEach(o=>c.fillRect(x+1,64-ht+o,bw-3,1.5));if(bw>11){c.fillStyle='#d8bd73';c.fillRect(x+3,64-ht+18,bw-7,5);}x+=bw;}
 bookT.image=cv;bookT.needsUpdate=true;}
/* luminária de teto (globo fosco preso ao forro): sem esfera flutuando; some quando a câmera está acima da sala sem forro */
function ceilLamp(x,yc,z,g,i,d){const f=G();f.position.set(x,yc,z);g.add(f);cyl(.09,.09,.018,mBrass,0,-.009,0,f,null,18);cyl(.012,.012,.12,mBrass,0,-.07,0,f,null,8);
 const sh=new T.Mesh(new T.LatheGeometry([[.03,0],[.1,-.03],[.15,-.1],[.155,-.13],[.12,-.155],[0,-.16]].map(q=>new T.Vector2(q[0],q[1])),20),new T.MeshStandardMaterial({color:0xfff6e4,emissive:0xffe6b8,emissiveIntensity:.85,roughness:.4,transparent:true,opacity:.96}));sh.position.y=-.12;f.add(sh);
 const l=new T.PointLight(0xffdcae,i||.9,d||8,1.6);l.position.set(x,yc-.35,z);g.add(l);LAMPS.push(f);return l;}

(function(){if(!GL)return;const sup=items.find(i=>i.id==='superestrutura');if(!sup||!WALK.ponte)return;root.updateMatrixWorld(true);
 const inv=new T.Matrix4().copy(root.matrixWorld).invert(),supAll=[];sup.o.traverse(m=>{if((m.isMesh||m.isLineSegments)&&m.geometry&&m.geometry.attributes.position)supAll.push(m);});
 const rbox=m=>{if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();return m.geometry.boundingBox.clone().applyMatrix4(m.matrixWorld).applyMatrix4(inv);};
 const toSup=v=>sup.o.worldToLocal(root.localToWorld(v.clone()));
 const drop=o=>{if(o.parent)o.parent.remove(o);[meshes,lineObjs].forEach(a=>{const i=a.indexOf(o);if(i>=0)a.splice(i,1);});const id=o.userData&&o.userData.pid;if(id&&byPart[id]){const i=byPart[id].indexOf(o);if(i>=0)byPart[id].splice(i,1);}};
 const Y0=29.565,YC=31.95;

 /* ---- portas do modelo: a folha é recortada da superestrutura e ganha dobradiça ---- */
 function hingeDoor(B,hx,hz,sz,label,lab){const h=G();h.position.copy(toSup(V(hx,Y0,hz)));sup.o.add(h);h.updateMatrixWorld(true);let n=0;
  supAll.forEach(m=>{if(!rbox(m).intersectsBox(B))return;if(splitMesh(m,allIn(B),h))n++;});if(!n){sup.o.remove(h);return null;}
  const cx=(B.min.x+B.max.x)/2,dx=cx-hx,d={h:h,a:0,open:-sz*Math.sign(dx)*1.45,c:V(cx,Y0,(B.min.z+B.max.z)/2),lab:lab};
  if(label){const p=new T.Mesh(new T.PlaneGeometry(.24,.05),new T.MeshStandardMaterial({map:plaqueT(label),metalness:.55,roughness:.4}));const zf=(B.min.z+B.max.z)/2-sz*.042;p.position.copy(toSup(V(cx,31.18,zf))).sub(h.position);p.rotation.y=sz>0?PI:0;h.add(p);}
  CMD.doors.push(d);return d;}
 [-1,1].forEach(s=>{
  /* porta de ré da casa do leme → sala de cartas (bombordo) / sala de navegação (boreste) */
  hingeDoor(new T.Box3(V(68.205,29.5,s<0?-3.36:3.225),V(68.915,31.43,s<0?-3.225:3.37)),68.21,s*3.3,s,s<0?'CHART ROOM':'NAVIGATING ROOM',s<0?'Sala de cartas':'Sala de navegação');
  /* porta de vante da casa do leme → recanto e asa da ponte */
  hingeDoor(new T.Box3(V(69.325,29.6,s<0?-3.36:3.225),V(70.39,31.78,s<0?-3.225:3.37)),70.37,s*3.3,s,null,'Ponte e asa '+(s<0?'de bombordo':'de boreste'));});

 /* ---- equipamentos antigos da antepara de ré: os dois aparelhos do modelo e o quadro iluminado das portas estanques saem;
        entram quatro telefones e o relógio. O quadro de lâmpadas não tem base documental para 1912 ---- */
 const EQ=new T.Box3(V(68.03,29.95,-2.96),V(68.64,31.97,2.86)),trash=G();
 supAll.forEach(m=>{if(/^M_super_(4[789]|5[0-3]|5[67])$/.test(m.name||'')&&EQ.containsBox(rbox(m)))drop(m);});
 const EQF=new T.Box3(V(68.116,29.95,-2.96),V(68.7,32.16,1.55));supAll.forEach(m=>{if(!m.parent||!rbox(m).intersectsBox(EQF))return;splitMesh(m,allIn(EQF),trash);});
 const EQC=new T.Box3(V(68.0,29.9,-2.96),V(68.75,32.2,1.55));supAll.forEach(m=>{if(!m.parent||!rbox(m).intersectsBox(EQC))return;takeComps(m,c=>EQC.containsBox(c.b)&&(c.b.max.x>68.125||c.b.max.y-c.b.min.y<.6),trash);});
 trash.children.slice().forEach(drop);

 /* ---- quatro telefones (circuitos dedicados) na antepara de ré da casa do leme ---- */
 const pg=G(),mEb=M(0x161412,{roughness:.45,metalness:.2}),mBr=M(0xb89452,{metalness:.82,roughness:.33}),mWd=new T.MeshStandardMaterial({map:cmdMah,roughness:.5});
 ["FORECASTLE","CROW'S NEST","ENGINE ROOM","DOCKING BRIDGE"].forEach((nm,k)=>{const u=G();u.position.set(68.115,30.98,-2.55+k*.75);u.rotation.y=PI/2;pg.add(u);
  box(.25,.46,.025,mWd,0,0,.0125,u);box(.17,.21,.07,mEb,0,.03,.06,u);box(.18,.012,.075,mBr,0,.14,.06,u);box(.18,.012,.075,mBr,0,-.08,.06,u);
  const gn=G();gn.position.set(0,.19,.06);u.add(gn);[-.045,.045].forEach(o=>{const b=new T.Mesh(new T.SphereGeometry(.036,16,8,0,6.283,0,1.6),mBr);b.position.x=o;b.rotation.x=-PI/2;b.rotation.z=0;b.scale.y=.8;b.position.z=.01;gn.add(b);});
  const hm=G();hm.position.set(0,.19,.075);u.add(hm);cyl(.004,.004,.06,mBr,0,.0,0,hm,null,6);sph(.009,mBr,0,.03,0,hm);
  lathe([[0,0],[.016,0],[.02,.02],[.045,.07],[.048,.075],[0,.075]],mEb,0,.05,.1,u,16).rotation.x=PI/2;
  const rc=G();rc.position.set(-.115,.04,.07);u.add(rc);cyl(.016,.016,.15,mEb,0,-.07,0,rc,null,10);lathe([[0,0],[.03,0],[.032,.015],[.018,.03],[0,.03]],mEb,0,-.16,0,rc,14);cyl(.004,.004,.2,M(0x5a4a3a),.02,-.22,-.01,rc,null,5);
  box(.012,.04,.04,mBr,-.098,.05,.05,u);
  const pl=new T.Mesh(new T.PlaneGeometry(.21,.042),new T.MeshStandardMaterial({map:plateT2(nm,'#f3eee2','#151515'),roughness:.35}));pl.position.set(0,-.2,.027);u.add(pl);
  if(k===1){CMD.gong=gn;CMD.ham=hm;CMD.hook=rc;}});
 {const ck=G();ck.position.set(68.115,31.45,1.15);ck.rotation.y=PI/2;pg.add(ck);cyl(.15,.15,.05,mWd,0,0,.025,ck,'z',28);const rr=new T.Mesh(new T.TorusGeometry(.128,.012,8,32),mBr);rr.position.z=.052;ck.add(rr);const fc=new T.Mesh(new T.CircleGeometry(.122,32),new T.MeshStandardMaterial({map:cmdClock,roughness:.3}));fc.position.z=.051;ck.add(fc);}
 regItem(add('telefones',pg,{layer:'ext',clip:false}));

 /* ---- chave das portas estanques: alavanca única na ponte, na antepara de vante da casa do leme (lado de boreste) ---- */
 {const wg=G();wg.position.set(72.17,30.6,2.62);wg.rotation.y=PI/2;const mI=M(0x2c2a27,{metalness:.5,roughness:.55});
  box(.3,.42,.025,mI,0,0,.0125,wg);box(.22,.26,.085,mBr,0,-.03,.065,wg);
  const qd=new T.Mesh(new T.CircleGeometry(.1,28,0,PI),new T.MeshStandardMaterial({map:ctex(256,128,(c,w,h)=>{c.fillStyle='#e9e1c8';c.fillRect(0,0,w,h);c.fillStyle='#1b1b1b';c.font='700 24px Georgia';c.textAlign='center';c.fillText('OPEN',62,96);c.fillText('CLOSED',196,96);c.strokeStyle='#1b1b1b';c.lineWidth=3;c.beginPath();c.arc(128,128,120,PI,0);c.stroke();}),roughness:.4}));qd.position.set(0,.02,.109);wg.add(qd);
  const tp=new T.Mesh(new T.PlaneGeometry(.26,.05),new T.MeshStandardMaterial({map:plaqueT('WATERTIGHT DOORS'),metalness:.55,roughness:.4}));tp.position.set(0,.165,.028);wg.add(tp);
  const lv=G();lv.position.set(0,.02,.12);wg.add(lv);cyl(.018,.018,.02,mBr,0,0,0,lv,'z',14);box(.02,.15,.014,mBr,0,.075,.006,lv);const kn=sph(.022,M(0x111111,{roughness:.3}),0,.15,.01,lv);kn.scale.set(1,1.2,1);lv.rotation.z=CMD.wtd.a;CMD.wtd.lv=lv;
  regItem(add('wtd',wg,{layer:'ext',clip:false}));}

 /* ---- salas de cartas (bombordo) e de navegação (boreste), dentro da casa dos oficiais, atrás da casa do leme ---- */
 const rg=G(),mP=new T.MeshStandardMaterial({map:cmdPaint,roughness:.78}),mF=new T.MeshStandardMaterial({map:cmdLino,roughness:.62}),mCl=M(0xf4f1e8,{roughness:.9}),mSk=new T.MeshStandardMaterial({map:cmdTeak,roughness:.55}),mT2=new T.MeshStandardMaterial({map:cmdMah,roughness:.42});
 const slab=(x0,x1,y0,y1,z0,z1,m,p)=>{const b=new T.Mesh(new T.BoxGeometry(Math.abs(x1-x0),Math.abs(y1-y0),Math.abs(z1-z0)),m);b.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);(p||rg).add(b);return b;};
 [-1,1].forEach(s=>{const zi=s*3.4,zo=s*6.85,zw=s*6.09,zd=s*5.3,X0=64.4,X1=68.97,Z=v=>s*v,lo=Math.min(zi,zo),hi=Math.max(zi,zo);
  slab(X0,X1,Y0-.02,Y0,lo,hi,mF);slab(X0,X1,YC,YC+.03,lo,hi,mCl);for(let x=X0+.6;x<X1;x+=1.1)slab(x-.05,x+.05,YC-.09,YC,lo,hi,mCl);
  const w=.05,iz=zi+s*w/2,oz=zo-s*w/2;
  slab(X0,68.2,Y0,YC,iz-w/2,iz+w/2,mP);slab(68.92,X1,Y0,YC,iz-w/2,iz+w/2,mP);slab(68.2,68.92,31.43,YC,iz-w/2,iz+w/2,mP);
  slab(X0,X1,Y0,YC,oz-w/2,oz+w/2,mP);
  const wl=Math.min(zw-s*.37,zw+s*.37),wh=Math.max(zw-s*.37,zw+s*.37);slab(X1-w,X1,Y0,YC,lo,hi,mP);
  {const gl=new T.Mesh(new T.PlaneGeometry(wh-wl-.06,1.1),new T.MeshStandardMaterial({color:0xc9dcea,emissive:0x9db4c6,emissiveIntensity:.55,roughness:.15,metalness:.1}));gl.position.set(X1-w-.004,31.28,zw);gl.rotation.y=-PI/2;rg.add(gl);
   slab(X1-w-.03,X1-w,30.7,30.74,wl-.04,wh+.04,mSk);slab(X1-w-.03,X1-w,31.82,31.86,wl-.04,wh+.04,mSk);slab(X1-w-.03,X1-w,30.7,31.86,wl-.04,wl,mSk);slab(X1-w-.03,X1-w,30.7,31.86,wh,wh+.04,mSk);slab(X1-w-.025,X1-w,31.26,31.29,wl,wh,mSk);slab(X1-w-.1,X1-w,30.66,30.7,wl-.06,wh+.06,mSk);}
  const dl=Math.min(zd-s*.45,zd+s*.45),dh=Math.max(zd-s*.45,zd+s*.45);slab(X0,X0+w,Y0,YC,lo,dl,mP);slab(X0,X0+w,Y0,YC,dh,hi,mP);slab(X0,X0+w,31.62,YC,dl,dh,mP);
  /* rodapé e porta de ré (corredor dos oficiais / aposentos do comandante) */
  slab(X0,X1,Y0,Y0+.12,oz-s*.035,oz-s*.025,mSk);slab(X0,68.2,Y0,Y0+.12,iz+s*.025,iz+s*.035,mSk);
  const dr=new T.Mesh(new T.PlaneGeometry(.88,2.04),new T.MeshStandardMaterial({map:doorT,roughness:.6}));dr.position.set(X0+.03,Y0+1.02,zd);dr.rotation.y=PI/2;dr.userData.door=s<0?'radio':'capitao';rg.add(dr);
  const pq=new T.Mesh(new T.PlaneGeometry(.26,.054),new T.MeshStandardMaterial({map:plaqueT(s<0?"OFFICERS' QUARTERS":'CAPTAIN'),metalness:.55,roughness:.4}));pq.position.set(X0+.035,Y0+1.6,zd);pq.rotation.y=PI/2;pq.userData.door=dr.userData.door;rg.add(pq);
  sph(.03,mBrass,X0+.06,Y0+1.0,zd+s*.34,rg);
  CMD.lights.push(ceilLamp(66.7,YC-.01,Z(5.1),rg,.7,7));
  const f=G();f.position.set(0,Y0,0);rg.add(f);
  if(s<0){/* sala de cartas: mesa de cartas sob a janela, gaveteiro, cronômetros, dois relógios-mestre, livros de sinais */
   slab(68.12,68.95,.0,.88,-6.75,-5.15,mT2,f);slab(68.08,68.97,.88,.93,-6.79,-5.11,mT2,f);
   for(let r=0;r<5;r++)for(let q=0;q<2;q++){slab(68.105,68.115,.1+r*.155,.22+r*.155,-6.7+q*.8,-5.98+q*.8,mSk,f);slab(68.098,68.104,.155+r*.155,.168+r*.155,-6.4+q*.8,-6.28+q*.8,mBrass,f);}
   const ch=new T.Mesh(new T.PlaneGeometry(.78,1.25),new T.MeshStandardMaterial({map:cmdChart,roughness:.85}));ch.rotation.x=-PI/2;ch.rotation.z=PI/2;ch.position.set(68.52,.935,-5.95);f.add(ch);
   [[-6.2,.0],[-6.05,.04]].forEach(q=>{const r=slab(68.3,68.8,.936,.948,q[0]-.02,q[0]+.02,M(0x1a1a1a,{roughness:.3}),f);r.rotation.y=.15+q[1];});
   const dv=G();dv.position.set(68.35,.95,-5.55);f.add(dv);[-.25,.25].forEach(a=>{const c=cyl(.004,.004,.18,mBrass,0,0,0,dv,null,6);c.rotation.z=PI/2+a;c.rotation.y=.3;});
   const cb=G();cb.position.set(68.55,.93,-5.3);f.add(cb);box(.2,.13,.2,mT2,0,.065,0,cb);box(.16,.005,.16,M(0x1a1410),0,.131,0,cb);const cf=new T.Mesh(new T.CircleGeometry(.065,24),new T.MeshStandardMaterial({map:cmdClock,roughness:.3}));cf.rotation.x=-PI/2;cf.position.y=.134;cb.add(cf);
   [66.1,67.0].forEach(x=>{const c=G();c.position.set(x,1.62,-3.425);c.rotation.y=PI;f.add(c);box(.34,.46,.06,mT2,0,0,.03,c);const fc=new T.Mesh(new T.CircleGeometry(.12,28),new T.MeshStandardMaterial({map:cmdClock,roughness:.3}));fc.position.set(0,.06,.062);c.add(fc);const rr=new T.Mesh(new T.TorusGeometry(.124,.008,6,28),mBrass);rr.position.set(0,.06,.063);c.add(rr);const pl=new T.Mesh(new T.PlaneGeometry(.22,.04),new T.MeshStandardMaterial({map:plateT2('MASTER CLOCK','#d9bd75','#2a1a08'),metalness:.4,roughness:.4}));pl.position.set(0,-.15,.062);c.add(pl);});
   shelf(f,65.6,-6.6,0,1.4);chair(f,67.75,-5.95,-PI/2,0x5a2a1a);
  }else{/* sala de navegação: mesa de reunião, cadeiras, sofá de couro, barômetro, estante de cartas */
   stab(f,66.5,5.1,1.5,.95,0x5a2a18);[[66.05,4.4,0],[66.95,4.4,0],[66.5,5.85,PI]].forEach(q=>chair(f,q[0],q[1],q[2],0x3a2a1a));
   sofa(f,66.6,6.43,PI,0x3a2416,2.2);shelf(f,64.62,4.0,PI/2,1.2);
   const br=G();br.position.set(67.6,1.4,3.43);f.add(br);box(.12,.9,.04,mT2,0,0,.02,br);const bd=new T.Mesh(new T.CircleGeometry(.09,24),new T.MeshStandardMaterial({map:cmdClock,roughness:.3}));bd.position.set(0,.3,.045);br.add(bd);cyl(.012,.012,.55,M(0xd9d4c4,{roughness:.2}),0,-.12,.045,br,null,8);
   const cr=G();cr.position.set(68.55,0,5.0);f.add(cr);box(.7,.8,1.2,mT2,0,.4,0,cr);for(let i=0;i<6;i++)box(.68,.012,1.18,mSk,0,.1+i*.12,0,cr);}
 });
 regItem(add('interiorComando',rg,{ex:V(0,34.5,0),shell:true,layer:'super'}));
 CMD.lights.forEach(l=>l.visible=false);

 /* ---- pisos caminháveis: ponte (seguindo a curva da frente), asas e cabines das asas, recantos, casa do leme, portas e salas ---- */
 const W=WALK.ponte,y=29.62;W.surf=[[72.45,76.45,-4.5,4.5,y],[68.4,71.3,-3.1,3.1,y]];
 [-1,1].forEach(s=>{const R=(x0,x1,a,b)=>W.surf.push([x0,x1,s>0?a:-b,s>0?b:-a,y]);
  R(72.45,76.1,4.5,6.2);R(72.45,75.4,6.2,7.4);R(72.4,74.75,7.4,8.4);R(72.1,74.15,8.4,9.4);R(71.95,73.55,9.4,14.35);
  R(69.45,72.6,3.75,6.75);R(69.45,70.3,3.0,3.85);R(68.3,68.85,3.0,3.7);R(64.65,68.75,3.65,6.6);});
 W.doors=[{p:[64.42,y,-5.3],n:[1,0],t:'radio'},{p:[64.42,y,5.3],n:[1,0],t:'capitao'}];
 CMD.doors.push({room:true,c:V(64.45,Y0,-5.3),lab:'Corredor dos oficiais e sala Marconi'},{room:true,c:V(64.45,Y0,5.3),lab:'Aposentos do comandante'});

 /* ---- dica discreta perto de portas (substitui as placas grandes) ---- */
 const tip=document.createElement('div');tip.id='doorTip';tip.style.cssText='position:fixed;left:50%;bottom:132px;transform:translateX(-50%);padding:6px 12px;border-radius:8px;background:rgba(14,22,34,.72);color:#efe3c2;font:500 13px/1.2 Barlow,system-ui,sans-serif;letter-spacing:.03em;pointer-events:none;opacity:0;transition:opacity .35s;z-index:30';document.body.appendChild(tip);CMD.tip=tip;
})();

/* ---- gávea: chapa pintada com rebites e a portinha de acesso no mastro, logo abaixo do sino ---- */
(function(){if(!GL)return;const mg=items.find(i=>i.id==='mastro');if(!mg)return;const fm=mg.o.children[0]||mg.o;root.updateMatrixWorld(true);const inv=new T.Matrix4().copy(root.matrixWorld).invert();
 const nT=ctex(512,128,(c,w,h)=>{c.fillStyle='#ecebe5';c.fillRect(0,0,w,h);for(let x=0;x<w;x+=64){c.fillStyle='rgba(80,80,74,.45)';c.fillRect(x,0,3,h);c.fillStyle='rgba(255,255,255,.6)';c.fillRect(x+3,0,1,h);for(let y=6;y<h;y+=12){c.fillStyle='rgba(70,68,60,.7)';c.beginPath();c.arc(x+5,y,1.6,0,7);c.fill();}}c.fillStyle='rgba(70,70,64,.5)';c.fillRect(0,10,w,3);c.fillRect(0,h-12,w,3);c.fillStyle='rgba(60,58,52,.18)';c.fillRect(0,0,w,9);
  for(let i=0;i<40;i++){const x=Math.random()*w,l=10+Math.random()*50;const g=c.createLinearGradient(0,h-l,0,h);g.addColorStop(0,'rgba(120,80,40,0)');g.addColorStop(1,'rgba(120,80,40,.18)');c.fillStyle=g;c.fillRect(x,h-l,1+Math.random()*2,l);}},4,1);
 fm.traverse(m=>{if(!m.isMesh||m.name!=='M_mastF_3')return;const ge=m.geometry,p=ge.attributes.position,Mx=new T.Matrix4().multiplyMatrices(inv,m.matrixWorld),uv=new Float32Array(p.count*2),v=new T.Vector3(),dp=!p.normalized?1:(p.array instanceof Int16Array?32767:p.array instanceof Uint16Array?65535:p.array instanceof Int8Array?127:255);
  for(let i=0;i<p.count;i++){v.set(p.getX(i)/dp,p.getY(i)/dp,p.getZ(i)/dp).applyMatrix4(Mx);uv[i*2]=(Math.atan2(v.z,v.x-97.9)/6.283+.5);uv[i*2+1]=(v.y-36.1)/2;}
  ge.setAttribute('uv',new T.BufferAttribute(uv,2));const mt=m.material.clone();mt.color=new T.Color(0xffffff);mt.map=nT;mt.roughness=.7;m.material=mt;if(m.userData)m.userData.real=mt;});
 /* porta no mastro, na face de vante, ao nível do piso da gávea (o vigia subia pela escada interna) */
 const dg=G();dg.position.set(97.69,37.0,0);dg.rotation.z=.17;const mM=M(0xc9a66b,{roughness:.6}),mK=M(0x1c1a17,{roughness:.9});
 box(.02,1.5,.56,mK,.0,.75,0,dg);[[-.3],[.3]].forEach(q=>box(.035,1.58,.04,mM,.012,.77,q[0],dg));box(.035,.05,.64,mM,.012,1.55,0,dg);
 const lf=G();lf.position.set(.02,0,-.27);dg.add(lf);box(.02,1.46,.53,mM,.0,.74,.265,lf);[.3,1.2].forEach(y=>box(.012,.05,.12,M(0x3a3a38,{metalness:.6}),.012,y,.06,lf));sph(.022,mBrass,.03,.78,.47,lf);
 lf.rotation.y=.35;GLX.nestDoor=lf;regItem(add('portaGavea',dg,{layer:'ext',clip:false}));root.updateMatrixWorld(true);fm.updateMatrixWorld(true);fm.attach(dg);})();

/* ---- telefone da gávea e chave das portas estanques: som, animação e diálogo ---- */
function cmdTrill(n,f1,f2,rate,vol){const a=AC;if(!a)return null;try{const t=a.currentTime,o1=a.createOscillator(),o2=a.createOscillator(),lfo=a.createOscillator(),lg=a.createGain(),vca=a.createGain(),g=a.createGain(),bp=a.createBiquadFilter();
 o1.type='triangle';o1.frequency.value=f1;o2.type='square';o2.frequency.value=f2;lfo.type='square';lfo.frequency.value=rate;lg.gain.value=.5;vca.gain.value=.5;lfo.connect(lg);lg.connect(vca.gain);bp.type='bandpass';bp.frequency.value=2200;bp.Q.value=.8;
 o1.connect(vca);o2.connect(vca);vca.connect(bp);bp.connect(g);g.connect(out());g.gain.setValueAtTime(0,t);for(let k=0;k<n;k++){g.gain.setValueAtTime(vol,t+k*1.7);g.gain.setValueAtTime(vol,t+k*1.7+1.05);g.gain.linearRampToValueAtTime(0,t+k*1.7+1.1);}
 const end=t+n*1.7+.2;[o1,o2,lfo].forEach(o=>{o.start(t);o.stop(end);});return{g:g,stop(){try{const u=a.currentTime;g.gain.cancelScheduledValues(u);g.gain.setValueAtTime(g.gain.value,u);g.gain.linearRampToValueAtTime(0,u+.06);[o1,o2,lfo].forEach(o=>o.stop(u+.1));}catch(e){}}};}catch(e){return null;}}
function phoneRing(auto){if(!CMD.gong||CMD.call)return;ac();CMD.call=true;CMD.ring=1;CMD.ringT=performance.now();CMD.ringN=cmdTrill(4,1150,1390,24,.07);
 if(S.walk==='ponte'||S.tab==='gavea')flash('Telefone da gávea tocando na casa do leme — toque no aparelho CROW’S NEST para atender');
 if(auto)setTimeout(()=>{if(CMD.call)phoneAnswer(true);},1900);else setTimeout(()=>{if(CMD.call&&CMD.ring){CMD.ring=0;CMD.call=false;}},7600);}
function phoneAnswer(auto){if(!CMD.call){return false;}CMD.call=false;CMD.ring=0;if(CMD.ringN)CMD.ringN.stop();CMD.ringN=null;CMD.lift=performance.now();
 const L=['Fleet: “Is there anyone there?” — Há alguém aí?','Moody: “Yes. What do you see?” — Sim. O que você vê?','Fleet: “Iceberg right ahead!” — Iceberg bem à frente!','Moody: “Thank you.” — e avisa o primeiro oficial Murdoch.'];
 L.forEach((s,i)=>setTimeout(()=>flash(s),i*2300));return true;}
function wtdToggle(force){const W=CMD.wtd;if(force!==undefined&&W.closed===force)return;ac();W.closed=force!==undefined?force:!W.closed;W.tg=W.closed?-.62:.62;
 tone(95,.35,'sine',.16);tone(1400,.05,'square',.03,.02);if(W.closed){cmdTrill(1,880,1060,18,.05);setTimeout(()=>{tone(48,1.2,'sine',.14);tone(62,.9,'triangle',.06,.1);},1300);}
 if(force===undefined)flash(W.closed?'Chave em CLOSED: o eletroímã solta as portas estanques das salas de caldeiras e máquinas, que descem pelo próprio peso.':'Chave em OPEN: as portas só se reabrem à mão, no local.');}
function cmdReset(){if(CMD.ringN)CMD.ringN.stop();CMD.call=false;CMD.ring=0;CMD.wtd.closed=false;CMD.wtd.tg=.62;}
function cmdStep(dt){const now=performance.now(),k=Math.min(1,dt*7);
 /* portas: abrem com o visitante perto, fecham devagar quando ele se afasta */
 let tipS='';if(S.walk==='ponte'){CMD.doors.forEach(d=>{const r=Math.hypot(F.p.x-d.c.x,F.p.z-d.c.z);if(r<1.5&&d.lab)tipS=d.lab;if(d.h){const tg=r<1.55?d.open:(r>2.3?0:null);if(tg!==null)d.a+=(tg-d.a)*Math.min(1,dt*(tg?4:2.2));d.h.rotation.y=d.a;}});}
 else CMD.doors.forEach(d=>{if(d.h&&d.a){d.a+=(0-d.a)*k;d.h.rotation.y=d.a;}});
 if(CMD.tip&&tipS!==CMD.tipT){CMD.tipT=tipS;if(tipS)CMD.tip.textContent='Porta: '+tipS;CMD.tip.style.opacity=tipS?1:0;}
 const inR=S.walk==='ponte';CMD.lights.forEach(l=>{if(l.visible!==inR)l.visible=inR;});
 /* telefone tocando: martelo entre os gongos e o fone tremendo no gancho */
 if(CMD.ham){const ring=CMD.ring&&((now-CMD.ringT)%1700)<1050;CMD.ham.rotation.z=ring?.35*Math.sin(now*.16):CMD.ham.rotation.z*.8;CMD.gong.position.x=ring?.0015*Math.sin(now*.4):0;
  let ly=0,lz=0;if(ring){CMD.hook.rotation.z=.04*Math.sin(now*.09);}else CMD.hook.rotation.z*=.85;if(CMD.lift){const u=(now-CMD.lift)/1000;if(u<9.5){const e=Math.min(1,u/.5)*Math.min(1,(9.5-u)/.6);ly=.17*e;lz=.08*e;}else CMD.lift=0;}CMD.hook.position.y=.04+ly;CMD.hook.position.z=.07+lz;}
 const W=CMD.wtd;if(W.lv){W.a+=(W.tg-W.a)*Math.min(1,dt*6);W.lv.rotation.z=W.a;}
 if(GLX.nestDoor){const tg=S.nestOpen?1.55:.35;GLX.nestDoor.rotation.y+=(tg-GLX.nestDoor.rotation.y)*Math.min(1,dt*3);}
 /* luminárias das salas: escondidas quando se olha de cima de um cenário sem forro */
 if(S.visit&&!S.fp){LAMPS.forEach(f=>{f.getWorldPosition(_cmv);f.visible=cam.position.y<_cmv.y+.2;});}else if(LAMPS.length&&!LAMPS[0].visible)LAMPS.forEach(f=>f.visible=true);}
