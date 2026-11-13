/* foguista: malha do arquivo Pessoa.obj (geometria única compartilhada), com esqueleto simples
   (quadril, tronco, ombros e cotovelos) e cinemática inversa de dois ossos para segurar a pá */
const STK=(()=>{const F=window.FOGUISTA;if(!F||!F.v)return null;try{
 const b64=s=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer;};
 const P=new Float32Array(b64(F.v)),I=new Uint16Array(b64(F.i)),n=P.length/3,gm=new T.BufferGeometry();
 gm.setAttribute('position',new T.BufferAttribute(P,3));gm.setIndex(new T.BufferAttribute(I,1));gm.computeVertexNormals();
 const ss=(x,a,b)=>{const u=Math.max(0,Math.min(1,(x-a)/(b-a)));return u*u*(3-2*u);};
 const SP=[0,2.23,0],SH=[.45,3.68,0],EL=[1.12,3.08,0],HD=[1.78,2.53,0];
 const seg=(p,a,b)=>{const ab=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],ap=[p[0]-a[0],p[1]-a[1],p[2]-a[2]],L=ab[0]*ab[0]+ab[1]*ab[1]+ab[2]*ab[2];let t=(ap[0]*ab[0]+ap[1]*ab[1]+ap[2]*ab[2])/L;t=Math.max(0,Math.min(1,t));const d=[ap[0]-ab[0]*t,ap[1]-ab[1]*t,ap[2]-ab[2]*t];return[t,Math.hypot(d[0],d[1],d[2])];};
 const si=new Uint16Array(n*4),sw=new Float32Array(n*4),cl=new Float32Array(n*3);
 for(let i=0;i<n;i++){const x=P[i*3],y=P[i*3+1],z=P[i*3+2],ax=Math.abs(x),p=[ax,y,z];
  const s1=seg(p,SH,EL),s2=seg(p,EL,HD);let par,d;if(s2[1]<s1[1]&&s2[0]>0){par=.51+.49*s2[0];d=s2[1];}else{par=.51*s1[0];d=s1[1];}
  const a=(ax>.3&&y>2.3)?ss(par,.02,.13)*(1-ss(d,.24,.36)):0,e=ss(par,.42,.56),ws=ss(y,1.88,2.48),L=x>0;
  si.set([0,1,L?2:4,L?3:5],i*4);sw.set([(1-ws)*(1-a),ws*(1-a),a*(1-e),a*e],i*4);
  let c;const nz=.9+.2*Math.sin(x*13.1+y*7.7)*Math.sin(z*11.3);
  if(y<.36)c=[.11,.085,.065];else if(y<2.3)c=[.15,.15,.165];else if(y>3.95){c=y>4.55&&z<.25?[.1,.08,.07]:[.66,.48,.37];}
  else if(ax>.62||(a>.5&&par>.25))c=[.6,.43,.33];else c=[.5,.48,.44];
  if(y>.36&&y<3.95&&a<.5)c=c.map(v=>v*(1-.35*ss(Math.sin(x*3+z*5),-.2,1)));
  cl.set(c.map(v=>v*nz),i*3);}
 gm.setAttribute('skinIndex',new T.Uint16BufferAttribute(si,4));gm.setAttribute('skinWeight',new T.Float32BufferAttribute(sw,4));gm.setAttribute('color',new T.Float32BufferAttribute(cl,3));
 const mat=new T.MeshStandardMaterial({vertexColors:true,skinning:true,roughness:.85,metalness:0});
 const wood=M(0x7a5a34),iron=M(0x2d3034,{metalness:.6,roughness:.5}),coal=M(0x101012,{roughness:.9}),hg=new T.CylinderGeometry(.05,.05,2.5,6),bg=new T.BoxGeometry(.62,.72,.05),cg=new T.DodecahedronGeometry(.17,0);
 return{gm,mat,wood,iron,coal,hg,bg,cg,SP,SH,EL,HD};}catch(e){console.warn('foguista',e);return null;}})();
