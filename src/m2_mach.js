/* foguista: malha do arquivo Pessoa.obj (geometria única compartilhada). Esqueleto: quadril, tronco, cabeça, ombros/cotovelos e coxas/pernas;
   mãos e pés são resolvidos por cinemática inversa de dois ossos — as mãos seguem a pá, os pés ficam plantados no piso */
const STK=(()=>{const F=window.FOGUISTA;if(!F||!F.v)return null;try{
 const b64=s=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer;};
 const P=new Float32Array(b64(F.v)),I=new Uint16Array(b64(F.i)),n=P.length/3,gm=new T.BufferGeometry();
 gm.setAttribute('position',new T.BufferAttribute(P,3));gm.setIndex(new T.BufferAttribute(I,1));gm.computeVertexNormals();
 const ss=(x,a,b)=>{const u=Math.max(0,Math.min(1,(x-a)/(b-a)));return u*u*(3-2*u);};
 const SP=[0,2.5,0],SH=[.45,3.68,0],EL=[1.12,3.08,0],HD=[1.78,2.53,0],HP=[.25,2.45,.05],KN=[.3,1.3,.04],AN=[.36,.2,0];
 const seg=(p,a,b)=>{const ab=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],ap=[p[0]-a[0],p[1]-a[1],p[2]-a[2]],L=ab[0]*ab[0]+ab[1]*ab[1]+ab[2]*ab[2];let t=(ap[0]*ab[0]+ap[1]*ab[1]+ap[2]*ab[2])/L;t=Math.max(0,Math.min(1,t));const d=[ap[0]-ab[0]*t,ap[1]-ab[1]*t,ap[2]-ab[2]*t];return[t,Math.hypot(d[0],d[1],d[2])];};
 const si=new Uint16Array(n*4),sw=new Float32Array(n*4),cl=new Float32Array(n*3),N=gm.attributes.normal.array;
 for(let i=0;i<n;i++){const x=P[i*3],y=P[i*3+1],z=P[i*3+2],ax=Math.abs(x),p=[ax,y,z],L=x>0;
  const s1=seg(p,SH,EL),s2=seg(p,EL,HD);let par,d;if(s2[1]<s1[1]&&s2[0]>0){par=.51+.49*s2[0];d=s2[1];}else{par=.51*s1[0];d=s1[1];}
  const a=(ax>.3&&y>2.3)?ss(par,.02,.13)*(1-ss(d,.24,.36)):0,e=ss(par,.42,.56),ws=ss(y,2.35,2.95);
  if(a>.001){si.set([0,1,L?2:4,L?3:5],i*4);sw.set([(1-ws)*(1-a),ws*(1-a),a*(1-e),a*e],i*4);}
  else if(y>3.86){const wh=ss(y,3.9,4.12);si.set([1,10,0,0],i*4);sw.set([1-wh,wh,0,0],i*4);}
  else{const wT=1-ss(y,2.15,2.62),wS=1-ss(y,1.08,1.5);si.set([0,1,L?6:8,L?7:9],i*4);sw.set([(1-ws)*(1-wT),ws*(1-wT),wT*(1-wS),wT*wS],i*4);}
  /* cores por região: pele, camiseta encardida com suspensórios, calça escura, botas; fuligem e sombra suave */
  const nz=.96+.07*Math.sin(x*13.1+y*7.7)*Math.sin(z*11.3),ao=.82+.18*Math.max(0,N[i*3+1]*.5+.5),soot=.5+.5*Math.sin(x*4.1+y*2.3+1.7)*Math.sin(z*5.2+y*3.1);let c;
  if(y<.4)c=[.075,.06,.05];
  else if(y<2.56)c=y>2.44?[.11,.085,.06]:[.105,.105,.125];
  else if(y>3.92)c=(y>4.5&&z<.22)||(y>4.68)?[.085,.065,.055]:[.6,.44,.35];
  else if(a>.5&&par>.2)c=[.58,.42,.33];
  else{c=[.47,.455,.42];if(ax>.17&&ax<.27)c=[.2,.16,.12];}
  const st=(a>.5&&par>.2)||y>3.92?.14:.22,k=nz*ao*(1-st*ss(soot,.35,1));
  cl.set([c[0]*k,c[1]*k,c[2]*k],i*3);}
 gm.setAttribute('skinIndex',new T.Uint16BufferAttribute(si,4));gm.setAttribute('skinWeight',new T.Float32BufferAttribute(sw,4));gm.setAttribute('color',new T.Float32BufferAttribute(cl,3));
 const mat=new T.MeshStandardMaterial({vertexColors:true,skinning:true,roughness:.88,metalness:0});
 /* pá de carvão: empunhadura em D, cabo de madeira, soquete e lâmina de aço côncava com a ponta arredondada (eixo local +y, face para +z) */
 const wood=M(0x6e4d2c,{roughness:.8}),steel=new T.MeshStandardMaterial({color:0x3a3d41,metalness:.75,roughness:.42,side:T.DoubleSide}),coal=M(0x0c0c0e,{roughness:.95});
 const bl=new T.PlaneGeometry(.8,1.02,8,6),bp=bl.attributes.position;for(let i=0;i<bp.count;i++){const x=bp.getX(i),y=bp.getY(i),u=x/.4,v=(y+.51)/1.02,tp=1-.34*ss(v,.62,1)*u*u-.1*(1-v);bp.setXYZ(i,x*tp*(1-.22*ss(v,.75,1)),y,.13*u*u*(1-.5*v)+.1*(1-ss(v,0,.22))-.03*v);}bl.computeVertexNormals();
 const lumpG=new T.DodecahedronGeometry(.2,1),lp=lumpG.attributes.position;for(let i=0;i<lp.count;i++){const k=1+.3*Math.sin(lp.getX(i)*23+lp.getY(i)*17)*Math.sin(lp.getZ(i)*29);lp.setXYZ(i,lp.getX(i)*k*1.5,lp.getY(i)*k*1.9,lp.getZ(i)*k*.6);}lumpG.computeVertexNormals();
 return{gm:gm,mat:mat,wood:wood,steel:steel,coal:coal,bl:bl,lumpG:lumpG,shaft:new T.CylinderGeometry(.042,.05,2.1,8),grip:new T.CylinderGeometry(.04,.04,.34,8),strut:new T.CylinderGeometry(.028,.028,.3,6),sock:new T.CylinderGeometry(.05,.085,.34,8),SP:SP,SH:SH,EL:EL,HD:HD,HP:HP,KN:KN,AN:AN};}catch(e){console.warn('foguista',e);return null;}})();
