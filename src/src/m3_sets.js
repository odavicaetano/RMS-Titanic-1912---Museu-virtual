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
function lamp(x,y,z,g,i,d){sph(.09,glow(0xffe2a0),x,y,z,g);const l=new T.PointLight(0xffdca0,i||.7,d||14,1.5);l.position.set(x,y,z);g.add(l);}
const baluGeo=new T.LatheGeometry([[.03,0],[.05,.05],[.025,.15],[.06,.42],[.025,.7],[.05,.84],[.03,.9]].map(q=>new T.Vector2(q[0],q[1])),8);
function balustrade(segs,g,mRail){const tr=[];segs.forEach(s=>{const a=V(s[0],s[1],s[2]),b=V(s[3],s[4],s[5]),len=a.distanceTo(b),n=Math.max(2,Math.round(len/.28));for(let i=0;i<=n;i++)tr.push(a.clone().lerp(b,i/n));
  const r=rod(a.clone().setY(a.y+.95),b.clone().setY(b.y+.95),.07,.07,mRail,g,8);part(r,'balaustrada');[a,b].forEach(p=>lathe([[.11,0],[.09,.1],[.07,1],[.12,1.06],[.1,1.16],[0,1.2]],mRail,p.x,p.y,p.z,g,10));});
 const im=new T.InstancedMesh(baluGeo,M(0x2a2118,{metalness:.6,roughness:.4}),tr.length),m4=new T.Matrix4();tr.forEach((p,i)=>{m4.makeTranslation(p.x,p.y,p.z);im.setMatrixAt(i,m4);});part(im,'balaustrada');g.add(im);}
function chairs(list,g,col){const s=new T.InstancedMesh(new T.BoxGeometry(.45,.08,.45),M(col),list.length),b=new T.InstancedMesh(new T.BoxGeometry(.45,.5,.06),M(col),list.length),l=new T.InstancedMesh(new T.BoxGeometry(.4,.45,.4),M(0x3a2414),list.length),m4=new T.Matrix4();
 list.forEach((p,i)=>{m4.makeTranslation(p[0],.47,p[1]);s.setMatrixAt(i,m4);m4.makeTranslation(p[0],.76,p[1]+(p[2]||0)*.22);b.setMatrixAt(i,m4);m4.makeTranslation(p[0],.22,p[1]);l.setMatrixAt(i,m4);});g.add(s,b,l);}
