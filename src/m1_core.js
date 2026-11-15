(function(){'use strict';
/* ===== MÓDULO 1 — núcleo, texturas, forma do casco, exterior ===== */
const T=THREE,$=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s),V=(x,y,z)=>new T.Vector3(x,y,z),PI=Math.PI;
const cv=$('#c');let R;
try{R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});}
catch(e){$('#load').innerHTML='WEBGL INDISPONÍVEL<br><br>Este navegador não conseguiu iniciar a renderização 3D.';return;}
R.setPixelRatio(Math.min(window.devicePixelRatio||1,2));R.outputEncoding=T.sRGBEncoding;R.localClippingEnabled=true;
const scene=new T.Scene(),cam=new T.PerspectiveCamera(40,1,.5,120000),root=new T.Group(),setsG=new T.Group();scene.add(root,setsG);
const hemi=new T.HemisphereLight(0xd6e6ff,0x2a3440,.95);scene.add(hemi);
const sun=new T.DirectionalLight(0xffecd4,1.0);sun.position.set(160,220,180);scene.add(sun);
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
 $('#loadT').innerHTML='CARREGANDO O NAVIO…<br><span style="opacity:.6;font-size:10px">modelo 3D · cerca de 14 MB</span>';
 const cib=window.createImageBitmap;try{window.createImageBitmap=undefined;}catch(e){}const rst=()=>{try{window.createImageBitmap=cib;}catch(e){}};
 const sc=document.createElement('script');sc.src='assets/models/titanic_glb.js';sc.async=true;sc.onerror=()=>{rst();fin(null);};
 sc.onload=()=>{try{$('#loadT').innerHTML='MONTANDO O NAVIO…';const s=atob(window.TITANIC_GLB_B64||'');window.TITANIC_GLB_B64=null;const n=s.length,u=new Uint8Array(n);for(let q=0;q<n;q++)u[q]=s.charCodeAt(q);const Ld=new T.GLTFLoader();Ld.setMeshoptDecoder(MeshoptDecoder);
   Ld.parse(u.buffer,'',g=>{rst();setTimeout(()=>fin(g.scene),30);},()=>{rst();fin(null);});}catch(e){rst();fin(null);}};
 setTimeout(()=>fin(null),150000);document.head.appendChild(sc);}