function stoker(){if(!STK)return null;const K=STK,g=G();const bn=[0,1,2,3,4,5].map(()=>new T.Bone());
 bn[0].position.set(0,0,0);bn[1].position.set(0,K.SP[1],0);bn[0].add(bn[1]);
 [[2,1],[4,-1]].forEach(q=>{const s=bn[q[0]],e=bn[q[0]+1];s.position.set(q[1]*K.SH[0],K.SH[1]-K.SP[1],0);e.position.set(q[1]*(K.EL[0]-K.SH[0]),K.EL[1]-K.SH[1],0);bn[1].add(s);s.add(e);});
 const m=new T.SkinnedMesh(K.gm,K.mat);m.add(bn[0]);m.bind(new T.Skeleton(bn));m.frustumCulled=false;
 const sv=G(),h=new T.Mesh(K.hg,K.wood);h.position.y=1.25;sv.add(h);const bl=new T.Mesh(K.bg,K.iron);bl.position.set(0,2.84,0);bl.rotation.x=-.12;sv.add(bl);const lp=new T.Mesh(K.cg,K.coal);lp.position.set(0,2.8,-.13);lp.scale.set(1.3,.6,1.2);sv.add(lp);bn[1].add(sv);
 const w=G();w.add(m);m.rotation.y=PI/2;m.scale.setScalar(.36);g.add(w);
 g.userData.stk={bn,sv,lp,w,m};return g;}
const _iq=new T.Quaternion(),_iv=new T.Vector3(),_iu=new T.Vector3(),_if=new T.Vector3(),_ie=new T.Vector3(),_ip=new T.Vector3(),_ir=new T.Vector3();
function armIK(sh,el,side,tg,pole){const K=STK,L1=.9,L2=.86,S=_iv.set(side*K.SH[0],K.SH[1]-K.SP[1],0);
 const d0=_ip.copy(tg).sub(S);let d=d0.length();d=Math.max(.12,Math.min(L1+L2-.02,d));d0.normalize();
 const a=(L1*L1+d*d-L2*L2)/(2*d),h=Math.sqrt(Math.max(0,L1*L1-a*a));_ir.copy(pole).addScaledVector(d0,-pole.dot(d0)).normalize();
 _ie.copy(S).addScaledVector(d0,a).addScaledVector(_ir,h);_iu.copy(_ie).sub(S).normalize();
 const u0=V(side*(K.EL[0]-K.SH[0]),K.EL[1]-K.SH[1],0).normalize();sh.quaternion.setFromUnitVectors(u0,_iu);
 _if.copy(S).addScaledVector(d0,d).sub(_ie).normalize().applyQuaternion(_iq.copy(sh.quaternion).invert());
 el.quaternion.setFromUnitVectors(V(side*(K.HD[0]-K.EL[0]),K.HD[1]-K.EL[1],0).normalize(),_if);}
const _hf=new T.Vector3(),_hr=new T.Vector3(),_pl=new T.Vector3(),_pr=new T.Vector3();
function stokerPose(st,p){const U=st.o.userData.stk,ss=(x,a,b)=>{const u=Math.max(0,Math.min(1,(x-a)/(b-a)));return u*u*(3-2*u);};
 /* ciclo: pega o carvão (0–.3), levanta e gira (.3–.6), atira na fornalha (.6–.72), volta (.72–1) */
 const b=p<.7?ss(p,.28,.6):1-ss(p,.74,.98),jab=Math.sin(PI*ss(p,.08,.3))*(1-b),thr=Math.sin(PI*ss(p,.58,.74));
 st.o.rotation.y=st.base+2.3*(1-b);
 U.bn[1].rotation.set(.12+.5*(1-b)-.1*thr+.08*jab,.25*b*(1-thr*.5),0);
 _hf.set(.12+.05*b,.38+.85*b+.12*thr,1.0+.25*jab+.3*b+.35*thr);_hr.set(-.22,.78+.2*b,.36+.2*b+.2*thr+.12*jab);
 armIK(U.bn[2],U.bn[3],1,_hf,_pl.set(1,-.6,-.4));armIK(U.bn[4],U.bn[5],-1,_hr,_pr.set(-1,-.7,-.5));
 const dir=_iv.copy(_hf).sub(_hr).normalize();U.sv.quaternion.setFromUnitVectors(V(0,1,0),dir);U.sv.position.copy(_hr).addScaledVector(dir,-.3);
 U.lp.visible=p>.16&&p<.67;}
