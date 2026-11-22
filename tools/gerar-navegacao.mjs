// Gera assets/models/conves_nav.js: malha de navegação em grade (pisos por coluna + ligações) para caminhar em primeira pessoa
// pelos conveses do modelo. Entrada: tris.bin (Float32, 9 floats por triângulo, coordenadas locais do navio), exportado da
// página pelo console do navegador (ver README, seção "Navegação nos conveses").
// Uso: node tools/gerar-navegacao.mjs caminho/tris.bin
import {readFileSync,writeFileSync} from 'node:fs';
import {dirname,join} from 'node:path';import {fileURLToPath} from 'node:url';
const ROOT=join(dirname(fileURLToPath(import.meta.url)),'..');
const buf=readFileSync(process.argv[2]);const P=new Float32Array(buf.buffer,buf.byteOffset,buf.byteLength/4);const NT=P.length/9;
const H=0.25,X0=-137,X1=137,Z0=-15.5,Z1=15.5,NX=Math.round((X1-X0)/H),NZ=Math.round((Z1-Z0)/H);
const CLEAR=1.95,STEP=0.42,EYE=[0.5,1.2,1.75];
/* --- índice 2D (raios verticais) e 3D (segmentos horizontais) --- */
const B2=0.5,B2X=Math.ceil((X1-X0)/B2),B2Z=Math.ceil((Z1-Z0)/B2),bin2=new Array(B2X*B2Z);
const B3=0.5,Y0=-4,Y1=48,B3Y=Math.ceil((Y1-Y0)/B3),bin3=new Map();
const flat=new Float32Array(NT);
for(let t=0;t<NT;t++){const o=t*9;let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9,z0=1e9,z1=-1e9;for(let k=0;k<3;k++){const x=P[o+k*3],y=P[o+k*3+1],z=P[o+k*3+2];if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;if(z<z0)z0=z;if(z>z1)z1=z;}
 const ax=P[o+3]-P[o],ay=P[o+4]-P[o+1],az=P[o+5]-P[o+2],bx=P[o+6]-P[o],by=P[o+7]-P[o+1],bz=P[o+8]-P[o+2];const nx=ay*bz-az*by,ny=az*bx-ax*bz,nz=ax*by-ay*bx,nl=Math.hypot(nx,ny,nz);if(nl<1e-9)continue;flat[t]=Math.abs(ny)/nl;
 if(x1<X0||x0>X1||z1<Z0||z0>Z1)continue;
 const i0=Math.max(0,Math.floor((x0-X0)/B2)),i1=Math.min(B2X-1,Math.floor((x1-X0)/B2)),j0=Math.max(0,Math.floor((z0-Z0)/B2)),j1=Math.min(B2Z-1,Math.floor((z1-Z0)/B2));
 if((i1-i0+1)*(j1-j0+1)>4000)continue;
 for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const q=i*B2Z+j;(bin2[q]||(bin2[q]=[])).push(t);}
 const k0=Math.max(0,Math.floor((y0-Y0)/B3)),k1=Math.min(B3Y-1,Math.floor((y1-Y0)/B3));
 if((i1-i0+1)*(j1-j0+1)*(k1-k0+1)>20000)continue;
 for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++)for(let k=k0;k<=k1;k++){const q=(i*B2Z+j)*B3Y+k;let a=bin3.get(q);if(!a)bin3.set(q,a=[]);a.push(t);}}
