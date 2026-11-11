(function(){'use strict';
/* ===== MÓDULO 1 — núcleo, texturas, forma do casco, exterior ===== */
const T=THREE,$=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s),V=(x,y,z)=>new T.Vector3(x,y,z),PI=Math.PI;
const cv=$('#c');let R;
try{R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});}
catch(e){$('#load').innerHTML='WEBGL INDISPONÍVEL<br><br>Este navegador não conseguiu iniciar a renderização 3D.';return;}
R.setPixelRatio(Math.min(window.devicePixelRatio||1,2));R.outputEncoding=T.sRGBEncoding;R.localClippingEnabled=true;
const scene=new T.Scene(),cam=new T.PerspectiveCamera(40,1,.5,9000),root=new T.Group(),setsG=new T.Group();scene.add(root,setsG);
const hemi=new T.HemisphereLight(0xd6e6ff,0x2a3440,.95);scene.add(hemi);
const sun=new T.DirectionalLight(0xfff2dd,1.0);sun.position.set(160,220,180);scene.add(sun);
const fillL=new T.DirectionalLight(0x88aaff,.35);fillL.position.set(-140,80,-160);scene.add(fillL);
const clip=new T.Plane(V(0,0,-1),1e4),CLIP=[clip],NOCLIP=[];
function ctex(w,h,fn,rx,ry){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rx||1,ry||1);t.anisotropy=4;return t;}
function M(color,o){return new T.MeshStandardMaterial(Object.assign({color:color,roughness:.72,metalness:.15},o||{}));}
const G=()=>new T.Group(),DS=T.DoubleSide;
function box(w,h,d,m,x,y,z,p){const b=new T.Mesh(new T.BoxGeometry(w,h,d),m);b.position.set(x||0,y||0,z||0);if(p)p.add(b);return b;}
function cyl(rt,rb,h,m,x,y,z,p,ax,seg){const b=new T.Mesh(new T.CylinderGeometry(rt,rb,h,seg||18),m);b.position.set(x||0,y||0,z||0);if(ax==='x')b.rotation.z=PI/2;if(ax==='z')b.rotation.x=PI/2;if(p)p.add(b);return b;}
function sph(r,m,x,y,z,p){const b=new T.Mesh(new T.SphereGeometry(r,14,10),m);b.position.set(x,y,z);if(p)p.add(b);return b;}
function rod(a,b,r1,r2,m,p,seg){const d=b.clone().sub(a),o=new T.Mesh(new T.CylinderGeometry(r2,r1,d.length(),seg||10),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());if(p)p.add(o);return o;}
function pipe(pts,r,m,p){for(let i=0;i<pts.length-1;i++){rod(pts[i],pts[i+1],r,r,m,p,10);if(i>0)sph(r*1.05,m,pts[i].x,pts[i].y,pts[i].z,p);}}
function lathe(pts,m,x,y,z,p,seg){const o=new T.Mesh(new T.LatheGeometry(pts.map(q=>new T.Vector2(q[0],q[1])),seg||16),m);o.position.set(x||0,y||0,z||0);if(p)p.add(o);return o;}
function lines(arr,color,p){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(arr,3));const l=new T.LineSegments(g,new T.LineBasicMaterial({color:color,transparent:true,opacity:.8}));l.userData.rc=color;if(p)p.add(l);return l;}
function part(o,id){o.userData.part=id;return o;}
const items=[];
function add(id,o,opt){opt=opt||{};o.userData.part=id;root.add(o);const it={o:o,id:id,ex:opt.ex||V(0,0,0),clip:opt.clip!==false,shell:!!opt.shell,layer:opt.layer||'int',deck:opt.deck||null,base:o.position.clone()};items.push(it);return it;}

/* ---------- texturas ---------- */
const plankT=ctex(256,256,(c,w,h)=>{c.fillStyle='#b9945f';c.fillRect(0,0,w,h);for(let i=0;i<16;i++){c.fillStyle='rgba('+(150+Math.random()*40|0)+','+(112+Math.random()*30|0)+',72,.35)';c.fillRect(0,i*16,w,15);c.fillStyle='rgba(40,25,10,.5)';c.fillRect(0,i*16+15,w,1);c.fillRect((i*97)%w,i*16,1,16);}});
const L=269,XH=134.5,HB=14.1,WL=10.5,TH=26;
const DY={T:1.6,O:5.2,G:8,F:10.6,E:13.2,D:15.9,C:18.6,B:21.3,A:24.1,BT:26.9};
function wins(c,sx,sy,em){const px=x=>(x+XH)*sx,py=y=>(TH-y)*sy;
 [[12,-110,112],[14.6,-116,118],[17.3,-122,124],[19.9,-126,123]].forEach(r=>{for(let x=r[1];x<=r[2];x+=3){if(em){if(Math.random()<.3)continue;c.fillStyle='#ffd58a';c.beginPath();c.ellipse(px(x),py(r[0]),.3*sx,.3*sy,0,0,7);c.fill();}
  else{c.fillStyle=r[0]>18.8?'#8f7a4a':'#c9a85a';c.beginPath();c.ellipse(px(x),py(r[0]),.34*sx,.34*sy,0,0,7);c.fill();c.fillStyle='#0b1422';c.beginPath();c.ellipse(px(x),py(r[0]),.23*sx,.23*sy,0,0,7);c.fill();}}});
 for(let x=-76;x<=71;x+=2.6){if(em){if(Math.random()<.25)continue;c.fillStyle='#ffd58a';}else{c.fillStyle='#6d5a38';c.fillRect(px(x)-.55*sx,py(23.4),1.1*sx,1.4*sy);c.fillStyle='#14263a';}c.fillRect(px(x)-.45*sx,py(23.3),.9*sx,1.2*sy);}}
function hullTex(mir){return ctex(4096,512,(c,w,h)=>{const sx=w/L,sy=h/TH,py=y=>(TH-y)*sy,px=x=>(x+XH)*sx;
 c.fillStyle='#f1eee4';c.fillRect(0,0,w,h);c.fillStyle='#d2a437';c.fillRect(0,py(18.85),w,py(18.6)-py(18.85));c.fillStyle='#15171b';c.fillRect(0,py(18.6),w,h);c.fillStyle='#7a2a1e';c.fillRect(0,py(WL),w,h);
 for(let i=0;i<1600;i++){c.fillStyle='rgba(255,255,255,'+(Math.random()*.03)+')';c.fillRect(Math.random()*w,py(18.6)+Math.random()*(h-py(18.6)),1,8+Math.random()*40);}
 for(let s=0;s<13;s++){const y=py(s*1.5);if(y<py(18.6))break;c.fillStyle='rgba(255,255,255,.08)';c.fillRect(0,y,w,1);c.fillStyle='rgba(0,0,0,.3)';c.fillRect(0,y+1,w,1);c.fillStyle='rgba(255,255,255,.15)';for(let x=0;x<w;x+=5)c.fillRect(x,y-3,1,1);
  for(let x=(s%2)*60;x<w;x+=120){c.fillStyle='rgba(255,255,255,.07)';c.fillRect(x,y-29,1,29);}}
 wins(c,sx,sy,false);
 c.save();c.translate(px(121),py(17.6));c.scale(mir?-.78:.78,1);c.fillStyle='#d9b24a';c.font='700 13px Georgia,serif';c.textAlign='center';c.fillText('T I T A N I C',0,0);c.restore();
 c.save();c.translate(px(-128.5),py(17.2));c.scale(mir?-.6:.6,1);c.fillStyle='#d9b24a';c.font='700 9px Georgia,serif';c.textAlign='center';c.fillText('TITANIC',0,0);c.fillText('LIVERPOOL',0,10);c.restore();});}