/* ===== MÓDULO 2 — caldeiras, carvão, máquinas alternativas, turbina, eixos, dínamos ===== */
const BRX=[[56.5,4],[38.3,5],[20.8,5],[3.3,5],[-13.7,5],[-27.5,5]];           // salas 6…1 (centro x, nº de caldeiras)
const fireMats=[],xrayMats=[],stokers=[],flows={live:[],exp:[],lp:[],flue:[]};
{const g=G(),dbl=[],sgl=[],fd=[];
 BRX.forEach((b,bi)=>{const n=b[1],single=bi===5,len=single?3.6:6.1;for(let k=0;k<n;k++){const z=(k-(n-1)/2)*5.05;(single?sgl:dbl).push([b[0],z]);
   [-1.35,0,1.35].forEach(o=>{if(single)fd.push([b[0]+len/2+.03,z+o,1]);else{fd.push([b[0]+len/2+.03,z+o,1]);fd.push([b[0]-len/2-.03,z+o,-1]);}});}});
 const sm=M(0x5b3a2e,{metalness:.35,roughness:.6,transparent:true,opacity:1}),m4=new T.Matrix4(),Q=new T.Quaternion().setFromAxisAngle(V(0,0,1),PI/2),E=new T.Quaternion();
 const mk=(arr,len)=>{const im=new T.InstancedMesh(new T.CylinderGeometry(2.4,2.4,len,26),sm,arr.length);arr.forEach((p,i)=>{m4.compose(V(p[0],4.6,p[1]),Q,V(1,1,1));im.setMatrixAt(i,m4);});im.userData.xr=true;g.add(im);
  const sd=new T.InstancedMesh(new T.BoxGeometry(len*.7,.7,3.6),mIron,arr.length);arr.forEach((p,i)=>{m4.compose(V(p[0],2,p[1]),E,V(1,1,1));sd.setMatrixAt(i,m4);});g.add(sd);};
 mk(dbl,6.1);mk(sgl,3.6);
 const fm=new T.MeshStandardMaterial({color:0x331100,emissive:0xff6a1a,emissiveIntensity:1,side:DS}),fi=new T.InstancedMesh(new T.CircleGeometry(.5,14),fm,fd.length),Qa=new T.Quaternion().setFromAxisAngle(V(0,1,0),PI/2);
 fd.forEach((p,i)=>{m4.compose(V(p[0],3.3,p[1]),Qa,V(1,1,1));fi.setMatrixAt(i,m4);});fi.userData.keep=true;fi.userData.fire=true;part(fi,'fornalha');g.add(fi);
 const dr=new T.InstancedMesh(new T.BoxGeometry(.08,.5,.8),mIron,fd.length);fd.forEach((p,i)=>{m4.compose(V(p[0]+p[2]*.05,3.05,p[1]),E,V(1,1,1));dr.setMatrixAt(i,m4);});part(dr,'fornalha');g.add(dr);
 add('caldeira',g,{ex:V(0,-28,0),layer:'maq',clip:false});
 /* carvoeiras transversais (em W) junto às anteparas, condutos de fumaça, piso */
 const cb=G();[66,47,29.6,12,-5.4,-22].forEach((x,i)=>{[-1,1].forEach(d=>{if(i===0&&d>0)return;const ge=new T.BoxGeometry(1.5,6.4,22,2,2,14),p=ge.attributes.position;for(let k=0;k<p.count;k++)if(p.getY(k)>2)p.setY(k,p.getY(k)-Math.random()*1.6);ge.computeVertexNormals();const m=new T.Mesh(ge,mCoal);m.position.set(x+d*1,5,0);cb.add(m);});});
 add('carvao',cb,{shell:true,layer:'int'});
 const up=G(),mu=M(0x2b2e31,{transparent:true,opacity:.5,side:DS,depthWrite:false});
 BRX.forEach((b,bi)=>{const fx=FX[bi>>1];[-6,0,6].forEach(z=>rod(V(b[0],7.2,z),V(fx+(b[0]>fx?1.2:-1.2),20,z*.25),1.1,1,mu,up,10));flows.flue.push([V(b[0],7.2,0),V(fx,20,0),V(fx-.3,DY.BT+3,0),funnelTops[bi>>1]]);});
 FX.slice(0,3).forEach(x=>cyl(3,3.2,10,mu,x-.9,25,0,up,null,20).scale.z=.8);
 add('dutos',up,{ex:V(0,-14,0),layer:'maq',clip:false});
 const fl=G();const f=new T.Mesh(new T.BoxGeometry(99,.1,25),M(0xffffff,{map:plateT}));f.position.set(16.5,1.75,0);fl.add(f);
 [[12.6,-5,PI],[12.6,5,PI],[-9.8,0,0],[-9.8,-10,0],[-1.8,5,PI],[29,0,0],[33.8,-5,PI],[-18.6,10,PI]].forEach((s,i)=>{const sk=stoker(),fg=sk||figure();fg.position.set(s[0],1.8,s[1]);fl.add(fg);stokers.push({o:fg,base:s[2],ph:(i*.37)%1,k:.86+((i*7)%5)*.07,sk:!!sk});});
 [[9,-5],[9,5],[-8,0],[25,0]].forEach(p=>{const c=new T.Mesh(new T.ConeGeometry(1.1,.9,7),mCoal);c.position.set(p[0],2.2,p[1]+1.2);fl.add(c);});
 add('salaCald',fl,{ex:V(0,-33,0),layer:'maq',clip:false});}