function stoker(){if(!STK)return null;const K=STK,g=G(),bn=[];for(let i=0;i<11;i++)bn.push(new T.Bone());
 bn[0].position.set(0,0,0);bn[1].position.set(0,K.SP[1],0);bn[0].add(bn[1]);bn[10].position.set(0,3.95-K.SP[1],0);bn[1].add(bn[10]);
 [[2,1],[4,-1]].forEach(q=>{const s=bn[q[0]],e=bn[q[0]+1];s.position.set(q[1]*K.SH[0],K.SH[1]-K.SP[1],0);e.position.set(q[1]*(K.EL[0]-K.SH[0]),K.EL[1]-K.SH[1],0);bn[1].add(s);s.add(e);});
 [[6,1],[8,-1]].forEach(q=>{const s=bn[q[0]],e=bn[q[0]+1];s.position.set(q[1]*K.HP[0],K.HP[1],K.HP[2]);e.position.set(q[1]*(K.KN[0]-K.HP[0]),K.KN[1]-K.HP[1],K.KN[2]-K.HP[2]);bn[0].add(s);s.add(e);});
 const m=new T.SkinnedMesh(K.gm,K.mat);m.add(bn[0]);m.bind(new T.Skeleton(bn));m.frustumCulled=false;
 const sv=G(),add2=(geo,mt,x,y,z,rz)=>{const o=new T.Mesh(geo,mt);o.position.set(x,y,z);if(rz)o.rotation.z=rz;sv.add(o);return o;};
 add2(K.grip,K.wood,0,.03,0,PI/2);add2(K.strut,K.steel,-.13,.17,0,-.32);add2(K.strut,K.steel,.13,.17,0,.32);add2(K.shaft,K.wood,0,1.33,0);add2(K.sock,K.steel,0,2.5,.02);add2(K.bl,K.steel,0,3.12,.0);
 const lp=new T.Group();lp.position.set(0,3.16,.1);sv.add(lp);[[0,0,0,1.6],[-.17,.02,.05,1.15],[.16,-.02,.04,1.25],[.04,.14,.06,1.0],[-.06,-.15,.07,1.1]].forEach((q,j)=>{const c=new T.Mesh(COAL.g[j],COAL.m);c.position.set(q[0],q[1],q[2]);c.scale.setScalar(q[3]);c.rotation.set(j,j*2,j*.7);lp.add(c);});m.add(sv);
 const w=G();w.add(m);m.rotation.y=PI/2;m.scale.setScalar(.36);g.add(w);g.userData.stk={bn:bn,sv:sv,lp:lp,m:m};return g;}
