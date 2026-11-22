
/* ===== MÓDULO 3c — caminhada nos conveses do navio (malha de navegação gerada do modelo) =====
   assets/models/conves_nav.js (tools/gerar-navegacao.mjs): grade de 25 cm em coordenadas locais do navio; em cada coluna, os pisos
   com pé-direito livre e, em cada piso, as ligações com os vizinhos (degrau até 42 cm, sem parede, balaústre ou bote no caminho).
   Carregada só quando o visitante começa a caminhar. Os pisos retangulares da ponte (WALK.ponte.surf) continuam valendo. */
const NAV={d:null,ld:false,cbs:[]};
function navLoad(cb){if(NAV.d){cb&&cb();return;}if(cb)NAV.cbs.push(cb);if(NAV.ld)return;NAV.ld=true;
 const fin=()=>{const r=window.CONVES_NAV;if(!r)return;const b=s=>{const t=atob(s),u=new Uint8Array(t.length);for(let i=0;i<t.length;i++)u[i]=t.charCodeAt(i);return u;};
  const cnt=b(r.cnt),yb=b(r.y),off=new Uint32Array(cnt.length+1);for(let i=0;i<cnt.length;i++)off[i+1]=off[i]+cnt[i];
  NAV.d={x0:r.x0,z0:r.z0,h:r.h,nx:r.nx,nz:r.nz,off,y:new Int16Array(yb.buffer,0,yb.length/2),e:b(r.e)};delete window.CONVES_NAV;NAV.cbs.splice(0).forEach(f=>f());};
 if(window.CONVES_NAV){fin();return;}const s=document.createElement('script');s.src='assets/models/conves_nav.js';s.onload=fin;s.onerror=()=>{NAV.ld=false;};document.head.appendChild(s);}
const NAV_STEP=.42;
function navCell(x,z){const d=NAV.d,i=Math.floor((x-d.x0)/d.h),j=Math.floor((z-d.z0)/d.h);return i<0||j<0||i>=d.nx||j>=d.nz?-1:i*d.nz+j;}
/* piso da coluna c mais próximo da altura y (dentro de tol); devolve o índice da camada ou -1 */
function navLayer(c,y,tol){const d=NAV.d;if(c<0)return -1;let b=-1,bd=tol;for(let n=d.off[c];n<d.off[c+1];n++){const q=Math.abs(d.y[n]/100-y);if(q<=bd){bd=q;b=n;}}return b;}
/* passo para uma coluna vizinha (di,dj ∈ {-1,0,1}, só um eixo): exige a ligação gravada */
function navAdj(n,c,di,dj){const d=NAV.d,bit=di>0?1:di<0?2:dj>0?4:8;if(!(d.e[n]&bit))return -1;return navLayer(c+di*d.nz+dj,d.y[n]/100,NAV_STEP);}
/* altura do piso em (x1,z1) partindo de (x0,z0,y) ou null se o caminho estiver bloqueado */
function navMove(x0,z0,y,x1,z1){const d=NAV.d;if(!d)return null;const c0=navCell(x0,z0),n0=navLayer(c0,y,.6);if(n0<0)return null;const c1=navCell(x1,z1);if(c1<0)return null;if(c1===c0)return d.y[n0]/100;
 const di=Math.floor((x1-d.x0)/d.h)-Math.floor((x0-d.x0)/d.h),dj=Math.floor((z1-d.z0)/d.h)-Math.floor((z0-d.z0)/d.h);if(Math.abs(di)>1||Math.abs(dj)>1)return null;
 if(!di||!dj){const n=navAdj(n0,c0,di,dj);return n<0?null:d.y[n]/100;}
 /* diagonal: passa por uma das duas colunas laterais */
 for(const [a,b] of [[di,0],[0,dj]]){const m=navAdj(n0,c0,a,b);if(m<0)continue;const n=navAdj(m,c0+a*d.nz+b,b?di:0,a?dj:0);if(n>=0)return d.y[n]/100;}return null;}
/* coluna livre em volta (3×3 com todas as ligações), para não pôr marcas encostadas em obstáculos */
function navOpen(c,y){const d=NAV.d;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const n=navLayer(c+a*d.nz+b,y,.3);if(n<0||d.e[n]!==15)return false;}return true;}
/* ponto de piso mais próximo de (x,y,z) num raio de r metros (para pontos de partida e acessos) */
function navNear(x,y,z,r){const d=NAV.d;if(!d)return null;let best=null,bd=1e9;const R=Math.ceil((r||3)/d.h),ci=Math.floor((x-d.x0)/d.h),cj=Math.floor((z-d.z0)/d.h);
 for(let i=ci-R;i<=ci+R;i++)for(let j=cj-R;j<=cj+R;j++){if(i<0||j<0||i>=d.nx||j>=d.nz)continue;const c=i*d.nz+j;for(let n=d.off[c];n<d.off[c+1];n++){if(d.e[n]!==15||!navOpen(c,d.y[n]/100))continue;const px=d.x0+(i+.5)*d.h,pz=d.z0+(j+.5)*d.h,py=d.y[n]/100;if(Math.abs(py-y)>1.2)continue;const q=Math.hypot(px-x,pz-z)+Math.abs(py-y)*3;if(q<bd){bd=q;best=[px,py,pz];}}}return best;}