function figure(){const g=G(),mb=M(0x50545a),ml=M(0x2a2d33),ms=M(0xc49a7a);box(.14,.8,.16,ml,0,.4,.11,g);box(.14,.8,.16,ml,0,.4,-.11,g);const up=G();up.position.y=.82;box(.24,.6,.42,mb,0,.3,0,up);sph(.12,ms,0,.74,0,up);
 const sv=G();sv.position.set(.15,.35,0);rod(V(0,0,0),V(1.2,-.25,0),.025,.025,M(0x8a6a3a),sv,6);box(.3,.04,.26,mIron,1.3,-.27,0,sv);up.add(sv);g.add(up);g.userData.up=up;return g;}
const fireL=[38,3,-14].map(x=>{const l=new T.PointLight(0xff7a2a,1,30,1.6);l.position.set(x,3.6,0);root.add(l);return l;});

/* máquinas alternativas: 4 cilindros, tripla expansão (BP · AP · MP · BP) */
const engines=[],CR=.95,CL=4,EX=-43.5,EZ=6.4,SY=3.2;
const CX=[5.85,1.95,-1.95,-5.85],CD=[2.46,1.37,2.13,2.46],CN=['BP','AP','MP','BP'];
[-1,1].forEach(s=>{const g=G();g.position.set(EX,SY,s*EZ);const cyls=[];
 box(17.5,1.2,4.4,mIron,0,-1.7,0,g);cyl(.36,.36,17.5,mBright,0,0,0,g,'x');
 [7.8,3.9,0,-3.9,-7.8].forEach(x=>{const c=box(.6,7,.9,mIronG,x,2.4,-1.6,g);c.rotation.x=-.1;cyl(.16,.16,7,mBright,x,2.4,1.7,g);box(.9,.8,3,mIron,x,-.8,0,g);});
 const mv=part(G(),'bielas');g.add(mv);
 CX.forEach((cx,i)=>{const r=CD[i]/2+.16;const c=new T.Mesh(new T.CylinderGeometry(r,r,2.9,26,1,true,.9,PI*2-1.8),mIronG);c.position.set(cx,7.3,0);g.add(c);cyl(r+.1,r+.1,.22,mIronG,cx,8.86,0,g,null,26);cyl(r+.1,r+.1,.18,mIronG,cx,5.78,0,g,null,26);
  cyl(.42,.42,2.4,mIronG,cx,7.3,-(r+.46),g);
  const pg=G();pg.position.x=cx;cyl(CD[i]/2,CD[i]/2,.32,mBright,0,3.3,0,pg,null,22);cyl(.1,.1,3.3,mBright,0,1.65,0,pg);box(.56,.4,.66,mIron,0,0,0,pg);mv.add(pg);
  box(.16,2.6,.66,mIron,cx,4,-.66,g);
  const rg=G();rg.position.x=cx;box(.26,CL,.3,mBright,0,-CL/2,0,rg);mv.add(rg);
  const cr=G();cr.position.x=cx;[-.42,.42].forEach(o=>box(.22,1.45,.7,mIron,o,.42,0,cr));cyl(.2,.2,.84,mBright,0,CR,0,cr,'x');mv.add(cr);
  cyls.push({pg:pg,rg:rg,cr:cr,ph:i*PI/2});});
 engines.push({g:g,s:s,c:cyls});add('maquina',g,{ex:V(0,-28,0),layer:'maq',clip:false});});