const hullEm=ctex(2048,256,(c,w,h)=>{c.fillStyle='#000';c.fillRect(0,0,w,h);wins(c,w/L,h/TH,true);});
function houseTex(n,em){return ctex(64,64,(c,w,h)=>{if(em){c.fillStyle='#000';c.fillRect(0,0,w,h);c.fillStyle='#ffd58a';c.fillRect(22,18,20,22);return;}c.fillStyle='#efece2';c.fillRect(0,0,w,h);c.fillStyle='rgba(0,0,0,.1)';c.fillRect(0,0,1,h);c.fillRect(0,h-3,w,3);c.fillStyle='#8a6a3a';c.fillRect(20,16,24,26);c.fillStyle='#14263a';c.fillRect(22,18,20,22);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(22,18,20,3);},n,1);}
function mHouse(n){return M(0xffffff,{map:houseTex(n),emissive:0xffffff,emissiveMap:houseTex(n,true),emissiveIntensity:0});}
const funnelT=ctex(32,256,(c,w,h)=>{c.fillStyle='#c9a25f';c.fillRect(0,0,w,h);c.fillStyle='#101010';c.fillRect(0,0,w,h*.22);c.fillStyle='rgba(0,0,0,.25)';[.45,.68,.9].forEach(k=>c.fillRect(0,h*k,w,2));});
const plateT=ctex(64,64,(c,w,h)=>{c.fillStyle='#4a4f55';c.fillRect(0,0,w,h);c.strokeStyle='rgba(255,255,255,.18)';for(let i=-64;i<128;i+=8){c.beginPath();c.moveTo(i,0);c.lineTo(i+64,64);c.stroke();c.beginPath();c.moveTo(i+64,0);c.lineTo(i,64);c.stroke();}},8,6);
const dotT=ctex(64,64,(c)=>{const g=c.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.4,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,64,64);});
function dialTex(){return ctex(256,256,(c,w,h)=>{c.fillStyle='#caa25a';c.beginPath();c.arc(128,128,126,0,7);c.fill();c.fillStyle='#f4f0e2';c.beginPath();c.arc(128,128,112,0,7);c.fill();c.strokeStyle='#222';c.lineWidth=2;for(let i=0;i<9;i++){const a=-PI/2+(i-4)*.62;c.beginPath();c.moveTo(128+50*Math.cos(a-.31),128+50*Math.sin(a-.31));c.lineTo(128+112*Math.cos(a-.31),128+112*Math.sin(a-.31));c.stroke();c.fillStyle=i<4?'#8a1a12':i===4?'#111':'#123';c.font='700 11px Arial';c.textAlign='center';c.fillText(['FULL','HALF','SLOW','D.SLOW','STOP','D.SLOW','SLOW','HALF','FULL'][i],128+84*Math.cos(a),132+84*Math.sin(a));}c.fillStyle='#8a1a12';c.fillText('ASTERN',70,150);c.fillStyle='#123';c.fillText('AHEAD',186,150);});}

