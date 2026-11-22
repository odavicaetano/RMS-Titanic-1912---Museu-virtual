// Gera index.html (na raiz do projeto) a partir dos módulos de src/. Uso: node src/build.mjs [PERM]
import {readFileSync as r,writeFileSync as w} from 'node:fs';
import {dirname,join} from 'node:path';import {fileURLToPath} from 'node:url';
const S=dirname(fileURLToPath(import.meta.url)),R=join(S,'..'),PERM=process.argv[2]||'0.85';
const parts=['a_head.html','m1_core.js','m2_mach.js','m3_sets.js','m3b_rooms.js','m4_data.js','m5_app.js'];
let s=parts.map(f=>r(join(S,f),'utf8')).join('').replaceAll('__PERM__',PERM);
s=s.replace('/*@@CMD@@*/',()=>r(join(S,'m6_cmd.js'),'utf8'));
for(const f of ['iceberg','foguista']){const tag=`<script src="assets/models/${f}.js"></script>`;
 if(!s.includes(tag))throw new Error('falta '+tag);s=s.replace(tag,()=>'<script>'+r(join(R,'assets/models',f+'.js'),'utf8')+'</script>');}
const out=process.argv.includes('--out')?process.argv[process.argv.indexOf('--out')+1]:join(R,'index.html');
w(out,s);
// checagem de sintaxe de cada <script> inline
const vm=await import('node:vm');let n=0;
for(const m of s.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)){try{new vm.Script(m[1]);n++;}catch(e){console.error('ERRO de sintaxe no script',n,e.message);process.exit(1);}}
console.log('OK',out,s.length,'bytes,',n,'scripts');