function shipFromGLB(o){HTB=true;const w=new T.Group();w.add(o);o.updateMatrixWorld(true);const b=new T.Box3().setFromObject(o),sz=b.getSize(new T.Vector3()),s=269.1/sz.x,c=b.getCenter(new T.Vector3());
 w.scale.setScalar(s);w.position.set(-c.x*s,-b.min.y*s,-c.z*s);w.updateMatrixWorld(true);
 const lm=new T.LineBasicMaterial({color:0xe6f2ff,transparent:true,opacity:.9});
 /* posições quantizadas → Float32, para que toque/seleção (raycast) funcionem */
 o.traverse(m=>{const ge=m.geometry,p=ge&&ge.attributes.position;if(!p||(p.array instanceof Float32Array&&!p.normalized&&!p.isInterleavedBufferAttribute))return;const A=p.isInterleavedBufferAttribute?p.data.array:p.array,k=p.normalized?(A instanceof Int16Array?1/32767:A instanceof Int8Array?1/127:A instanceof Uint16Array?1/65535:A instanceof Uint8Array?1/255:1):1,n=p.count,f=new Float32Array(n*3);for(let i=0;i<n;i++){f[i*3]=p.getX(i)*k;f[i*3+1]=p.getY(i)*k;f[i*3+2]=p.getZ(i)*k;}ge.setAttribute('position',new T.BufferAttribute(f,3));ge.computeBoundingSphere();});
 o.traverse(m=>{if(m.isLineSegments||m.isLine){m.material=lm.clone();m.userData.bpOnly=true;m.userData.rc=0x9bd8ff;m.visible=false;return;}
  if(m.isMesh){m.userData.noEdge=true;const mm=m.material,nm=mm.name||'';if(nm==='material'||nm==='0134_DimGray'||/glass/i.test(nm)){mm.userData.win=true;mm.userData.ec=[1,.82,.5];mm.emissive=new T.Color(1,.82,.5);mm.emissiveIntensity=0;if(nm==='0134_DimGray')mm.color.multiplyScalar(.5);}
   else if(mm.color&&!mm.map){const cc=mm.color,l=(cc.r+cc.g+cc.b)/3;if(Math.abs(cc.r-cc.g)<.04&&Math.abs(cc.g-cc.b)<.04&&l>.1&&l<.45)cc.multiplyScalar(.27);else if(l>.85)cc.multiplyScalar(.9);}}});
 const N=k=>o.getObjectByName('G_'+k),put=(g,k)=>{const n=N(k);if(n){g.updateMatrixWorld(true);g.attach(n);}return g;};
 const mkI=(id,k,pos,opt)=>{const g=G();if(pos)g.position.copy(pos);const it=add(id,g,opt);put(g,k);return it;};
 mkI('casco','hullP',null,{ex:V(0,0,-46),shell:true,layer:'casco'});mkI('casco','hullS',null,{ex:V(0,0,46),shell:true,layer:'casco'});if(N('hdeck'))mkI('casco','hdeck',null,{ex:V(0,17,0),shell:true,layer:'casco'});
 /* âncoras: a própria âncora do modelo 3D é recortada do casco (braços, haste e cruz são peças soltas na malha) e passa a ser uma peça móvel;
    a chapa e o anel do escovém continuam no casco. A corrente é a única geometria nova. */
 {GLX.anc=[];root.updateMatrixWorld(true);const rinv=new T.Matrix4().copy(root.matrixWorld).invert(),mA=M(0x1c1d1f,{metalness:.55,roughness:.5}),lk=new T.TorusGeometry(.13,.042,6,12);lk.scale(1,1.6,1);
  const hulls=items.filter(it=>it.id==='casco'),v=new T.Vector3();
  [-1,1].forEach(s=>{try{const parts=[],pts=[],keys=new Set(),K=(x,y,z)=>Math.round(x*50)+','+Math.round(y*50)+','+Math.round(z*50);
   hulls.forEach(it=>it.o.traverse(o=>{if(!o.isMesh||!o.geometry.index)return;const ge=o.geometry,p=ge.attributes.position,ix=ge.index.array,nt=ix.length/3,Mx=new T.Matrix4().multiplyMatrices(rinv,o.matrixWorld);
    if(!ge.boundingBox)ge.computeBoundingBox();const bb=ge.boundingBox.clone().applyMatrix4(Mx);if(bb.max.x<126.3||(s>0?bb.max.z<.5:bb.min.z>-.5))return;
    const L=new Float32Array(p.count*3);for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(Mx);L[i*3]=v.x;L[i*3+1]=v.y;L[i*3+2]=v.z;}
    const inb=i=>{const x=L[i*3],y=L[i*3+1],z=L[i*3+2]*s;return x>126.3&&x<131.3&&y>19&&y<23.6&&z>0;},par=new Map(),find=k=>{let a=k;while(par.get(a)!==a)a=par.get(a);par.set(k,a);return a;},key=i=>Math.round(L[i*3]*200)+','+Math.round(L[i*3+1]*200)+','+Math.round(L[i*3+2]*200),tris=[];
    for(let t=0;t<nt;t++){const a=ix[t*3],b=ix[t*3+1],c=ix[t*3+2];if(inb(a)&&inb(b)&&inb(c)){const ka=key(a),kb=key(b),kc=key(c);[ka,kb,kc].forEach(k=>{if(!par.has(k))par.set(k,k);});par.set(find(ka),find(kb));par.set(find(kb),find(kc));tris.push([t,ka]);}}
    if(!tris.length)return;const comps={};tris.forEach(q=>{const k=find(q[1]),c=comps[k]||(comps[k]={t:[],x0:1e9,x1:-1e9,pr:0});c.t.push(q[0]);for(let j=0;j<3;j++){const i=ix[q[0]*3+j],x=L[i*3],y=L[i*3+1],z=L[i*3+2]*s;c.x0=Math.min(c.x0,x);c.x1=Math.max(c.x1,x);c.pr=Math.max(c.pr,z-hb(x,y));}});
    const take=new Set();Object.values(comps).forEach(c=>{if(c.pr>.3&&c.x1-c.x0<3&&c.t.length>=8)c.t.forEach(t=>take.add(t));});if(!take.size)return;
    const mp=new Map(),ni=[],rem=[];for(let t=0;t<nt;t++){if(take.has(t)){for(let j=0;j<3;j++){const i=ix[t*3+j];if(!mp.has(i)){mp.set(i,mp.size);pts.push(L[i*3],L[i*3+1],L[i*3+2]);keys.add(K(L[i*3],L[i*3+1],L[i*3+2]));}ni.push(mp.get(i));}}else rem.push(ix[t*3],ix[t*3+1],ix[t*3+2]);}
    const ng=new T.BufferGeometry();Object.keys(ge.attributes).forEach(nm=>{const at=ge.attributes[nm],sz=at.itemSize,src=at.isInterleavedBufferAttribute?at.data.array:at.array,arr=new src.constructor(mp.size*sz);mp.forEach((nw,od)=>{arr[nw*sz]=at.getX(od);if(sz>1)arr[nw*sz+1]=at.getY(od);if(sz>2)arr[nw*sz+2]=at.getZ(od);if(sz>3)arr[nw*sz+3]=at.getW(od);});ng.setAttribute(nm,new T.BufferAttribute(arr,sz,at.normalized));});ng.setIndex(ni);
    ge.setIndex(new T.BufferAttribute(new ix.constructor(rem),1));const nm2=new T.Mesh(ng,o.material);nm2.userData.noEdge=true;nm2.userData.M=Mx;parts.push(nm2);}));
   if(!parts.length)return;let y1=-1e9,y0=1e9;for(let i=1;i<pts.length;i+=3){y1=Math.max(y1,pts[i]);y0=Math.min(y0,pts[i]);}
   const P0=V(0,0,0),Cr=V(0,0,0);let n1=0,n0=0;for(let i=0;i<pts.length;i+=3){if(pts[i+1]>y1-.1){P0.x+=pts[i];P0.y+=pts[i+1];P0.z+=pts[i+2];n1++;}if(pts[i+1]<y0+.5){Cr.x+=pts[i];Cr.y+=pts[i+1];Cr.z+=pts[i+2];n0++;}}P0.multiplyScalar(1/n1);Cr.multiplyScalar(1/n0);
   const g=G(),a=G();a.position.copy(P0);const Ti=new T.Matrix4().makeTranslation(-P0.x,-P0.y,-P0.z);parts.forEach(m=>{m.matrixAutoUpdate=false;m.matrix.multiplyMatrices(Ti,m.userData.M);a.add(m);});g.add(a);
   /* linhas do blueprint que pertencem à âncora acompanham a peça */
   const near=(x,y,z)=>{for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(let dz=-1;dz<=1;dz++)if(keys.has((Math.round(x*50)+dx)+','+(Math.round(y*50)+dy)+','+(Math.round(z*50)+dz)))return true;return false;};
   hulls.forEach(it=>it.o.traverse(o=>{if(!o.isLineSegments)return;const ge=o.geometry,p=ge.attributes.position,ix=ge.index?ge.index.array:null,ns=(ix?ix.length:p.count)/2,Mx=new T.Matrix4().multiplyMatrices(rinv,o.matrixWorld),lp=[],rem=[],A=new T.Vector3(),B=new T.Vector3();
    if(!ge.boundingBox)ge.computeBoundingBox();const bb=ge.boundingBox.clone().applyMatrix4(Mx);if(bb.max.x<126.3||(s>0?bb.max.z<.5:bb.min.z>-.5))return;
    for(let k=0;k<ns;k++){const i=ix?ix[k*2]:k*2,j=ix?ix[k*2+1]:k*2+1;A.fromBufferAttribute(p,i).applyMatrix4(Mx);if(A.x>126.3&&A.z*s>0&&near(A.x,A.y,A.z)){B.fromBufferAttribute(p,j).applyMatrix4(Mx);if(near(B.x,B.y,B.z)){lp.push(A.x-P0.x,A.y-P0.y,A.z-P0.z,B.x-P0.x,B.y-P0.y,B.z-P0.z);if(!ix){p.setXYZ(j,p.getX(i),p.getY(i),p.getZ(i));p.needsUpdate=true;}continue;}}if(ix)rem.push(i,j);}
    if(lp.length){if(ix)ge.setIndex(new T.BufferAttribute(new ix.constructor(rem),1));const lg=new T.BufferGeometry();lg.setAttribute('position',new T.Float32BufferAttribute(lp,3));const ln=new T.LineSegments(lg,o.material);ln.userData=Object.assign({},o.userData);a.add(ln);}}));
   const ch=new T.InstancedMesh(lk,mA,175);ch.count=0;ch.frustumCulled=false;g.add(ch);
   const dir=P0.clone().sub(Cr).normalize(),q1=new T.Quaternion().setFromUnitVectors(dir,V(0,1,0));
   /* boca do escovém: ponto em que o eixo da haste cruza o chapeamento */
   const Hh=P0.clone();let tO=0;for(;tO<5;tO+=.05){Hh.copy(P0).addScaledVector(dir,-tO);if(Hh.z*s>hb(Hh.x,Hh.y)+.06)break;}
   add('ancora',g,{ex:V(0,0,s*46),layer:'ext'});GLX.anc.push({g:g,a:a,ch:ch,s:s,H:Hh.clone(),A0:P0.clone(),Ao:P0.clone().addScaledVector(dir,-(tO+.5)),A1:V(Hh.x,Hh.y-1,s*(Math.abs(Hh.z)+.8)),q0:new T.Quaternion(),q1:q1,len:P0.distanceTo(Cr)});}catch(e){console.warn('ancora',e);}});
  if(!GLX.anc.length)GLX.anc=null;}
 mkI('superestrutura','super',null,{ex:V(0,34.5,0),shell:true,layer:'super'});
 {const g=G();add('bote',g,{ex:V(0,34.5,0),shell:true,layer:'super'});GLX.boats=[];for(let i=0;i<16;i++){const n=N('boat'+i);if(n){n.traverse(m=>{if(m.isMesh){const c=m.material.clone();c.userData.win=false;if(c.emissive){c.emissive.setRGB(0,0,0);c.emissiveIntensity=1;}m.material=c;}});put(g,'boat'+i);}GLX.boats.push(n||null);}}
 FX=[61,27.5,-6.5,-40.5];[55.3,21,-13,-47].forEach((tx,i)=>{const it=mkI(i<3?'chamine':'chamine4','fun'+(i+1),V(FX[i],34.3,0),{ex:V(0,56,0),shell:true,layer:'super'});it.r0=0;funnelTops.push(V(tx,50.6,0));});
 {const g=G(),it=add('mastro',g,{ex:V(0,26,0),shell:true,layer:'super'});it.r0=0;[['mastF',98.9],['mastM',-78.4]].forEach(q=>{const p=G();p.position.set(q[1],24.3,0);g.add(p);put(p,q[0]);});const rg=G();g.add(rg);put(rg,'rig');add('antena',G(),{shell:true,layer:'super'});}
 {const g=G();add('helice',g,{ex:V(-12,-28,0),layer:'ext',clip:false});[['propP',-110.123,3.162,-6.449,-1,1,[.9999,-.0093,-.0143]],['propS',-110.123,3.164,6.464,1,1,[.9999,-.0094,.0142]],['propC',-118.417,3.631,.008,1,2.2,[1,0,0]]].forEach(q=>{const o=G(),p=G();o.position.set(q[1],q[2],q[3]);o.quaternion.setFromUnitVectors(V(1,0,0),V(q[6][0],q[6][1],q[6][2]).normalize());o.add(p);g.add(o);put(p,q[0]);props.push({o:p,s:q[4],k:q[5]});});}
 rudder=G();rudder.position.set(-121.15,0,0);add('leme',rudder,{ex:V(-16,-8,0),layer:'ext',clip:false});put(rudder,'rudder');
 NEST=V(97.9,37.4,0);
 {const g=G();g.position.set(75.711,30.42,.01);add('timao',g,{ex:V(0,34.5,0),shell:true,layer:'super'});put(g,'wheel');GLX.wheel=g;}
 GLX.telH=[[76.311,2.3855],[76.310,-2.6945],[76.309,-1.5675],[75.979,3.7085],[75.979,-3.696]].map((q,k)=>{const g=G();g.position.set(q[0],30.62,q[1]);add('telegrafoP',g,{ex:V(0,34.5,0),shell:true,layer:'super'});put(g,'telH'+k);return g;});
 /* detalhes interativos presos ao navio: sino da gávea, corda do apito, luzes */
 {const g=G();g.position.set(97.3,39.75,.42);lathe([[.0,0],[.05,-.02],[.09,-.1],[.11,-.24],[.17,-.36],[.19,-.38],[.0,-.38]],mBrass,0,0,0,g,14);sph(.035,mDark,0,-.36,0,g);cyl(.02,.02,.5,mDark,.25,0,0,g,'x');add('sino',g,{layer:'ext',clip:false});GLX.bell=g;}
 /* controle dos apitos (sistema elétrico Willett-Bruce): duas chaves de alavanca na antepara de vante da ponte. Reconstrução aproximada
   a partir de fotos de chaves Willett-Bruce posteriores e das descrições do Olympic: caixa redonda de latão, alavanca com punho preto, posições marcadas */
 {const g=G();add('apito',g,{layer:'ext',clip:false});GLX.wb=[];
  const mBr=M(0xb39a5e,{metalness:.75,roughness:.32}),mBd=M(0x8a7442,{metalness:.7,roughness:.4}),mBk=M(0x111214,{roughness:.35,metalness:.1}),mGl=M(0x6f6f6f,{metalness:.6,roughness:.45});
  const face=(auto)=>ctex(256,256,(c,w,h)=>{const r=c.createRadialGradient(w*.4,h*.35,10,w/2,h/2,w*.55);r.addColorStop(0,'#e8d8a2');r.addColorStop(.6,'#c8b177');r.addColorStop(1,'#9c834a');c.fillStyle=r;c.fillRect(0,0,w,h);
   for(let k=0;k<900;k++){c.fillStyle='rgba(90,70,30,'+(Math.random()*.08).toFixed(3)+')';c.fillRect(Math.random()*w,Math.random()*h,2,1);}
   c.fillStyle='#2a1e0c';c.textAlign='center';c.font='bold 16px Georgia,serif';c.fillText('WILLETT-BRUCE',118,198);c.font='bold 12px Georgia,serif';c.fillText(auto?'AUTOMATIC':'WHISTLE',118,216);c.fillText(auto?'WHISTLE TIMER':'CONTROL',118,231);
   c.font='bold 20px Georgia,serif';c.textBaseline='middle';c.fillText('OFF',128+Math.sin(.62)*92,128-Math.cos(.62)*92);c.fillText(auto?'AUTO':'ON',128+Math.sin(2.15)*90,128-Math.cos(2.15)*90);c.textBaseline='alphabetic';
   [[.5,.1],[.1,.5],[.9,.5]].forEach(q=>{c.fillStyle='#7d6936';c.beginPath();c.arc(q[0]*w,q[1]*h,6,0,7);c.fill();c.strokeStyle='#3d3015';c.lineWidth=2;c.beginPath();c.moveTo(q[0]*w-5,q[1]*h);c.lineTo(q[0]*w+5,q[1]*h);c.stroke();});});
  [[-.94,false],[.94,true]].forEach(q=>{const u=G();u.position.set(76.8,30.15,q[0]);u.rotation.y=-PI/2;u.scale.setScalar(.78);g.add(u);
   cyl(.175,.175,.02,mBd,0,0,.01,u,'z',32);cyl(.156,.16,.1,mBr,0,0,.07,u,'z',32);const f=new T.Mesh(new T.CircleGeometry(.152,40),new T.MeshStandardMaterial({map:face(q[1]),metalness:.55,roughness:.38}));f.position.z=.1205;u.add(f);
   cyl(.022,.026,.08,mGl,0,-.19,.07,u,null,10);cyl(.018,.018,.58,mGl,0,-.47,.05,u,null,8);cyl(.03,.03,.03,mGl,0,-.755,.05,u,null,10);
   const lv=G();lv.position.z=.13;u.add(lv);cyl(.032,.032,.025,mBd,0,0,.005,lv,'z',18);box(.034,.165,.012,mBr,0,.085,.016,lv);cyl(.012,.012,.05,mBr,0,.165,.04,lv,'z',8);const kb=sph(.03,mBk,0,.165,.072,lv);kb.scale.set(1,1,1.1);
   const hit=sph(.2,new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),0,.03,.08,u);hit.userData.wbAuto=q[1];
   lv.rotation.z=-.7;GLX.wb.push({lv:lv,auto:q[1],a:-.7,v:0});});}
 {const g=G(),lm2=c=>new T.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.25});add('luzes',g,{layer:'super',clip:false});GLX.nav=[];GLX.navS=[];GLX.navL=[];[[0xfff0c8,96.6,44.6,0,.7],[0xfff0c8,-132.9,24.1,0,.6],[0x35ff78,72.5,29.8,15.1,.42],[0xff3a2a,72.5,29.8,-15.1,.42]].forEach((q,i)=>{const sp=new T.Sprite(new T.SpriteMaterial({map:dotT,color:q[0],transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));sp.position.set(q[1],q[2],q[3]);sp.scale.setScalar(q[4]);sp.visible=false;root.add(sp);GLX.navS.push(sp);if(i>1){const l=new T.PointLight(q[0],0,7,2);l.position.set(q[1],q[2]+.3,q[3]+(q[3]>0?.9:-.9));root.add(l);GLX.navL.push(l);}});}
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
const berg=(()=>{let g,colT=null;const IB=window.ICEBERG,BT=new Uint8Array(64*4);
 if(IB&&IB.v){const b64=s=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer;},q=new Int16Array(b64(IB.v)),n=q.length/3,P=new Float32Array(n*3);
  for(let i=0;i<n;i++){P[i*3]=q[i*3]/32767;P[i*3+1]=q[i*3+1]/32767-.02;P[i*3+2]=q[i*3+2]/32767;}
  g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(P,3));g.setIndex(new T.BufferAttribute(new Uint16Array(b64(IB.i)),1));g.computeVertexNormals();
  const N=g.attributes.normal.array,C=new Float32Array(n*3),ss=(x,a,b)=>{const u=Math.max(0,Math.min(1,(x-a)/(b-a)));return u*u*(3-2*u);},R=new Float32Array(64);
  for(let i=0;i<n;i++){const x=P[i*3],y=P[i*3+1],z=P[i*3+2],nx=N[i*3],ny=N[i*3+1],nz=N[i*3+2],l=Math.hypot(x,y*1.5,z*1.2)||1,cv=(nx*x+ny*y*1.5+nz*z*1.2)/l;
   const nn=.5+.5*Math.sin(x*23.1+z*17.7)*Math.sin(y*29.3+x*11.9),up=ss(ny*.55+cv*.55+nn*.12,.05,.8);let r,gg,b;
   if(y>=0){r=.60+.34*up;gg=.72+.24*up;b=.82+.16*up;const w=1-ss(y,0,.05);r-=.1*w;gg-=.06*w;b-=.02*w;}
   else{const d=ss(-y,0,.5),k=.55+.45*up;r=(.36-.24*d)*k;gg=(.62-.3*d)*k;b=(.72-.26*d)*k;}
   C[i*3]=r;C[i*3+1]=gg;C[i*3+2]=b;
   if(Math.abs(y)<.07){const a=Math.atan2(z,x),k=Math.floor((a/6.2832+.5)*64)&63;R[k]=Math.max(R[k],Math.hypot(x,z));}}
  /* contorno exato na linha d'água: cruzamento de cada aresta com o plano y = 0 */
  {const ix=g.index.array;for(let t=0;t<ix.length;t+=3)for(let e=0;e<3;e++){const a=ix[t+e],b=ix[t+(e+1)%3],ya=P[a*3+1],yb=P[b*3+1];if((ya<0)!==(yb<0)){const u=ya/(ya-yb),x=P[a*3]+(P[b*3]-P[a*3])*u,z=P[a*3+2]+(P[b*3+2]-P[a*3+2])*u,k=Math.floor((Math.atan2(z,x)/6.2832+.5)*64)&63;R[k]=Math.max(R[k],Math.hypot(x,z));}}}
  for(let k=0;k<64;k++){if(!R[k])R[k]=R[(k+63)&63]||R[(k+1)&63]||.8;}
  {let y0=1e9,y1=-1e9;for(let i=0;i<n;i++){y0=Math.min(y0,P[i*3+1]);y1=Math.max(y1,P[i*3+1]);}const CR=new Float32Array(48*24);for(let i=0;i<n;i++){const x=P[i*3],y=P[i*3+1],z=P[i*3+2],ia=((Math.atan2(z,x)/6.2832+.5)*48|0)%48,k=Math.max(0,Math.min(23,(y-y0)/(y1-y0)*24|0));CR[ia*24+k]=Math.max(CR[ia*24+k],Math.hypot(x,z));}
   const C3=CR.slice();for(let ia=0;ia<48;ia++)for(let k=0;k<24;k++){let v=0;for(let da=-1;da<=1;da++)for(let dk=-1;dk<=1;dk++){const kk=k+dk;if(kk<0||kk>23)continue;v=Math.max(v,CR[((ia+da+48)%48)*24+kk]*(da||dk?.92:1));}C3[ia*24+k]=v;}colT={R:C3,y0:y0,y1:y1};}
  for(let k=0;k<64;k++){const v=(R[(k+63)&63]+2*R[k]+R[(k+1)&63])/4;BT[k*4]=BT[k*4+1]=BT[k*4+2]=Math.min(255,Math.round(v/1.5*255));BT[k*4+3]=255;}
  g.setAttribute('color',new T.BufferAttribute(C,3));}
 else{g=new T.SphereGeometry(1,9,6);const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,Math.max(-.15,p.getY(i)));g.computeVertexNormals();for(let k=0;k<64;k++){BT[k*4]=170;BT[k*4+3]=255;}}
 const m=new T.Mesh(g,new T.MeshStandardMaterial({color:0xffffff,vertexColors:!!g.attributes.color,roughness:.58,metalness:0,emissive:0x0c1822,emissiveIntensity:1}));
 const tx=new T.DataTexture(BT,64,1,T.RGBAFormat);tx.magFilter=tx.minFilter=T.LinearFilter;tx.wrapS=T.RepeatWrapping;tx.needsUpdate=true;m.userData.bt=tx;
 m.scale.setScalar(45);m.position.set(640,WL,-20);m.visible=false;m.userData.noPick=true;m.userData.col=colT;scene.add(m);return m;})();