/* turbina Parsons de baixa pressão, condensadores, válvulas de mudança */
let rotor;const dynos=[];
{const g=G(),tx=-62.5;const cs=new T.Mesh(new T.CylinderGeometry(2.7,2.7,9.5,30,1,true,.9,PI*2-1.8),mIronG);cs.rotation.z=PI/2;cs.rotation.y=0;cs.position.set(tx,SY+.6,0);
 const cw=G();cw.position.set(tx,SY+.6,0);const c2=new T.Mesh(new T.CylinderGeometry(2.7,2.7,9.5,30,1,true,-.2,PI*1.25),mIronG);c2.rotation.z=PI/2;cw.add(c2);cw.rotation.x=-.5;g.add(cw);
 [-4.85,4.85].forEach(o=>cyl(2.8,2.8,.3,mIronG,tx+o,SY+.6,0,g,'x',30));box(11,1.4,6,mIron,tx,1.9,0,g);
 rotor=part(G(),'rotor');rotor.position.set(tx,SY+.6,0);cyl(1.7,1.7,8.6,mBright,0,0,0,rotor,'x',24);for(let i=0;i<9;i++)cyl(2.1+i*.05,2.1+i*.05,.18,M(0xd9b36a,{metalness:.8,roughness:.3}),-3.8+i*.95,0,0,rotor,'x',30);box(.3,.5,.5,mBrass,4.5,1.2,0,rotor);g.add(rotor);
 add('turbina',g,{ex:V(0,-28,0),layer:'maq',clip:false});
 const c=G();[-1,1].forEach(s=>{box(10,4.4,3.4,mIronG,tx,4,s*9.6,c);cyl(1.2,1.2,.3,mIron,tx-5.2,4,s*9.6,c,'x');});add('condensador',c,{ex:V(0,-28,0),layer:'maq',clip:false});
 const v=G();[-1,1].forEach(s=>{cyl(.9,.9,1.6,mIron,-54.6,11.6,s*EZ,v);const hw=new T.Mesh(new T.TorusGeometry(.6,.07,6,16),mBrass);hw.position.set(-54.6,12.7,s*EZ);hw.rotation.x=PI/2;v.add(hw);sph(.5,mIron,-33.6,11,s*EZ,v);const h2=new T.Mesh(new T.TorusGeometry(.5,.06,6,16),mBrass);h2.position.set(-33.6,11.8,s*EZ);h2.rotation.x=PI/2;v.add(h2);});
 add('valvulas',v,{ex:V(0,-28,0),layer:'maq',clip:false});
 /* piso, plataforma, repetidor do telégrafo, quadro de manômetros */
 const r=G();const fl=new T.Mesh(new T.BoxGeometry(55,.1,25),M(0xffffff,{map:plateT}));fl.position.set(-60.5,1.75,0);r.add(fl);box(20,.08,3,M(0x30353a,{transparent:true,opacity:.6}),EX,7.6,0,r);
 const ra=[];rail(-53,-34,-1.5,7.64,ra);rail(-53,-34,1.5,7.64,ra);lines(ra,0xaab2b8,r);add('salaMaq',r,{ex:V(0,-33,0),layer:'maq',clip:false});
 const t=G();[-1.2,1.2].forEach(z=>{lathe([[.3,0],[.14,.15],[.1,1.1],[.2,1.2],[0,1.2]],mBrass,-36,1.8,z,t,12);const d=cyl(.42,.42,.2,M(0xffffff,{map:dialTex()}),-36,3.25,z,t,'x',24);const hd=G();hd.position.set(-36,3.25,z);box(.05,.6,.05,mDark,-.15,.3,0,hd);t.add(hd);t.userData['h'+(z>0?1:0)]=hd;});
 const gb=new T.Mesh(new T.BoxGeometry(.15,2,4),mBrass);gb.position.set(-33.5,5,0);t.add(gb);for(let i=0;i<6;i++)cyl(.28,.28,.08,M(0xf3efe2),-33.6,4.5+(i/3|0)*.9,-1.2+(i%3)*1.2,t,'x',16);
 add('telegrafoM',t,{ex:V(0,-28,0),layer:'maq',clip:false});
 /* sala dos dínamos: 4 grupos de 400 kW */
 const d=G();[[-76,-4.5],[-76,4.5],[-83,-4.5],[-83,4.5]].forEach(p=>{box(2.4,2.6,1.6,mIronG,p[0]+1.6,3.2,p[1],d);cyl(1.25,1.25,1.8,M(0x2c4a3a),p[0]-.9,3.2,p[1],d,'x',20);const fw=G();fw.position.set(p[0]+.25,3.2,p[1]);cyl(1.1,1.1,.22,mIron,0,0,0,fw,'x',20);box(.24,.3,.3,mBrass,0,.9,0,fw);d.add(fw);dynos.push(fw);cyl(.25,.25,.5,mBrass,p[0]-2,3.2,p[1],d,'x');});
 const sb=new T.Mesh(new T.BoxGeometry(.2,3,9),M(0x2a2620));sb.position.set(-87.4,4,0);d.add(sb);for(let i=0;i<12;i++)cyl(.2,.2,.06,mBrass,-87.25,3.4+(i/6|0)*1.2,-3.8+(i%6)*1.5,d,'x',12);
 const f2=new T.Mesh(new T.BoxGeometry(16,.1,22),M(0xffffff,{map:plateT}));f2.position.set(-79.7,1.75,0);d.add(f2);
 add('dinamo',d,{ex:V(0,-28,0),layer:'maq',clip:false});}
