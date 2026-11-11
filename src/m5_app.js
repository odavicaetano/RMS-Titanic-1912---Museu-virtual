/* ===== MÓDULO 5 — estado, modos, câmera, interface, simuladores ===== */
/* zonas (ambientes) por convés */
{const byDeck={};ZD.forEach(z=>{(byDeck[z[1]]=byDeck[z[1]]||[]).push(z);});
 DECKS.forEach(d=>{const zs=byDeck[d[0]];if(!zs)return;const g=G();zs.forEach(z=>{const m=box(z[3]-z[2],2.3,z[5]-z[4],new T.MeshBasicMaterial({color:ZCOL[z[6]],transparent:true,opacity:.62,depthWrite:false,depthTest:false}),(z[2]+z[3])/2,DY[z[1]]+1.2,(z[4]+z[5])/2,g);part(m,z[0]);});add('zonas',g,{ex:V(0,d[2],0),layer:'zone',deck:d[0],clip:false});});}
const meshes=[],byPart={},lineObjs=[];
const mkF=(c,h)=>new T.MeshBasicMaterial({color:h?0xffe08a:0x4da3ff,transparent:true,opacity:h?.3:.06,depthWrite:false,side:DS,clippingPlanes:c});
const mkL=(c,h)=>new T.LineBasicMaterial({color:h?0xffe08a:0x9bd8ff,transparent:true,opacity:h?1:.65,clippingPlanes:c});
const BPF={c:mkF(CLIP),n:mkF(NOCLIP),ch:mkF(CLIP,1),nh:mkF(NOCLIP,1)},BPL={c:mkL(CLIP),n:mkL(NOCLIP),ch:mkL(CLIP,1),nh:mkL(NOCLIP,1)};
items.forEach(it=>{it.o.traverse(o=>{
 if(o.isMesh){const cl=m=>{const c=m.clone();if(it.clip){c.clippingPlanes=CLIP;if(c.side===T.FrontSide&&!o.userData.noEdge&&it.id!=='casco'&&it.id!=='chamine'&&it.id!=='chamine4')c.side=DS;}return c;};o.material=Array.isArray(o.material)?o.material.map(cl):cl(o.material);
  o.userData.real=o.material;o.userData.it=it;let p=o,id=null;while(p){if(p.userData.part){id=p.userData.part;break;}p=p.parent;}o.userData.pid=id;(byPart[id]=byPart[id]||[]).push(o);meshes.push(o);}
 else if(o.isLineSegments){if(it.clip)o.material.clippingPlanes=CLIP;o.userData.it=it;lineObjs.push(o);}});});
if(GL){const A={chamine:[25,44,0],chamine4:[-45,46,0],mastro:[-86,50,0],gavea:[97.9,38.3,0],antena:[0,68,0],bote:[48,32,13.6],leme:[-124,5,0],helice:[-110.1,3.8,6.5],ponte:[74,32.4,0],superestrutura:[-30,28,13.2],sino:[97.3,39.5,.42],apito:[62.6,44,0]};Object.keys(A).forEach(k=>{if(P[k])P[k].a=A[k];});}
ORDER.forEach(id=>{const p=P[id];p.it=byPart[id]?byPart[id][0].userData.it:null;p.av=V(p.a[0],p.a[1],p.a[2]);});
P.proa.it=P.popa.it=P.casco.it;ORDER.forEach(id=>{if(!P[id].it&&P[id].g==='e')P[id].it=P.casco.it;});
const winMats=[];meshes.forEach(m=>{const r=m.userData.real;if(!Array.isArray(r)&&r.userData&&r.userData.win&&winMats.indexOf(r)<0)winMats.push(r);});
items.forEach(it=>{it.inner=GL&&(it.layer==='estr'||it.layer==='conves'||it.layer==='int'||it.layer==='maq');});
let edgesBuilt=false;const edgeCache=new Map();
function buildEdges(){meshes.forEach(m=>{if(m.isInstancedMesh||m.userData.keep||m.userData.noEdge)return;let e=edgeCache.get(m.geometry.uuid);if(!e){e=new T.EdgesGeometry(m.geometry,32);edgeCache.set(m.geometry.uuid,e);}const l=new T.LineSegments(e,BPL.n);l.visible=false;m.add(l);m.userData.edge=l;});edgesBuilt=true;}
const fireMesh=meshes.filter(m=>m.userData.fire),xr=meshes.filter(m=>m.userData.xr),glowM=meshes.filter(m=>m.userData.glow);
const telM=items.find(i=>i.id==='telegrafoM').o;

/* ================= ESTADO ================= */
const S={mode:'navio',bp:false,cut:false,ax:'z',cutV:50,ex:0,exT:0,ghost:false,labels:false,sel:[],run:true,tab:null,cat:null,deck:'BT',night:false,visit:null,fp:false,walk:null,gavea:false,q:''};
const sim={rpm:0,trpm:0,kn:0,ang:0,tang:0,sph:0,burn:.6};const nav={h:0,rud:0,rate:0};S.nf=0;S.berg=true;S.snd=true;S.amb=true;
const tel={ord:8,eng:8,ack:8,stage:0,t:0};
const F={p:V(0,0,0),yaw:0,pitch:0};
const sk={t:0,play:false,np:false};let pLock=false;
const fl={on:new Set(),sp:new Set(),lvl:new Array(16).fill(0),sink:0,trim:0,over:false,msg:'',H:null};
function applyLook(){const bp=S.bp,conv=S.mode==='conveses';S.closed=GL&&S.mode==='navio'&&!bp&&!S.cut&&S.exT===0&&S.ex<.02&&S.tab!=='flood';if(bp&&!edgesBuilt)buildEdges();
 meshes.forEach(m=>{const it=m.userData.it,hi=S.sel.indexOf(m.userData.pid)>=0,k=(it.clip?'c':'n')+(hi?'h':''),r=m.userData.real;
  m.material=(bp&&!m.userData.keep&&it.layer!=='zone')?BPF[k]:r;if(m.userData.edge){m.userData.edge.visible=bp;m.userData.edge.material=BPL[k];}
  const gh=(S.ghost||conv)&&it.shell&&!bp&&!(conv&&it.deck===S.deck);
  (Array.isArray(r)?r:[r]).forEach(mm=>{if(m.userData.keep)return;if(mm.userData.o0===undefined)mm.userData.o0=[mm.transparent,mm.opacity,mm.depthWrite,mm.emissive?mm.emissive.getHex():0,mm.emissiveIntensity];const o=mm.userData.o0;
   if(gh){mm.transparent=true;mm.opacity=.03;mm.depthWrite=false;}else{mm.transparent=o[0];mm.opacity=o[1];mm.depthWrite=o[2];}
   if(mm.emissiveMap||(mm.userData&&mm.userData.win)){}
   else if(mm.emissive){if(hi&&!bp){mm.emissive.setHex(0x1f7ae0);mm.emissiveIntensity=.45;}else{mm.emissive.setHex(o[3]);mm.emissiveIntensity=o[4];}}});});
 xr.forEach(m=>{const r=m.userData.real;r.opacity=(S.ghost&&!bp&&!S.walk)?.35:1;r.depthWrite=!(S.ghost&&!bp&&!S.walk);});
 
 lineObjs.forEach(l=>{if(l.userData.bpOnly){l.visible=bp;return;}l.material.color.setHex(bp?0x9bd8ff:l.userData.rc);l.material.opacity=((S.ghost||conv)&&l.userData.it.shell&&!bp)?.08:.8;});
 items.forEach(it=>{let v=true;if(it.layer==='zone')v=conv&&it.deck===S.deck;else if(it.layer==='flood')v=S.tab==='flood';else if(conv)v=it.deck===S.deck||it.id==='casco'||(S.deck==='T'&&it.layer==='maq');else if(S.ghost&&!bp&&it.shell&&(S.walk||it.id!=='casco'))v=false;else if(S.closed&&it.inner)v=false;it.o.visible=v;});
 const inS=!!S.visit;root.visible=!inS;setsG.visible=inS;
 sea.visible=!bp&&!S.ghost&&!conv&&S.exT===0&&!inS;grid.visible=bp&&!inS;dimL.visible=bp&&S.exT===0&&!inS;berg.visible=S.gavea&&S.berg;
 const app=$('#app');app.classList.toggle('bp',bp&&!inS);app.classList.toggle('night',S.night&&!bp&&!inS);app.classList.toggle('in',inS);$('#bBP').classList.toggle('on',bp);$('#bNight').classList.toggle('on',S.night);
 sky.visible=sea.visible;
 if(S.cut&&!inS){if(S.ax==='z'){clip.normal.set(0,0,-1);clip.constant=(S.cutV-50)*.29;}else{clip.normal.set(-1,0,0);clip.constant=(S.cutV-50)*2.7;}}else clip.constant=1e4;
 $('#cutbar').classList.toggle('show',S.cut&&!inS);$('#deckbar').classList.toggle('show',conv&&!inS);
 $$('#cutbar [data-ax]').forEach(b=>b.classList.toggle('on',b.dataset.ax===S.ax));$$('#deckbar .chip').forEach(b=>b.classList.toggle('on',b.dataset.d===S.deck));
 $$('.lbl').forEach(b=>b.classList.toggle('on',S.sel.indexOf(b.dataset.id)>=0));
 $('#bExit').classList.toggle('hide',!(inS||S.walk||S.gavea));$('#bWalk').classList.toggle('hide',!inS);$('#bWalk').classList.toggle('on',S.fp);
 $('#dpad').classList.toggle('show',S.fp&&!S.gavea);
 const w=$('#where');if(inS){w.innerHTML=SETS[S.visit].n+'<small>Reconstrução visual · '+(S.fp?'arraste para olhar, setas para andar; atravesse uma porta para mudar de ambiente':'toque em 👣 para caminhar ou numa porta para passar')+'</small>';w.classList.add('show');}
 else if(S.gavea){w.innerHTML='Gávea do mastro de proa<small>Arraste para olhar em volta</small>';w.classList.add('show');}
 else if(S.walk){w.innerHTML=(S.walk==='ponte'?'Ponte de comando':S.walk==='maquinas'?'Casa de máquinas':'Salas de caldeiras')+'<small>'+(S.walk==='ponte'?'Arraste para olhar, setas para andar · toque num lado do timão para virar o leme, num telégrafo (à frente/atrás) para dar ordens, na corda para o apito':'Arraste para olhar, setas para andar')+'</small>';w.classList.add('show');}else w.classList.remove('show');
 if(S.fp){cam.near=.1;cam.updateProjectionMatrix();}if(S.tab==='sink'&&sk.bow)sinkApply();}

/* ================= CÂMERA ================= */
const C={t:V(0,14,0),th:.7,ph:1.25,r:400};let tween=null;
function hTan(){return Math.tan(cam.fov*PI/360)*Math.min(cam.aspect,1.9);}
function rFor(span){return Math.max(span*.5/hTan(),span*.9);}
function fly(o,ms){tween={f:{t:C.t.clone(),th:C.th,ph:C.ph,r:C.r},to:{t:o.t||C.t.clone(),th:o.th===undefined?C.th:o.th,ph:o.ph===undefined?C.ph:o.ph,r:o.r||C.r},k:0,ms:ms||900};
 let d=tween.to.th-tween.f.th;while(d>PI)d-=2*PI;while(d<-PI)d+=2*PI;tween.to.th=tween.f.th+d;}
function camUpdate(dt){
 if(S.fp){cam.position.set(F.p.x,F.p.y+1.62,F.p.z);const cp=Math.cos(F.pitch),tg=V(F.p.x-Math.sin(F.yaw)*cp,F.p.y+1.62+Math.sin(F.pitch),F.p.z-Math.cos(F.yaw)*cp);if(!S.visit){root.updateMatrixWorld(true);cam.position.applyMatrix4(root.matrixWorld);tg.applyMatrix4(root.matrixWorld);}cam.lookAt(tg);return;}
 if(tween){tween.k=Math.min(1,tween.k+dt*1000/tween.ms);const e=tween.k<.5?2*tween.k*tween.k:1-Math.pow(-2*tween.k+2,2)/2,f=tween.f,o=tween.to;C.t.lerpVectors(f.t,o.t,e);C.th=f.th+(o.th-f.th)*e;C.ph=f.ph+(o.ph-f.ph)*e;C.r=f.r+(o.r-f.r)*e;if(tween.k>=1)tween=null;}
 const sp=Math.sin(C.ph);cam.position.set(C.t.x+C.r*sp*Math.sin(C.th),C.t.y+C.r*Math.cos(C.ph),C.t.z+C.r*sp*Math.cos(C.th));cam.lookAt(C.t);const nr=Math.max(.5,Math.min(30,C.r*.03));if(Math.abs(cam.near-nr)>nr*.15){cam.near=nr;cam.updateProjectionMatrix();}}
function preset(m){const full=rFor(225);
 if(m==='blueprint')return{t:V(0,12,0),th:.55,ph:1.12,r:full};
 if(m==='corte')return S.ax==='z'?{t:V(0,12,0),th:.25,ph:1.3,r:rFor(290)}:{t:V(0,14,0),th:1.25,ph:1.25,r:rFor(90)};
 if(m==='explodido')return{t:V(0,16,0),th:.75,ph:1.2,r:full*1.35};
 if(m==='conveses')return cam.aspect<1?{t:V(0,DY[S.deck],0),th:-PI/2,ph:.42,r:300/Math.tan(cam.fov*PI/360)*.5}:{t:V(0,DY[S.deck],0),th:.001,ph:.5,r:rFor(240)*.92};
 if(m==='maq')return{t:V(-52,6,2),th:.5,ph:1.1,r:rFor(60)};
 if(m==='cald')return{t:V(12,6,2),th:.45,ph:1.05,r:rFor(80)};
 return{t:V(0,14,0),th:.7,ph:1.25,r:full};}