const SEA_H=`
uniform float uT,uV,uR,uRc,uN,uK,uX;uniform sampler2D uHW,uBT;uniform vec4 uE1,uE2,uB;uniform vec3 uC1,uC2;
float bergD(vec2 p){vec2 q=p-uB.xy;return length(q)-texture2D(uBT,vec2(atan(q.y,q.x)/6.2832+.5,.5)).r*1.5*uB.z;}
float SG(){return uV<0.?-1.:1.;}
float hw(float x){float k=clamp((x+135.)/5.,0.,54.);return texture2D(uHW,vec2((k+.5)/55.,.5)).r*16.*smoothstep(138.5,133.,abs(x));}
float gLod;
/* mar de fundo: 10 trens de onda com a relação de dispersão da água profunda (w=sqrt(gk)), direções espalhadas
   em torno do vento e amplitudes decrescentes (espectro tipo Phillips, vento ~10 m/s, como no arquivo mar.blend);
   ondas mais curtas que o detalhe disponível (malha longe, pixel longe) são filtradas para não serrilhar */
float amb(vec2 p){vec2 q=p+vec2(uX,0.);vec2 wp=q+vec2(sin(q.y*.0091+uT*.031)+.6*sin(q.x*.0137-q.y*.0053+1.7),sin(q.x*.0083-uT*.027)+.6*sin(q.y*.0121+q.x*.0047+.4))*16.;float h=0.;
 for(int i=0;i<12;i++){float fi=float(i),L=86.*pow(.74,fi),a=.45+sin(fi*2.399+.3)*1.1,k=6.2832/L,ph=dot(vec2(cos(a),sin(a)),mix(q,wp,clamp(1.2-fi*.08,.3,1.)))*k-sqrt(9.81*k)*uT+fi*1.93;
  h+=.21*pow(.78,fi)*smoothstep(gLod*2.,gLod*4.,L)*(exp(sin(ph)*1.15-1.15)*1.9-.62);}
 return h;}
float kelv(vec2 p,float x0,float amp){float V=max(abs(uV),2.5),d=x0-p.x;if(d<0.)return 0.;float az=abs(p.y),zc=x0>0.?hw(p.x*SG())+.8+d*.15*smoothstep(0.,50.,d):d*.3+3.,kt=9.81/(V*V),e=exp(-pow((az-zc)/(5.+d*.06),2.));
 float h=amp*e*sin(kt*1.5*(d*.577+az*.816))*exp(-d/260.)*smoothstep(0.,30.,d);
 h+=amp*.38*sin(kt*d)*smoothstep(zc,zc*.45,az)/sqrt(1.+d/160.)*smoothstep(0.,40.,d);return h;}
float shipH(vec2 p){float A=min(1.3,uV*uV/120.*(uV<0.?3.:1.));if(A<.002)return 0.;float az=abs(p.y);vec2 m=vec2(p.x*SG(),p.y);
 float fw=1.-smoothstep(130.,140.,m.x);float bx=134.-m.x,ez=hw(p.x)+.6+max(bx,0.)*.12;float h=A*.62*exp(-pow((bx-1.6)/3.4,2.))*exp(-pow(max(az-hw(p.x),0.)/(2.6+max(bx,0.)*.1),2.))+A*.22*exp(-pow((az-ez)/(1.8+max(bx,0.)*.05),2.))*smoothstep(-1.,4.,bx)*exp(-max(bx,0.)/34.);
 h+=A*.5*exp(-pow((az-hw(p.x)-1.5)/3.,2.))*smoothstep(40.,128.,m.x)*fw;
 {float V2=max(abs(uV),2.5),sd=exp(-pow((az-hw(p.x)-1.4)/3.4,2.))*smoothstep(-136.,-122.,m.x)*fw*smoothstep(.05,1.,hw(p.x));h+=A*sd*(.2*sin((134.-m.x)*9.81/(V2*V2)*1.6)+.14*sin((134.-m.x)*.62-uT*2.3+az*.5));}
 h+=kelv(m,134.,A*.85)+kelv(m,-118.,A*.5);return h;}
float evH(vec2 p,vec4 e){if(e.z<=0.||e.w<=0.)return 0.;float r=length(p-e.xy),rr=r-7.*e.z;return e.w*exp(-e.z/16.)*smoothstep(0.,.6,e.z)*exp(-pow(rr/8.,2.))*sin(.42*rr);}
float crH(vec2 p,vec3 c){if(c.z<=0.)return 0.;vec2 q=(p-c.xy)/vec2(16.,12.);return c.z*.55*exp(-dot(q,q))*sin(uT*1.6+p.x*.31+p.y*.43);}
float seaH(vec2 p){float h=amb(p)*(1.-.35*min(1.,uN))+shipH(p)+evH(p,uE1)+evH(p,uE2)+crH(p,uC1)+crH(p,uC2);if(uB.w>0.){float d=bergD(p);h+=uB.w*.07*exp(-pow(max(d,0.)/9.,2.))*sin(d*.7-uT*.9)*smoothstep(-1.,2.,d);}return h;}
`;
const seaMat=new T.ShaderMaterial({transparent:true,clipping:true,clippingPlanes:CLIP,side:DS,uniforms:{uX:{value:0},uE1:{value:new T.Vector4()},uE2:{value:new T.Vector4()},uC1:{value:new T.Vector3()},uC2:{value:new T.Vector3()},uT:{value:0},uV:{value:0},uR:{value:0},uRc:{value:0},uN:{value:0},uK:{value:0},uHW:{value:null},uSun:{value:V(160,220,180).normalize()},uCam:{value:V(0,0,0)},uB:{value:new T.Vector4(0,0,1,0)},uBT:{value:berg.userData.bt},uUW:{value:0},uFog:{value:new T.Color(0x0b3a55)}},
vertexShader:SEA_H+`#include <clipping_planes_pars_vertex>
varying vec3 vP;void main(){vec3 p=position;gLod=max(4.,4.+.0645*(max(abs(p.x),abs(p.z))-280.));p.y+=seaH(p.xz);vec4 wp=modelMatrix*vec4(p,1.);vP=vec3(position.x,wp.y,position.z);vec4 mvPosition=viewMatrix*wp;gl_Position=projectionMatrix*mvPosition;
#include <clipping_planes_vertex>
}`,
fragmentShader:SEA_H+`#include <clipping_planes_pars_fragment>
uniform vec3 uSun,uCam,uFog;uniform float uUW;varying vec3 vP;
float hsh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hsh(i),hsh(i+vec2(1,0)),f.x),mix(hsh(i+vec2(0,1)),hsh(i+vec2(1,1)),f.x),f.y);}
const mat2 RT=mat2(.8,.6,-.6,.8);float fbm(vec2 p){return .5*vn(p)+.3*vn(RT*p*2.1+7.)+.2*vn(RT*RT*p*4.3+3.);}
/* micro-ondulação: 9 ondas curtas com gradiente analítico (sem grade); somem com a distância */
vec2 micro(vec2 q,float k0){vec2 g=vec2(0.);for(int i=0;i<7;i++){float fi=float(i),L=3.2*pow(.78,fi),a=fi*2.399+1.1,k=6.2832/L;vec2 d=vec2(cos(a),sin(a));float ph=dot(d,q+vec2(sin(q.y*.21+fi),sin(q.x*.19-fi))*1.4)*k-sqrt(9.81*k)*uT*1.1+fi*4.1;g+=d*(.016*k*L/3.2)*cos(ph)*exp(sin(ph)-1.);}
 vec2 r1=RT*q*.9+vec2(uT*.31,uT*.17),r2=RT*RT*q*2.3-vec2(uT*.23,-uT*.29);float e=.08,n0=vn(r1)+.5*vn(r2);g+=vec2(vn(r1+vec2(e,0.))+.5*vn(r2+vec2(e,0.))-n0,vn(r1+vec2(0.,e))+.5*vn(r2+vec2(0.,e))-n0)*.55;return g*k0;}
void main(){
#include <clipping_planes_fragment>
 vec2 p=vP.xz;float dist=length(vP-uCam);float gz=max(.12,abs(normalize(uCam-vP).y));gLod=max(.04,dist*.0016/sqrt(gz));float e=clamp(dist*.003,.3,8.);float h0=seaH(p),hx=seaH(p+vec2(e,0.)),hz=seaH(p+vec2(0.,e));
 vec3 n=normalize(vec3(h0-hx,e,h0-hz));vec2 mp=p+vec2(uX,0.);float nd=smoothstep(700.,40.,dist);vec2 mg=micro(mp,smoothstep(150.,14.,dist/sqrt(gz)));n=normalize(n-vec3(mg.x,0.,mg.y));
 vec3 v=normalize(uCam-vec3(p.x,vP.y,p.y));float fr=.03+.97*pow(1.-max(dot(n,v),0.),5.);
 vec3 R=reflect(-v,n);float ry=clamp(R.y,0.,1.),ah=amb(p);
 /* corpo da água: azul profundo com variação ampla e luz que atravessa as cristas (sem textura repetida) */
 float bv=fbm(RT*mp*.0045+uT*.004);vec3 deep=mix(vec3(.010,.072,.14),vec3(.011,.026,.047),uN)*(.86+.28*bv);
 deep+=(1.-uN)*vec3(.0,.085,.085)*smoothstep(-.1,.9,ah)*(.4+.6*max(0.,dot(-v,uSun)*.5+.5))*(.5+.5*max(0.,dot(n,uSun)));
 /* reflexo do céu em camadas (como o Fresnel em duas camadas do material): horizonte claro, zênite azul, com leve aspereza */
 vec3 skyD=mix(vec3(.66,.76,.86),vec3(.3,.52,.8),pow(ry,.55)),sky=mix(skyD,mix(vec3(.075,.095,.13),vec3(.026,.036,.06),pow(ry,.6)),uN);
 vec3 col=mix(deep,sky,fr*(.9+.1*bv));col+=uN*vec3(.02,.028,.04)*smoothstep(.25,.9,fbm(RT*mp*.09+uT*.05))*nd;
 /* sol: reflexo concentrado + halo largo e alongado (anisotrópico), cintilando com a micro-ondulação */
 {vec3 hv=normalize(uSun+v);float sp=pow(max(dot(R,uSun),0.),420.)*2.4+pow(max(dot(n,hv),0.),70.)*.16;vec3 t1=normalize(cross(n,vec3(0.,0.,1.)));float an=pow(max(0.,1.-abs(dot(t1,hv))*1.6),3.)*pow(max(dot(n,hv),0.),24.)*.05;
  col+=mix(vec3(1.,.95,.84),vec3(.25,.3,.4),uN)*(sp+an)*(.3+.7*nd)*(1.-.88*uN);}
 /* espuma: contato com o casco, onda de proa, cristas do sistema de ondas, esteira das três hélices */
 float A=min(1.,uV*uV/120.*(uV<0.?3.:1.)),az=abs(p.y),w=hw(p.x),f=0.,nz=fbm(mp*.35),nf=fbm(mp*1.3+nz*2.),mx=p.x*SG();
 float bw=1.5+min(134.-mx,70.)*.03,band=smoothstep(bw,0.,az-w)*smoothstep(.05,1.6,w);f+=band*A*(.5+.3*smoothstep(80.,134.,mx)+.3*smoothstep(-95.,-134.,mx))*(.3+1.15*nf+.2*sin(mx*.8+uT*2.6+nz*8.));
 {float sl=exp(-pow((az-w-bw-2.5)/(3.+(134.-mx)*.03),2.))*smoothstep(134.,100.,mx)*smoothstep(.05,1.2,w);f+=A*.36*sl*smoothstep(.42,.8,fbm(mp*vec2(.5,1.6)+nz));}
 float d=134.-mx,zc=w+.5+d*.13*smoothstep(0.,50.,d);float pa=smoothstep(.42,.78,fbm(RT*mp*.42+vec2(uT*.35,0.))*.6+nf*.55);f+=A*.55*exp(-pow((az-zc)/(1.1+d*.06),2.))*exp(-d/60.)*smoothstep(-.5,6.,d)*pa;f+=A*.5*exp(-pow((az-w)/1.2,2.))*smoothstep(-1.,2.,d)*exp(-d/45.)*pa;
 f+=A*.45*smoothstep(.8,1.6,shipH(p))*(.3+nf);
 {vec4 E[2];E[0]=uE1;E[1]=uE2;for(int i=0;i<2;i++){vec4 e=E[i];if(e.z>0.&&e.w>0.){float r=length(p-e.xy),rr=r-7.*e.z;f+=e.w*.7*exp(-e.z/9.)*(exp(-pow(rr/4.,2.))*(.25+nf)+exp(-pow(r/(14.+2.*e.z),2.))*smoothstep(.35,.75,nf));}}
  vec3 C[2];C[0]=uC1;C[1]=uC2;for(int i=0;i<2;i++){vec3 c=C[i];if(c.z>0.){vec2 q=p-c.xy;float ln=length(q),an=atan(q.y,q.x)+uT*.25-ln*.06;vec2 qq=vec2(cos(an),sin(an))*ln;vec2 s2=q/vec2(18.,13.);f+=c.z*exp(-dot(s2,s2))*(.45+fbm(qq*.22+uT*.1));}}}
 float dw=uV<0.?p.x+110.:-110.-p.x;if(dw>0.){float pz=p.y-clamp(uK*dw*dw*.5,-dw*.9,dw*.9);az=abs(pz);float R=clamp(abs(uR)/75.,0.,1.),Rc=clamp(uRc/165.,0.,1.),sp=1.7+dw*.055;vec2 q=vec2(p.x*.25+uT*(1.5+2.5*R),p.y*.6);
  float s3=R*(exp(-pow((pz-6.4)/sp,2.))+exp(-pow((pz+6.4)/sp,2.)))+max(Rc,R*.15)*exp(-pow(pz/sp,2.));float ww=11.+dw*.085,wide=smoothstep(ww,ww*.35,az)*max(R,A*.6);
  float sw=.5+.5*sin(dw*.55-uT*(2.+6.*R)+6.*vn(q*1.7)+pz*.9);float tur=fbm(q*2.2+vec2(sw*.6,uT*.4));
  float wk=mix(s3*(.35+.75*sw),wide*.8,smoothstep(45.,190.,dw))*exp(-dw/420.)*smoothstep(4.,46.,dw);f+=wk*(.3+1.15*tur);col=mix(col,mix(vec3(.05,.33,.36),vec3(.02,.06,.08),uN),clamp(wk*.55,0.,.6));}
 /* carneirinhos raros nas cristas mais altas (cobertura de espuma do .blend), recortados por dois ruídos */
 f+=(1.-.55*uN)*.75*smoothstep(.5,.85,ah)*smoothstep(.55,.82,fbm(RT*mp*.11+nz))*smoothstep(1400.,200.,dist);
 if(uB.w>0.){float bd=bergD(p),ne=exp(-max(bd,0.)/7.);col=mix(col,mix(vec3(.72,.82,.88),vec3(.08,.1,.13),uN),.32*ne*fr*smoothstep(-1.,1.5,bd));col*=1.-.12*ne*(1.-fr);}
 f=clamp(f-.28,0.,1.);f=smoothstep(0.,.75,f);col=mix(col,mix(vec3(.93,.96,.97),vec3(.3,.34,.4),uN),f);
 col=mix(col,mix(vec3(.6,.72,.84),vec3(.045,.06,.09),uN),smoothstep(500.,5200.,dist));
 float al=1.;
 if(uUW>.5){float up=max(-v.y,0.),win=smoothstep(.62,.98,up+.06*(n.x+n.z)*6.);vec3 uc=mix(uFog*1.25,mix(vec3(.2,.5,.6),vec3(.05,.09,.13),uN),win*.85);uc+=mix(vec3(.3,.42,.45),vec3(.04,.05,.06),uN)*f*.5;col=mix(uFog,uc,exp(-dist*.011));al=1.;}
 gl_FragColor=vec4(col,al);}`});