console.log('triângulos',NT,'bins3',bin3.size);
/* raio vertical: alturas e inclinação de todos os triângulos sob (x,z) */
function column(x,z){const q=Math.floor((x-X0)/B2)*B2Z+Math.floor((z-Z0)/B2),L=bin2[q],hits=[];if(!L)return hits;
 for(const t of L){const o=t*9,ax=P[o],az=P[o+2],bx=P[o+3],bz=P[o+5],cx=P[o+6],cz=P[o+8];const d=(bz-cz)*(ax-cx)+(cx-bx)*(az-cz);if(Math.abs(d)<1e-12)continue;
  const l1=((bz-cz)*(x-cx)+(cx-bx)*(z-cz))/d,l2=((cz-az)*(x-cx)+(ax-cx)*(z-cz))/d,l3=1-l1-l2;if(l1<0||l2<0||l3<0)continue;
  hits.push([l1*P[o+1]+l2*P[o+4]+l3*P[o+7],flat[t]]);}
 hits.sort((a,b)=>a[0]-b[0]);return hits;}
/* segmento horizontal bloqueado? (Möller–Trumbore com t em [0,1]) */
function blocked(ax,ay,az,bx,by,bz){const dx=bx-ax,dy=by-ay,dz=bz-az,seen=new Set();
 const i0=Math.floor((Math.min(ax,bx)-X0)/B2),i1=Math.floor((Math.max(ax,bx)-X0)/B2),j0=Math.floor((Math.min(az,bz)-Z0)/B2),j1=Math.floor((Math.max(az,bz)-Z0)/B2),k0=Math.floor((Math.min(ay,by)-Y0)/B3),k1=Math.floor((Math.max(ay,by)-Y0)/B3);
 for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++)for(let k=k0;k<=k1;k++){const L=bin3.get((i*B2Z+j)*B3Y+k);if(!L)continue;
  for(const t of L){if(seen.has(t))continue;seen.add(t);const o=t*9,e1x=P[o+3]-P[o],e1y=P[o+4]-P[o+1],e1z=P[o+5]-P[o+2],e2x=P[o+6]-P[o],e2y=P[o+7]-P[o+1],e2z=P[o+8]-P[o+2];
   const px=dy*e2z-dz*e2y,py=dz*e2x-dx*e2z,pz=dx*e2y-dy*e2x,det=e1x*px+e1y*py+e1z*pz;if(Math.abs(det)<1e-12)continue;const inv=1/det,tx=ax-P[o],ty=ay-P[o+1],tz=az-P[o+2];
   const u=(tx*px+ty*py+tz*pz)*inv;if(u<0||u>1)continue;const qx=ty*e1z-tz*e1y,qy=tz*e1x-tx*e1z,qz=tx*e1y-ty*e1x,v=(dx*qx+dy*qy+dz*qz)*inv;if(v<0||u+v>1)continue;const s=(e2x*qx+e2y*qy+e2z*qz)*inv;if(s>=0&&s<=1)return true;}}
 return false;}
/* pisos por coluna */
const layers=new Array(NX*NZ);let nl=0;
for(let i=0;i<NX;i++)for(let j=0;j<NZ;j++){const x=X0+(i+.5)*H,z=Z0+(j+.5)*H,h=column(x,z),fl=[];
 for(let a=0;a<h.length;a++){const [y,f]=h[a];if(f<0.8||y<15||y>30.4)continue;let b=a+1;while(b<h.length&&h[b][0]<y+0.06)b++;
  /* piso aceito se o próximo obstáculo acima estiver a mais de CLEAR (pé-direito livre) */
  if(b<h.length&&h[b][0]<y+CLEAR)continue;if(fl.length&&y-fl[fl.length-1]<0.3)fl.pop();fl.push(y);a=b-1;}
 if(fl.length){layers[i*NZ+j]=fl;nl+=fl.length;}}