function leave(){S.visit=null;S.fp=false;S.walk=null;S.gavea=false;morseStop();}
function setMode(m,noFly){if(S.tab==='sink'||S.tab==='flood'||S.tab==='gavea')closeSheet();leave();S.mode=m;S.bp=m==='blueprint';S.cut=m==='corte';S.exT=m==='explodido'?1:0;S.ghost=m==='maq'||m==='cald';S.labels=m!=='navio';
 $$('#modes button').forEach(b=>b.classList.toggle('on',b.dataset.m===m));applyLook();if(!noFly)fly(preset(m));if(m==='conveses'){if(cam.aspect>=1&&S.tab!=='ficha')openTab('deck');else if(cam.aspect<1&&S.tab&&S.tab!=='ficha')closeSheet();}else if(S.tab==='deck')closeSheet();}
function buildSet(id){const s=SETS[id];if(s.g)return s;const g=G();g.position.copy(s.O);s.build(g);setsG.add(g);s.g=g;s.meshes=[];g.traverse(o=>{if(o.isMesh)s.meshes.push(o);});return s;}
function visit(id,focus){if(SETS[id].ship){walk('ponte');return;}const s=buildSet(id);leave();if(S.tab==='deck'||S.tab==='flood'||S.tab==='sink'||(window.innerWidth<900&&S.tab&&S.tab!=='ficha'&&!focus))closeSheet();S.visit=id;S.bp=false;S.cut=false;S.exT=0;S.ex=0;Object.keys(SETS).forEach(k=>{if(SETS[k].g)SETS[k].g.visible=k===id;});applyLook();
 const c=focus&&P[focus]?V(P[focus].a[0],P[focus].a[1],P[focus].a[2]):V(s.c[0],s.c[1],s.c[2]);C.t.copy(s.O).add(c);C.r=focus?Math.max(6,rFor(5)):Math.max(s.r,rFor(s.r)*.8);C.th=focus==='cab2'||focus==='cab3'||focus==='cab1'?1.57:.9;C.ph=1.0;tween=null;}
function startFP(from){if(window.innerWidth<900&&S.tab&&S.tab!=='lift')closeSheet();if(S.visit){const s=SETS[S.visit],sp=s.spawn,d=from&&s.doors&&s.doors.find(q=>q.t===from);
 if(d){F.p.set(s.O.x+d.p[0]+d.n[0]*1.3,s.O.y+d.p[1],s.O.z+d.p[2]+d.n[1]*1.3);F.yaw=Math.atan2(-d.n[0],-d.n[1]);pLock=true;}else{F.p.set(s.O.x+sp[0],s.O.y+sp[1],s.O.z+sp[2]);F.yaw=sp[3];}F.pitch=0;S.fp=true;applyLook();}}
function fadeDo(fn){const f=$('#fade');f.classList.add('on');setTimeout(()=>{fn();setTimeout(()=>f.classList.remove('on'),160);},260);}
function travel(t,from){from=from||S.walk;if(t==='lift'){pLock=true;S.liftFrom=from;openTab('lift');return;}const fp=S.fp;fadeDo(()=>{visit(t);if(fp)startFP(from);if(S.tab==='lift')closeSheet();});}
function portals(){const s=S.visit?SETS[S.visit]:WALK[S.walk],O=S.visit?s.O:Z0;if(!s||!s.doors)return;let near=false;for(let i=0;i<s.doors.length;i++){const d=s.doors[i],dx=F.p.x-(O.x+d.p[0]),dz=F.p.z-(O.z+d.p[2]),dy=Math.abs(F.p.y-(O.y+d.p[1])),r=Math.hypot(dx,dz);if(dy>1)continue;if(r<1.5)near=true;if(r<.8&&!pLock){travel(d.t,S.visit||S.walk);return;}}if(!near)pLock=false;}
function walk(id){if(window.innerWidth<900&&S.tab)closeSheet();setMode(id==='ponte'?'navio':'maq',true);S.walk=id;const sp=WALK[id].spawn;F.p.set(sp[0],sp[1],sp[2]);F.yaw=sp[3];F.pitch=0;S.fp=true;applyLook();}
function gavea(){setMode('navio',true);S.gavea=true;S.fp=true;F.p.set(NEST.x,NEST.y-.4,0);F.yaw=-PI/2;F.pitch=-.12;applyLook();openTab('gavea');}
function exitAll(){const was=S.visit||S.walk||S.gavea;if(S.tab==='gavea')closeSheet();leave();if(was){S.mode='navio';setMode('navio');}}
const Z0=V(0,0,0);
/* caminhada: escolhe, entre as superfícies sob o ponto, a mais próxima da altura atual */
function surfY(list,O,x,z,y){let best=null;for(let i=0;i<list.length;i++){const s=list[i];if(x<s[0]+O.x||x>s[1]+O.x||z<s[2]+O.z||z>s[3]+O.z)continue;const sy=O.y+(typeof s[4]==='function'?s[4]({x:x-O.x,z:z-O.z}):s[4]);if(Math.abs(sy-y)<=.75&&(best===null||Math.abs(sy-y)<Math.abs(best-y)))best=sy;}return best;}
const keys={};
function fpMove(dt){if(S.gavea)return;let f=(keys.w?1:0)-(keys.s?1:0),r=(keys.d?1:0)-(keys.a?1:0);if(!f&&!r)return;const sp=(S.walk?5:2.6)*dt,sx=-Math.sin(F.yaw),sz=-Math.cos(F.yaw),dx=(sx*f-sz*r)*sp,dz=(sz*f+sx*r)*sp;
 const list=S.visit?SETS[S.visit].surf:WALK[S.walk].surf,O=S.visit?SETS[S.visit].O:Z0;
 let y=surfY(list,O,F.p.x+dx,F.p.z+dz,F.p.y);if(y!==null){F.p.x+=dx;F.p.z+=dz;F.p.y=y;}
 else{y=surfY(list,O,F.p.x+dx,F.p.z,F.p.y);if(y!==null){F.p.x+=dx;F.p.y=y;}else{y=surfY(list,O,F.p.x,F.p.z+dz,F.p.y);if(y!==null){F.p.z+=dz;F.p.y=y;}}}
 if(S.visit||S.walk)portals();}
window.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;if(!S.fp&&!S.visit&&S.tab!=='sink'&&S.tab!=='flood'){const q=e.key;if(q==='ArrowLeft'||q==='ArrowRight'){nav.rud=Math.max(-35,Math.min(35,nav.rud+(q==='ArrowRight'?5:-5)));rudUI();e.preventDefault();return;}if(q==='ArrowUp'||q==='ArrowDown'){sendOrder(Math.max(0,Math.min(8,tel.ord+(q==='ArrowUp'?1:-1))));e.preventDefault();return;}if(q==='h'||q==='H'){if(!e.repeat)blowWhistle();return;}}const k={ArrowUp:'w',ArrowDown:'s',ArrowLeft:'a',ArrowRight:'d'}[e.key]||e.key.toLowerCase();if('wasd'.indexOf(k)>=0&&k.length===1){keys[k]=true;if(S.fp)e.preventDefault();}});
window.addEventListener('keyup',e=>{const k={ArrowUp:'w',ArrowDown:'s',ArrowLeft:'a',ArrowRight:'d'}[e.key]||e.key.toLowerCase();keys[k]=false;});
$$('#dpad button').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true;});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>{keys[k]=false;}));});

/* ================= ENTRADA ================= */
const ptr=new Map();let moved=0,downT=0,pd=0,pcx=0,pcy=0;
function pan(dx,dy){const k=C.r*.0016,right=V(Math.cos(C.th),0,-Math.sin(C.th));C.t.addScaledVector(right,-dx*k);C.t.y+=dy*k;}
cv.addEventListener('pointerdown',e=>{try{cv.setPointerCapture(e.pointerId);}catch(_){}ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});if(ptr.size===1){moved=0;downT=performance.now();}tween=null;$('#hint').style.opacity=0;
 if(ptr.size===2){const a=[...ptr.values()];pd=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);pcx=(a[0].x+a[1].x)/2;pcy=(a[0].y+a[1].y)/2;}});
cv.addEventListener('pointermove',e=>{const p=ptr.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;moved+=Math.abs(dx)+Math.abs(dy);
 if(S.fp){if(ptr.size===1){F.yaw+=dx*.005;F.pitch=Math.max(-1.2,Math.min(1.2,F.pitch+dy*.004));}return;}
 if(ptr.size===1){if((e.buttons&2)||e.shiftKey)pan(dx,dy);else{C.th-=dx*.006;C.ph=Math.max(.08,Math.min(1.95,C.ph-dy*.005));}}
 else if(ptr.size===2){const a=[...ptr.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),cx=(a[0].x+a[1].x)/2,cy=(a[0].y+a[1].y)/2;if(pd>0)C.r=Math.max(2,Math.min(2500,C.r*pd/d));pan(cx-pcx,cy-pcy);pd=d;pcx=cx;pcy=cy;}});