const sea=(()=>{const H=[0];{let x=0,c=4;for(let k=0;k<180;k++){if(k>=70)c*=1.0645;x+=c;H.push(x);}}const A=H.slice(1).reverse().map(x=>-x).concat(H),N=A.length-1,pos=[],idx=[];for(let i=0;i<=N;i++)for(let j=0;j<=N;j++)pos.push(A[i],0,A[j]);for(let i=0;i<N;i++)for(let j=0;j<N;j++){const a=i*(N+1)+j,b=a+N+1;idx.push(a,a+1,b,a+1,b+1,b);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(pos.length/3>65535?new T.Uint32BufferAttribute(idx,1):idx);const m=new T.Mesh(g,seaMat);m.position.y=WL;m.frustumCulled=false;m.userData.noPick=true;scene.add(m);return m;})();
{const d=new Uint8Array(55*4);for(let i=0;i<55;i++){const v=Math.max(0,Math.min(255,Math.round((hb(i*5-135,WL)+(GL?.5:0))/16*255)));d[i*4]=d[i*4+1]=d[i*4+2]=v;d[i*4+3]=255;}const tx=new T.DataTexture(d,55,1,T.RGBAFormat);tx.magFilter=tx.minFilter=T.LinearFilter;tx.needsUpdate=true;seaMat.uniforms.uHW.value=tx;}
sea.renderOrder=-5;
const sky=new T.Mesh(new T.SphereGeometry(90000,24,12),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{uN:{value:0},uT:{value:0},uSun:{value:V(160,220,180).normalize()}},vertexShader:'varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform float uN,uT;uniform vec3 uSun;varying vec3 vD;float sh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float sn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(sh(i),sh(i+vec2(1,0)),f.x),mix(sh(i+vec2(0,1)),sh(i+vec2(1,1)),f.x),f.y);}void main(){float y=clamp(vD.y,0.,1.);vec3 c=mix(vec3(.6,.72,.84),vec3(.2,.42,.74),pow(y,.55));c+=vec3(1.,.9,.7)*pow(max(dot(normalize(vD),uSun),0.),300.)*1.5;vec3 dn=normalize(vD);float sd=max(dot(dn,uSun),0.);c+=(1.-uN)*vec3(.09,.05,.0)*pow(sd,6.)*exp(-y*5.);if(uN<.99&&vD.y>0.){vec2 q=dn.xz/(dn.y+.09)*1.7+vec2(uT*.0045,uT*.0016);mat2 r=mat2(.8,.6,-.6,.8);float cl=.5*sn(q)+.26*sn(r*q*2.03+3.1)+.14*sn(r*r*q*4.1+7.7)+.1*sn(r*q*8.3+1.3);float wv=sn(q*.35+9.);float den=smoothstep(.5-.1*wv,.78,cl)*smoothstep(.02,.16,y);float th=smoothstep(.55,.95,cl);vec3 lit=mix(vec3(1.,.97,.92),vec3(1.,.9,.78),pow(sd,3.)),sh=vec3(.62,.67,.75);vec3 cc=mix(lit,sh,th*.55)+vec3(.25,.18,.1)*pow(sd,10.);c=mix(c,cc,den*.82*(1.-uN));}c=mix(c,mix(vec3(.045,.06,.09),vec3(.008,.012,.03),pow(y,.45)),uN);c=mix(c,mix(vec3(.6,.72,.84),vec3(.045,.06,.09),uN),exp(-y*26.));if(uN>.01){vec3 d=normalize(vD),nm=vec3(.549,.35,-.759),e1=normalize(cross(nm,vec3(0.,1.,0.))),e2=cross(nm,e1);float bd=dot(d,nm);vec2 q=vec2(dot(d,e1),dot(d,e2))*5.;float cl=.5*sn(q*1.3)+.3*sn(q*3.1+5.)+.2*sn(q*7.3+2.);float mw=exp(-bd*bd/.028)*(.3+.9*smoothstep(.3,.8,cl))*(1.-.55*exp(-bd*bd/.0022)*smoothstep(.35,.7,sn(q*2.2+9.)));c+=uN*vec3(.034,.04,.054)*mw*smoothstep(.03,.32,d.y);}if(vD.y<0.)c=mix(vec3(.6,.72,.84),vec3(.045,.06,.09),uN);gl_FragColor=vec4(c,1.);}'}));sky.renderOrder=-10;sky.visible=false;scene.add(sky);
const grid=new T.GridHelper(600,60,0x8fd3ff,0x2b6aa8);grid.position.y=-2;grid.material.transparent=true;grid.material.opacity=.35;grid.visible=false;scene.add(grid);
const dimL=lines([-134.5,-5,20,134.5,-5,20,-134.5,-6.5,20,-134.5,-3.5,20,134.5,-6.5,20,134.5,-3.5,20, 142,0,-14.1,142,0,14.1,142,0,-14.1,139,0,-14.1,142,0,14.1,139,0,14.1, -142,0,0,-142,53.3,0,-144,0,0,-140,0,0,-144,53.3,0,-140,53.3,0, 142,0,18,142,10.5,18,140.5,10.5,18,143.5,10.5,18],0xcfeaff,scene);dimL.visible=false;
const DIMS=[[V(0,-5,20),'COMPRIMENTO 269,1 m (882 pés 9 pol.)'],[V(142,0,0),'BOCA 28,2 m'],[V(-142,28,0),'QUILHA AO TOPO DAS CHAMINÉS 53,3 m'],[V(142,5.2,18),'CALADO 10,5 m']];
const stars=(()=>{const n1=4600,n2=3600,n=n1+n2,a=new Float32Array(n*3),sz=new Float32Array(n),cl=new Float32Array(n*3),nM=V(.549,.35,-.759).normalize(),u=new T.Vector3(),e1=new T.Vector3().crossVectors(nM,V(0,1,0)).normalize(),e2=new T.Vector3().crossVectors(nM,e1);
 let sd=11;const rnd=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};
 for(let i=0;i<n;i++){if(i<n1){const y=rnd()*1.02-.02,th=rnd()*6.2832,r=Math.sqrt(Math.max(0,1-y*y));u.set(r*Math.cos(th),y,r*Math.sin(th));}
  else{const th=rnd()*6.2832,gs=(rnd()+rnd()+rnd()-1.5)*.21;u.copy(e1).multiplyScalar(Math.cos(th)).addScaledVector(e2,Math.sin(th)).addScaledVector(nM,gs).normalize();if(u.y<0)u.multiplyScalar(-1);}
  a[i*3]=u.x*5000;a[i*3+1]=u.y*5000;a[i*3+2]=u.z*5000;const mg=Math.pow(rnd(),i<n1?6:11),b=(i<n1?.3:.2)+.7*mg,t=rnd();sz[i]=(i<n1?1.15:.95)+2.5*mg;cl[i*3]=b*(t<.18?1:.84+.16*t);cl[i*3+1]=b*.93;cl[i*3+2]=b*(t<.18?.78:1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(a,3));g.setAttribute('aS',new T.BufferAttribute(sz,1));g.setAttribute('aC',new T.BufferAttribute(cl,3));
 const p=new T.Points(g,new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{uO:{value:0},uPR:{value:Math.min(window.devicePixelRatio||1,2)}},
  vertexShader:'attribute float aS;attribute vec3 aC;uniform float uPR;varying vec3 vC;varying float vA;void main(){vC=aC;vA=smoothstep(.0,.16,normalize(position).y);gl_PointSize=aS*uPR;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'uniform float uO;varying vec3 vC;varying float vA;void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(vC,smoothstep(.5,.08,d)*vA*uO);}'}));
 p.visible=false;p.frustumCulled=false;p.renderOrder=-9;scene.add(p);return p;})();