const _iq=new T.Quaternion(),_iv=new T.Vector3(),_iu=new T.Vector3(),_if=new T.Vector3(),_ie=new T.Vector3(),_ip=new T.Vector3(),_ir=new T.Vector3(),_u0=new T.Vector3(),_u1=new T.Vector3();
/* cinemática inversa de dois ossos: S = origem do 1º osso no referencial do pai; A,B,C = articulações em repouso */
function ik2(b1,b2,sx,sy,sz,A,B,C,side,tg,pole){const L1=Math.hypot(B[0]-A[0],B[1]-A[1],B[2]-A[2]),L2=Math.hypot(C[0]-B[0],C[1]-B[1],C[2]-B[2]),S=_iv.set(sx,sy,sz);
 const d0=_ip.copy(tg).sub(S);let d=d0.length();d=Math.max(.15,Math.min(L1+L2-.015,d));d0.normalize();
 const a=(L1*L1+d*d-L2*L2)/(2*d),h=Math.sqrt(Math.max(0,L1*L1-a*a));_ir.copy(pole).addScaledVector(d0,-pole.dot(d0)).normalize();
 _ie.copy(S).addScaledVector(d0,a).addScaledVector(_ir,h);_iu.copy(_ie).sub(S).normalize();
 _u0.set(side*(B[0]-A[0]),B[1]-A[1],B[2]-A[2]).normalize();b1.quaternion.setFromUnitVectors(_u0,_iu);
 _if.copy(S).addScaledVector(d0,d).sub(_ie).normalize().applyQuaternion(_iq.copy(b1.quaternion).invert());
 _u1.set(side*(C[0]-B[0]),C[1]-B[1],C[2]-B[2]).normalize();b2.quaternion.setFromUnitVectors(_u1,_if);}
