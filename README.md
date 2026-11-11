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
assets/models/LICENCA-modelo.txt
assets/images/historical/       imagens históricas das fichas (ver LEIA-ME.txt)
src/                            módulos-fonte e build.sh (concatena em index.html)
tools/                          scripts para baixar as imagens históricas
CREDITOS.md                     autoria, licenças e fontes
```

## Editar
Altere os arquivos em `src/` e rode `sh build.sh` dentro de `src/` (gera `src/index.html`; copie para a raiz).
