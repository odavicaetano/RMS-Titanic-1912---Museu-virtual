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
assets/models/conves_nav.js     malha de navegação dos conveses (gerada; ver abaixo)
src/                            módulos-fonte e build.mjs (gera o index.html)
tools/                          imagens históricas e gerador da malha de navegação
CREDITOS.md                     autoria, licenças e fontes
```

## Editar
Altere os arquivos em `src/` e rode, na raiz do projeto, `node src/build.mjs` (Node 18 ou mais novo). O script gera o `index.html` da raiz e confere a sintaxe dos scripts. Ao publicar, altere `VERSION` em `sw.js`.

## Navegação nos conveses
A caminhada em primeira pessoa pelos conveses usa `assets/models/conves_nav.js`: uma grade de 25 cm com os pisos, os degraus (até 42 cm) e os obstáculos medidos no próprio modelo do navio. Ela só é carregada quando o visitante começa a caminhar. Para regerá-la depois de mudar o modelo:
1. Abra o museu em `localhost` e, no console do navegador, exporte para um arquivo `tris.bin` os triângulos visíveis de `__ship.root` em coordenadas locais do navio (9 floats por triângulo).
2. Rode `node tools/gerar-navegacao.mjs caminho/tris.bin`. Com `COMPS=1`, o script só lista as regiões encontradas; com `PNG=mapa.png`, desenha também um mapa visto de cima.

As marcas azuis no convés são acessos do museu entre áreas que, no navio real, se ligavam por escadas internas não reconstruídas. Não representam escadas históricas.

## Hospedagem
O iceberg e os foguistas vão embutidos no `index.html`; os arquivos em `assets/models/` com esses nomes ficam só como fonte. Publique sempre a pasta inteira (o modelo do navio, os sons e as imagens continuam em `assets/`).

## PWA (instalável e offline)
- `manifest.json`, `sw.js` e a pasta `icons/` ficam na mesma pasta do `index.html`.
- Funciona em HTTPS (GitHub Pages) ou em `localhost`; abrindo o arquivo direto (file://) o Service Worker não é registrado.
- Cache-first: depois da primeira visita online, o museu abre sem internet. Ao publicar uma nova versão, altere `VERSION` no início de `sw.js`.