/* pontos de partida no convés (aproximados; ajustados ao piso real ao carregar) */
const NAV_SPOTS={ponte:null,botes:[[48,29,12.4],-PI/2],proa:[[112,25.5,2.5],-PI/2],pontaProa:[[131.7,25.7,1.55],-1.0],popa:[[-112,24.5,3],PI/2],passeioA:[[30,23.3,11],-PI/2]};
/* regiões, só para o letreiro do canto (ordem importa) */
function navZone(x,y){if(y>27.4)return x>67.8?'Ponte de comando':'Convés dos Botes';if(x>129)return 'Ponta da proa';if(x>66)return 'Proa · castelo e poço de vante';if(x<-59.5&&y>20.3)return 'Popa · poço de ré e tombadilho';if(y<21)return 'Convés B · passeio de ré da 2ª classe';return 'Convés A · passeio';}
/* Acessos do museu: ligam áreas do convés que, no navio real, se comunicavam por escadas internas não reconstruídas aqui.
   Não são escadas históricas; aparecem como marcas circulares azuis com a legenda “acesso do museu”. */
const NAV_LINKS=[
 {a:[[62,29,8.3],PI/2],b:[[82,21.2,8.5],-PI/2],la:'Descer à proa',lb:'Subir ao convés dos Botes'},
 {a:[[62,29,-8.3],PI/2],b:[[82,21.2,-8.5],-PI/2],la:'Descer à proa',lb:'Subir ao convés dos Botes'},
 {a:[[38,29,12.2],PI/2],b:[[38,23.3,11],PI/2],la:'Descer ao passeio do convés A',lb:'Subir ao convés dos Botes'},
 {a:[[38,29,-12.2],PI/2],b:[[38,23.3,-11],PI/2],la:'Descer ao passeio do convés A',lb:'Subir ao convés dos Botes'},
 {a:[[-62,28.6,2],PI/2],b:[[-58.2,23,2],PI/2],la:'Descer ao convés A, à ré',lb:'Subir ao convés dos Botes'},
 {a:[[-70,28.6,8],PI/2],b:[[-92,21.2,8],PI/2],la:'Descer à popa',lb:'Subir ao convés dos Botes'},
 {a:[[-70,20.3,12],PI/2],b:[[-100,21.2,9],PI/2],la:'Ir ao poço de ré',lb:'Ir ao passeio do convés B'}];
let navG=null,navLock=true;
function navMarkers(){if(navG||!NAV.d)return;navG=G();navG.visible=false;
 const rm=new T.MeshBasicMaterial({color:0x7fd0ff,transparent:true,opacity:.75,depthWrite:false,side:DS}),rg=new T.RingGeometry(.42,.55,40);
 const lab=t=>{const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.fillStyle='rgba(10,17,32,.82)';x.fillRect(0,0,512,128);x.strokeStyle='#7fd0ff';x.lineWidth=4;x.strokeRect(2,2,508,124);x.fillStyle='#e8f4ff';x.font='600 40px Barlow, sans-serif';x.textAlign='center';x.fillText(t,256,58);x.fillStyle='#9fc3d6';x.font='28px Barlow, sans-serif';x.fillText('acesso do museu (não histórico)',256,100);
  const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:true,transparent:true}));s.scale.set(1.6,.4,1);return s;};
 NAV.pts=[];NAV_LINKS.forEach((L,i)=>{['a','b'].forEach(k=>{const p=navNear(L[k][0][0],L[k][0][1],L[k][0][2],4);if(!p)return;L[k+'p']=p;const r=new T.Mesh(rg,rm);r.rotation.x=-PI/2;r.position.set(p[0],p[1]+.03,p[2]);r.userData.noPick=true;navG.add(r);
  const s=lab(k==='a'?L.la:L.lb);s.position.set(p[0],p[1]+1.9,p[2]);navG.add(s);NAV.pts.push({p,L,k});});});
 root.add(navG);}
/* chegou a uma marca de acesso: atravessa com o esmaecimento já usado nas portas */
function navLinks(){if(!NAV.pts)return;let near=false;for(const q of NAV.pts){const r=Math.hypot(F.p.x-q.p[0],F.p.z-q.p[2]);if(Math.abs(F.p.y-q.p[1])>1)continue;if(r<1.4)near=true;
  if(r<.5&&!navLock){const o=q.k==='a'?'b':'a',to=q.L[o+'p'],yaw=q.L[o][1];if(!to)return;navLock=true;fadeDo(()=>{F.p.set(to[0],to[1],to[2]);F.yaw=yaw;F.ys=undefined;applyLook();});return;}}
 if(!near)navLock=false;}
function navSpawn(k){const s=NAV_SPOTS[k];if(!s||!NAV.d)return;const p=navNear(s[0][0],s[0][1],s[0][2],4);if(!p)return;F.p.set(p[0],p[1],p[2]);F.yaw=s[1];F.pitch=0;F.ys=undefined;navLock=true;}