/* ---------- forma do casco ---------- */
const U=x=>(x+XH)/L;
const sst=(x,a,b)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
function dHalf(u){if(u>.72){const s=(u-.72)/.28;return Math.max(0,1-Math.pow(s,2.1));}if(u<.14){const s=(.14-u)/.14;return Math.pow(Math.max(0,1-Math.pow(s,2.6)),.55);}return 1;}
let HTB=null;const HT={"ys":[1.2,3,5,8,10.5,14,18,21.5],"tab":[[0,0,0.04,0.53,0.4,1.0,1.72,2.09,2.56,3.11,4.35,5.33,6.4,7.37,8.08,9.24,10.35,11.3,11.38,11.48,12.25,12.28,12.32,12.36,12.39,12.43,12.46,12.52,12.64,12.65,12.65,12.64,12.67,12.71,12.74,12.77,12.81,12.61,12.61,12.3,11.67,10.29,9.14,8.19,6.19,5.04,3.83,2.94,2.22,1.75,0.56,0,0,0,0],[0,0,0.11,0.44,1.05,4.0,7.23,7.33,7.41,7.5,7.58,8.44,9.39,10.3,11.21,12.12,12.8,13.26,13.31,13.37,13.42,13.48,13.55,13.61,13.69,13.75,13.8,13.84,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.75,13.18,12.22,11.06,9.52,7.95,6.67,5.46,4.41,3.44,2.16,0.98,0.18,0,0],[0,0,0.15,0.43,1.35,3.0,4.41,5.03,6.25,7.62,8.82,9.78,10.74,11.5,12.2,12.83,13.27,13.5,13.54,13.58,13.62,13.66,13.7,13.75,13.79,13.83,13.84,13.86,13.87,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.54,12.91,12.18,10.54,9.21,7.84,6.78,5.56,4.23,3.01,1.97,0.81,0.28,0],[0,0,0.2,0.92,1.99,3.69,5.28,6.41,7.74,9.07,10.08,11.09,11.85,12.33,12.84,13.17,13.4,13.61,13.65,13.69,13.73,13.76,13.78,13.79,13.81,13.83,13.84,13.86,13.87,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.82,13.26,12.69,11.3,10.22,8.99,7.78,6.42,5.02,3.78,2.4,1.39,0.5,0],[0,0,0.12,1.01,2.91,4.64,6.46,7.67,8.8,10.03,11.2,11.81,12.38,12.79,13.03,13.36,13.56,13.7,13.71,13.73,13.75,13.76,13.78,13.79,13.81,13.83,13.84,13.86,13.87,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.54,12.97,11.72,10.65,9.6,8.43,6.96,5.66,4.32,2.97,1.71,0.74,0],[0,0,0,1.74,4.32,6.6,8.64,9.62,10.59,11.47,12.2,12.73,12.93,13.13,13.29,13.57,13.64,13.7,13.76,13.76,13.76,13.76,13.78,13.8,13.81,13.83,13.84,13.86,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.7,13.2,12.31,11.4,10.4,9.42,8.17,6.78,5.25,3.73,2.29,1.03,0],[0,0,0,5.15,8.36,10.23,11.11,11.59,12.15,12.44,12.76,13.09,13.22,13.35,13.48,13.57,13.64,13.7,13.75,13.81,13.83,13.83,13.83,13.83,13.83,13.83,13.84,13.86,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.89,13.89,13.88,13.88,13.88,13.88,13.88,13.7,13.43,12.71,11.99,11.49,10.68,9.69,8.35,6.67,5,3.31,1.59,0.01],[0,0,7.98,9.92,10.85,11.58,11.95,12.29,12.51,12.72,12.94,13.1,13.21,13.36,13.46,13.59,13.65,13.7,13.76,13.81,13.86,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.88,13.74,13.39,13.03,12.48,12.04,11.57,10.8,9.78,8.32,6.7,4.51,2.68,0.21]],"yb":[28,22.4,19,12,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.5,8]};
function htS(a,x){const k=Math.max(0,Math.min(53.999,(x+135)/5)),i=k|0;return a[i]+(a[i+1]-a[i])*(k-i);}
function yBot(u){if(HTB)return htS(HT.yb,u*L-XH);if(u<.12)return 10*Math.pow((.12-u)/.12,1.2);if(u>.99)return 1.5*Math.pow((u-.99)/.01,2);return 0;}
function yTop(u){const x=u*L-XH,mid=sst(x,-80,-78.5)*(1-sst(x,73.5,75)),fo=sst(x,93.5,95),af=1-sst(x,-104.5,-103);return 19.7+4.4*mid+1.6*fo+1.6*af+1.3*Math.pow(Math.max(0,(x-95)/40),2);}
function nFull(u){const k=Math.max(0,Math.min(u/.3,(1-u)/.35,1)),s=k*k*(3-2*k);return 1.5+3.7*s;}
function hb(x,y){if(HTB){if(y<htS(HT.yb,x)-.01)return 0;const ys=HT.ys;let f=1;if(y<ys[0]){f=Math.sqrt(Math.max(0,y)/ys[0]);y=ys[0];}y=Math.min(y,ys[ys.length-1]);let j=0;while(j<ys.length-2&&y>ys[j+1])j++;const t=(y-ys[j])/(ys[j+1]-ys[j]);return Math.max(.1,(htS(HT.tab[j],x)*(1-t)+htS(HT.tab[j+1],x)*t)*f-.5);}const u=U(x);if(u<0||u>1)return 0;const b=yBot(u);if(y<b)return 0;const tt=Math.min(1,(y-b)/(21.3-b)),n=nFull(u);return Math.max(.1,HB*dHalf(u)*Math.pow(1-Math.pow(1-tt,n),1/n));}
function hullGeo(side){const NS=240,NV=26,pos=[],uv=[],idx=[];
 for(let i=0;i<=NS;i++){const u=i/NS,x=u*L-XH,b=yBot(u),t=yTop(u);for(let j=0;j<=NV;j++){const y=b+(t-b)*Math.pow(j/NV,1.6);pos.push(x,y,side*hb(x,y));uv.push(u,y/TH);}}
 for(let i=0;i<NS;i++)for(let j=0;j<NV;j++){const a=i*(NV+1)+j,b=a+NV+1,c=a+1,d=b+1;if(side>0)idx.push(a,b,c,b,d,c);else idx.push(a,c,b,b,c,d);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
function hullLines(side){const a=[];for(let x=-125;x<=130;x+=15){let py=null,pz;for(let j=0;j<=18;j++){const u=U(x),y=yBot(u)+(yTop(u)-yBot(u))*Math.pow(j/18,1.6),z=side*(hb(x,y)+.04);if(py!==null)a.push(x,py,pz,x,y,z);py=y;pz=z;}}
 [3,6.5,10.5,14.5,18.6].forEach(y=>{let px=null,pz;for(let x=-134;x<=134.5;x+=2.5){const h=hb(x,y);if(h<=.11){px=null;continue;}const z=side*(h+.04);if(px!==null)a.push(px,y,pz,x,y,z);px=x;pz=z;}});return a;}
function deckGeo(y,x0,x1,zin){const pos=[],uv=[],idx=[];let n=0;const st=2.5,strips=zin?[-1,1]:[0];
 strips.forEach(s=>{const base=n;let k=0;for(let x=x0;x<=x1+.01;x+=st){let zo=Math.max(.02,hb(x,y)-.08),za,zb;if(s===0){za=-zo;zb=zo;}else{zo=Math.max(zo,zin);za=s*zin;zb=s*zo;}pos.push(x,y,za,x,y,zb);uv.push(x/4,za/4,x/4,zb/4);n+=2;if(k>0){const a=base+(k-1)*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}k++;}});
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
function bulkGeo(x,top){const pos=[],idx=[],b=yBot(U(x));for(let j=0;j<=14;j++){const y=b+(top-b)*Math.pow(j/14,1.5),z=hb(x,y)-.06;pos.push(x,y,-z,x,y,z);if(j>0){const a=(j-1)*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;}
function frameGeo(){const pos=[],idx=[];let n=0;for(let x=-126;x<=128;x+=6){const u=U(x),b=yBot(u),t=Math.min(yTop(u),21.3)-.3;[-1,1].forEach(s=>{for(let j=0;j<=14;j++){const y=b+(t-b)*Math.pow(j/14,1.6),z=hb(x,y)-.05,zi=Math.max(0,z-.6-(j<3?1.5:0));pos.push(x,y,s*z,x,y+(j<3?1.1:0),s*zi);if(j>0){const a=n-2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}n+=2;}});}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;}

/* ---------- materiais ---------- */
const mSteel=M(0x9aa19f,{side:DS}),mIron=M(0x33383c,{metalness:.5,roughness:.55}),mIronG=M(0x3c4a44,{metalness:.45,roughness:.6,side:DS}),mBright=M(0xc9ced2,{metalness:.85,roughness:.3}),
 mBrass=M(0xcaa25a,{metalness:.8,roughness:.35}),mBronze=M(0xb18a4c,{metalness:.8,roughness:.4}),mWhite=M(0xefece2),mWood=M(0xffffff,{map:plankT}),mWoodD=M(0xffffff,{map:plankT,side:DS}),mDeckS=M(0x6e7477,{side:DS}),
 mRed=M(0x7b4a3a,{side:DS}),mCoal=M(0x18181a,{roughness:1,flatShading:true}),mDark=M(0x1d2024),mBuff=M(0xc9a25f),mSpar=M(0xb9905a);

/* ================= NAVIO ÚNICO: modelo GLB (Renan_1912, CC BY 4.0), dividido em partes articuladas ================= */
function rail(x0,x1,z,y,arr){for(let k=1;k<=3;k++)arr.push(x0,y+k*.36,z,x1,y+k*.36,z);for(let x=x0;x<=x1+.01;x+=3)arr.push(x,y,z,x,y+1.08,z);}
let FX=[47,12,-22,-56],NEST=V(87.25,38.55,0),rudder;const funnelTops=[],props=[],GLX={};
function loadShip(cb){const ld=$('#load');let done=false;const fin=g=>{if(done)return;done=true;cb(g);};
 if(!T.GLTFLoader||typeof MeshoptDecoder==='undefined'){fin(null);return;}
 ld.innerHTML='CARREGANDO O NAVIO…<br><span style="opacity:.6;font-size:10px">modelo 3D · cerca de 14 MB</span>';
 const cib=window.createImageBitmap;try{window.createImageBitmap=undefined;}catch(e){}const rst=()=>{try{window.createImageBitmap=cib;}catch(e){}};
 const sc=document.createElement('script');sc.src='assets/models/titanic_glb.js';sc.async=true;sc.onerror=()=>{rst();fin(null);};
 sc.onload=()=>{try{ld.innerHTML='MONTANDO O NAVIO…';const s=atob(window.TITANIC_GLB_B64||'');window.TITANIC_GLB_B64=null;const n=s.length,u=new Uint8Array(n);for(let q=0;q<n;q++)u[q]=s.charCodeAt(q);const Ld=new T.GLTFLoader();Ld.setMeshoptDecoder(MeshoptDecoder);
   Ld.parse(u.buffer,'',g=>{rst();setTimeout(()=>fin(g.scene),30);},()=>{rst();fin(null);});}catch(e){rst();fin(null);}};
 setTimeout(()=>fin(null),150000);document.head.appendChild(sc);}
function shipFromGLB(o){HTB=true;const w=new T.Group();w.add(o);o.updateMatrixWorld(true);const b=new T.Box3().setFromObject(o),sz=b.getSize(new T.Vector3()),s=269.1/sz.x,c=b.getCenter(new T.Vector3());
 w.scale.setScalar(s);w.position.set(-c.x*s,-b.min.y*s,-c.z*s);w.updateMatrixWorld(true);
 const lm=new T.LineBasicMaterial({color:0x9bd8ff,transparent:true,opacity:.4});
 /* posições quantizadas → Float32, para que toque/seleção (raycast) funcionem */
 o.traverse(m=>{const ge=m.geometry,p=ge&&ge.attributes.position;if(!p||(p.array instanceof Float32Array&&!p.normalized&&!p.isInterleavedBufferAttribute))return;const A=p.isInterleavedBufferAttribute?p.data.array:p.array,k=p.normalized?(A instanceof Int16Array?1/32767:A instanceof Int8Array?1/127:A instanceof Uint16Array?1/65535:A instanceof Uint8Array?1/255:1):1,n=p.count,f=new Float32Array(n*3);for(let i=0;i<n;i++){f[i*3]=p.getX(i)*k;f[i*3+1]=p.getY(i)*k;f[i*3+2]=p.getZ(i)*k;}ge.setAttribute('position',new T.BufferAttribute(f,3));ge.computeBoundingSphere();});
 o.traverse(m=>{if(m.isLineSegments||m.isLine){m.material=lm.clone();m.userData.bpOnly=true;m.userData.rc=0x9bd8ff;m.visible=false;return;}
  if(m.isMesh){m.userData.noEdge=true;const mm=m.material,nm=mm.name||'';if(nm==='material'||nm==='0134_DimGray'||/glass/i.test(nm)){mm.userData.win=true;mm.userData.ec=[1,.82,.5];mm.emissive=new T.Color(1,.82,.5);mm.emissiveIntensity=0;if(nm==='0134_DimGray')mm.color.multiplyScalar(.5);}
   else if(mm.color&&!mm.map){const cc=mm.color,l=(cc.r+cc.g+cc.b)/3;if(Math.abs(cc.r-cc.g)<.04&&Math.abs(cc.g-cc.b)<.04&&l>.1&&l<.45)cc.multiplyScalar(.27);else if(l>.85)cc.multiplyScalar(.9);}}});
 const N=k=>o.getObjectByName('G_'+k),put=(g,k)=>{const n=N(k);if(n){g.updateMatrixWorld(true);g.attach(n);}return g;};
 const mkI=(id,k,pos,opt)=>{const g=G();if(pos)g.position.copy(pos);const it=add(id,g,opt);put(g,k);return it;};
 mkI('casco','hullP',null,{ex:V(0,0,-46),shell:true,layer:'casco'});mkI('casco','hullS',null,{ex:V(0,0,46),shell:true,layer:'casco'});
 mkI('superestrutura','super',null,{ex:V(0,34.5,0),shell:true,layer:'super'});
 {const g=G();add('bote',g,{ex:V(0,48,0),shell:true,layer:'super'});GLX.boats=[];for(let i=0;i<16;i++){const n=N('boat'+i);if(n){n.traverse(m=>{if(m.isMesh){const c=m.material.clone();c.userData.win=false;if(c.emissive){c.emissive.setRGB(0,0,0);c.emissiveIntensity=1;}m.material=c;}});put(g,'boat'+i);}GLX.boats.push(n||null);}}
 FX=[61,27.5,-6.5,-40.5];[55.3,21,-13,-47].forEach((tx,i)=>{const it=mkI(i<3?'chamine':'chamine4','fun'+(i+1),V(FX[i],34.3,0),{ex:V(0,56,0),shell:true,layer:'super'});it.r0=0;funnelTops.push(V(tx,50.6,0));});
 {const g=G(),it=add('mastro',g,{ex:V(0,26,0),shell:true,layer:'super'});it.r0=0;[['mastF',98.9],['mastM',-78.4]].forEach(q=>{const p=G();p.position.set(q[1],24.3,0);g.add(p);put(p,q[0]);});const rg=G();g.add(rg);put(rg,'rig');add('antena',G(),{shell:true,layer:'super'});}
 {const g=G();add('helice',g,{ex:V(-12,-28,0),layer:'ext',clip:false});[['propP',-110.123,3.162,-6.449,-1,1,[.9999,-.0093,-.0143]],['propS',-110.123,3.164,6.464,1,1,[.9999,-.0094,.0142]],['propC',-118.417,3.631,.008,1,2.2,[1,0,0]]].forEach(q=>{const o=G(),p=G();o.position.set(q[1],q[2],q[3]);o.quaternion.setFromUnitVectors(V(1,0,0),V(q[6][0],q[6][1],q[6][2]).normalize());o.add(p);g.add(o);put(p,q[0]);props.push({o:p,s:q[4],k:q[5]});});}
 rudder=G();rudder.position.set(-121.15,0,0);add('leme',rudder,{ex:V(-16,-8,0),layer:'ext',clip:false});put(rudder,'rudder');
 NEST=V(97.9,37.4,0);
 {const g=G();g.position.set(75.711,30.42,.01);add('timao',g,{ex:V(0,34.5,0),shell:true,layer:'super'});put(g,'wheel');GLX.wheel=g;}
 GLX.telH=[[76.311,2.3855],[76.310,-2.6945],[76.309,-1.5675],[75.979,3.7085],[75.979,-3.696]].map((q,k)=>{const g=G();g.position.set(q[0],30.62,q[1]);add('telegrafoP',g,{ex:V(0,34.5,0),shell:true,layer:'super'});put(g,'telH'+k);return g;});
 /* detalhes interativos presos ao navio: sino da gávea, corda do apito, luzes */
 {const g=G();g.position.set(97.3,39.75,.42);lathe([[.0,0],[.05,-.02],[.09,-.1],[.11,-.24],[.17,-.36],[.19,-.38],[.0,-.38]],mBrass,0,0,0,g,14);sph(.035,mDark,0,-.36,0,g);cyl(.02,.02,.5,mDark,.25,0,0,g,'x');add('sino',g,{layer:'ext',clip:false});GLX.bell=g;}
 {const g=G();g.position.set(75.45,32.08,.85);cyl(.012,.012,.62,M(0xd9cfb4),0,-.31,0,g,null,6);lathe([[.0,0],[.035,-.02],[.04,-.12],[.0,-.14]],M(0x6e2f1c),0,-.62,0,g,10);const hit=sph(.16,new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),0,-.55,0,g);add('apito',g,{layer:'ext',clip:false});GLX.cord=g;}
 {const g=G(),lm2=c=>new T.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.25});sph(.16,lm2(0xfff2cc),96.6,44.6,0,g);sph(.14,lm2(0xfff2cc),-134.2,26.6,0,g);sph(.14,lm2(0x30ff70),72.6,30.4,15.1,g);sph(.14,lm2(0xff4030),72.6,30.4,-15.1,g);add('luzes',g,{layer:'super',clip:false});GLX.nav=g.children.map(x=>x.material);}
 GLX.deckL=[[62,37,0],[24,37,0],[-12,37,0],[-48,37,0],[-98,30,0],[108,30,0]].map(p=>{const l=new T.PointLight(0xffd9a0,0,60,1.4);l.position.set(p[0],p[1],p[2]);root.add(l);return l;});
 GLX.puff=[];{const sm=new T.SpriteMaterial({map:dotT,color:0xffffff,transparent:true,opacity:0,depthWrite:false});for(let i=0;i<10;i++){const sp=new T.Sprite(sm.clone());sp.visible=false;sp.userData={l:1,f:i%2};root.add(sp);GLX.puff.push(sp);}}
 return true;}
loadShip(function(GLS){
const GL=GLS?shipFromGLB(GLS):false;
/* ================= CASCO E ESTRUTURA ================= */
const BH=[114,98,82,66,47,29.6,12,-5.4,-22,-33,-54,-71.4,-88,-103,-116];           // 15 anteparas (A…P)
const BHTOP=[18.6,15.9,13.2,13.2,13.2,13.2,13.2,13.2,13.2,15.9,15.9,15.9,15.9,15.9,15.9];
const COMP=['Pique de vante','Porão 1','Porão 2','Porão 3','Sala de caldeiras 6','Sala de caldeiras 5','Sala de caldeiras 4','Sala de caldeiras 3','Sala de caldeiras 2','Sala de caldeiras 1','Máquinas alternativas','Sala da turbina','Sala dos dínamos','Túnel dos eixos','Compartimento de ré','Pique de ré'];
if(!GL){
[[1,hullTex(false)],[-1,hullTex(true)]].forEach(a=>{const g=G(),geo=hullGeo(a[0]);g.add(new T.Mesh(geo,M(0xffffff,{map:a[1],roughness:.6,metalness:.2,emissive:0xffffff,emissiveMap:hullEm,emissiveIntensity:0})));g.add(new T.Mesh(geo,M(0x8d9391,{side:T.BackSide,roughness:.85})));
 const hl=lines(hullLines(a[0]),0x8fd3ff,g);hl.userData.bpOnly=true;hl.visible=false;add('casco',g,{ex:V(0,0,a[0]*46),shell:true,layer:'casco'});});
{const g=G();box(228,.6,1.2,mIron,15.5,-.2,0,g);const sh=new T.Shape();sh.moveTo(-102,-.5);sh.lineTo(-119.5,-.5);sh.lineTo(-119.5,2.2);for(let x=-119.5;x<=-102;x+=1.25)sh.lineTo(x,Math.max(2.2,yBot(U(x))+.2));sh.lineTo(-102,-.5);
 const sk=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:.7,bevelEnabled:false}),mIron);sk.position.z=-.35;g.add(sk);box(.7,7.6,.7,mIron,-125.6,3.3,0,g);box(6.8,.6,.8,mIron,-122.4,-.2,0,g);box(.6,16,.5,mIron,134.45,10.2,0,g);
 add('quilha',g,{ex:V(0,-12,0),layer:'estr'});}
}
add('cavername',new T.Mesh(frameGeo(),mRed),{layer:'estr',shell:true});
{const g=G();BH.forEach((x,i)=>g.add(new T.Mesh(bulkGeo(x,BHTOP[i]),mSteel)));add('anteparas',g,{layer:'estr',shell:true});
 const d=G(),md=M(0x9a2c22);BH.slice(3,13).forEach(x=>{box(.35,2.2,1.4,md,x-.1,2.9,0,d);box(.4,.3,1.8,mIron,x-.1,4.2,0,d);});add('portas',d,{layer:'estr',shell:true});}
/* conveses — cada um é um item próprio (para as plantas e o explodido) */
const DECKS=[['T','Teto do fundo duplo',0],['O','Orlop',3],['G','Convés G · Inferior',6],['F','Convés F · Intermediário',10],['E','Convés E · Superior',14],['D','Convés D · Salão',18],['C','Convés C · Abrigo',22],['B','Convés B · Ponte',27],['A','Convés A · Passeio',32],['BT','Convés dos Botes',37]];
{const mk=(id,segs,mat,exy)=>{const g=G();segs.forEach(s=>g.add(new T.Mesh(deckGeo(DY[id],s[0],s[1],s[2]),mat)));add(id==='T'?'fundo':'conves',g,{ex:V(0,exy,0),shell:true,layer:'conves',deck:id});};
 mk('T',[[-104,120]],M(0x5d6468,{side:DS}),0);mk('O',[[66,116],[-116,-88]],mDeckS,3);mk('G',[[66,120],[-120,-88]],mDeckS,6);
 mk('F',[[-33,123],[-122,-54],[-54,-33,9]],mDeckS,10);mk('E',[[-126,126]],mDeckS,14);mk('D',[[-128,128]],mDeckS,18);mk('C',[[-131,131]],mWoodD,22);
 mk('B',[[95.5,132.5],[-78,73],[-133.5,-104.5]],mWoodD,27);mk('A',[[-78,73]],mWoodD,32);if(GL)mk('BT',[[-72,66]],mWoodD,37);}
/* divisórias genéricas de camarotes (dão leitura aos cortes) */
{const ps=[];[13.2,15.9,18.6,21.3].forEach(y=>{for(let x=-100;x<=100;x+=3.6){if(y>21&&(x>72||x<-77))continue;[-1,1].forEach(s=>{const zo=hb(x,y+1)-.4;if(zo<8)return;ps.push([x,y,s*(zo+6.5)/2,zo-6.5]);});}});
 const im=new T.InstancedMesh(new T.BoxGeometry(.1,2.4,1),M(0xd9cdb4),ps.length),m4=new T.Matrix4(),Q=new T.Quaternion();ps.forEach((p,i)=>{m4.compose(V(p[0],p[1]+1.25,p[2]),Q,V(1,1,p[3]));im.setMatrixAt(i,m4);});
 add('camarotes',im,{shell:true,layer:'int'});}

/* ================= SUPERESTRUTURA (só no plano alternativo, sem o modelo GLB) ================= */
if(!GL){
{const g=G(),A=DY.A,BT=DY.BT;
 box(132,2.7,21,mHouse(60),-4,A+1.38,0,g);                                   // casaria do convés A
 [-1,1].forEach(s=>{box(54,2.75,.14,mHouse(30),35,A+1.38,s*13.95,g);});          // passeio A fechado a vante (traço do Titanic)
 const ra=[];[-1,1].forEach(s=>{rail(-76,8,s*13.9,A+.04,ra);for(let x=-76;x<=8;x+=4)ra.push(x,A,s*13.9,x,BT,s*13.9);});lines(ra,0xd8d8d0,g);
 add('superestrutura',g,{ex:V(0,34.5,0),shell:true,layer:'super'});
 const b=G();const pl=box(138,.2,28.2,mWood,-3,BT,0,b);
 const hs=[[54,20,13,2.9,10],[35,14,13,2.9,7],[25,6,5,2.9,3,4],[10,24,12,1.9,10],[-22,16,12,2.9,7],[-38,12,12,2.9,6],[-56,14,12,2.9,6],[-67.5,6,10,2.9,3]];
 hs.forEach(h=>box(h[1],h[3],h[2],mHouse(h[4]),h[0],BT+.1+h[3]/2,h[5]||0,b));
 [[36,'esc'],[-38,'esc2']].forEach(d=>{const dm=new T.Mesh(new T.SphereGeometry(3.6,20,10,0,PI*2,0,PI/2),M(0xbfd9e6,{metalness:.3,roughness:.2,emissive:0xffe2a0,emissiveIntensity:0}));dm.scale.y=.45;dm.position.set(d[0],BT+3,0);dm.userData.glow=true;b.add(dm);});
 const rb=[];[-1,1].forEach(s=>{rail(-72,66,s*14,BT+.1,rb);});lines(rb,0xd8d8d0,b);
 add('conves',b,{ex:V(0,37,0),shell:true,layer:'super',deck:'BT'});
 /* ponte de comando (exterior) */
 const p=G();box(4.4,.18,28.8,mWhite,66.3,BT+2.95,0,p);box(.15,1.15,28.6,mWhite,68.4,BT+.65,0,p);box(4.4,.12,28.8,mWood,66.3,BT+.12,0,p);
 [-1,1].forEach(s=>{box(2.6,2.6,2.2,mHouse(1),66.6,BT+1.5,s*13.6,p);for(let z=2;z<=12;z+=2.5)cyl(.05,.05,1.7,mWhite,68.4,BT+2.05,s*z,p);});
 sph(.25,M(0x20ff60,{emissive:0x10c040}),66.6,BT+2.2,14.8,p);sph(.25,M(0xff3020,{emissive:0xc02010}),66.6,BT+2.2,-14.8,p);
 add('ponte',p,{ex:V(8,44,0),shell:true,layer:'super'});}
/* chaminés */
FX.forEach((x,i)=>{const g=G();g.position.set(x,DY.BT+2.9,0);g.rotation.z=.165;
 const f=new T.Mesh(new T.CylinderGeometry(3.55,3.75,21.5,36,1,true),M(0xffffff,{map:funnelT,roughness:.55}));f.position.y=10.75;f.scale.z=.78;g.add(f);
 const fi=new T.Mesh(new T.CylinderGeometry(3.45,3.65,21.5,24,1,true),M(0x0c0c0c,{side:T.BackSide}));fi.position.y=10.75;fi.scale.z=.78;g.add(fi);
 const tr=new T.Mesh(new T.TorusGeometry(3.57,.1,8,36),mDark);tr.rotation.x=PI/2;tr.position.y=21.5;tr.scale.y=.78;g.add(tr);
 cyl(4.1,4.2,1,mBuff,0,.4,0,g,null,28).scale.z=.8;cyl(.14,.14,19,mBuff,3.9,9.5,0,g);if(i<3){cyl(.12,.12,1,mBrass,3.75,15,0,g);cyl(.2,.2,.4,mBrass,3.75,15.6,0,g);}
 const st=[];[[-12,11],[-12,-11],[12,11],[12,-11]].forEach(q=>st.push(0,15,q[1]>0?2.8:-2.8,q[0],-2.6,q[1]));lines(st,0x555a5e,g);
 funnelTops.push(V(x-Math.sin(.165)*21.5,DY.BT+2.9+Math.cos(.165)*21.5,0));
 add(i<3?'chamine':'chamine4',g,{ex:V(0,56,0),shell:true,layer:'super'});});
/* botes: 14 padrão, 2 cúteres de emergência, 4 desmontáveis */
{const g=G(),BT=DY.BT,bx=[55,48,41,-36,-45,-54,-63],N=bx.length*2,im=new T.InstancedMesh(new T.SphereGeometry(1,14,10),M(0xf4f1e8,{roughness:.6}),N+2),m4=new T.Matrix4(),Q=new T.Quaternion();let k=0;
 const dv=new T.InstancedMesh(new T.CylinderGeometry(.08,.11,3.4,6),mIron,(N+2)*2),ar=new T.InstancedMesh(new T.BoxGeometry(.12,.12,1.9),mIron,(N+2)*2);let d=0;
 const put=(x,z,s,len)=>{m4.compose(V(x,BT+1.45,z),Q,V(len/2,.75,1.35));im.setMatrixAt(k++,m4);[-len/2+.6,len/2-.6].forEach(o=>{m4.compose(V(x+o,BT+1.7,s*14.1),Q,V(1,1,1));dv.setMatrixAt(d,m4);m4.compose(V(x+o,BT+3.4,s*(Math.abs(z)+13.9)/2),Q,V(1,1,Math.max(.6,Math.abs(Math.abs(z)-13.9)/1.6+.6)));ar.setMatrixAt(d++,m4);});};
 bx.forEach(x=>[-1,1].forEach(s=>put(x,s*12.6,s,9.1)));[-1,1].forEach(s=>put(62,s*15.1,s,7.7));g.add(im,dv,ar);
 const mc=M(0xe4dfcf);[-1,1].forEach(s=>{box(8.3,.55,2.4,mc,61.5,BT+.45,s*11.6,g);box(8.3,.55,2.4,mc,52,BT+3.35,s*3.6,g);});
 add('bote',g,{ex:V(0,48,0),shell:true,layer:'super'});}
/* mastros, gávea, antena Marconi, bandeiras */
{const g=G(),st=[],mk=(x,H,nest)=>{const mg=G(),y0=DY.C;mg.position.set(x,y0,0);mg.rotation.z=.165;cyl(.28,.5,H*.6,mSpar,0,H*.3,0,mg);cyl(.14,.28,H*.4,mSpar,0,H*.8,0,mg);
  if(nest){const n=part(G(),'gavea');const c=new T.Mesh(new T.CylinderGeometry(.95,.85,1.25,16,1,true,PI*.5,PI),M(0xefece2,{side:DS}));c.position.set(.15,20.4,0);n.add(c);cyl(.9,.9,.08,mWhite,.3,19.8,0,n);sph(.16,mBrass,.9,21.6,.5,n);box(.2,.3,.16,mDark,.5,20.6,-.7,n);mg.add(n);
   const ll=[];for(let y=2;y<19.6;y+=.4)ll.push(-.3,y,-.2,-.3,y,.2);lines(ll,0x333333,mg);}
  [-1,1].forEach(d=>{rod(V(d*.9,2.6,0),V(d*13,13,0),.16,.1,mSpar,mg);});g.add(mg);
  const tx=x-Math.sin(.165)*H,ty=y0+Math.cos(.165)*H;[-1,1].forEach(s=>[-3,0,3].forEach(o=>st.push(x-Math.sin(.165)*H*.7,y0+H*.69,0,x+o-3,19.9,s*(hb(x,19.5)-.2))));return[tx,ty];};
 const a=mk(90,44,true),b=mk(-92,42,false);st.push(a[0],a[1],0,133,DY.B+2.2,0);lines(st,0x4a4f55,g);
 const fl=(tex,w,h,x,y)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:tex,side:DS}));m.position.set(x,y,0);g.add(m);};
 fl(ctex(64,32,(c)=>{c.fillStyle='#c8102e';c.beginPath();c.moveTo(0,0);c.lineTo(64,0);c.lineTo(44,16);c.lineTo(64,32);c.lineTo(0,32);c.fill();c.fillStyle='#fff';c.font='20px serif';c.fillText('★',10,23);}),3.2,1.6,b[0]-1.9,b[1]-1);
 fl(ctex(64,32,(c)=>{c.fillStyle='#0a2a6a';c.fillRect(0,0,64,32);c.fillStyle='#fff';c.fillRect(0,6,28,3);c.fillRect(12,0,3,16);c.fillStyle='#c8102e';c.fillRect(0,7,28,1.4);c.fillRect(13,0,1.2,16);}),3.6,1.8,-135.6,DY.B+6.2);
 cyl(.07,.1,7,mSpar,-133.6,DY.B+3.5,0,g);
 add('mastro',g,{ex:V(0,26,0),shell:true,layer:'super'});
 const r=G(),w=[];[-1.2,-.4,.4,1.2].forEach(z=>w.push(a[0]-1,a[1]-1,z,b[0]+1,b[1]-1,z));w.push(a[0]-1,a[1]-1,-1.2,a[0]-1,a[1]-1,1.2,b[0]+1,b[1]-1,-1.2,b[0]+1,b[1]-1,1.2,43,a[1]-1.1,0,43,DY.BT+3.1,-3);lines(w,0xd9c27a,r);
 add('antena',r,{ex:V(0,26,0),shell:true,layer:'super'});}

