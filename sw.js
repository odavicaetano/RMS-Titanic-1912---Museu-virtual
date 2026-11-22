/* Service Worker — Titanic 3D. Estratégia Cache-First: tudo que já foi baixado vem do cache (carregamento imediato e uso offline);
   o que não está no cache é buscado na rede e guardado. Para publicar uma nova versão, altere VERSION. */
const VERSION='v8';
const CACHE='titanic3d-'+VERSION;
const CORE=['./','index.html','manifest.json','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-touch-icon.png',
 'assets/models/titanic_glb.js','assets/models/querubim_glb.js','assets/models/conves_nav.js','assets/models/iceberg.js','assets/models/foguista.js',
 'assets/audio/ship/sino-titanic.mp3','assets/audio/ship/apito-titanic.mp3','assets/audio/ship/nearer-my-god-to-thee.mp3',
 'assets/images/historical/blueprints/titanic-perfil-planos-1911.jpg','assets/images/historical/engineering/popa-leme-dique-seco.jpg',
 'ingresso/index.html'];
const EXT=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/meshopt_decoder.js',
 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(CACHE);
 /* um arquivo ausente não impede a instalação */
 await Promise.allSettled(CORE.map(u=>c.add(new Request(u,{cache:'reload'}))));
 await Promise.allSettled(EXT.map(u=>fetch(u,{mode:'cors'}).then(r=>r.ok?c.put(u,r):0)));
 self.skipWaiting();})());});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k.startsWith('titanic3d-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})());});
/* resposta parcial (Range) a partir do cache — necessária para áudio no Safari */
async function ranged(req,res){const m=/bytes=(\d*)-(\d*)/.exec(req.headers.get('range')||'');if(!m||res.status!==200)return res;const b=await res.arrayBuffer(),n=b.byteLength;
 let s=m[1]===''?Math.max(0,n-+m[2]):+m[1],e=m[1]!==''&&m[2]!==''?Math.min(+m[2],n-1):n-1;if(s>e||s>=n)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+n}});
 return new Response(b.slice(s,e+1),{status:206,statusText:'Partial Content',headers:{'Content-Type':res.headers.get('Content-Type')||'application/octet-stream','Content-Length':String(e-s+1),'Content-Range':'bytes '+s+'-'+e+'/'+n}});}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.protocol!=='http:'&&u.protocol!=='https:')return;
 e.respondWith((async()=>{const c=await caches.open(CACHE);
  let hit=await c.match(r,{ignoreSearch:r.mode==='navigate'});
  if(!hit&&r.mode==='navigate')hit=await c.match('index.html')||await c.match('./');
  if(hit)return r.headers.has('range')?ranged(r,hit):hit;
  try{const res=await fetch(r.headers.has('range')?new Request(r,{headers:new Headers()}):r);
   /* guarda o que veio da rede (inclui imagens do Commons e fontes do Google, inclusive respostas opacas) */
   if(res&&(res.ok||res.type==='opaque')&&res.status!==206){try{await c.put(r.url,res.clone());}catch(_){}}
   return r.headers.has('range')?ranged(r,res):res;
  }catch(err){if(r.mode==='navigate'){const i=await c.match('index.html');if(i)return i;}return new Response('Sem conexão e recurso ainda não guardado.',{status:503,statusText:'Offline',headers:{'Content-Type':'text/plain; charset=utf-8'}});}
 })());});