/* linhas de eixo */
const spin=[];
{const g=G();[[-1,-52.5,-100],[1,-52.5,-100]].forEach(q=>{const s=q[0],z=s*EZ;rod(V(-52.5,SY+.15,z),V(-109.3,3.16,s*6.45),.34,.34,mBright,g,16);const sp=G();sp.position.set(0,SY+.15,z);for(let x=-58;x>=-96;x-=9){cyl(.6,.6,.36,mIron,x,0,0,sp,'x');box(.4,.2,.2,mBrass,x,.62,0,sp);}g.add(sp);spin.push({o:sp,s:s,k:1});box(2.4,2.2,2.2,mIronG,-54.5,2.9,z,g);});
 rod(V(-67.5,SY,0),V(-117.3,3.63,0),.3,.3,mBright,g,16);const sc=G();sc.position.set(0,SY,0);for(let x=-72;x>=-110;x-=10){cyl(.52,.52,.3,mIron,x,0,0,sc,'x');box(.34,.18,.18,mBrass,x,.54,0,sc);}g.add(sc);spin.push({o:sc,s:1,k:2.2});box(2,1.9,1.9,mIronG,-69.5,2.8,0,g);
 add('eixo',g,{ex:V(0,-28,0),layer:'maq',clip:false});}
/* tubulação de vapor e percursos das partículas */
{const g=G(),mT=M(0xd8d2c0,{roughness:.9,transparent:true,opacity:.32,depthWrite:false});
 const Pp=(pts,r,k)=>{pipe(pts,r,mT,g);flows[k].push(pts);};
 [-3.2,3.2].forEach(z=>{Pp([V(60,9.2,z),V(-32,9.2,z)],.3,'live');});
 BRX.forEach(b=>[-1,1].forEach(s=>Pp([V(b[0],7.1,s*7.5),V(b[0],9.2,s*7.5),V(b[0],9.2,s*3.2)],.2,'live')));
 [-1,1].forEach(s=>{const z=s*EZ,x=i=>EX+CX[i];Pp([V(-32,9.2,s*3.2),V(-33.6,11,z),V(x(1)+1.2,12.4,z),V(x(1),12.2,z)],.28,'live');
  Pp([V(x(1),12.2,z),V(x(1)-.8,13,z),V(x(2)+.8,13,z),V(x(2),12.2,z)],.34,'exp');
  Pp([V(x(2),12.2,z),V(x(2)-.6,13.4,z),V(x(3)+.8,13.4,z),V(x(3),12.2,z)],.42,'exp');Pp([V(x(2),12.2,z),V(x(2),13.9,z),V(x(0)-.6,13.9,z),V(x(0),12.2,z)],.42,'exp');
  Pp([V(x(3),12.2,z),V(-54.6,11.6,z),V(-58,9.5,s*2),V(-60,6.9,s*.8)],.7,'lp');Pp([V(-62.5,6.4,s*1.5),V(-62.5,6.4,s*6),V(-62.5,5.6,s*8.4)],.8,'lp');});
 add('tubos',g,{ex:V(0,-18,0),layer:'maq',clip:false});}