/* quadros do ciclo: fase, empunhadura (x,y,z), direção do cabo (x,y,z), quadril (y,z), flexão e torção do tronco */
const SKF2=[[0,-.25,2.1,.1,.1,-.62,.78,-.5,.25,.85,.12],[.2,-.2,1.82,.68,.08,-.5,.86,-.56,.5,.88,.06],[.4,-.38,2.3,.05,.16,-.1,.98,-.14,.08,.28,-.12],[.56,-.6,2.5,-.4,.28,-.06,.96,-.1,-.14,.1,-.42],[.68,-.06,3.3,.78,.03,.32,1,-.2,.38,.3,.3],[.84,-.3,2.4,.2,.12,-.3,.95,-.06,.1,.16,0],[1,-.25,2.1,.1,.1,-.62,.78,-.5,.25,.85,.12]];
const _kv=new Float32Array(10),_G=new T.Vector3(),_D=new T.Vector3(),_hf=new T.Vector3(),_hr=new T.Vector3(),_pl=new T.Vector3(),_tq=new T.Quaternion(),_tm=new T.Matrix4(),_x=new T.Vector3(),_z=new T.Vector3(),_ft=new T.Vector3(),_e=new T.Euler();
function stokerPose(st,p){const U=st.o.userData.stk,K=STK,ss=(x,a,b)=>{const u=Math.max(0,Math.min(1,(x-a)/(b-a)));return u*u*(3-2*u);};
 let k=0;while(k<SKF2.length-2&&p>SKF2[k+1][0])k++;const A=SKF2[k],B=SKF2[k+1],f=ss(p,A[0],B[0]);for(let i=0;i<10;i++)_kv[i]=A[i+1]+(B[i+1]-A[i+1])*f;
 /* gira o corpo entre o monte de carvão e a fornalha, com um passo curto de cada pé */
 const b=p<.6?ss(p,.33,.55):1-ss(p,.8,.99),stp=p<.6?ss(p,.33,.55):ss(p,.8,.99),lf=Math.sin(PI*Math.min(1,stp*2))*(stp<.5?1:0),rf=Math.sin(PI*Math.max(0,stp*2-1))*(stp>=.5?1:0);
 st.o.rotation.y=st.base+2.3*(1-b);
 const hy=_kv[6]-.05*(lf+rf),hz=_kv[7],bend=_kv[8],tw=_kv[9];U.bn[0].position.set(0,hy,hz);
 U.bn[1].quaternion.setFromEuler(_e.set(bend,tw,0,'YXZ'));U.bn[10].quaternion.setFromEuler(_e.set(-bend*.55,-tw*.5,0,'YXZ'));
 ik2(U.bn[6],U.bn[7],K.HP[0],K.HP[1],K.HP[2],K.HP,K.KN,K.AN,1,_ft.set(.38,.2+.14*lf-hy,.46-hz),_pl.set(.15,0,1));
 ik2(U.bn[8],U.bn[9],-K.HP[0],K.HP[1],K.HP[2],K.HP,K.KN,K.AN,-1,_ft.set(-.38,.2+.14*rf-hy,-.34-hz),_pl.set(-.2,0,1));
 /* pá no espaço do modelo; as mãos vão até ela (convertidas para o referencial do tronco) */
 _G.set(_kv[0],_kv[1],_kv[2]);_D.set(_kv[3],_kv[4],_kv[5]).normalize();_x.set(0,1,0).cross(_D).normalize().negate();_z.crossVectors(_x,_D);_tm.makeBasis(_x,_D,_z);U.sv.quaternion.setFromRotationMatrix(_tm);U.sv.position.copy(_G);
 _tq.copy(U.bn[1].quaternion).invert();
 _hr.copy(_G).addScaledVector(_D,.04);_hr.y-=hy+K.SP[1];_hr.z-=hz;_hr.applyQuaternion(_tq);
 _hf.copy(_G).addScaledVector(_D,1.38);_hf.y-=hy+K.SP[1];_hf.z-=hz;_hf.applyQuaternion(_tq);
 const sy=K.SH[1]-K.SP[1];ik2(U.bn[2],U.bn[3],K.SH[0],sy,0,K.SH,K.EL,K.HD,1,_hf,_pl.set(1,-.5,-.5));ik2(U.bn[4],U.bn[5],-K.SH[0],sy,0,K.SH,K.EL,K.HD,-1,_hr,_pl.set(-1,-.6,-.6));
 U.lp.visible=p>.2&&p<.665;}