console.log('camadas de piso',nl);
/* ligações entre vizinhos (+x, +z): mesma camada dentro de STEP e caminho livre na altura das pernas, do tronco e da cabeça */
const id=new Map(),Ly=[],Lc=[];for(let c=0;c<NX*NZ;c++){const f=layers[c];if(!f)continue;f.forEach((y,k)=>{id.set(c*8+k,Ly.length);Ly.push(y);Lc.push(c);});}
const E=new Uint8Array(Ly.length);// bits: 1:+x 2:-x 4:+z 8:-z
function link(c,k,c2,bit,bit2){const f2=layers[c2];if(!f2)return;const y=layers[c][k];let best=-1,bd=9;f2.forEach((y2,k2)=>{const d=Math.abs(y2-y);if(d<=STEP&&d<bd){bd=d;best=k2;}});if(best<0)return;const y2=f2[best];
 const xa=X0+(Math.floor(c/NZ)+.5)*H,za=Z0+(c%NZ+.5)*H,xb=X0+(Math.floor(c2/NZ)+.5)*H,zb=Z0+(c2%NZ+.5)*H;
 for(const e of EYE)if(blocked(xa,y+e,za,xb,y2+e,zb))return;E[id.get(c*8+k)]|=bit;E[id.get(c2*8+best)]|=bit2;}
for(let i=0;i<NX;i++){for(let j=0;j<NZ;j++){const c=i*NZ+j,f=layers[c];if(!f)continue;for(let k=0;k<f.length;k++){if(i+1<NX)link(c,k,c+NZ,1,2);if(j+1<NZ)link(c,k,c+1,4,8);}}if(i%100===0)console.log('ligações',i,'/',NX);}
/* componentes conexas a partir das sementes (ponte de navegação, castelo de proa, popa, convés dos botes) */
const SEEDS=JSON.parse(process.argv[3]||'[[73.3,29.62,0]]');
const comp=new Int32Array(Ly.length).fill(-1);
function near(x,y,z){const i=Math.floor((x-X0)/H),j=Math.floor((z-Z0)/H),c=i*NZ+j,f=layers[c];if(!f)return -1;let b=-1,bd=3;f.forEach((yy,k)=>{if(Math.abs(yy-y)<bd){bd=Math.abs(yy-y);b=k;}});return b<0?-1:id.get(c*8+b);}
const nb=(n,bit)=>{const c=Lc[n],y=Ly[n],c2=bit===1?c+NZ:bit===2?c-NZ:bit===4?c+1:c-1,f=layers[c2];let b=-1,bd=9;f.forEach((yy,k)=>{const d=Math.abs(yy-y);if(d<=STEP&&d<bd){bd=d;b=k;}});return id.get(c2*8+b);};
let keep=new Uint8Array(Ly.length);
SEEDS.forEach((s,si)=>{const n0=near(s[0],s[1],s[2]);if(n0<0){console.log('semente sem piso',s);return;}if(keep[n0]){console.log('semente',si,'já alcançada');return;}let st=[n0],cnt=0,bb=[1e9,-1e9,1e9,-1e9,1e9,-1e9];keep[n0]=1;
 while(st.length){const n=st.pop();cnt++;const x=X0+(Math.floor(Lc[n]/NZ)+.5)*H,z=Z0+(Lc[n]%NZ+.5)*H;bb=[Math.min(bb[0],x),Math.max(bb[1],x),Math.min(bb[2],Ly[n]),Math.max(bb[3],Ly[n]),Math.min(bb[4],z),Math.max(bb[5],z)];
  for(const bit of [1,2,4,8])if(E[n]&bit){const m=nb(n,bit);if(m!==undefined&&!keep[m]){keep[m]=1;st.push(m);}}}
 console.log('semente',si,s,'células',cnt,'x',bb[0],bb[1],'y',bb[2].toFixed(2),bb[3].toFixed(2));});
