# RMS Titanic 1912 - Museu virtual 3D

Museu interativo em uma única página (`index.html`).

## Como abrir
- GitHub Pages ou outro serviço estático: publique a pasta inteira; todos os caminhos são relativos.
- No computador: `python -m http.server 8000` dentro da pasta e abra http://localhost:8000. Abrir o `index.html` com dois cliques também deve funcionar, mas esse modo não foi testado.

É preciso internet para o three.js e as fontes (CDN).

## Estrutura
```
index.html                      página do museu (gerada a partir de src/)
assets/models/titanic_glb.js    modelo 3D do navio (GLB comprimido, em base64)
assets/models/foguista.js       malha dos foguistas (do arquivo Pessoa.obj)
assets/models/iceberg.js        malha do iceberg (do arquivo iceberg.glb)
assets/models/LICENCA-modelo.txt
assets/audio/ship/              apito, sino e o hino tocado pelo botão do violino
assets/images/historical/       imagens históricas das fichas, por tema (ver CREDITOS.md)
ingresso/index.html             gerador de ingressos (página própria, aberta num painel do museu)
src/                            módulos-fonte e build.sh (concatena em index.html)
tools/                          scripts para baixar as imagens históricas
CREDITOS.md                     autoria, licenças e fontes
```

## Editar
Altere os arquivos em `src/` e rode `sh build.sh` dentro de `src/` (gera `src/index.html`; copie para a raiz).

## Hospedagem
O iceberg e os foguistas vão embutidos no `index.html`; os arquivos em `assets/models/` com esses nomes ficam só como fonte. Publique sempre a pasta inteira (o modelo do navio, os sons e as imagens continuam em `assets/`).

## PWA (instalável e offline)
- `manifest.json`, `sw.js` e a pasta `icons/` ficam na mesma pasta do `index.html`.
- Funciona em HTTPS (GitHub Pages) ou em `localhost`; abrindo o arquivo direto (file://) o Service Worker não é registrado.
- Cache-first: depois da primeira visita online, o museu abre sem internet. Ao publicar uma nova versão, altere `VERSION` no início de `sw.js`.