/* carvão: pedras irregulares (icosaedros deformados, 5 formas), material escuro com leve brilho; montes com base achatada */
const COAL=(()=>{const g=[];for(let k=0;k<5;k++){const ge=new T.IcosahedronGeometry(.13,1),p=ge.attributes.position,sx=.8+((k*37)%7)*.08,sy=.55+((k*53)%5)*.09,sz=.75+((k*29)%6)*.07;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),f=1+.28*Math.sin(x*31+k*7)*Math.sin(y*27+k*3)+.16*Math.sin(z*43+x*11+k);p.setXYZ(i,x*sx*f,y*sy*f,z*sz*f);}ge.computeVertexNormals();g.push(ge);}
 return{g:g,m:new T.MeshStandardMaterial({color:0x111214,roughness:.58,metalness:.12,flatShading:true})};})();
function coalPiles(list,parent){const n=46,ims=COAL.g.map(ge=>{const im=new T.InstancedMesh(ge,COAL.m,list.length*n);im.count=0;im.frustumCulled=false;parent.add(im);return im;}),m4=new T.Matrix4(),q=new T.Quaternion(),e=new T.Euler(),c=new T.Color();let sd=7;const rnd=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};
 const bm=new T.MeshStandardMaterial({color:0x101113,roughness:.9,metalness:.05,flatShading:true});
 list.forEach(L=>{const bg=new T.ConeGeometry(.95,.34,11,2),bp=bg.attributes.position;for(let i=0;i<bp.count;i++){const y=bp.getY(i);if(y>-.16)bp.setXYZ(i,bp.getX(i)*(.85+rnd()*.3),y-rnd()*.05,bp.getZ(i)*(.85+rnd()*.3));}bg.computeVertexNormals();const b=new T.Mesh(bg,bm);b.position.set(L[0],1.97,L[1]);b.rotation.y=rnd()*6;parent.add(b);
  for(let k=0;k<n;k++){const r=Math.sqrt(rnd())*.88,a=rnd()*6.283,s=.65+rnd()*1.15,y=1.84+.36*(1-r/.95)+.06*s+rnd()*.05,im=ims[(k+L[2])%ims.length];e.set(rnd()*6,rnd()*6,rnd()*6);q.setFromEuler(e);
   m4.compose(V(L[0]+Math.cos(a)*r,y,L[1]+Math.sin(a)*r),q,V(s,s,s));im.setMatrixAt(im.count,m4);const v=.6+rnd()*.4;c.setRGB(v,v,v*1.04);if(!im.instanceColor)im.instanceColor=new T.InstancedBufferAttribute(new Float32Array(im.instanceMatrix.count*3),3);im.setColorAt(im.count,c);im.count++;}});
 ims.forEach(im=>{im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;});}
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
 const fl=G();const f=new T.Mesh(new T.BoxGeometry(99,.1,25),M(0xffffff,{map:plateT}));f.position.set(16.5,1.75,0);f.userData.clipMe=true;fl.add(f);
 /* cada foguista fica a 1,3 m da porta da fornalha, de frente para ela; o monte de carvão fica atrás, para onde ele gira ao encher a pá */
 const DR=[[17.72,-5.05,1],[23.88,5.05,-1],[6.38,0,-1],[.22,-5.05,1],[35.22,0,1],[41.38,10.1,-1],[-10.62,5.05,-1],[-16.78,-10.1,1]],piles=[];
 DR.forEach((d,i)=>{const sx=d[0]-d[2]*1.3,base=d[2]>0?0:PI,sk=stoker(),fg=sk||figure();fg.position.set(sx,1.8,d[1]);fl.add(fg);const yw=base+2.3;piles.push([sx+Math.cos(yw)*1.05,d[1]-Math.sin(yw)*1.05,i]);
  const fly=[];if(sk)for(let j=0;j<3;j++){const c=new T.Mesh(COAL.g[j%COAL.g.length],COAL.m);c.scale.setScalar(.55+.2*j);c.visible=false;fl.add(c);fly.push(c);}
  stokers.push({o:fg,base:base,ph:(i*.37)%1,k:.86+((i*7)%5)*.07,sk:!!sk,door:V(d[0]-d[2]*.15,3.3,d[1]),fly:fly,rel:null});});
 piles.push([9,-3.6,8],[9,6.4,9],[-8,1.4,10],[25,1.4,11]);coalPiles(piles,fl);
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
 const r=G();const fl=new T.Mesh(new T.BoxGeometry(55,.1,25),M(0xffffff,{map:plateT}));fl.position.set(-60.5,1.75,0);fl.userData.clipMe=true;r.add(fl);box(20,.08,3,M(0x30353a,{transparent:true,opacity:.6}),EX,7.6,0,r);
 const ra=[];rail(-53,-34,-1.5,7.64,ra);rail(-53,-34,1.5,7.64,ra);lines(ra,0xaab2b8,r);add('salaMaq',r,{ex:V(0,-33,0),layer:'maq',clip:false});
 /* telégrafos da casa de máquinas: mesma geometria e materiais do telégrafo da ponte, adaptados a receptor —
    um ponteiro repete a ordem vinda da ponte (e a campainha toca); a alavanca é a resposta do maquinista */
 const telSrc=(()=>{if(!GL||!GLX.telH||!GLX.telH[0])return null;const sup=items.find(i=>i.id==='superestrutura');if(!sup)return null;root.updateMatrixWorld(true);
  const inv=new T.Matrix4().copy(root.matrixWorld).invert(),B=new T.Box3(V(76.03,29.53,2.14),V(76.6,30.93,2.64)),O=V(76.311,29.55,2.3855),out=[],v=new T.Vector3();
  sup.o.traverse(m=>{if(!m.isMesh||!m.geometry||!m.geometry.attributes.position)return;const ge=m.geometry,p=ge.attributes.position;if(!ge.boundingBox)ge.computeBoundingBox();const Mx=new T.Matrix4().multiplyMatrices(inv,m.matrixWorld);if(!ge.boundingBox.clone().applyMatrix4(Mx).intersectsBox(B))return;
   const dp=!p.normalized?1:(p.array instanceof Int16Array?32767:p.array instanceof Uint16Array?65535:p.array instanceof Int8Array?127:255),ix=ge.index?ge.index.array:null,n=Math.floor((ix?ix.length:p.count)/3),P=new Float32Array(p.count*3),ok=new Uint8Array(p.count);
   for(let i=0;i<p.count;i++){v.set(p.getX(i)/dp,p.getY(i)/dp,p.getZ(i)/dp).applyMatrix4(Mx);ok[i]=B.containsPoint(v)?1:0;P[i*3]=v.x-O.x;P[i*3+1]=v.y-O.y;P[i*3+2]=v.z-O.z;}
   const take=[];for(let k=0;k<n;k++){const a=ix?ix[k*3]:k*3,b=ix?ix[k*3+1]:k*3+1,c=ix?ix[k*3+2]:k*3+2;if(ok[a]&&ok[b]&&ok[c])take.push(a,b,c);}if(!take.length)return;
   const mp=new Map(),ni=take.map(q=>{let w=mp.get(q);if(w===undefined){w=mp.size;mp.set(q,w);}return w;}),g=new T.BufferGeometry(),np=new Float32Array(mp.size*3);mp.forEach((w,q)=>{np[w*3]=P[q*3];np[w*3+1]=P[q*3+1];np[w*3+2]=P[q*3+2];});g.setAttribute('position',new T.BufferAttribute(np,3));
   const uv=ge.attributes.uv;if(uv){const base=uv.isInterleavedBufferAttribute?uv.data.array:uv.array,ua=new base.constructor(mp.size*2);mp.forEach((w,q)=>{ua[w*2]=uv.getX(q);ua[w*2+1]=uv.getY(q);});g.setAttribute('uv',new T.BufferAttribute(ua,2,uv.normalized));}
   g.setIndex(ni);g.computeVertexNormals();out.push([g,m.userData.real||m.material]);});
  return out.length>3?out:null;})();
 const t=G(),tHs=[],tNs=[];
 [-1.2,1.2].forEach(z=>{const u=G();u.position.set(-36,1.8,z);t.add(u);
  if(telSrc){u.rotation.y=PI/2;u.scale.setScalar(1.3);telSrc.forEach(q=>u.add(new T.Mesh(q[0],q[1])));
   const hs=GLX.telH[0],ud=[];hs.traverse(o=>{ud.push([o,o.userData]);o.userData={};});const h=hs.clone(true);ud.forEach(q=>{q[0].userData=q[1];});h.position.set(0,1.07,0);h.rotation.set(0,0,0);u.add(h);tHs.push(h);
   [-1,1].forEach(sd=>{const nd=G();nd.position.set(0,1.075,sd*.172);box(.013,.15,.004,mDark,0,.08,0,nd);box(.022,.04,.004,M(0xb3261a),0,.17,0,nd);cyl(.016,.016,.007,mBrass,0,0,0,nd,'z',10);u.add(nd);tNs.push(nd);});
   const gg=sph(.065,mBrass,-.16,.7,0,u);gg.scale.set(.45,1,1);cyl(.012,.012,.1,mBrass,-.11,.7,0,u,'x',8);}
  else{lathe([[.3,0],[.14,.15],[.1,1.1],[.2,1.2],[0,1.2]],mBrass,0,0,0,u,12);const dm=M(0xffffff,{map:dialTex()}),d=new T.Mesh(new T.CylinderGeometry(.42,.42,.2,24),[mBrass,dm,dm]);d.rotation.z=PI/2;d.position.y=1.45;u.add(d);const hd=G();hd.position.set(0,1.45,0);box(.05,.6,.05,mDark,-.15,.3,0,hd);u.add(hd);tHs.push(hd);}});
 t.userData.hs=tHs;t.userData.ns=tNs;t.userData.k=telSrc?.36:.5;
 const gb=new T.Mesh(new T.BoxGeometry(.15,2,4),mBrass);gb.position.set(-33.5,5,0);t.add(gb);for(let i=0;i<6;i++)cyl(.28,.28,.08,M(0xf3efe2),-33.6,4.5+(i/3|0)*.9,-1.2+(i%3)*1.2,t,'x',16);
 add('telegrafoM',t,{ex:V(0,-28,0),layer:'maq',clip:false});
 /* sala dos dínamos: 4 grupos de 400 kW */
 const d=G();[[-76,-4.5],[-76,4.5],[-83,-4.5],[-83,4.5]].forEach(p=>{box(2.4,2.6,1.6,mIronG,p[0]+1.6,3.2,p[1],d);cyl(1.25,1.25,1.8,M(0x2c4a3a),p[0]-.9,3.2,p[1],d,'x',20);const fw=G();fw.position.set(p[0]+.25,3.2,p[1]);cyl(1.1,1.1,.22,mIron,0,0,0,fw,'x',20);box(.24,.3,.3,mBrass,0,.9,0,fw);d.add(fw);dynos.push(fw);cyl(.25,.25,.5,mBrass,p[0]-2,3.2,p[1],d,'x');});
 const sb=new T.Mesh(new T.BoxGeometry(.2,3,9),M(0x2a2620));sb.position.set(-87.4,4,0);d.add(sb);for(let i=0;i<12;i++)cyl(.2,.2,.06,mBrass,-87.25,3.4+(i/6|0)*1.2,-3.8+(i%6)*1.5,d,'x',12);
 const f2=new T.Mesh(new T.BoxGeometry(16,.1,22),M(0xffffff,{map:plateT}));f2.position.set(-79.7,1.75,0);f2.userData.clipMe=true;d.add(f2);
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