/* ================= PROA, POPA, PROPULSÃO EXTERNA ================= */
function capstan(x,y,z,g){lathe([[.55,0],[.5,.1],[.3,.35],[.3,.75],[.5,.95],[.5,1.05],[0,1.05]],mIron,x,y,z,g,12);}
function crane(x,y,z,dir,g){cyl(.55,.7,1.8,mWhite,x,y+.9,z,g,null,12);box(1.6,1.3,1.4,mWhite,x,y+2.4,z,g);rod(V(x,y+2.6,z),V(x+dir*7,y+8,z),.2,.12,mSpar,g);}
{const g=G(),B=DY.B,C=DY.C,fy=x=>yTop(U(x))-.0;
 [-1,1].forEach(s=>{const a=G(),z=s*(hb(124,17.4)+.35);a.position.set(124,17.2,z);a.rotation.z=.1;a.rotation.x=s*.2;box(.4,3.4,.36,mIron,0,.5,0,a);box(.6,.6,2.4,mIron,0,-1.2,0,a);[-.9,.9].forEach(o=>{const f=new T.Mesh(new T.ConeGeometry(.36,1.5,4),mIron);f.position.set(.18,-.6,o);f.rotation.z=-.35;a.add(f);});g.add(a);cyl(.55,.55,.6,mIron,123.8,19,s*hb(123.8,19),g,'z');});
 const ce=G();ce.position.set(129.5,fy(129.5)+.35,0);box(3.6,.4,.4,mIron,0,0,0,ce);box(.6,.5,2.6,mIron,-1.9,0,0,ce);g.add(ce);rod(V(126.5,fy(126),0),V(130.5,fy(126)+4.4,0),.2,.12,mWhite,g);
 add('ancora',g,{ex:V(12,2,0),layer:'ext',clip:false});
 const c=G(),lk=new T.TorusGeometry(.19,.065,5,8);[-1,1].forEach(s=>{const y=fy(118),cu=new T.CatmullRomCurve3([V(124,19.2,s*2.6),V(122.5,y+.4,s*2.2),V(119,y+.35,s*2),V(116.5,y+.9,s*2),V(115.6,y+.3,s*1.9),V(115.2,15,s*1.6),V(115,9,s*1.2)]),n=64,im=new T.InstancedMesh(lk,mIron,n),m4=new T.Matrix4(),q=new T.Quaternion(),q2=new T.Quaternion();
  for(let i=0;i<n;i++){const t=i/(n-1),p=cu.getPointAt(t),tg=cu.getTangentAt(t);q.setFromUnitVectors(V(0,1,0),tg);q2.setFromAxisAngle(V(0,1,0),i%2?PI/2:0);q.multiply(q2);m4.compose(p,q,V(1,1.5,1));im.setMatrixAt(i,m4);}c.add(im);});
 add('corrente',c,{ex:V(12,2,0),layer:'ext'});
 /* equipamentos de convés: castelo de proa, poços, tombadilho */
 const e=G(),y=fy(116);[-2,2].forEach(z=>{cyl(.7,.7,.9,mIron,116.5,y+.75,z,e,'z');cyl(.95,.95,.14,mIron,116.5,y+.75,z-.55,e,'z');});box(2.4,1,1.6,mIronG,114.6,y+.5,0,e);
 [[121,3.4],[121,-3.4],[110,4.5],[110,-4.5]].forEach(q=>capstan(q[0],fy(q[0]),q[1],e));
 [[126,2.2],[126,-2.2],[106,7.5],[106,-7.5],[100,9],[100,-9]].forEach(q=>{[-.45,.45].forEach(o=>cyl(.22,.26,.7,mIron,q[0]+o,fy(q[0])+.35,q[1],e));});
 [-1,1].forEach(s=>{const w=box(9.6,.9,.1,mWhite,108.6,fy(108)+.45,s*4.4,e);w.rotation.y=s*-1.07;});
 const mH=M(0x3d3a33);box(5,1,5,mH,103,fy(103)+.5,0,e);box(6,1.1,6,mH,84,C+.55,0,e);box(6,1.1,6,mH,-90,C+.55,5,e).position.z=0;box(5,1.1,5,mH,-99,C+.55,0,e);
 crane(79,C,7.5,1,e);crane(79,C,-7.5,1,e);crane(-83,C,8,-1,e);crane(-83,C,-8,-1,e);crane(-74,DY.B,9,-1,e);crane(-74,DY.B,-9,-1,e);
 box(1.8,.14,22,mWood,-125,B+3.2,0,e);[-1,1].forEach(s=>{cyl(.08,.08,3.2,mWhite,-125,B+1.6,s*10,e);cyl(.08,.08,3.2,mWhite,-125,B+1.6,s*4,e);});
 [[-112,4],[-112,-4],[-120,3],[-120,-3]].forEach(q=>capstan(q[0],B,q[1],e));[[-116,8],[-116,-8],[-128,4.5],[-128,-4.5]].forEach(q=>{[-.45,.45].forEach(o=>cyl(.22,.26,.7,mIron,q[0]+o,B+.35,q[1],e));});
 box(10,2.4,9,mHouse(5),-109.5,B+1.2,0,e);
 const ra=[];[-1,1].forEach(s=>{for(let x=96;x<=131;x+=2.5){const a=x,b=Math.min(131,x+2.5);[.4,.75,1.1].forEach(k=>ra.push(a,fy(a)+k,s*(hb(a,21)-.15),b,fy(b)+k,s*(hb(b,21)-.15)));ra.push(a,fy(a),s*(hb(a,21)-.15),a,fy(a)+1.1,s*(hb(a,21)-.15));}
  for(let x=-133;x<=-106;x+=2.5){const a=x,b=x+2.5;[.4,.75,1.1].forEach(k=>ra.push(a,B+k,s*(hb(a,21)-.15),b,B+k,s*(hb(b,21)-.15)));ra.push(a,B,s*(hb(a,21)-.15),a,B+1.1,s*(hb(a,21)-.15));}});lines(ra,0xd8d8d0,e);
 add('conves_eq',e,{ex:V(0,27,0),shell:true,layer:'super'});}
{rudder=G();rudder.position.set(-125.6,0,0);const sh=new T.Shape();sh.moveTo(0,.4);sh.lineTo(-4.6,.7);sh.lineTo(-5,7.6);sh.lineTo(-2.4,9.6);sh.lineTo(0,9.6);sh.lineTo(0,.4);
 const m=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:.5,bevelEnabled:false}),M(0x7a2a1e));m.position.z=-.25;rudder.add(m);cyl(.38,.38,14.5,mIron,0,8,0,rudder);[2,4.5,7].forEach(y=>box(.9,.5,.9,mIron,0,y,0,rudder));
 add('leme',rudder,{ex:V(-16,-8,0),layer:'ext',clip:false});}
{const g=G();[[-118,3.5,-6.4,3.3,-1,1],[-118,3.5,6.4,3.3,1,1],[-122.6,3.2,0,2.5,1,2.2]].forEach(q=>{const p=G(),r=q[3];p.position.set(q[0],q[1],q[2]);const hub=sph(r*.23,mBronze,0,0,0,p);hub.scale.set(1.6,1,1);const cn=new T.Mesh(new T.ConeGeometry(r*.2,r*.5,12),mBronze);cn.rotation.z=PI/2;cn.position.x=-r*.5;p.add(cn);
  for(let k=0;k<3;k++){const pv=G();pv.rotation.x=k*PI*2/3;const b=new T.Mesh(new T.SphereGeometry(1,12,8),mBronze);b.scale.set(r*.04,r*.45,r*.27);b.position.y=r*.53;b.rotation.y=q[4]*.55;pv.add(b);p.add(pv);}
  g.add(p);props.push({o:p,s:q[4],k:q[5]});});add('helice',g,{ex:V(-12,-28,0),layer:'maq',clip:false});}
}
/* mar, grade, cotas, estrelas, iceberg da demonstração da gávea */
/* ===== oceano dinâmico (shader): ondulação, sistema de ondas do casco, espuma e esteira ===== */
const SEA_H=`
uniform float uT,uV,uR,uRc,uN,uK;uniform sampler2D uHW;
float hw(float x){float k=(x+135.)/5.;if(k<0.||k>54.)return 0.;return texture2D(uHW,vec2((k+.5)/55.,.5)).r*16.;}
float amb(vec2 p){float t=uT;vec2 q=p+vec2(uV*t,0.);float h=.26*sin(dot(q,vec2(.045,.021))+t*.62);h+=.19*sin(dot(q,vec2(-.031,.058))+t*.81+1.3);h+=.11*sin(dot(q,vec2(.11,-.085))+t*1.25+.7);h+=.07*sin(dot(q,vec2(.19,.16))+t*1.7+2.1);h+=.04*sin(dot(q,vec2(-.33,.21))+t*2.3);return h;}
float kelv(vec2 p,float x0,float amp){float V=max(uV,2.5),d=x0-p.x;if(d<0.)return 0.;float az=abs(p.y),zc=x0>0.?max(d*.3536,hw(p.x)+.8):d*.3536+3.,kt=9.81/(V*V),e=exp(-pow((az-zc)/(5.+d*.06),2.));
 float h=amp*e*sin(kt*1.5*(d*.577+az*.816))*exp(-d/700.)*smoothstep(0.,18.,d);
 h+=amp*.38*sin(kt*d)*smoothstep(zc,zc*.45,az)/sqrt(1.+d/160.)*smoothstep(0.,40.,d);return h;}
float shipH(vec2 p){float A=min(1.3,uV*uV/120.);if(A<.002)return 0.;float az=abs(p.y);
 float fw=1.-smoothstep(133.2,135.2,p.x);float h=A*1.1*exp(-pow((p.x-130.5)/3.6,2.))*exp(-pow(az/4.5,2.))*fw;
 h+=A*.5*exp(-pow((az-hw(p.x)-1.5)/3.,2.))*smoothstep(40.,128.,p.x)*fw;
 h+=kelv(p,134.,A*.85)+kelv(p,-118.,A*.5);return h;}
float seaH(vec2 p){return amb(p)*(1.-.35*min(1.,uN))+shipH(p);}
`;
const seaMat=new T.ShaderMaterial({transparent:true,clipping:true,clippingPlanes:CLIP,side:DS,uniforms:{uT:{value:0},uV:{value:0},uR:{value:0},uRc:{value:0},uN:{value:0},uK:{value:0},uHW:{value:null},uSun:{value:V(160,220,180).normalize()},uCam:{value:V(0,0,0)}},
vertexShader:SEA_H+`#include <clipping_planes_pars_vertex>
varying vec3 vP;void main(){vec3 p=position;p.y+=seaH(p.xz);vec4 wp=modelMatrix*vec4(p,1.);vP=vec3(position.x,wp.y,position.z);vec4 mvPosition=viewMatrix*wp;gl_Position=projectionMatrix*mvPosition;
#include <clipping_planes_vertex>
}`,
fragmentShader:SEA_H+`#include <clipping_planes_pars_fragment>
uniform vec3 uSun,uCam;varying vec3 vP;
float hsh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hsh(i),hsh(i+vec2(1,0)),f.x),mix(hsh(i+vec2(0,1)),hsh(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){return .5*vn(p)+.3*vn(p*2.1+7.)+.2*vn(p*4.3+3.);}
void main(){
#include <clipping_planes_fragment>
 vec2 p=vP.xz;float e=.9;float h0=seaH(p),hx=seaH(p+vec2(e,0.)),hz=seaH(p+vec2(0.,e));
 vec3 n=normalize(vec3(h0-hx,e,h0-hz));vec2 mp=p+vec2(uV*uT,0.);float dist=length(vP-uCam),nd=smoothstep(700.,40.,dist);n=normalize(n+vec3(vn(mp*.55+uT*.5)-.5,0.,vn(mp*.55-uT*.4+9.)-.5)*.2*nd);
 vec3 v=normalize(uCam-vec3(p.x,vP.y,p.y));float fr=.03+.97*pow(1.-max(dot(n,v),0.),5.);
 vec3 deep=mix(vec3(.012,.085,.16),vec3(.004,.012,.03),uN),sky=mix(mix(vec3(.62,.74,.86),vec3(.27,.5,.8),clamp(reflect(-v,n).y,0.,1.)),vec3(.03,.045,.08),uN);
 vec3 col=mix(deep,sky,fr);col+=mix(vec3(.02,.1,.11),vec3(0.),uN)*max(0.,h0)*.35;
 col+=mix(vec3(1.,.95,.82),vec3(.25,.3,.4),uN)*pow(max(dot(reflect(-uSun,n),v),0.),90.)*(.25+.75*nd)*(1.-.85*uN);
 /* espuma: contato com o casco, onda de proa, cristas do sistema de ondas, esteira das três hélices */
 float A=min(1.,uV*uV/120.),az=abs(p.y),w=hw(p.x),f=0.,nz=fbm(mp*.35),nf=fbm(mp*1.3+nz*2.);
 float band=smoothstep(3.4,0.,az-w)*smoothstep(.05,1.2,w);f+=band*A*(.35+.8*smoothstep(55.,134.,p.x)+.5*smoothstep(-95.,-134.,p.x))*(.45+nf);
 float d=134.-p.x,zc=max(d*.3536,w+.8);f+=A*1.2*exp(-pow((az-zc)/(2.2+d*.035),2.))*exp(-d/150.)*smoothstep(1.,9.,d)*(.3+nf);
 f+=A*.7*smoothstep(.55,1.1,shipH(p))*(.4+nf);
 float dw=-118.-p.x;if(dw>0.){float pz=p.y-clamp(uK*dw*dw*.5,-dw*.9,dw*.9);az=abs(pz);float R=clamp(abs(uR)/75.,0.,1.),Rc=clamp(uRc/165.,0.,1.),sp=1.7+dw*.055;vec2 q=vec2(p.x*.25+uT*(1.5+2.5*R),p.y*.6);
  float s3=R*(exp(-pow((pz-6.4)/sp,2.))+exp(-pow((pz+6.4)/sp,2.)))+max(Rc,R*.15)*exp(-pow(pz/sp,2.));float ww=11.+dw*.085,wide=smoothstep(ww,ww*.35,az)*max(R,A*.6);
  float sw=.5+.5*sin(dw*.55-uT*(2.+6.*R)+6.*vn(q*1.7)+pz*.9);float tur=fbm(q*2.2+vec2(sw*.6,uT*.4));
  float wk=mix(s3*(.35+.75*sw),wide*.8,smoothstep(45.,190.,dw))*exp(-dw/420.)*smoothstep(0.,5.,dw);f+=wk*(.3+1.15*tur);col=mix(col,mix(vec3(.05,.33,.36),vec3(.02,.06,.08),uN),clamp(wk*.55,0.,.6));}
 f=clamp(f-.28,0.,1.);f=smoothstep(0.,.75,f);col=mix(col,mix(vec3(.93,.96,.97),vec3(.3,.34,.4),uN),f);
 col=mix(col,mix(vec3(.6,.72,.84),vec3(.03,.045,.08),uN),smoothstep(900.,3800.,dist));
 gl_FragColor=vec4(col,mix(.965,1.,max(f,smoothstep(300.,1500.,dist))));}`});