function Flow(paths,color,size,dens){this.t=[];const self=this;paths.forEach(p=>{let Ls=0;const seg=[];for(let i=0;i<p.length-1;i++){const d=p[i].distanceTo(p[i+1]);seg.push(d);Ls+=d;}const n=Math.max(2,Math.round(Ls*dens));for(let i=0;i<n;i++)self.t.push({p:p,seg:seg,L:Ls,o:i/n+Math.random()*.03});});
 const g=new T.BufferGeometry();this.a=new Float32Array(this.t.length*3);g.setAttribute('position',new T.BufferAttribute(this.a,3));this.o=new T.Points(g,new T.PointsMaterial({size:size,map:dotT,color:color,transparent:true,opacity:.95,depthWrite:false}));this.o.frustumCulled=false;this.s=0;root.add(this.o);}
Flow.prototype.step=function(d){this.s+=d;const a=this.a;for(let i=0;i<this.t.length;i++){const q=this.t[i];let dist=((q.o+this.s/q.L)%1)*q.L,k=0;while(k<q.seg.length-1&&dist>q.seg[k]){dist-=q.seg[k];k++;}const f=dist/q.seg[k],A=q.p[k],B=q.p[k+1];a[i*3]=A.x+(B.x-A.x)*f;a[i*3+1]=A.y+(B.y-A.y)*f;a[i*3+2]=A.z+(B.z-A.z)*f;}this.o.geometry.attributes.position.needsUpdate=true;};
const fLive=new Flow(flows.live,0xffffff,.75,.7),fExp=new Flow(flows.exp,0xbfe6ff,.8,1.2),fLp=new Flow(flows.lp,0x7fc4ff,.9,1.2),fFlue=new Flow(flows.flue,0x8c8c8c,1.4,.5);
const smokeT=ctex(128,128,(c,w,h)=>{c.clearRect(0,0,w,h);for(let i=0;i<16;i++){const a=Math.random()*6.283,d=Math.random()*26,x=64+Math.cos(a)*d,y=64+Math.sin(a)*d,r=22+Math.random()*22,g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,255,255,.2)');g.addColorStop(.6,'rgba(255,255,255,.08)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,w,h);}});smokeT.wrapS=smokeT.wrapT=T.ClampToEdgeWrapping;
const smoke=[];{const sm=new T.SpriteMaterial({map:smokeT,color:0x555555,transparent:true,opacity:0,depthWrite:false});for(let i=0;i<60;i++){const s=new T.Sprite(sm.clone());s.userData={life:Math.random(),v:V(0,0,0),f:i%3};s.visible=false;root.add(s);smoke.push(s);}}
/* volumes de água da simulação de alagamento (um por compartimento) */
const CB=[134.5].concat(BH).concat([-134.5]),floodM=[];
{const g=G();for(let i=0;i<16;i++){const x0=CB[i+1],x1=CB[i],xm=(x0+x1)/2,w=Math.max(hb(xm,8),hb(x0,9),hb(x1,9))-.15;const m=new T.Mesh(new T.BoxGeometry(x1-x0-.3,1,w*2),new T.MeshStandardMaterial({color:0x2f8fe0,transparent:true,opacity:.55,roughness:.2,depthWrite:false}));m.position.set(xm,0,0);m.visible=false;m.userData.noPick=true;m.userData.keep=true;g.add(m);floodM.push(m);}
 add('agua',g,{layer:'flood'});}