function teleg(x,z,g,key){const t=part(G(),'telegrafoP');lathe([[.26,0],[.12,.12],[.09,.95],[.17,1.05],[0,1.05]],mBrass,x,0,z,t,12);const dm=M(0xffffff,{map:dialTex()});cyl(.3,.3,.2,dm,x,1.3,z,t,'z',24);const h=G();h.position.set(x,1.3,z);box(.04,.5,.04,mBrass,0,.25,.13,h);sph(.05,M(0x3a2414),0,.52,.13,h);box(.04,.5,.04,mBrass,0,.25,-.13,h);t.add(h);g.add(t);(g.userData.handles=g.userData.handles||[]).push(h);}
const SETS={
escadaria:{n:'Grande Escadaria (1ª classe)',c:[-1,2.6,0],r:26,spawn:[5.4,0,1.2,PI/2+.1],build(g){
 const oak=mT(oakT,1,1),oakS=M(0x8a5a2e,{roughness:.55}),tread=M(0xa9753f,{roughness:.5});
 const f=new T.Mesh(new T.PlaneGeometry(16,18),mT(tileT,16,18));f.rotation.x=-PI/2;g.add(f);
 wall(18,6.3,mT(oakT,12,3),8,3.15,0,-PI/2,g);wall(18,6.3,mT(oakT,12,3),-8,3.15,0,PI/2,g);wall(16,6.3,mT(oakT,10,3),0,3.15,9,PI,g);wall(16,6.3,mT(oakT,10,3),0,3.15,-9,0,g);
 const cs=new T.Shape();cs.moveTo(-8,-9);cs.lineTo(8,-9);cs.lineTo(8,9);cs.lineTo(-8,9);cs.lineTo(-8,-9);const hp=new T.Path();hp.absarc(-1,0,4,0,PI*2,true);cs.holes.push(hp);const ce=new T.Mesh(new T.ShapeGeometry(cs,32),M(0xf2ecdc,{side:T.BackSide}));ce.rotation.x=-PI/2;ce.position.y=6.3;g.add(ce);
 const dm=part(new T.Mesh(new T.SphereGeometry(4,32,12,0,PI*2,0,PI/2),new T.MeshStandardMaterial({map:tx(domeT,2,1),side:DS,emissive:0xfff0c8,emissiveMap:tx(domeT,2,1),emissiveIntensity:.75})),'cupula');dm.scale.y=.55;dm.position.set(-1,6.3,0);g.add(dm);
 const ch=part(G(),'lustre');const tr=new T.Mesh(new T.TorusGeometry(.7,.05,8,24),mBrass);tr.rotation.x=PI/2;tr.position.set(-1,7,0);ch.add(tr);for(let i=0;i<12;i++)sph(.08,glow(0xffe9b0),-1+.7*Math.cos(i*PI/6),6.92,.7*Math.sin(i*PI/6),ch);sph(.3,glow(0xfff0c8,.8),-1,7.3,0,ch);g.add(ch);
 for(let i=0;i<9;i++){box(.5,(i+1)*.178,5,i%1?oakS:tread,1-(i+.5)*.5,(i+1)*.089,0,g);[-3.6,3.6].forEach(z=>box(.5,.22,1.8,tread,-3.5+(i+.5)*.5,1.6+(i+1)*.178-.11,z,g));}
 box(2,1.6,9,tread,-4.5,.8,0,g);[-1,1].forEach(s=>{const st=box(4.9,.5,.1,oakS,-1.25,2.2,s*2.72,g);st.rotation.z=.34;const s2=box(4.9,.5,.1,oakS,-1.25,2.2,s*4.5,g);s2.rotation.z=.34;});
 [[-6.75,0,2.5,18],[6.25,0,3.5,18],[-.5,6.8,10,4.4],[-.5,-6.8,10,4.4],[2.75,3.6,3.5,2],[2.75,-3.6,3.5,2]].forEach(r=>box(r[2],.25,r[3],oakS,r[0],3.075,r[1],g));
 const pn=part(new T.Mesh(new T.PlaneGeometry(3.4,1.6),new T.MeshStandardMaterial({map:clockT})),'relogio');pn.position.set(-5.47,2.4,0);pn.rotation.y=PI/2;g.add(pn);wall(9,1.6,mT(oakT,6,1),-5.49,2.4,0,PI/2,g);
 balustrade([[1,0,2.5,-3.5,1.6,2.5],[1,0,-2.5,-3.5,1.6,-2.5],[-3.5,1.6,2.72,1,3.2,2.72],[-3.5,1.6,-2.72,1,3.2,-2.72],[-5.5,3.2,-4.6,-5.5,3.2,4.6],[-5.5,3.2,4.6,1,3.2,4.6],[-5.5,3.2,-4.6,1,3.2,-4.6],[4.5,3.2,-2.6,4.5,3.2,2.6],[1,3.2,2.6,4.5,3.2,2.6],[1,3.2,-2.6,4.5,3.2,-2.6],[1,0,0,-3.5,1.6,0]],g,oakS);
 const q=part(G(),'querubim');lathe([[.2,0],[.16,.1],[.1,.9],[.18,1],[.16,1.1],[0,1.12]],M(0x6a4a2a,{metalness:.5}),1.25,0,0,q,12);const bd=sph(.085,M(0x8a6a3a,{metalness:.6,roughness:.4}),1.25,1.3,0,q);bd.scale.set(1,1.7,1);sph(.06,M(0x8a6a3a,{metalness:.6}),1.25,1.5,0,q);rod(V(1.25,1.38,0),V(1.33,1.62,.1),.012,.012,mBrass,q,6);sph(.05,glow(0xffe2a0),1.34,1.66,.1,q);g.add(q);
 [[4.5,2.6],[4.5,-2.6],[-5.5,4.6],[-5.5,-4.6],[1,4.6],[1,-4.6]].forEach(p=>{lathe([[.2,0],[.2,.25],[.14,.35],[.13,2.85],[.2,2.98],[.2,3.08]],oakS,p[0],0,p[1],g,14);});
 [-2.4,0,2.4].forEach(z=>{const d=part(new T.Mesh(new T.PlaneGeometry(1.6,2.3),new T.MeshStandardMaterial({map:grilleT})),'elevador');d.position.set(7.96,1.2,z);d.rotation.y=-PI/2;g.add(d);});
 [-6,6].forEach(z=>{const w=new T.Mesh(new T.PlaneGeometry(1.4,2.2),new T.MeshStandardMaterial({map:leadT,emissive:0xfff0c0,emissiveMap:leadT,emissiveIntensity:.6}));w.position.set(z>0?0:0,4.6,z>0?8.96:-8.96);w.rotation.y=z>0?PI:0;g.add(w);});
 lamp(-1,5.6,0,g,1.2,34);lamp(5,2.6,6,g,.5,16);lamp(5,2.6,-6,g,.5,16);lamp(-6.8,5.4,0,g,.5,16);},
 surf:[[-8,8,-9,9,0],[-3.5,1,-2.5,2.5,p=>1.6*(1-p.x)/4.5],[-5.5,-3.5,-4.5,4.5,1.6],[-3.5,1,2.7,4.5,p=>1.6+1.6*(p.x+3.5)/4.5],[-3.5,1,-4.5,-2.7,p=>1.6+1.6*(p.x+3.5)/4.5],[-8,-5.5,-9,9,3.2],[4.5,8,-9,9,3.2],[-5.5,4.5,4.6,9,3.2],[-5.5,4.5,-9,-4.6,3.2],[1,4.5,2.6,4.6,3.2],[1,4.5,-4.6,-2.6,3.2]]},
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
radio:{n:'Sala de rádio Marconi',c:[1.4,1.1,0],r:13,spawn:[-1.6,0,1,PI/2-.2],build(g){
 room(6,2.5,5,whiteT,linoT,g,0,0,true);room(3.2,2.5,5,whiteT,linoT,g,4.6,0,true);
 box(3,.06,.85,M(0x6e2f1c),0,.8,-2,g);box(2.9,.78,.8,M(0x5a2a18),0,.4,-2,g);
 const k=part(G(),'chaveMorse');box(.24,.03,.12,M(0x2a1c10),-.3,.85,-1.85,k);box(.2,.015,.03,mBrass,-.3,.9,-1.85,k);cyl(.03,.03,.04,M(0x111111),-.38,.93,-1.85,k);g.add(k);g.userData.key=k.children[1];
 const rc=part(G(),'receptor');box(.6,.26,.3,M(0x6e2f1c),.6,.96,-2.1,rc);[-.14,.14].forEach(o=>cyl(.1,.1,.04,mBrass,.6+o,1.1,-2.1,rc));box(.55,.4,.3,M(0x4a2c12),1.25,1.03,-2.1,rc);for(let i=0;i<3;i++)cyl(.04,.04,.05,mBrass,1.08+i*.17,1.05,-1.93,rc,'z');g.add(rc);
 const hp=part(G(),'fones');const hb2=new T.Mesh(new T.TorusGeometry(.1,.012,6,14,PI),mDark);hb2.position.set(-.9,.95,-1.9);hp.add(hb2);[-.1,.1].forEach(o=>cyl(.05,.05,.03,mDark,-.9+o,.92,-1.9,hp,'x'));g.add(hp);
 box(.3,.02,.22,M(0xf6f1e0),-.75,.84,-1.75,g);box(.3,.02,.22,M(0xf6f1e0),.1,.84,-1.7,g);cyl(.16,.16,.05,M(0xf3efe2),0,1.9,-2.46,g,'z',18);
 box(.45,.5,.45,M(0x3a2414),-.2,.25,-1.2,g);box(.45,.5,.06,M(0x3a2414),-.2,.7,-.98,g);box(1.9,.5,.8,M(0x5a2a18),-1.9,.25,2,g);box(1.9,.14,.8,M(0xe8e4d8),-1.9,.57,2,g);
 const t=part(G(),'transmissor');const disc=G();disc.position.set(4.6,1,-1.6);cyl(.34,.34,.05,mBrass,0,0,0,disc,'z',20);for(let i=0;i<8;i++)box(.05,.05,.1,mBright,.3*Math.cos(i*PI/4),.3*Math.sin(i*PI/4),0,disc);t.add(disc);g.userData.disc=disc;
 box(.9,.7,.6,M(0x2c4a3a),4.6,.36,-1.6,t);box(.9,.9,.5,M(0x4a2c12),5.6,.45,-1.9,t);const sp=sph(.07,glow(0x9fd8ff,0),4.6,1.38,-1.6,t);g.userData.spark=sp;const sl=new T.PointLight(0x9fd8ff,0,8);sl.position.set(4.6,1.4,-1.5);t.add(sl);g.userData.sparkL=sl;
 const jars=[];for(let i=0;i<12;i++)jars.push([3.5+(i%6)*.26,1.2+(i/6|0)*.3]);const ji=new T.InstancedMesh(new T.CylinderGeometry(.1,.1,.5,10),new T.MeshStandardMaterial({color:0x9fc3d6,transparent:true,opacity:.55}),12),m4=new T.Matrix4();jars.forEach((p,i)=>{m4.makeTranslation(p[0],.3,p[1]);ji.setMatrixAt(i,m4);});t.add(ji);
 box(.08,1.3,1.6,M(0xd9d4c4),6.14,1.4,.6,t);for(let i=0;i<4;i++)cyl(.12,.12,.05,mBrass,6.08,1.1+(i>>1)*.5,.25+(i%2)*.7,t,'x',14);g.add(t);
 lamp(0,2.2,0,g,.8,10);lamp(4.6,2.2,0,g,.5,8);},
 surf:[[-2.8,2.8,-1.4,2.3,0],[2.8,6,-1,2.3,0]]},
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