const sea=(()=>{const N=190,pos=[],idx=[],wr=c=>Math.sign(c)*Math.pow(Math.abs(c),2.4)*4200;for(let i=0;i<=N;i++)for(let j=0;j<=N;j++)pos.push(wr(i/N*2-1),0,wr(j/N*2-1));for(let i=0;i<N;i++)for(let j=0;j<N;j++){const a=i*(N+1)+j,b=a+N+1;idx.push(a,a+1,b,a+1,b+1,b);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);const m=new T.Mesh(g,seaMat);m.position.y=WL;m.frustumCulled=false;m.userData.noPick=true;scene.add(m);return m;})();
{const d=new Uint8Array(55*4);for(let i=0;i<55;i++){const v=Math.max(0,Math.min(255,Math.round((hb(i*5-135,WL)+(GL?.5:0))/16*255)));d[i*4]=d[i*4+1]=d[i*4+2]=v;d[i*4+3]=255;}const tx=new T.DataTexture(d,55,1,T.RGBAFormat);tx.magFilter=tx.minFilter=T.LinearFilter;tx.needsUpdate=true;seaMat.uniforms.uHW.value=tx;}
const sky=new T.Mesh(new T.SphereGeometry(6500,24,12),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{uN:{value:0},uSun:{value:V(160,220,180).normalize()}},vertexShader:'varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform float uN;uniform vec3 uSun;varying vec3 vD;void main(){float y=clamp(vD.y,0.,1.);vec3 c=mix(vec3(.6,.72,.84),vec3(.2,.42,.74),pow(y,.55));c+=vec3(1.,.9,.7)*pow(max(dot(normalize(vD),uSun),0.),300.)*1.5;c=mix(c,mix(vec3(.03,.045,.08),vec3(.008,.012,.03),pow(y,.5)),uN);if(vD.y<0.)c=mix(c,mix(vec3(.02,.09,.16),vec3(.004,.012,.03),uN),smoothstep(0.,-.06,vD.y));gl_FragColor=vec4(c,1.);}'}));sky.renderOrder=-10;sky.visible=false;scene.add(sky);
const grid=new T.GridHelper(600,60,0x8fd3ff,0x2b6aa8);grid.position.y=-2;grid.material.transparent=true;grid.material.opacity=.35;grid.visible=false;scene.add(grid);
const dimL=lines([-134.5,-5,20,134.5,-5,20,-134.5,-6.5,20,-134.5,-3.5,20,134.5,-6.5,20,134.5,-3.5,20, 142,0,-14.1,142,0,14.1,142,0,-14.1,139,0,-14.1,142,0,14.1,139,0,14.1, -142,0,0,-142,53.3,0,-144,0,0,-140,0,0,-144,53.3,0,-140,53.3,0, 142,0,18,142,10.5,18,140.5,10.5,18,143.5,10.5,18],0xcfeaff,scene);dimL.visible=false;
const DIMS=[[V(0,-5,20),'COMPRIMENTO 269,1 m (882 pés 9 pol.)'],[V(142,0,0),'BOCA 28,2 m'],[V(-142,28,0),'QUILHA AO TOPO DAS CHAMINÉS 53,3 m'],[V(142,5.2,18),'CALADO 10,5 m']];
const stars=(()=>{const n=500,a=new Float32Array(n*3);for(let i=0;i<n;i++){const th=Math.random()*PI*2,ph=Math.random()*1.35,r=5000;a[i*3]=r*Math.sin(ph)*Math.cos(th);a[i*3+1]=r*Math.cos(ph);a[i*3+2]=r*Math.sin(ph)*Math.sin(th);}const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(a,3));const p=new T.Points(g,new T.PointsMaterial({color:0xffffff,size:2,sizeAttenuation:false,transparent:true,opacity:.85,depthWrite:false}));p.visible=false;scene.add(p);return p;})();
const berg=(()=>{const g=new T.SphereGeometry(1,9,6),p=g.attributes.position,k={};for(let i=0;i<p.count;i++){const key=p.getX(i).toFixed(2)+p.getY(i).toFixed(2)+p.getZ(i).toFixed(2),f=k[key]||(k[key]=[1+Math.random()*.45,1+Math.random()*.7]);p.setXYZ(i,p.getX(i)*f[0],Math.max(-.15,p.getY(i))*f[1],p.getZ(i)*f[0]);}g.computeVertexNormals();const m=new T.Mesh(g,new T.MeshStandardMaterial({color:0x7d8fa3,roughness:.95,flatShading:true}));m.scale.set(55,20,40);m.position.set(640,WL,-20);m.visible=false;scene.add(m);return m;})();