function pUp(e){if(!ptr.has(e.pointerId))return;const one=ptr.size===1;ptr.delete(e.pointerId);if(one&&moved<9&&performance.now()-downT<600)pick(e.clientX,e.clientY);}
cv.addEventListener('pointerup',pUp);cv.addEventListener('pointercancel',e=>ptr.delete(e.pointerId));
cv.addEventListener('wheel',e=>{e.preventDefault();if(S.fp)return;tween=null;C.r=Math.max(2,Math.min(2500,C.r*Math.exp(e.deltaY*.0012)));},{passive:false});
cv.addEventListener('contextmenu',e=>e.preventDefault());
const ray=new T.Raycaster(),ndc=new T.Vector2();
function pick(x,y){hist.length=0;const r=cv.getBoundingClientRect();ndc.set((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1);ray.setFromCamera(ndc,cam);
 if(S.visit){const hs=ray.intersectObjects(SETS[S.visit].meshes,false);for(let i=0;i<hs.length;i++){if(hs[i].object.userData.door){travel(hs[i].object.userData.door,S.visit);return;}let p=hs[i].object,id=null;while(p){if(p.userData.part){id=p.userData.part;break;}p=p.parent;}if(id&&P[id]){S.sel=[id];openTab('ficha');return;}if(hs[i].object.material.opacity>.5)break;}return;}
 const hs=ray.intersectObjects(meshes,false),conv=S.mode==='conveses';
 for(let i=0;i<hs.length;i++){const h=hs[i],m=h.object,it=m.userData.it;if(m.userData.noPick||!m.visible||(!it.o.visible&&!it.hg))continue;if((S.ghost||conv)&&it.shell&&!S.bp&&!(conv&&it.deck===S.deck))continue;if(conv&&it.layer!=='zone'&&it.layer!=='maq')continue;
  if(it.clip&&S.cut&&clip.distanceToPoint(h.point)<0)continue;if(m.userData.door){travel(m.userData.door,S.walk);return;}let id=m.userData.pid;const lp=root.worldToLocal(h.point.clone());
  if(id==='apito'){blowWhistle();S.sel=['apito'];if(window.innerWidth>=900)openTab('ficha');return;}if(id==='sino'){ringBell(1);S.sel=['sino'];if(window.innerWidth>=900)openTab('ficha');return;}if(S.gavea)continue;
  if(S.walk==='ponte'&&id==='timao'){nav.rud=Math.max(-35,Math.min(35,nav.rud+(lp.z>0?5:-5)));rudUI();flash('Leme: '+(nav.rud===0?'a meio':Math.abs(nav.rud)+'° a '+(nav.rud>0?'boreste':'bombordo')));return;}
  if(S.walk==='ponte'&&id==='telegrafoP'){ac();sendOrder(Math.max(0,Math.min(8,tel.ord+(lp.x>(lp.x<76.14?75.979:76.31)?1:-1))));flash('Telégrafo: '+ORDERS[tel.ord]+' — '+ORD_PT[tel.ord]);return;}
  if(GL&&(id==='casco'||id==='superestrutura')){const x=lp.x,y=lp.y,az=Math.abs(lp.z);if(S.walk==='ponte'){id=(x>73.6&&x<76.8&&y<31.45)?(az<1.25?(x>75.75?'bussola':'timao'):'telegrafoP'):'ponte';}else if(x>66.5&&x<77.3&&y>29.3&&y<33.2)id='ponte';else if(y>29.6&&y<33.4&&az>10.2&&((x>36&&x<66)||(x>-72&&x<-28)))id='bote';else if(x>95)id='proa';else if(x<-104)id='popa';}
  else if(id==='casco'){if(lp.x>95)id='proa';else if(lp.x<-104)id='popa';}
  if(S.fp&&P[id]&&P[id].g==='s'){S.sel=[id];openTab('ficha');return;}
  if(!P[id])continue;select([id]);return;}
 select([]);}
function flash(t){const w=$('#where small');if(w)w.textContent=t;}
function select(ids,focus){S.sel=ids;applyLook();if(ids.length){openTab('ficha');if(focus){const p=P[ids[0]];fly({t:root.localToWorld(anchor(p)),r:Math.max(p.r,rFor(p.r*.5)*.55)},800);}}else if(S.tab==='ficha')closeSheet();}
function anchor(p){const v=p.av.clone();if(p.it)v.addScaledVector(p.it.ex,S.ex);return v;}
function goto(id){const p=P[id];if(!p)return;
 if(p.g==='s'){visit(p.set,id);S.sel=[id];if(!S.fp||window.innerWidth>=900)openTab('ficha');return;}
 if(p.g==='z'){S.deck=p.deck;setMode('conveses',true);S.sel=[id];applyLook();openTab('ficha');fly({t:anchor(p),th:cam.aspect<1?-PI/2:.001,ph:.45,r:Math.max(p.r*1.7,rFor(p.r)*.9)},800);return;}
 if(S.visit||S.walk||S.gavea||S.mode==='conveses')setMode(p.g==='m'?'maq':'navio',true);
 if(p.g==='m'&&S.mode==='navio'&&!S.bp)setMode('maq',true);else if(p.g==='i'&&S.mode==='navio'&&!S.bp){S.ax='z';S.cutV=50;setMode('corte',true);}
 select([id],true);}

/* ================= LEGENDAS ================= */
const LG={navio:'',blueprint:'e',corte:'im',explodido:'em',conveses:'z',maq:'m',cald:'m'},lblBox=$('#labels'),lbls=[];
ORDER.forEach(id=>{const p=P[id];if(p.g==='s')return;const b=document.createElement('button');b.className='lbl'+(p.g==='z'?' z':'');b.dataset.id=id;b.innerHTML='<i>'+p.i+'</i><span>'+p.n+'</span>';b.addEventListener('click',()=>{hist.length=0;goto(id);});lblBox.appendChild(b);lbls.push({b:b,p:p,id:id});});
const dimEls=DIMS.map(d=>{const e=document.createElement('div');e.className='dim';e.textContent=d[1];lblBox.appendChild(e);return{e:e,v:d[0]};});
const tv=new T.Vector3();
function scr(v,w,h){tv.copy(v);root.localToWorld(tv);tv.project(cam);if(tv.z>1||tv.z<-1||Math.abs(tv.x)>1.05||Math.abs(tv.y)>1.05)return null;return[(tv.x*.5+.5)*w,(-tv.y*.5+.5)*h];}
function labelsUpdate(){const w=cv.clientWidth,h=cv.clientHeight,g=LG[S.mode]||'',wide=w>=900,placed=[],off=S.visit||S.fp||S.tab==='flood'||S.tab==='sink';
 const cand=[];lbls.forEach(l=>{const p=l.p,sel=S.sel.indexOf(l.id)>=0;let on=!off&&((S.labels&&g.indexOf(p.g)>=0)||sel);if(on&&p.g==='z'&&(S.mode!=='conveses'||p.deck!==S.deck))on=false;
  if(on&&!sel&&S.cut&&p.it&&p.it.clip&&clip.distanceToPoint(p.av)<-.5)on=false;const s=on?scr(anchor(p),w,h):null;if(!s){l.b.style.display='none';return;}cand.push({l:l,s:s,sel:sel,z:p.g==='z'});});
 cand.sort((a,b)=>(b.sel-a.sel));
 cand.forEach(c=>{const s=c.s;if(!c.sel)for(let i=0;i<placed.length;i++){const q=placed[i],dx=Math.abs(q[0]-s[0]),dy=Math.abs(q[1]-s[1]);if((wide||c.z)?(dx<(c.z&&!wide?64:110)&&dy<18):(dx<26&&dy<26)){c.l.b.style.display='none';return;}}
  placed.push(s);c.l.b.style.display='';c.l.b.style.transform='translate(-50%,-50%) translate('+s[0].toFixed(1)+'px,'+s[1].toFixed(1)+'px)';});
 wlab.forEach(l=>{if(!l.on||S.tab!=='sink'){l.e.style.display='none';return;}tv.copy(l.v).project(cam);if(tv.z>1||Math.abs(tv.x)>1.05||Math.abs(tv.y)>1.05){l.e.style.display='none';return;}l.e.style.display='';l.e.style.transform='translate(-50%,-50%) translate('+((tv.x*.5+.5)*w).toFixed(1)+'px,'+((-tv.y*.5+.5)*h).toFixed(1)+'px)';});
 dimEls.forEach(d=>{const s=(S.bp&&S.exT===0&&!S.visit)?scr(d.v,w,h):null;if(!s){d.e.style.display='none';return;}d.e.style.display='';d.e.style.transform='translate(-50%,-50%) translate('+s[0].toFixed(1)+'px,'+s[1].toFixed(1)+'px)';});}

/* ================= ÁUDIO (só após um toque do usuário) ================= */
let AC=null;function ac(){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();}catch(e){AC=null;}return AC;}
function tone(f,dur,type,vol,at){const a=AC;if(!a)return;try{const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+(at||0);o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(vol||.12,t);g.gain.exponentialRampToValueAtTime(.0008,t+dur);o.connect(g);g.connect(out());o.start(t);o.stop(t+dur+.02);}catch(e){}}
let MG=null;function out(){if(!MG){MG=AC.createGain();MG.gain.value=S.snd?1:0;MG.connect(AC.destination);}return MG;}
const bell=()=>{tone(1400,.5,'sine',.1);tone(2100,.35,'sine',.05);};
/* sino náutico e apito a vapor de três notas — sons sintetizados (Web Audio), não gravações */
const fx={bell:0,wh:0};
function ringBell(n){ac();for(let k=0;k<(n||1);k++){const at=k*.95;[[1,.2,2.6],[2.76,.11,1.7],[5.4,.06,1.1],[8.93,.03,.6]].forEach(q=>tone(590*q[0],q[2],'sine',q[1],at));setTimeout(()=>{fx.bell=1;},at*1000);}}
let wh=null;
function whStart(){const a=ac();if(wh)return;const w=wh={t0:performance.now(),nodes:[],out:null,end:false};fx.wh=99;setTimeout(()=>{if(wh===w)whStop();},12000);if(!a)return;
 try{const t=a.currentTime,out=a.createGain(),lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=900;lp.connect(out);out.connect(window.__out());out.gain.setValueAtTime(.0001,t);out.gain.exponentialRampToValueAtTime(.22,t+.35);
  [98,123.5,147,196.5].forEach((f,i)=>{const o=a.createOscillator(),g=a.createGain();o.type=i<3?'sawtooth':'triangle';o.frequency.setValueAtTime(f*.93,t);o.frequency.linearRampToValueAtTime(f,t+.5);g.gain.value=i<3?.5:.25;o.connect(g);g.connect(lp);o.start(t);w.nodes.push(o);});
  const n=a.createBufferSource(),b=a.createBuffer(1,a.sampleRate*2|0,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;n.buffer=b;n.loop=true;const bp=a.createBiquadFilter();bp.type='bandpass';bp.frequency.value=2600;bp.Q.value=.6;const ng=a.createGain();ng.gain.value=.16;n.connect(bp);bp.connect(ng);ng.connect(out);n.start(t);w.nodes.push(n);w.out=out;}catch(e){}}
function whStop(){const w=wh;if(!w||w.end)return;w.end=true;const wait=Math.max(0,.9-(performance.now()-w.t0)/1000);
 setTimeout(()=>{fx.wh=.5;const a=AC;try{if(a&&w.out){const t=a.currentTime,g=w.out.gain;g.cancelScheduledValues(t);g.setValueAtTime(Math.max(.0002,g.value),t);g.exponentialRampToValueAtTime(.0001,t+.5);w.nodes.forEach(n=>{if(n.frequency)n.frequency.linearRampToValueAtTime(n.frequency.value*.95,t+.5);n.stop(t+.56);});}}catch(e){}setTimeout(()=>{if(wh===w)wh=null;},570);},wait*1000);}
function blowWhistle(d){whStart();const w=wh;setTimeout(()=>{if(wh===w)whStop();},(d||2.6)*1000);}
function holdWh(el){if(!el)return;el.addEventListener('pointerdown',e=>{e.preventDefault();whStart();});['pointerup','pointerleave','pointercancel'].forEach(v=>el.addEventListener(v,whStop));el.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter')blowWhistle();});}
window.__out=()=>out();
/* ambientação: mar, água no casco e máquinas — sintetizados (ruído filtrado), sem arquivos de áudio */
const amb={sea:null,wash:null,eng:null};let AG=null;function aout(){if(!AG){AG=AC.createGain();AG.gain.value=S.amb?1:0;AG.connect(AC.destination);}return AG;}
function ambStart(){const a=ac();if(!a||amb.sea)return;try{const n=a.createBufferSource(),b=a.createBuffer(1,a.sampleRate*3|0,a.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){l=.97*l+.03*(Math.random()*2-1);d[i]=l*6;}n.buffer=b;n.loop=true;
  const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=520;amb.sea=a.createGain();amb.sea.gain.value=0;n.connect(lp);lp.connect(amb.sea);amb.sea.connect(aout());
  [[.09,.07],[.143,.045]].forEach(q=>{const o=a.createOscillator(),g=a.createGain();o.frequency.value=q[0];g.gain.value=q[1];o.connect(g);g.connect(amb.sea.gain);o.start();});
  const bp=a.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1500;bp.Q.value=.6;amb.wash=a.createGain();amb.wash.gain.value=0;n.connect(bp);bp.connect(amb.wash);amb.wash.connect(aout());
  amb.eng=a.createGain();amb.eng.gain.value=0;[[41,'sine',1],[61.5,'triangle',.5]].forEach(q=>{const o=a.createOscillator(),g=a.createGain();o.type=q[1];o.frequency.value=q[0];g.gain.value=q[2];o.connect(g);g.connect(amb.eng);o.start();});amb.eng.connect(aout());n.start();}catch(e){}}
function ambStep(){if(!amb.sea||!AC)return;const t=AC.currentTime,inS=!!S.visit,uw=S.tab==='sink'&&sk.t>=161.5,v=Math.min(1,Math.abs(sim.kn)/22),r=Math.min(1,Math.abs(sim.rpm)/75);
 amb.sea.gain.setTargetAtTime(uw?.03:inS?.05:.2,t,.6);amb.wash.gain.setTargetAtTime(inS||uw?0:.03+.2*v,t,.6);amb.eng.gain.setTargetAtTime(uw?0:r*(S.ghost||S.walk==='maquinas'?.16:inS?.05:.035),t,.6);}
function sndSet(on){S.snd=on;const b=$('#bSnd');b.textContent=on?'🔊':'🔇';b.classList.toggle('on',on);b.title=on?'Efeitos sonoros ligados (apito, sinos, telégrafo) — toque para silenciar':'Efeitos sonoros desligados — toque para ativar';if(on)ac();if(MG&&AC)MG.gain.setTargetAtTime(on?1:0,AC.currentTime,.15);}
function ambSet(on){S.amb=on;const b=$('#bAmb');b.classList.toggle('on',on);b.classList.toggle('mut',!on);b.title=on?'Som ambiente ligado (mar, água no casco, máquinas) — toque para silenciar':'Som ambiente desligado — toque para ativar';if(on){ac();ambStart();}if(AG&&AC)AG.gain.setTargetAtTime(on?1:0,AC.currentTime,.3);}
$('#bSnd').addEventListener('click',()=>sndSet(!S.snd));$('#bAmb').addEventListener('click',()=>ambSet(!S.amb));
window.addEventListener('pointerdown',function f1(){window.removeEventListener('pointerdown',f1);if(S.amb){ac();ambStart();}});
function rudUI(){const ir=$('#iRud'),l=$('#lRud');if(ir)ir.value=nav.rud;if(l)l.textContent=nav.rud===0?'a meio':Math.abs(nav.rud)+'° a '+(nav.rud>0?'boreste':'bombordo');}

/* imagens históricas (Wikimedia Commons, domínio público): arquivo local em assets/images/historical, com reserva on-line */
const HIMG={dep:{f:'RMS Titanic 3.jpg',l:'titanic-partida-southampton-1912.jpg',t:'Fotografia de 1912.',c:'O Titanic deixa Southampton em 10 de abril de 1912.',a:'F. G. O. Stuart · domínio público'},
 launch:{f:'RMS Titanic ready for launch, 1911.jpg',l:'titanic-pronto-para-lancamento-1911.jpg',t:'Fotografia de 1911.',c:'O casco na carreira do estaleiro Harland & Wolff, pronto para o lançamento.',a:'Robert John Welch, fotógrafo da Harland & Wolff · domínio público'},
 stern:{f:'View of the stern and rudder of the Olympic in drydock.png',l:'olympic-popa-leme-helices-1911.png',t:'Fotografia de 1911 — navio gêmeo.',c:'Popa, leme e hélices do Olympic em dique seco. Não se conhecem fotografias das hélices do Titanic.',a:'Coleção George Grantham Bain, Biblioteca do Congresso dos EUA · sem restrições conhecidas'},
 gym:{f:'Titanic gymnasium.jpg',l:'titanic-ginasio-1912.jpg',t:'Imagem de 1912.',c:'O ginásio, em folheto da White Star Line.',a:'White Star Line, “White Star Line Triple Screw Steamers” · domínio público'},
 stair:{f:'Drawing of the Grand Staircase onboard the RMS Titanic from the 1912 promotional booklet.jpg',l:'grande-escadaria-desenho-1912.jpg',t:'Desenho de época, não fotografia.',c:'A Grande Escadaria num folheto promocional de 1912. Não se conhecem fotografias da escadaria do Titanic.',a:'White Star Line · domínio público'},
 berg:{f:'Titanic iceberg.jpg',l:'iceberg-prinz-adalbert-1912.jpg',t:'Fotografia de abril de 1912.',c:'Iceberg fotografado do vapor Prinz Adalbert, apontado como o provável iceberg da colisão.',a:'Comissário-chefe do Prinz Adalbert · domínio público'},
 trials:{f:'RMS Titanic sea trials April 2, 1912.jpg',l:'titanic-provas-de-mar-1912.jpg',t:'Fotografia de 1912.',c:'O Titanic no início das provas de mar, em 2 de abril de 1912.',a:'Autor desconhecido, via Arquivos Nacionais dos EUA · domínio público'}};
const HMAP={casco:'dep',proa:'dep',superestrutura:'dep',chamine:'trials',chamine4:'trials',mastro:'trials',quilha:'launch',cavername:'launch',helice:'stern',leme:'stern',popa:'stern',z_gin:'gym',z_esc:'stair',z_esc_b:'stair',gavea:'berg',sino:'berg'},HSET={ginasio:'gym',escadaria:'stair'};
function lbOpen(src,cap){const l=$('#lb');l.querySelector('img').src=src;l.querySelector('p').textContent=cap||'';l.classList.add('on');}
$('#lb').addEventListener('click',()=>$('#lb').classList.remove('on'));
/* ================= PAINEL / ABAS ================= */
const sheet=$('#sheet'),pDyn=$('#pDyn'),hist=[];let histLock=false;
const snap=()=>({tab:S.tab,cat:S.cat,sel:S.sel.slice()});
function goBack(){const h=hist.pop();if(!h)return;histLock=true;S.cat=h.cat;S.sel=h.sel;openTab(h.tab);histLock=false;}
const TITLES={ficha:'Ficha',explorar:'Explorar o navio',cat:'Explorar',busca:'Buscar',tele:'Navegação: telégrafo, leme e apito',morse:'Telegrafia Marconi',flood:'Compartimentos estanques',rota:'Viagem inaugural',comp:'As três classes',deck:'Planta do convés',gavea:'Gávea',sobre:'Sobre o modelo',lift:'Elevador',sink:'Naufrágio · 14–15 de abril de 1912'};
function openTab(t){if(S.tab==='flood'&&t!=='flood')floodReset();if(S.tab==='sink'&&t!=='sink')sinkReset();if(S.tab==='morse'&&t!=='morse')morseStop();S.tab=t;sheet.classList.add('show');sheet.classList.toggle('tall',t==='sink');$('#sheetT').textContent=t==='cat'&&S.cat?S.cat[1]:TITLES[t];renderTab();$('#sheetBody').scrollTop=0;
 $$('#tools .chip').forEach(b=>b.classList.toggle('on',b.dataset.tab===t||(b.dataset.tab==='explorar'&&t==='cat')));if(t==='flood')floodInit();if(t==='sink')sinkInit();applyLook();resize();if(t==='sink')sinkApply();}
function closeSheet(){if(S.tab==='flood')floodReset();if(S.tab==='sink')sinkReset();morseStop();S.tab=null;sheet.classList.remove('show');$$('#tools .chip').forEach(b=>b.classList.remove('on'));applyLook();resize();}
$('#sheetX').addEventListener('click',()=>{hist.length=0;closeSheet();});
$$('#tools .chip').forEach(b=>b.addEventListener('click',()=>{hist.length=0;ac();if(S.tab===b.dataset.tab)closeSheet();else openTab(b.dataset.tab);}));
$$('#modes button').forEach(b=>b.addEventListener('click',()=>{hist.length=0;if(S.tab==='flood'||S.tab==='sink')closeSheet();setMode(b.dataset.m);}));
$('#bBP').addEventListener('click',()=>{if(S.visit)return;S.bp=!S.bp;applyLook();});
$('#bNight').addEventListener('click',()=>{S.night=!S.night;applyLook();});
holdWh($('#bHorn'));
$('#bHome').addEventListener('click',()=>{if(S.visit){const s=SETS[S.visit];S.fp=false;applyLook();fly({t:s.O.clone().add(V(s.c[0],s.c[1],s.c[2])),r:Math.max(s.r,rFor(s.r)*.8),th:.9,ph:1});}else if(!S.fp)fly(preset(S.mode));});
$('#bPlay').addEventListener('click',()=>{S.run=!S.run;$('#bPlay').textContent=S.run?'❚❚':'▶';});
$('#bExit').addEventListener('click',exitAll);
$('#bWalk').addEventListener('click',()=>{if(S.fp){S.fp=false;applyLook();}else startFP();});
$$('#cutbar [data-ax]').forEach(b=>b.addEventListener('click',()=>{S.ax=b.dataset.ax;S.cutV=50;$('#cut').value=50;applyLook();fly(preset('corte'));}));
$('#cut').addEventListener('input',e=>{S.cutV=+e.target.value;applyLook();});
$('#deckbar').innerHTML=DECKS.slice().reverse().map(d=>'<button class="chip" data-d="'+d[0]+'">'+(d[0]==='BT'?'Botes':d[0]==='T'?'Fundo':d[0]==='O'?'Orlop':d[0])+'</button>').join('');
$$('#deckbar .chip').forEach(b=>b.addEventListener('click',()=>{S.deck=b.dataset.d;S.sel=[];applyLook();fly(preset('conveses'));if(cam.aspect>=1)openTab('deck');else if(S.tab)closeSheet();}));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
function dial(id,cap){let s='<figure><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="#caa25a"/><circle cx="60" cy="60" r="50" fill="#f4f0e2"/>';
 for(let i=0;i<9;i++){const a=(-90+(i-4)*32)*PI/180,a0=a-16*PI/180;s+='<line x1="'+(60+22*Math.cos(a0)).toFixed(1)+'" y1="'+(60+22*Math.sin(a0)).toFixed(1)+'" x2="'+(60+50*Math.cos(a0)).toFixed(1)+'" y2="'+(60+50*Math.sin(a0)).toFixed(1)+'" stroke="#333" stroke-width=".7"/><text x="'+(60+38*Math.cos(a)).toFixed(1)+'" y="'+(62+38*Math.sin(a)).toFixed(1)+'" font-size="5.2" font-weight="700" text-anchor="middle" fill="'+(i<4?'#8a1a12':i>4?'#123a5a':'#111')+'" font-family="Arial">'+['FULL','HALF','SLOW','D.SL','STOP','D.SL','SLOW','HALF','FULL'][i]+'</text>';}
 s+='<text x="26" y="92" font-size="5.5" fill="#8a1a12" font-family="Arial" font-weight="700">ASTERN</text><text x="72" y="92" font-size="5.5" fill="#123a5a" font-family="Arial" font-weight="700">AHEAD</text><g id="'+id+'b" style="transition:transform .5s;transform-origin:60px 60px"><rect x="58.6" y="14" width="2.8" height="46" fill="#b0301c"/></g><g id="'+id+'a" style="transition:transform .5s;transform-origin:60px 60px"><rect x="59.2" y="20" width="1.6" height="40" fill="#111"/><circle cx="60" cy="18" r="3.4" fill="#3a2414"/></g><circle cx="60" cy="60" r="5" fill="#caa25a"/></svg><figcaption>'+cap+'</figcaption></figure>';return s;}
function renderTab(){const t=S.tab;let h='';
 if(t==='ficha'){const id=S.sel[0],p=P[id];if(!p){pDyn.innerHTML='<p class="note">Toque numa peça ou escolha um item em Explorar.</p>';return;}
  h='<div class="ficha"><div class="hd"><div class="num">'+p.i+'</div><div><h3>'+esc(p.n)+'</h3>'+(p.en?'<div class="en">'+esc(p.en)+'</div>':'')+'</div></div><div class="tags"><span class="tg '+p.tag+'">'+TAGN[p.tag]+'</span>'+(p.cls?'<span class="tg c'+p.cls+'">'+CLSN[p.cls]+'</span>':'')+(p.deck?'<span class="tg">'+DECKS.find(d=>d[0]===p.deck)[1]+'</span>':'')+(p.g==='s'?'<span class="tg R">Cenário reconstruído</span>':'')+'</div>'+(p.t?'<p class="txt">'+esc(p.t)+'</p>':'')+'<div class="row">';
  if(p.g!=='s')h+='<button class="btn" data-act="focus">Enquadrar</button>';if(p.set&&S.visit!==p.set)h+='<button class="btn on" data-visit="'+p.set+(p.g==='s'?':'+id:'')+'">Visitar em 3D</button>';
  if(id==='telegrafoP'||id==='telegrafoM')h+='<button class="btn on" data-tab="tele">Operar o telégrafo</button>';if(id==='chaveMorse'||id==='transmissor'||id==='z_radio')h+='<button class="btn" data-tab="morse">Simulador Morse</button>';
  if(id==='gavea')h+='<button class="btn on" data-act="gavea">Subir à gávea</button>';if(id==='apito')h+='<button class="btn on" data-a="whistle">♪ Acionar o apito</button>';if(id==='sino')h+='<button class="btn on" data-act="sino">Tocar o sino</button><button class="btn" data-act="gavea">Subir à gávea</button>';if(id==='leme'||id==='helice'||id==='timao')h+='<button class="btn on" data-tab="tele">Leme e telégrafo</button>';if(id==='anteparas'||id==='portas')h+='<button class="btn on" data-tab="flood">Simular alagamento</button>';if(id==='cartas')h+='<button class="btn" data-tab="rota">Ver a rota</button>';
  if(/^cab|^jan1/.test(id))h+='<button class="btn" data-tab="comp">Comparar classes</button>';h+='</div>';{const hk=HMAP[id]||(p.set&&HSET[p.set]),k=hk&&HIMG[hk];if(k){const src='https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(k.f.replace(/ /g,'_'));h+='<figure class="hist" data-k="'+hk+'" data-cap="'+esc(k.c+' — '+k.a)+'"><img alt="'+esc(k.c)+'" loading="lazy" src="assets/images/historical/'+k.l+'"><figcaption><b>'+k.t+'</b> '+esc(k.c)+'<br>'+esc(k.a)+' · <a href="'+src+'" target="_blank" rel="noopener">fonte: Wikimedia Commons ↗</a></figcaption></figure>';}}if(p.set&&SETS[p.set].ph)h+='<p class="note"><a href="https://commons.wikimedia.org/w/index.php?search='+encodeURIComponent(SETS[p.set].ph)+'" target="_blank" rel="noopener">Fotografias de época no Wikimedia Commons ↗</a> (abre fora do museu)</p>';h+='</div>';}
 else if(t==='explorar'){h='<div class="catl">'+CATS.map((c,i)=>'<button data-cat="'+i+'"><i>'+(i<9?'0':'')+(i+1)+'</i>'+c[1]+'</button>').join('')+'</div><p class="note">Qualquer ambiente pode ser aberto daqui, sem percorrer o navio.</p>';}
 else if(t==='cat'){const c=S.cat;h=(hist.length?'':'<button class="back" data-tab="explorar">◀ Categorias</button>')+'<p class="txt" style="margin-top:0">'+esc(c[2])+'</p><div class="row">'+c[3].map((a,i)=>'<button class="btn'+(i===0?' on':'')+'" data-a="'+a[1]+'" data-v="'+(a[2]||'')+'">'+a[0]+'</button>').join('')+'</div><h4>Fichas</h4><div class="list">'+c[4].map(id=>'<button data-go="'+id+'"><i>'+P[id].i+'</i>'+esc(P[id].n)+'</button>').join('')+'</div>';}
 else if(t==='busca'){h='<input class="minp" id="q" style="text-transform:none" placeholder="Buscar peça ou ambiente…" value="'+esc(S.q)+'"><div class="list" id="qr" style="margin-top:8px"></div>';}
 else if(t==='tele'){h='<div class="tele">'+dial('dp','Ponte de comando')+dial('dm','Casa de máquinas')+'</div><div id="tst" class="note" style="color:var(--ok);min-height:32px"></div><div class="ords">'+ORDERS.map((o,i)=>i).reverse().map(i=>'<button data-ord="'+i+'" class="'+(i===4?'stop':'')+'">'+ORDERS[i]+'<small>'+ORD_PT[i]+'</small></button>').join('')+'</div>'+
  '<div class="ctl"><label>Leme <b id="lRud">a meio</b></label><input id="iRud" type="range" min="-35" max="35" step="1" value="'+nav.rud+'"></div><div class="row" style="margin-top:4px"><button class="btn" id="bMid">Leme a meio</button><button class="btn hot" id="bWh">♪ Apito a vapor (segure)</button><button class="btn" data-a="visit" data-v="ponte">Ir à ponte</button></div><div class="kv"><div><span id="kH">266°</span><small>rumo</small></div><div><span id="kA">0</span><small>rpm alternativas</small></div><div><span id="kT">0</span><small>rpm turbina</small></div><div><span id="kK">0</span><small>nós</small></div></div>'+
  '<p class="note"><b>Como funcionava:</b> o telégrafo só transmite a ordem. Na ponte o oficial move a alavanca (ponteiro preto); na casa de máquinas toca uma campainha e o ponteiro repete a ordem. O maquinista confirma levando a sua alavanca à mesma posição (ponteiro vermelho) e só então manobra as válvulas à mão. A turbina central só trabalha avante e a partir de meia força; em manobras e a ré, apenas os hélices laterais giram. Rotações e velocidades são estimativas da simulação.</p><p class="note"><b>Leme:</b> o controle gira o leme do modelo; com o navio em marcha, o rumo muda e a esteira se curva. O navio permanece no centro da cena — é o mar que passa. Taxa de guinada e raio de giro são estimativas. O timão do modelo é fixo: não gira com o leme.<br><b>Teclado:</b> ← → leme · ↑ ↓ telégrafo · H apito (fora dos passeios a pé).</p><div class="row"><button class="btn" data-a="cam" data-v="maq">Ver as máquinas</button><button class="btn" data-go="leme">Ver o leme</button><button class="btn" data-go="helice">Ver as hélices</button></div>';}
 else if(t==='morse'){h='<p class="txt" style="margin-top:0">Digite uma mensagem. Cada letra vira pontos e traços; o operador os enviava abrindo e fechando o circuito do transmissor de centelha com a chave.</p><input class="minp" id="mi" maxlength="40" value="CQD MGY"><div class="mout" id="mo"></div><div class="row" style="align-items:center"><div id="mlamp"></div><button class="btn on" id="mplay">▶ Transmitir</button><button class="btn" data-m="CQD CQD SOS DE MGY">CQD · SOS</button><button class="btn" data-a="visit" data-v="radio">Ver a sala</button></div>'+
  '<p class="note"><b>Não confundir:</b> o telégrafo de ordens liga a ponte à casa de máquinas por cabos e correntes, dentro do navio. A telegrafia sem fio Marconi envia ondas de rádio pela antena a outros navios e a estações em terra. “CQD” era o pedido de socorro da Marconi; “SOS” era o sinal internacional mais recente. Na noite de 14 para 15 de abril Phillips usou os dois. “MGY” era o indicativo do Titanic. Phillips morreu no naufrágio; Bride sobreviveu.</p>';}
 else if(t==='flood'){h='<p class="txt" style="margin-top:0">Escolha um cenário hipotético ou toque nos compartimentos (1 = proa). A água entra nos escolhidos até igualar o nível do mar; o navio afunda um pouco e inclina.</p><div class="row">'+[['1 compartimento','0'],['2 adjacentes','1,2'],['4 primeiros','0,1,2,3'],['5 primeiros','0,1,2,3,4'],['2 a meio-navio','7,8']].map(s=>'<button class="btn" data-fs="'+s[1]+'">'+s[0]+'</button>').join('')+'<button class="btn hot" data-fs="">Esgotar</button></div><div class="cgrid">'+COMP.map((c,i)=>'<button data-fc="'+i+'" title="'+c+'">'+(i+1)+'</button>').join('')+'</div><div class="kv"><div><span id="fB">–</span><small>calado proa (m)</small></div><div><span id="fS">–</span><small>calado popa (m)</small></div><div><span id="fT">–</span><small>inclinação</small></div><div><span id="fN">0</span><small>alagados</small></div></div><div id="fst" class="note" style="min-height:34px"></div>'+
  '<p class="note"><b>Simplificação:</b> hidrostática linear (afundamento e inclinação proporcionais ao peso da água), sem adernamento lateral. A fração de cada compartimento que a água pode ocupar foi ajustada (40% nos porões, 70% nas praças de máquinas). A água passa por cima de uma antepara quando ultrapassa o seu topo (convés E a meio-navio, D nas extremidades). O modelo foi calibrado para reproduzir o critério de projeto documentado: o navio flutua com dois compartimentos quaisquer alagados, ou com os quatro primeiros — não com cinco.</p>';}
 else if(t==='rota'){const X=l=>((l+80)/85*340).toFixed(1),Y=l=>((57-l)/22*130).toFixed(1),pl=a=>a.map(p=>X(p[0])+','+Y(p[1])).join(' ');
  h='<svg class="map" viewBox="0 0 340 130">';for(let l=-70;l<=0;l+=10)h+='<line x1="'+X(l)+'" y1="0" x2="'+X(l)+'" y2="130" stroke="rgba(140,200,255,.15)" stroke-width=".5"/>';for(let l=40;l<=55;l+=5)h+='<line x1="0" y1="'+Y(l)+'" x2="340" y2="'+Y(l)+'" stroke="rgba(140,200,255,.15)" stroke-width=".5"/>';
  LAND.forEach(a=>{h+='<polygon points="'+pl(a)+'" fill="#1d4a7e" stroke="#7fd1ff" stroke-width=".6"/>';});h+='<polyline points="'+pl(ROUTE)+'" fill="none" stroke="#ffd98a" stroke-width="1.4"/><polyline points="'+pl(ROUTE2)+'" fill="none" stroke="#ffd98a" stroke-width="1" stroke-dasharray="3 3" opacity=".6"/>';
  PORTS.forEach(p=>{h+='<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="2.2" fill="#fff"/><text x="'+(+X(p[0])+p[3])+'" y="'+(+Y(p[1])+p[4])+'" font-size="6" fill="#e6eef8" text-anchor="'+p[5]+'" font-family="Arial">'+p[2]+'</text>';});
  h+='<circle id="evd" cx="0" cy="0" r="4" fill="none" stroke="#ff6b5e" stroke-width="1.5"/><text x="170" y="124" font-size="5.5" fill="#93a7bf" text-anchor="middle" font-family="Arial">mapa esquemático · tracejado: trecho não percorrido</text></svg>';
  EVENTS.forEach((e,i)=>{h+='<div class="ev'+(i===0?' on':'')+'" data-ev="'+i+'"><b>'+e[0]+'</b><strong>'+e[1]+'</strong><p>'+esc(e[2])+'</p></div>';});}
 else if(t==='comp'){h='<table class="cmp"><tr><th></th><th style="color:#d9b36a">1ª classe</th><th style="color:#6fa8dc">2ª classe</th><th style="color:#7fc98f">3ª classe</th></tr>'+COMP_T.map(r=>'<tr>'+r.map(c=>'<td>'+esc(c)+'</td>').join('')+'</tr>').join('')+'</table><div class="row"><button class="btn on" data-a="visit" data-v="cabines">Cabines lado a lado</button><button class="btn on" data-a="visit" data-v="jantar">Salões de jantar lado a lado</button></div><p class="note">Nos cenários 3D, da esquerda para a direita: 1ª, 2ª e 3ª classes, na mesma escala. São reconstruções visuais a partir de descrições e fotografias da época (em boa parte, do gêmeo Olympic).</p>';}
 else if(t==='deck'){const d=DECKS.find(x=>x[0]===S.deck),zs=ZD.filter(z=>z[1]===S.deck);h='<h4>'+d[1]+'</h4>';if(S.deck==='T')h+='<p class="txt">Sobre o teto do fundo duplo ficam as seis salas de caldeiras, a casa de máquinas, a sala da turbina e a dos dínamos. Toque nas máquinas para abrir as fichas.</p>';
  h+='<div class="rooms">'+zs.map(z=>'<button data-go="'+z[0]+'"><i style="background:#'+ZCOL[z[6]].toString(16)+'"></i>'+esc(z[7])+'</button>').join('')+'</div><div class="tags"><span class="tg c1">■ 1ª classe</span><span class="tg c2">■ 2ª classe</span><span class="tg c3">■ 3ª classe</span><span class="tg">■ tripulação/serviço</span></div><p class="note">Planta esquemática: mostra os ambientes principais nas posições aproximadas, não cada camarote.</p>';}
 else if(t==='gavea'){h='<p class="txt" style="margin-top:0">Dois vigias ficavam aqui, a cerca de 29 m acima da água, em turnos de duas horas, atentos a luzes, navios, destroços e gelo. Ao avistar algo, tocavam o sino — um toque para objeto a bombordo, dois a boreste, três bem à frente — e telefonavam à ponte, onde o oficial de quarto decidia a manobra.</p><div class="row"><button class="btn on" data-act="aviso">Tocar o sino (3 toques) e telefonar</button><button class="btn" data-act="night">Noite / dia</button><button class="btn" data-act="berg">'+(S.berg?'Ocultar iceberg':'Exibir iceberg')+'</button></div><div id="gst" class="note" style="color:var(--brass);min-height:40px"></div>'+
  '<h4>Binóculos e visibilidade</h4><p class="txt" style="margin-top:0">Os binóculos da gávea não estavam disponíveis na travessia: ficaram trancados num armário depois de uma troca de oficiais em Southampton. Seu efeito é discutido — binóculos ajudam a identificar o que já foi visto, mas estreitam o campo de busca. Pesaram mais as condições da noite: sem lua e com mar parado, não havia espuma quebrando na base do gelo, e o iceberg só se destacou do horizonte a poucas centenas de metros.</p><p class="note">Ligue “Noite” para comparar: o bloco à frente (demonstração, cerca de 500 m) quase desaparece. “Ocultar iceberg” deixa só o mar e o horizonte.</p>';}
 else if(t==='lift'){h='<p class="txt" style="margin-top:0">Três elevadores elétricos da 1ª classe ficavam logo a vante da Grande Escadaria e serviam do convés A ao E, com ascensoristas. Escolha o convés.</p><div class="rooms">'+LIFT.map(l=>'<button data-lift="'+l[2]+'"><i style="background:#d9b36a"></i>'+l[1]+'</button>').join('')+'</div><p class="note">Na escadaria, as cabines sobem e descem atrás das grades. A viagem aqui é uma transição direta para um ambiente daquele convés.</p>';}
 else if(t==='sink'){h='<div class="skTop"><div class="skrow"><div><div id="skc">23h38</div><div class="note" style="margin:0" id="skd">14 de abril</div></div><button class="btn on" id="skp">▶ Reproduzir</button><button class="btn" id="sk0">⏮</button></div><div class="skch"><button class="btn" data-ch="0">Colisão</button><button class="btn" data-ch="1">Naufrágio</button><button class="btn" data-ch="2">Descida</button><button class="btn" data-ch="3">Destroços</button></div><input id="skr" type="range" min="-2" max="176" step="0.5" value="-2"><div class="kv"><div><span id="skA">0°</span><small>inclinação</small></div><div><span id="skB">intacto</span><small>casco</small></div><div><span id="skL">acesas</span><small>luzes</small></div><div><span id="skN">0 / 20</span><small>botes na água</small></div></div></div><div id="skev">'+SK.map((e,i)=>'<div class="ev" data-sk="'+e[0]+'"><b>'+e[1]+'</b><p style="display:block">'+esc(e[2])+'</p></div>').join('')+'<p class="note"><b>Reconstituição:</b> os horários são os de bordo e seguem os inquéritos de 1912 e estudos posteriores; alguns são aproximados e discutidos. Os últimos cinco minutos passam em câmera lenta. Ângulos, a ordem exata da queda das chaminés e o movimento das duas metades são aproximações: a ruptura é mostrada como um corte limpo entre a 3ª e a 4ª chaminés. Os botes deixam os turcos no horário aproximado de cada um; os 16 botes dos turcos somem do convés nesse momento e suas posições na água são ilustrativas; os quatro desmontáveis não têm peça própria no modelo. Na colisão, o tamanho e a forma do iceberg são supostos. Na descida, a altura da coluna d’água está comprimida (400 m no modelo para 3.800 m reais); no fundo, a distância entre proa e popa está em escala, e a popa aparece apenas achatada, sem o detalhe real dos danos. Das cerca de 2.200 pessoas a bordo, perto de 710 sobreviveram.</p></div>';}
 else if(t==='sobre'){h='<h4>Como ler as fichas</h4><div class="tags"><span class="tg D">Documentado</span><span class="tg R">Reconstrução visual</span><span class="tg S">Simplificação</span></div><p class="note" style="color:var(--ink)">Dimensões, máquinas, caldeiras, botes e organização dos conveses seguem os registros do Titanic em abril de 1912. Toda a geometria 3D é reconstrução feita por código: o casco é gerado por fórmulas e os interiores foram montados a partir de descrições e fotografias de época, muitas do gêmeo Olympic.</p>'+
  '<h4>Implementado nesta versão</h4><p class="note">Exterior completo · 10 conveses com planta e 45 ambientes localizados · 19 cenários internos em 3D com caminhada: Grande Escadaria com elevadores em movimento, ponte, aposentos do comandante, sala Marconi, lounge, sala de leitura, salão de fumar, restaurante, Café Parisien, corredor, ginásio, piscina, banhos turcos, squash, biblioteca, salas da 3ª classe, cabines e salões de jantar · passagem a pé entre ambientes pelas portas e pelo elevador · gávea · caldeiras, máquinas, turbina, dínamos e hélices animados · telégrafo · Morse · alagamento · reconstituição do naufrágio · rota · dia/noite · blueprint, corte e vista explodida · busca.</p>'+
  '<h4>Limites desta versão</h4><p class="note"><b>Passagens:</b> cada porta leva diretamente ao ambiente vizinho; os corredores intermediários não são percorridos, com exceção de um trecho do corredor do convés B. As ligações são plausíveis, não a planta exata.<br><b>Imagens históricas:</b> sete imagens em domínio público do Wikimedia Commons aparecem nas fichas correspondentes, com legenda, autoria e fonte; a ficha diz quando se trata de desenho ou do navio gêmeo. O museu procura primeiro o arquivo na pasta assets/images/historical e, se não o achar, busca a imagem no Commons; onde imagens externas são bloqueadas, fica o atalho para a fonte.<br><b>Modelo do navio:</b> há um único Titanic na cena — o modelo “RMS Titanic 1912”, de Renan_1912 (<a href=\"https://sketchfab.com/3d-models/rms-titanic-1912-fe1019b8f4bf46eea28cdb7a866f05e0\" target=\"_blank\" rel=\"noopener\">Sketchfab</a>, licença <a href=\"http://creativecommons.org/licenses/by/4.0/\" target=\"_blank\" rel=\"noopener\">CC BY 4.0</a>). É exibido com a geometria completa (sem simplificação), as texturas originais e as faces com a orientação definida pelo autor; o arquivo foi apenas comprimido e dividido pelo museu em partes articuladas: duas metades do casco, superestrutura, quatro chaminés, dois mastros, cordame, 16 botes, três hélices e leme; o casco foi escurecido, as janelas ganharam luz noturna e 18 molduras triangulares soltas nas laterais do convés A, sem correspondência identificada no navio real, foram retiradas. Conveses internos, anteparas, caldeiras e máquinas são gerados por código e ajustados à forma desse casco. Se o modelo não puder ser carregado, o museu usa um casco gerado por código no lugar (nunca os dois).<br><b>Sons:</b> o mar, a água no casco, o ronco das máquinas, o apito a vapor e os sinos são sintetizados no navegador — não são gravações. Há dois botões independentes: o do alto-falante liga e silencia os efeitos (apito, sinos, telégrafo, Morse); o das ondas liga e silencia o som ambiente (mar, água no casco, máquinas).<br><b>Ponte:</b> o timão gira com o leme e as alavancas dos cinco telégrafos acompanham a ordem dada; todas se movem juntas, o que é uma simplificação.<br><b>Oceano:</b> ondulação, ondas de proa e de esteira (padrão de Kelvin, com comprimento de onda ligado à velocidade) e espuma são calculados por shader; é uma aproximação visual, não uma simulação de fluidos.<br><b>Naufrágio:</b> ruptura, queda das chaminés e posição dos botes na água são representações esquemáticas.<br><b>Ainda sem cenário:</b> escadaria de ré, Verandah Café, sala de fumar da 2ª classe.</p>'+
  '<h4>Fontes para consulta</h4><p class="note"><a href="https://www.encyclopedia-titanica.org/" target="_blank" rel="noopener">Encyclopedia Titanica</a> · <a href="https://www.titanicinquiry.org/" target="_blank" rel="noopener">Titanic Inquiry Project</a> (inquéritos de 1912) · <a href="https://www.norwayheritage.com/p_ship.asp?sh=titan" target="_blank" rel="noopener">Norway Heritage</a> (descrição técnica de época) · <a href="https://en.wikipedia.org/wiki/Titanic" target="_blank" rel="noopener">Wikipedia — Titanic</a> · revista The Shipbuilder, número especial de 1911.</p>';}
 if(hist.length)h='<button class="back" data-back="1">◀ Voltar</button>'+h;
 pDyn.innerHTML=h;
 pDyn.querySelectorAll('figure.hist img').forEach(im=>im.addEventListener('error',()=>{const f=im.closest('figure'),k=HIMG[f.dataset.k];if(!im.dataset.r){im.dataset.r='1';im.src='https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(k.f)+'?width=800';}else{im.remove();f.classList.add('off');}}));
 if(t==='busca'){const q=$('#q'),run=()=>{S.q=q.value;const n=norm(S.q);$('#qr').innerHTML=n.length<2?'':ORDER.filter(id=>norm(P[id].n+' '+P[id].en+' '+(P[id].t||'')).indexOf(n)>=0).slice(0,24).map(id=>'<button data-go="'+id+'"><i>'+P[id].i+'</i>'+esc(P[id].n)+'</button>').join('')||'<p class="note">Nada encontrado.</p>';};q.addEventListener('input',run);run();}
 if(t==='morse'){const mi=$('#mi'),up=()=>{$('#mo').textContent=toMorse(mi.value);};mi.addEventListener('input',up);up();$('#mplay').addEventListener('click',()=>{ac();if(mor.on)morseStop();else morsePlay(mi.value);});}
 if(t==='tele'){teleUI();$('#iRud').addEventListener('input',e=>{nav.rud=+e.target.value;rudUI();});$('#bMid').addEventListener('click',()=>{nav.rud=0;rudUI();});holdWh($('#bWh'));rudUI();}if(t==='flood')floodUI();if(t==='rota')evSel(0);
 if(t==='sink'){$('#skr').addEventListener('input',e=>{sk.t=+e.target.value;sk.play=false;sinkApply();});$$('[data-ch]').forEach(b=>b.addEventListener('click',()=>{sk.t=[-2,0,161.5,173][+b.dataset.ch];sk.play=false;sinkApply();}));$('#skp').addEventListener('click',()=>{if(sk.t>=176)sk.t=-2;sk.play=!sk.play;sinkApply();});$('#sk0').addEventListener('click',()=>{sk.t=-2;sk.play=false;sinkApply();});}}
function act(a,v){ac();if(a==='whistle'){blowWhistle();return;}if(a==='mode')setMode(v);else if(a==='go')goto(v);else if(a==='visit'){const q=v.split(':');visit(q[0],q[1]);if(q[1]&&P[q[1]]){S.sel=[q[1]];}}else if(a==='tab')openTab(v);else if(a==='cam'){setMode(v);}else if(a==='walk')walk(v);else if(a==='gavea')gavea();else if(a==='night'){S.night=!S.night;applyLook();}}
pDyn.addEventListener('click',e=>{const pre=S.tab?snap():null;if(pre)hist.push(pre);pClick(e);if(pre&&hist[hist.length-1]===pre&&(histLock2||!S.tab||(S.tab===pre.tab&&S.cat===pre.cat&&S.sel[0]===pre.sel[0]))){hist.pop();if(!hist.length){const bb=pDyn.querySelector('[data-back]');if(bb&&S.tab===pre.tab)bb.remove();}}histLock2=false;if(hist.length>14)hist.shift();});
let histLock2=false;
function pClick(e){const fg=e.target.closest('figure.hist');if(fg&&e.target.tagName==='IMG'){lbOpen(e.target.src,fg.dataset.cap);return;}const ev=e.target.closest('.ev');if(ev){if(ev.dataset.sk!==undefined){sk.t=+ev.dataset.sk;sk.play=false;sinkApply();}else evSel(+ev.dataset.ev);return;}const b=e.target.closest('button');if(!b)return;const d=b.dataset;if(d.back){hist.pop();histLock2=true;goBack();return;}
 if(d.lift){ac();tone(90,1.1,'sawtooth',.05);const fp=S.fp||!!S.liftFrom;fadeDo(()=>{visit(d.lift);if(fp)startFP('lift');closeSheet();S.liftFrom=null;});return;}
 if(d.go)goto(d.go);else if(d.cat!==undefined){S.cat=CATS[+d.cat];openTab('cat');}else if(d.a)act(d.a,d.v);else if(d.tab)openTab(d.tab);else if(d.visit){const q=d.visit.split(':');visit(q[0],q[1]);renderTab();}
 else if(d.ord!==undefined)sendOrder(+d.ord);else if(d.m!==undefined){$('#mi').value=d.m;$('#mo').textContent=toMorse(d.m);ac();morsePlay(d.m);}
 else if(d.fs!==undefined){floodReset(true);d.fs.split(',').filter(x=>x!=='').forEach(x=>fl.on.add(+x));floodUI();}else if(d.fc!==undefined){const i=+d.fc;if(fl.on.has(i)){floodReset(true,i);}else fl.on.add(i);fl.over=false;floodUI();}
 else if(d.act==='focus')select(S.sel,true);else if(d.act==='gavea')gavea();else if(d.act==='night'){S.night=!S.night;applyLook();}else if(d.act==='berg'){S.berg=!S.berg;applyLook();b.textContent=S.berg?'Ocultar iceberg':'Exibir iceberg';}else if(d.act==='aviso')aviso();else if(d.act==='sino'){ac();ringBell(1);}}
function evSel(i){$$('.ev').forEach((e,k)=>e.classList.toggle('on',k===i));const e=EVENTS[i],d=$('#evd');if(d){d.setAttribute('cx',((e[3]+80)/85*340).toFixed(1));d.setAttribute('cy',((57-e[4])/22*130).toFixed(1));}}
function aviso(){ac();ringBell(3);const g=$('#gst'),L=['Sino: três toques — objeto bem à frente.','Telefone para a ponte: “Há alguém aí?” — “Sim. O que você viu?”','“Iceberg, bem à frente!” — “Obrigado.”','Daqui em diante a decisão é do oficial de quarto: leme e telégrafo.'];L.forEach((s,i)=>setTimeout(()=>{if($('#gst'))$('#gst').textContent=s;},i*2600));}

/* ---- telégrafo ---- */
function sendOrder(i){ac();tel.ord=i;tel.stage=1;tel.t=1.3;bell();teleUI();}
function teleUI(){const set=(id,i)=>{const e=document.getElementById(id);if(e)e.style.transform='rotate('+((i-4)*32)+'deg)';};set('dpa',tel.ord);set('dpb',tel.ack);set('dma',tel.ack);set('dmb',tel.eng);
 $$('.ords button').forEach(b=>b.classList.toggle('on',+b.dataset.ord===tel.ord));const s=$('#tst');if(s)s.textContent=tel.stage===1?'Ponte: ordem “'+ORDERS[tel.ord]+'” enviada. Aguardando a casa de máquinas…':tel.stage===2?'Casa de máquinas: campainha — ordem recebida. O maquinista responde…':'Ordem confirmada: “'+ORDERS[tel.ack]+'” ('+ORD_PT[tel.ack]+'). Os maquinistas ajustam as válvulas.'+(tel.ack>=7?' Turbina em carga.':tel.ack>4?' Turbina isolada: vapor direto aos condensadores.':tel.ack<4?' Máquinas invertidas; turbina parada.':'');}
function teleStep(dt){if(tel.stage===1||tel.stage===2){tel.t-=dt;if(tel.t<=0){if(tel.stage===1){tel.eng=tel.ord;tel.stage=2;tel.t=1.5;bell();}else{tel.ack=tel.eng;tel.stage=3;bell();}if(S.tab==='tele')teleUI();}}}
/* ---- morse ---- */
const mor={on:false,tm:null};
function toMorse(s){return s.toUpperCase().split('').map(c=>c===' '?'/':(MORSE[c]||'')).filter(x=>x).join(' ');}
function sparkSet(on){const l=$('#mlamp');if(l)l.classList.toggle('on',on);const r=SETS.radio.g;if(r){r.userData.spark.material.emissiveIntensity=on?2.5:0;r.userData.sparkL.intensity=on?1.6:0;r.userData.key.position.y=on?.89:.9;}}
function morsePlay(s){morseStop();const m=toMorse(s);if(!m)return;mor.on=true;const b=$('#mplay');if(b)b.textContent='■ Parar';const U=.085;let i=0;
 const next=()=>{if(!mor.on)return;if(i>=m.length){morseStop();return;}const c=m[i++];const mo=$('#mo');if(mo)mo.innerHTML=esc(m.slice(0,i-1))+'<b>'+esc(c)+'</b>'+esc(m.slice(i));
  if(c==='.'||c==='-'){const d=(c==='.'?1:3)*U;sparkSet(true);tone(540,d,'sawtooth',.07);mor.tm=setTimeout(()=>{sparkSet(false);mor.tm=setTimeout(next,U*1000);},d*1000);}else mor.tm=setTimeout(next,(c==='/'?4:2)*U*1000);};next();}
function morseStop(){if(mor.tm)clearTimeout(mor.tm);mor.on=false;mor.tm=null;sparkSet(false);const b=$('#mplay');if(b)b.textContent='▶ Transmitir';}
/* ---- alagamento: hidrostática linear ---- */
const PERM=i=>(i<4||i>12)?.4:.7;   // calibrado: ver nota da aba
function floodInit(){if(!fl.H){let A=0,Mx=0;for(let x=-134;x<=134;x++){const b=2*hb(x,WL);A+=b;Mx+=b*x;}const xf=Mx/A;let I=0;for(let x=-134;x<=134;x++)I+=2*hb(x,WL)*(x-xf)*(x-xf);
  const vol=[];for(let i=0;i<16;i++){const x0=Math.ceil(CB[i+1]),x1=Math.floor(CB[i]),t=[0];let v=0;for(let k=1;k<=46;k++){let a=0;for(let x=x0;x<x1;x++)a+=2*hb(x+.5,k*.5-.25);v+=a*.5*PERM(i);t.push(v);}vol.push(t);}fl.H={A:A,xf:xf,I:I,vol:vol};}
 leave();S.mode='corte';S.bp=false;S.cut=true;S.ax='z';S.cutV=50;S.exT=0;S.ghost=false;S.labels=false;$$('#modes button').forEach(b=>b.classList.toggle('on',b.dataset.m==='corte'));fly({t:V(10,10,0),th:.1,ph:1.4,r:rFor(330)});}
function floodReset(keep,only){if(only!==undefined){fl.on.delete(only);fl.sp.clear();for(let i=0;i<16;i++)if(!fl.on.has(i))fl.lvl[i]=0;}else{fl.on.clear();fl.sp.clear();fl.lvl.fill(0);}fl.over=false;fl.msg='';if(!keep){fl.sink=0;fl.trim=0;root.position.y=0;root.rotation.z=0;floodM.forEach(m=>m.visible=false);}}
function floodStep(dt){const H=fl.H;if(!H||S.tab!=='flood')return;let W=0,Mo=0,moving=false,n=0;
 for(let i=0;i<16;i++){const xm=(CB[i]+CB[i+1])/2,act=fl.on.has(i)||fl.sp.has(i);if(act){n++;const tg=Math.min(22.5,WL+fl.sink+fl.trim*(xm-H.xf));if(!fl.over&&tg>fl.lvl[i]+.01){fl.lvl[i]+=Math.min(tg-fl.lvl[i],dt*(.6+ (tg-fl.lvl[i])*.5));moving=true;}}
  const k=Math.min(45.999,fl.lvl[i]*2),k0=k|0,v=H.vol[i][k0]+(H.vol[i][k0+1]-H.vol[i][k0])*(k-k0);W+=v;Mo+=v*(xm-H.xf);const m=floodM[i];m.visible=fl.lvl[i]>.05;if(m.visible){m.scale.y=fl.lvl[i];m.position.y=fl.lvl[i]/2;}}
 if(!fl.over)for(let j=0;j<15;j++){if(fl.lvl[j]>BHTOP[j]+.03&&!fl.on.has(j+1)&&!fl.sp.has(j+1)){fl.sp.add(j+1);}if(fl.lvl[j+1]>BHTOP[j]+.03&&!fl.on.has(j)&&!fl.sp.has(j)){fl.sp.add(j);}}
 fl.sink=W/H.A;fl.trim=Mo/H.I;const bow=WL+fl.sink+fl.trim*(134.5-H.xf),st=WL+fl.sink+fl.trim*(-134.5-H.xf);
 if(!fl.over&&(fl.sp.size>0&&(bow>18.3||fl.sp.size>=2))){fl.over=true;}
 root.rotation.z=-fl.trim;root.position.y=-(fl.sink-fl.trim*H.xf);
 const e=(id,v)=>{const x=document.getElementById(id);if(x)x.textContent=v;};e('fB',nf(bow,1));e('fS',nf(st,1));e('fT',nf(fl.trim*180/PI,1)+'°');e('fN',n);
 const s=$('#fst');if(s){let m,c='var(--ok)';if(fl.over){m='Limite excedido: a água passou por cima de uma antepara e seguiria de compartimento em compartimento. Com este dano o navio não se mantém à tona. A simulação para aqui.';c='var(--bad)';}
  else if(fl.sp.size){m='A água ultrapassou o topo de uma antepara e começa a invadir o compartimento vizinho.';c='var(--warn)';}else if(!n){m='Navio intacto. Calado de projeto: 10,5 m.';}else if(moving){m='Alagando… o navio afunda e inclina até a água interna igualar o nível do mar.';c='var(--warn)';}
  else m='Equilíbrio: a água parou abaixo do topo das anteparas. O navio permanece à tona.';s.textContent=m;s.style.color=c;}}
function floodUI(){$$('.cgrid button').forEach(b=>b.classList.toggle('on',fl.on.has(+b.dataset.fc)));}
const nf=(v,d)=>v.toFixed(d).replace('.',',');

/* ---- reconstituição do naufrágio (cinemática, por quadros-chave) ---- */
function sinkInit(){skCh=-1;leave();S.mode='navio';S.bp=false;S.cut=false;S.exT=0;S.ghost=false;S.labels=false;S.sel=[];sk.np=S.night;S.night=true;sk.t=-2;sk.play=false;tel.ord=tel.eng=tel.ack=4;tel.stage=3;$$('#modes button').forEach(b=>b.classList.toggle('on',b.dataset.m==='navio'));fly({t:V(25,10,0),th:.42,ph:1.36,r:rFor(380)});}
/* peças usadas na reconstituição: luzes, botes, chaminés, metades do casco */
const XS=GL?-24:-39,SPL=157.8,emMats=[];meshes.forEach(m=>{(Array.isArray(m.userData.real)?m.userData.real:[m.userData.real]).forEach(mm=>{if(mm.emissiveMap&&emMats.indexOf(mm)<0)emMats.push(mm);});});winMats.forEach(m=>emMats.push(m));
const boatIt=items.find(i=>i.id==='bote'),boatG=boatIt?boatIt.o:null,boatIM=(boatG&&!GL)?boatG.children[0]:null,boatM0=[];if(boatIM){const m=new T.Matrix4();for(let i=0;i<16;i++){boatIM.getMatrixAt(i,m);boatM0.push(m.clone());}}
const BL=[130,80,90,75,80,65,130,110,110,115,105,120,100,121,125,85,145,155,140,155],BX=[55,55,48,48,41,41,-36,-36,-45,-45,-54,-54,-63,-63,62,62,61.5,52,61.5,52],M0=new T.Matrix4().makeScale(0,0,0);
const wb=new T.InstancedMesh(new T.SphereGeometry(1,10,8),new T.MeshStandardMaterial({color:0xe6e0d0,roughness:.7,emissive:0x2a2a26}),20);wb.visible=false;wb.frustumCulled=false;scene.add(wb);
const mastG=items.find(i=>i.id==='mastro').o,antIt=items.find(i=>i.id==='antena'),funIt=items.filter(i=>i.id==='chamine'||i.id==='chamine4'),FT=[157,157.5,158,158.3],mR0=GL?0:.165;funIt.forEach(it=>{if(it.r0===undefined)it.r0=.165;});
items.forEach(it=>{if(!it.clip){const c=new T.Box3().setFromObject(it.o).getCenter(new T.Vector3());it.half=c.x<XS?'S':'B';}});
const kf=(A,t)=>{let k=0;while(k<A.length-2&&t>A[k+1][0])k++;const a=A[k],b=A[k+1],f=Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0])));return[a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f];};
const xfm=(px,a,wx,wy)=>({a:a,x:wx-(px*Math.cos(a)-WL*Math.sin(a)),y:wy-(px*Math.sin(a)+WL*Math.cos(a))});
/* fundo do oceano, destroços, neve marinha, faixa de dano e rótulos do local */
const BED=-400,bedG=new T.Group();bedG.visible=false;scene.add(bedG);
{const bt=ctex(128,128,(c,w,h)=>{c.fillStyle='#4a463c';c.fillRect(0,0,w,h);for(let i=0;i<300;i++){const v=50+Math.random()*45|0;c.fillStyle='rgba('+v+','+(v-4)+','+(v-12)+',.5)';c.beginPath();c.arc(Math.random()*w,Math.random()*h,1+Math.random()*4,0,7);c.fill();}},30,30),pl=new T.Mesh(new T.PlaneGeometry(4000,4000),new T.MeshStandardMaterial({map:bt,roughness:1}));pl.rotation.x=-PI/2;pl.position.y=BED;bedG.add(pl);
 const n=170,im=new T.InstancedMesh(new T.BoxGeometry(1,1,1),new T.MeshStandardMaterial({color:0x5a4a3a,roughness:.9}),n),m4=new T.Matrix4(),q=new T.Quaternion(),e=new T.Euler();for(let i=0;i<n;i++){const u=Math.random(),x=-330+u*430,z=(Math.random()-.5)*(140+200*Math.sin(u*PI));e.set(Math.random(),Math.random()*6,Math.random());q.setFromEuler(e);m4.compose(V(x,BED+.6,z),q,V(1+Math.random()*7,.6+Math.random()*2,1+Math.random()*5));im.setMatrixAt(i,m4);}bedG.add(im);
 const bm=new T.MeshStandardMaterial({color:0x6a4636,roughness:.8});[[-215,40],[-232,-25],[-196,-60],[-250,70],[-180,15]].forEach((p,i)=>{const b=new T.Mesh(new T.CylinderGeometry(2.4,2.4,3.6,18),bm);b.rotation.set(i*.5,i,PI/2);b.position.set(p[0],BED+2.2,p[1]);bedG.add(b);});
 const mound=new T.Mesh(new T.SphereGeometry(1,16,8,0,PI*2,0,PI/2),new T.MeshStandardMaterial({color:0x4f4a40,roughness:1}));mound.scale.set(45,7,26);mound.position.set(420,BED,0);bedG.add(mound);}
const snow=(()=>{const n=420,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=(Math.random()-.5)*1100;a[i*3+1]=BED+Math.random()*440;a[i*3+2]=(Math.random()-.5)*600;}const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(a,3));const p=new T.Points(g,new T.PointsMaterial({color:0xbfd8e6,size:2.2,sizeAttenuation:false,transparent:true,opacity:.6,depthWrite:false}));p.visible=false;p.frustumCulled=false;scene.add(p);return p;})();
const gash=(()=>{const pos=[],idx=[];let k=0;for(let x=125;x>=38;x-=3){if(((x/3|0)%4)===0)continue;const z=hb(x,4.2)+.12,z2=hb(x-2.2,4.2)+.12;pos.push(x,3.7,z,x,4.7,hb(x,4.7)+.12,x-2.2,3.7,z2,x-2.2,4.7,hb(x-2.2,4.7)+.12);idx.push(k,k+1,k+2,k+1,k+3,k+2);k+=4;}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);const m=new T.Mesh(g,new T.MeshBasicMaterial({color:0xff4a3a,side:DS,clippingPlanes:CLIP}));m.visible=false;root.add(m);return m;})();
const wlab=[[V(300,BED+60,0),'PROA · roda de proa enterrada ≈ 18 m'],[V(-300,BED+55,0),'POPA · conveses desabados'],[V(-60,BED+12,0),'CAMPO DE DESTROÇOS · ≈ 600 m entre as seções'],[V(-215,BED+14,40),'caldeiras']].map(q=>{const e=document.createElement('div');e.className='dim';e.textContent=q[1];e.style.display='none';lblBox.appendChild(e);return{e:e,v:q[0]};});
const smo=(t,a,b)=>{const u=Math.max(0,Math.min(1,(t-a)/(b-a)));return u*u*(3-2*u);};
let skCh=-1;
function sinkApply(){const t=sk.t;let bow,st,deg;const uw=t>=161.5,yaw=t<0?.1*smo(t,-.6,-.1):.1*(1-smo(t,0,4));
 if(uw){const u=smo(t,161.5,171),ul=Math.min(1,(t-161.5)/9.5);deg=40-37*u;
  bow={a:-(40-38*u)*PI/180,ry:0,x:40+260*u,y:-45+(BED-4+45)*ul,sy:1};st={a:-(88-80*u)*PI/180*(1-u*.4),ry:PI*3*u,x:-60-240*u,y:-30+(BED+1+30)*ul,sy:1-.28*smo(t,162,165)};}
 else if(t<SPL){const v=kf(SKF,Math.max(0,t));deg=v[0];bow=st=xfm(-15,-deg*PI/180,-15,WL-v[1]);bow.ry=yaw;}
 else{const vb=kf(SKB,t),vs=kf(SKS,t),a0=-19.5*PI/180,w0=xfm(-15,a0,-15,WL-9.6),wx=w0.x+(-85*Math.cos(a0)-WL*Math.sin(a0)),wy=w0.y+(-85*Math.sin(a0)+WL*Math.cos(a0));deg=vs[0];bow=xfm(-15,-vb[0]*PI/180,-15,WL-vb[1]);st=xfm(-85,-vs[0]*PI/180,wx,wy-vs[1]);}
 sk.bow=bow;sk.st=st;root.rotation.set(0,bow.ry||0,bow.a);root.position.set(bow.x,bow.y,0);root.scale.set(1,1,1);root.visible=true;
 /* ambiente: superfície ou fundo */
 sea.visible=!uw;sky.visible=!uw;stars.visible=!uw;wb.visible=!uw;bedG.visible=uw;snow.visible=uw&&t<171;$('#app').classList.toggle('deep',uw);lightApply(1);hemi.intensity=uw?.62:.24;hemi.color.setHex(uw?0x7fb0d0:0xd6e6ff);sun.intensity=uw?.25:.1;if(uw&&GLX.deckL)GLX.deckL.forEach(l=>l.intensity=0);gash.visible=t>=-.1;
 if(uw&&snow.visible){const p=snow.geometry.attributes.position;for(let i=0;i<p.count;i++){p.setY(i,BED+((p.getY(i)-BED+ (sk.play?9:0))%440));}p.needsUpdate=true;}
 wlab.forEach(l=>{l.on=t>=171;});
 /* iceberg da colisão */
 berg.visible=t<3;if(t<3){berg.scale.set(30,14,15);berg.position.set(t<0?35-695*t:35-520*t,WL,(t<-.62?0:33*smo(t,-.62,-.15))+(t>.05?30*smo(t,.05,1):0));}
 if(t<0){tel.ord=tel.eng=tel.ack=8;sim.kn=22.5;sim.rpm=75;}else if(tel.ack!==4){tel.ord=tel.eng=tel.ack=4;}
 /* luzes */
 let k=1,red=false;if(t>=156.5&&t<SPL){red=true;k=.55+.2*Math.sin(t*37);if(t>157.45)k*=Math.sin(t*95)>0?1:.12;}else if(t>=SPL)k=0;emMats.forEach(mm=>{const e=mm.userData.ec||[1,1,1];mm.emissiveIntensity=k;mm.emissive.setRGB(e[0],e[1]*(red?.5:1),e[2]*(red?.25:1));});glowM.forEach(m=>{m.userData.real.emissiveIntensity=k*.8;});if(GLX.deckL)GLX.deckL.forEach(l=>l.intensity=k*.9);
 antIt.o.visible=t<SPL;items.forEach(it=>{if(it.inner)it.o.visible=t>=SPL;});
 /* mastros: o de proa tomba para ré sobre a ponte durante a descida; o principal se perde */
 mastG.children[0].rotation.z=mR0+.965*smo(t,161.5,164.5);mastG.children[1].visible=t<159.4;for(let i=2;i<mastG.children.length;i++)mastG.children[i].visible=t<SPL;
 funIt.forEach((it,i)=>{const f=(t-FT[i])/.5,o=it.o;if(f<=0){o.rotation.set(0,0,it.r0);o.position.copy(it.base);o.visible=true;}else{const q=Math.min(1,f);o.rotation.set((i%2?-1:1)*.45*q*q,0,it.r0-1.6*q*q);o.position.copy(it.base);o.position.y-=f>1?(f-1)*22:0;o.visible=f<1.9;}});
 const m4=new T.Matrix4(),Q=new T.Quaternion(),sc=V(4.2,.7,1.3);for(let i=0;i<20;i++){const on=t>=BL[i];if(GLX.boats&&i<16&&GLX.boats[i])GLX.boats[i].visible=!on;if(boatIM){if(i<16)boatIM.setMatrixAt(i,on?M0:boatM0[i]);else boatG.children[i-13].visible=!on;}
  if(on){const dm=t-BL[i],s=i%2?1:-1;m4.compose(V(BX[i]+(i%3-1)*Math.min(dm,60)*.7,WL+.25,s*(19+Math.min(dm,70)*2.4+(i%4)*7)),Q,sc);wb.setMatrixAt(i,m4);}else wb.setMatrixAt(i,M0);}
 if(boatIM)boatIM.instanceMatrix.needsUpdate=true;wb.instanceMatrix.needsUpdate=true;
 const ch=t<0?0:t<161.5?1:t<171?2:3;if(ch!==skCh){skCh=ch;fly(ch===0?{t:V(70,12,0),th:1.95,ph:1.05,r:rFor(330)}:ch===1?{t:V(25,10,0),th:.42,ph:1.36,r:rFor(380)}:ch===2?{t:V(0,BED+200,0),th:.25,ph:1.45,r:rFor(1000)}:{t:V(0,BED+20,0),th:.35,ph:1.2,r:rFor(900)},1200);$$('[data-ch]').forEach(b=>b.classList.toggle('on',+b.dataset.ch===ch));}
 const tc=Math.max(-2,Math.min(t,160.6)),ms=Math.floor(tc)+23*60+40,hh=Math.floor(ms/60)%24,mi=ms%60,e=(id,v)=>{const x=document.getElementById(id);if(x)x.textContent=v;};
 e('skc',uw?'−'+(Math.round(3800*Math.min(1,(t-161.5)/9.5)/50)*50).toLocaleString('pt-BR')+' m':(hh<10?'0':'')+hh+'h'+(mi<10?'0':'')+mi);e('skd',uw?(t>=171?'no fundo do Atlântico':'profundidade'):ms>=1440?'15 de abril':'14 de abril');
 e('skA',uw?'—':t>=161.2?'—':nf(deg,0)+'°');e('skB',t>=SPL?'partido':t>=125?'proa submersa':t>=0?'avariado':'intacto');e('skL',k===0?'apagadas':red?'piscando':'acesas');e('skN',BL.filter(x=>t>=x).length+' / 20');
 const r=$('#skr');if(r&&Math.abs(+r.value-t)>.5)r.value=t;const p=$('#skp');if(p)p.textContent=sk.play?'❚❚ Pausar':'▶ Reproduzir';let cur=0;SK.forEach((s,i)=>{if(s[0]<=t)cur=i;});$$('.ev[data-sk]').forEach((x,i)=>{const on=i===cur;if(on&&!x.classList.contains('on')){const bd=$('#sheetBody'),tp=$('.skTop');if(bd&&tp)bd.scrollTop+=x.getBoundingClientRect().top-tp.getBoundingClientRect().bottom-6;}x.classList.toggle('on',on);});}
/* depois da ruptura o navio é desenhado em duas passadas, cada metade com seu movimento */
function sinkRender(){const t=sk.t;R.autoClear=false;R.clear();
 const hid=[];scene.children.forEach(c=>{if(c!==root&&!c.isLight&&c.visible){hid.push(c);c.visible=false;}});root.visible=true;
 [['B',sk.bow,1,159.3],['S',sk.st,-1,161.2]].forEach(h=>{if(t>=h[3]&&t<161.5)return;items.forEach(it=>{if(it.half){it.o.userData.pv=it.o.visible;if(it.half!==h[0])it.o.visible=false;}});
  root.rotation.set(0,h[1].ry||0,h[1].a);root.position.set(h[1].x,h[1].y,0);root.scale.set(1,h[1].sy||1,1);root.updateMatrixWorld(true);clip.setFromNormalAndCoplanarPoint(V(h[2],0,0).transformDirection(root.matrixWorld),V(XS,0,0).applyMatrix4(root.matrixWorld));R.render(scene,cam);
  items.forEach(it=>{if(it.half)it.o.visible=it.o.userData.pv;});});
 hid.forEach(c=>c.visible=true);clip.normal.set(0,0,-1);clip.constant=1e4;root.visible=false;R.render(scene,cam);root.visible=true;R.autoClear=true;}
function sinkReset(){sk.play=false;sk.t=0;skCh=-1;root.position.set(0,0,0);root.rotation.set(0,0,0);root.scale.set(1,1,1);root.visible=true;bedG.visible=false;snow.visible=false;gash.visible=false;wlab.forEach(l=>{l.on=false;l.e.style.display='none';});$('#app').classList.remove('deep');hemi.color.setHex(0xd6e6ff);berg.scale.set(55,20,40);berg.position.set(640,WL,-20);root.updateMatrixWorld(true);S.dark=false;S.night=sk.np;tel.ord=tel.eng=tel.ack=8;wb.visible=false;antIt.o.visible=true;mastG.children[0].rotation.z=mR0;mastG.children.forEach(c=>c.visible=true);
 if(GLX.boats)GLX.boats.forEach(b=>{if(b)b.visible=true;});if(boatIM){for(let i=0;i<16;i++)boatIM.setMatrixAt(i,boatM0[i]);boatIM.instanceMatrix.needsUpdate=true;for(let i=3;i<=6;i++)boatG.children[i].visible=true;}funIt.forEach(it=>{it.o.rotation.set(0,0,it.r0);it.o.position.copy(it.base);it.o.visible=true;});emMats.forEach(mm=>{const e=mm.userData.ec||[1,1,1];mm.emissive.setRGB(e[0],e[1],e[2]);});}
/* ================= SIMULAÇÃO E ANIMAÇÃO ================= */
function lightApply(nf){const inS=!!S.visit,bp=S.bp;hemi.intensity=inS?.8:.95+(.3-.95)*nf;sun.intensity=inS?.45:1+(.14-1)*nf;fillL.intensity=.35+(.16-.35)*nf;seaMat.uniforms.uN.value=sky.material.uniforms.uN.value=nf;
 stars.material.opacity=.85*nf;stars.visible=nf>.03&&!bp&&!inS&&sea.visible;const k=S.dark?0:nf;emMats.forEach(mm=>{mm.emissiveIntensity=k;});glowM.forEach(m=>{m.userData.real.emissiveIntensity=k*.8;});
 if(GLX.deckL)GLX.deckL.forEach(l=>l.intensity=k*.9);if(GLX.nav)GLX.nav.forEach(m=>m.emissiveIntensity=.25+1.6*nf);}
const sunW=V(160,220,180).normalize(),tq=new T.Vector3();
const colA=new T.Color(0x7a1c00),colB=new T.Color(0xffb040),tmpC=new T.Color();let hudT=0;
function animate(dt,time){const run=S.run;
 if(S.tab!=='sink'){S.nf+=((S.night?1:0)-S.nf)*Math.min(1,dt*1.3);if(Math.abs((S.night?1:0)-S.nf)<.004)S.nf=S.night?1:0;lightApply(S.nf);}
 const navOn=S.tab!=='sink'&&S.tab!=='flood';
 if(run&&navOn){const v=Math.max(0,sim.kn)*.5144;nav.rate+=((nav.rud/35)*.012*Math.min(1,v/6)-nav.rate)*Math.min(1,dt*.5);nav.h+=nav.rate*dt;seaMat.uniforms.uK.value=v>.6?nav.rate/v:0;}
 if(navOn){root.rotation.y=-nav.h;root.rotation.x+=(-nav.rate*3.2-root.rotation.x)*Math.min(1,dt*1.2);if(rudder)rudder.rotation.y+=(nav.rud*PI/180-rudder.rotation.y)*Math.min(1,dt*1.4);}else if(S.tab==='flood'){root.rotation.y=0;root.rotation.x=0;}sea.rotation.y=navOn?-nav.h:0;
 if(GLX.wheel)GLX.wheel.rotation.x+=(nav.rud/35*PI*1.5-GLX.wheel.rotation.x)*Math.min(1,dt*2.2);
 if(GLX.telH){const ta=-(tel.ord-4)*.36;GLX.telH.forEach(g=>{g.rotation.z+=(ta-g.rotation.z)*Math.min(1,dt*5);});}
 if(fx.bell>0&&GLX.bell){fx.bell=Math.max(0,fx.bell-dt*.5);GLX.bell.rotation.z=.5*fx.bell*Math.sin(time*13);}
 if(GLX.cord){const on=fx.wh>0;if(on)fx.wh=Math.max(0,fx.wh-dt);GLX.cord.position.y+=((on?31.83:32.08)-GLX.cord.position.y)*Math.min(1,dt*8);GLX.puff.forEach((sp,i)=>{const u=sp.userData;u.l+=dt/1.6;if(u.l>=1&&on&&fx.wh>.4){u.l=Math.random()*.2;sp.position.set((u.f?FX[1]:FX[0])+1.4,45.2,0);}const q=u.l;sp.visible=q<1&&!S.bp;if(q<1){sp.position.y+=dt*5;sp.position.x-=dt*(2+sim.kn*.3);sp.scale.setScalar(1.5+9*q);sp.material.opacity=.75*(1-q);}});}
 if(run){teleStep(dt);const tg=ORD_RPM[tel.ack];sim.rpm+=(tg-sim.rpm)*Math.min(1,dt*.35);const tt=tel.ack>=7?165*Math.max(0,sim.rpm)/75:0;sim.trpm+=(tt-sim.trpm)*Math.min(1,dt*.25);
  const kt=sim.rpm>=0?sim.rpm/75*(18.5+3.5*Math.min(1,sim.trpm/165)):sim.rpm/60*9;sim.kn+=(kt-sim.kn)*Math.min(1,dt*.12);sim.burn+=((.18+.82*Math.abs(tg)/75)-sim.burn)*Math.min(1,dt*.3);
  sim.ang+=sim.rpm/60*2*PI*dt;sim.tang+=sim.trpm/60*2*PI*dt;sim.sph+=dt*(.12+.2*sim.burn);}
 engines.forEach(e=>{e.c.forEach(c=>{const th=e.s*sim.ang+c.ph,y=CR*Math.cos(th)+Math.sqrt(CL*CL-CR*CR*Math.sin(th)*Math.sin(th));c.cr.rotation.x=th;c.pg.position.y=y;c.rg.position.y=y;c.rg.rotation.x=-Math.asin(CR*Math.sin(th)/CL);});});
 spin[0].o.rotation.x=-sim.ang;spin[1].o.rotation.x=sim.ang;spin[2].o.rotation.x=sim.tang;props.forEach(p=>{p.o.rotation.x=p.k>1.5?sim.tang:p.s*sim.ang;});rotor.rotation.x=sim.tang;
 if(run)dynos.forEach((d,i)=>d.rotation.x+=dt*(26+i));
 tmpC.copy(colA).lerp(colB,Math.min(1,sim.burn));fireMesh.forEach(m=>{const r=m.userData.real;r.emissive.copy(tmpC);r.emissiveIntensity=(.3+1.6*sim.burn)*(.86+.14*Math.sin(time*9));});
 const flk=.82+.18*Math.sin(time*11)*Math.sin(time*7.3);fireL.forEach(l=>l.intensity=1.6*sim.burn*flk);
 stokers.forEach(st=>{const p=(sim.sph+st.ph)%1,sw=.5+.5*Math.cos(2*PI*p);st.o.rotation.y=st.base+2.5*sw;st.o.userData.up.rotation.z=-.5*(.5+.5*Math.cos(4*PI*p));});
 const exOK=S.ex<.02&&!S.visit,fa=Math.abs(sim.rpm)/75;
 fLive.o.visible=fExp.o.visible=fLp.o.visible=fFlue.o.visible=exOK&&!S.closed&&S.mode!=='conveses'&&S.tab!=='sink';
 if(run&&exOK){fLive.step(dt*(1+12*fa));fExp.step(dt*(.6+7*fa));fLp.step(dt*(.5+8*fa));fFlue.step(dt*(1+7*sim.burn));}
 const hz=-(tel.ord-4)*.5;telM.userData.h0.rotation.z=telM.userData.h1.rotation.z=-(tel.eng-4)*.5;
 const ps=SETS.ponte.g;if(ps&&ps.visible){ps.userData.handles.forEach(h=>h.rotation.z=hz);}
 const rs=SETS.radio.g;if(rs&&rs.visible&&mor.on)rs.userData.disc.rotation.z+=dt*40;
 {const u=seaMat.uniforms;if(run)u.uT.value+=dt;u.uV.value=S.tab==='sink'&&sk.t>=0?0:Math.max(0,sim.kn)*.5144;u.uR.value=sim.rpm;u.uRc.value=sim.trpm;sea.updateMatrixWorld(true);u.uCam.value.copy(sea.worldToLocal(tq.copy(cam.position)));u.uCam.value.y+=WL;u.uSun.value.copy(sunW).applyAxisAngle(V(0,1,0),-sea.rotation.y);}
 const smOn=!S.bp&&exOK&&S.mode!=='conveses'&&S.tab!=='flood'&&S.tab!=='sink';
 smoke.forEach(sp=>{const u=sp.userData;if(run)u.life+=dt/6;if(u.life>=1){u.life=0;const f=funnelTops[u.f];sp.position.set(f.x+Math.random(),f.y+.5+Math.random(),(Math.random()-.5)*2);u.v.set(-(2+Math.abs(sim.kn)*.5)-Math.random(),3.6+Math.random(),(Math.random()-.5));u.on=Math.random()<.15+sim.burn;}
  if(run)sp.position.addScaledVector(u.v,dt);const k=u.life;sp.scale.setScalar(4+20*k);sp.material.opacity=u.on?.42*Math.sin(PI*k)*Math.min(1,.2+sim.burn)*(1-.8*S.nf):0;sp.visible=smOn;});
 if(Math.abs(S.exT-S.ex)>.001){S.ex+=(S.exT-S.ex)*Math.min(1,dt*3.2);if(Math.abs(S.exT-S.ex)<.002){S.ex=S.exT;if(S.ex===0)setTimeout(applyLook,0);}items.forEach(it=>{it.o.position.copy(it.base).addScaledVector(it.ex,S.ex);});grid.position.y=-2-36*S.ex;}
 if(S.fp)fpMove(dt);floodStep(dt);if(S.tab==='sink'&&sk.play){const t=sk.t;sk.t=Math.min(176,t+dt*(t<0?.22:t<145?4:t<155?2:t<161.5?.3:t<171?1:.8));if(sk.t>=176)sk.play=false;sinkApply();}
 const es=SETS.escadaria.g;if(es&&es.visible&&es.userData.cars)es.userData.cars.forEach(c=>{const u=((time*.16+c.ph)%2),v=u<1?u:2-u,q=Math.max(0,Math.min(1,(v-.25)/.5));c.o.position.y=3.2*q*q*(3-2*q);});
 hudT+=dt;if(hudT>.15){hudT=0;ambStep();$('#hO').textContent=ORDERS[tel.ack].replace(' Ahead',' ▲').replace(' Astern',' ▼');$('#hR').textContent=Math.round(sim.rpm);$('#hK').textContent=nf(Math.abs(sim.kn),1);
  if(S.tab==='tele'){const e=(id,v)=>{const x=document.getElementById(id);if(x)x.textContent=v;};e('kA',Math.round(sim.rpm));e('kT',Math.round(sim.trpm));e('kK',nf(Math.abs(sim.kn),1));e('kH',Math.round(((266+nav.h*180/PI)%360+360)%360)+'°');}}}

/* ================= LAÇO ================= */
function resize(){const w=window.innerWidth,h=window.innerHeight;R.setSize(w,h,false);cam.aspect=w/h;const bh=$('#bottom').offsetHeight;sheet.style.bottom=(w>=900?bh+12:bh)+'px';
 if(S.tab&&sheet.classList.contains('show')&&!S.fp){const r=sheet.getBoundingClientRect();if(r.width<w*.7)cam.setViewOffset(w,h,r.width/2,0,w,h);else cam.setViewOffset(w,h,0,Math.min(r.height,h*.5)/2,w,h);}else cam.clearViewOffset();
 cam.updateProjectionMatrix();}
window.addEventListener('resize',resize);
let last=performance.now();
function loop(now){requestAnimationFrame(loop);const rdt=Math.min(.3,(now-last)/1000),dt=Math.min(.05,rdt);last=now;animate(dt,now/1000);camUpdate(rdt);labelsUpdate();if(S.tab==='sink'&&sk.t>=SPL&&(sk.t<161.2||sk.t>=161.5))sinkRender();else R.render(scene,cam);}
resize();C.r=rFor(225);applyLook();camUpdate(0);
$('#load').style.display='none';setTimeout(()=>{$('#hint').style.opacity=0;},6000);
window.__ship={probe:(x,y,z,dx,dy,dz)=>{const r=new T.Raycaster(V(x,y,z),V(dx,dy,dz).normalize(),0,60),h=r.intersectObjects(meshes,false).filter(q=>q.object.userData.it.o.visible&&!q.object.userData.door);return h.length?[+h[0].distance.toFixed(2),h[0].object.userData.pid,h[0].object.userData.real.name||'']:null;},nav:nav,fx:fx,blowWhistle:blowWhistle,ringBell:ringBell,items:items,GLX:GLX,glbInfo:()=>({st:GL?'ok':'fallback',has:true}),seaMat:seaMat,SPL:SPL,sk:sk,sinkApply:sinkApply,SETS:SETS,travel:travel,S:S,sim:sim,tel:tel,fl:fl,setMode:setMode,goto:goto,openTab:openTab,visit:visit,walk:walk,gavea:gavea,startFP:startFP,sendOrder:sendOrder,C:C,F:F,keys:keys,hb:hb,CB:CB,BHTOP:BHTOP,BH:BH,WL:WL};
requestAnimationFrame(loop);
});
})();
</script>
</body>
</html>