/* diagnóstico (COMPS=1): todas as regiões conexas com mais de 300 células, sem gravar nada */
if(process.env.COMPS){const vis=new Uint8Array(Ly.length),out=[];for(let n0=0;n0<Ly.length;n0++){if(vis[n0])continue;let st=[n0],cnt=0,bb=[1e9,-1e9,1e9,-1e9,1e9,-1e9];vis[n0]=1;
  while(st.length){const n=st.pop();cnt++;const x=X0+(Math.floor(Lc[n]/NZ)+.5)*H,z=Z0+(Lc[n]%NZ+.5)*H;bb=[Math.min(bb[0],x),Math.max(bb[1],x),Math.min(bb[2],Ly[n]),Math.max(bb[3],Ly[n]),Math.min(bb[4],z),Math.max(bb[5],z)];
   for(const bit of [1,2,4,8])if(E[n]&bit){const m=nb(n,bit);if(m!==undefined&&!vis[m]){vis[m]=1;st.push(m);}}}
  if(cnt>300)out.push([cnt,'x '+bb[0]+'..'+bb[1],'y '+bb[2].toFixed(2)+'..'+bb[3].toFixed(2),'z '+bb[4]+'..'+bb[5],(keep[n0]?'MANTIDA':'')]);}
 out.sort((a,b)=>b[0]-a[0]).forEach(o=>console.log(o.join(' | ')));
 if(process.env.PNG){/* mapa visto de cima (PNG, 2 px por célula, proa à direita, boreste em cima): cor = altura do piso mais alto (azul baixo → vermelho alto); cinza = região não mantida; tom escuro = borda */
  const zlib=await import("node:zlib"),S=2,W=NX*S,Hh=NZ*S,raw=Buffer.alloc((W*3+1)*Hh);
  const col=y=>{const t=Math.max(0,Math.min(1,(y-18)/16));return [Math.round(255*t),Math.round(255*(1-Math.abs(t-.5)*2)),Math.round(255*(1-t))];};
  for(let c=0;c<NX*NZ;c++){const f=layers[c];if(!f)continue;const i=Math.floor(c/NZ),j=c%NZ;let rgb=null;for(let k=f.length-1;k>=0;k--){if(f[k]<15)continue;const n=id.get(c*8+k);rgb=keep[n]?col(f[k]):[90,90,90];if(E[n]!==15)rgb=rgb.map(v=>v*.6|0);break;}if(!rgb)continue;
   for(let a=0;a<S;a++)for(let d=0;d<S;d++){const y=(NZ-1-j)*S+d,o=y*(W*3+1)+1+(i*S+a)*3;raw[o]=rgb[0];raw[o+1]=rgb[1];raw[o+2]=rgb[2];}}
  const crc=(()=>{const t=new Int32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c;}return b=>{let c=-1;for(const x of b)c=t[(c^x)&255]^(c>>>8);return (c^-1)>>>0;};})();
  const ch=(ty,d)=>{const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(ty),d]),c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c]);};
  const ih=Buffer.alloc(13);ih.writeUInt32BE(W,0);ih.writeUInt32BE(Hh,4);ih[8]=8;ih[9]=2;
  writeFileSync(process.env.PNG,Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),ch("IHDR",ih),ch("IDAT",zlib.deflateSync(raw)),ch("IEND",Buffer.alloc(0))]));}
 process.exit(0);}
/* saída compacta: por coluna, nº de camadas mantidas; por camada, altura (cm) e bits de ligação */
const cnt=new Uint8Array(NX*NZ),ys=[],es=[];
for(let c=0;c<NX*NZ;c++){const f=layers[c];if(!f)continue;f.forEach((y,k)=>{const n=id.get(c*8+k);if(!keep[n])return;cnt[c]++;ys.push(Math.round(y*100));es.push(E[n]);});}
const b64=a=>Buffer.from(a.buffer,a.byteOffset,a.byteLength).toString('base64');
const js='/* Malha de navegação dos conveses (gerada por tools/gerar-navegacao.mjs a partir do modelo do navio; não editar à mão) */\n'+
 'window.CONVES_NAV='+JSON.stringify({x0:X0,z0:Z0,h:H,nx:NX,nz:NZ,cnt:b64(cnt),y:b64(new Int16Array(ys)),e:b64(new Uint8Array(es))})+';\n';
writeFileSync(join(ROOT,'assets/models/conves_nav.js'),js);console.log('camadas mantidas',ys.length,'bytes',js.length);
