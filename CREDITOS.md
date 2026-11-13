# Créditos e fontes

## Modelo 3D do navio

“RMS Titanic 1912”, de Renan_1912 — https://sketchfab.com/3d-models/rms-titanic-1912-fe1019b8f4bf46eea28cdb7a866f05e0 — licença CC BY 4.0 (http://creativecommons.org/licenses/by/4.0/). Alterações feitas para o museu: compressão; divisão em partes articuladas (casco, superestrutura, chaminés, mastros, cordame, botes, hélices, leme, timão e alavancas dos telégrafos); casco escurecido e com chapeamento desenhado por shader; bandeiras subdivididas para ondular; luz noturna nas janelas; retirada de 18 molduras triangulares das laterais do convés A; faixa central do convés separada como peça própria na vista explodida; suportes das hélices deixados fixos no casco (só as hélices de bronze giram).

## Foguistas

Malha humana do arquivo “Pessoa.obj”, fornecido pelo autor do museu (origem e licença não verificadas). Convertida para `assets/models/foguista.js`, com cores por região, um esqueleto simples (quadril, tronco, ombros e cotovelos) e animação procedural de pá; a pá e o carvão são geometria própria do museu.

## Imagens históricas

Pasta `assets/images/historical/`, dividida em exterior, interiors, navigation, engineering, construction, blueprints e documents. As imagens do Wikimedia Commons constam lá como domínio público ou sem restrições conhecidas; confira a página de cada arquivo antes de reutilizar. As duas imagens já incluídas foram fornecidas pelo autor do museu e não tiveram a origem verificada.

| Arquivo | Incluído no pacote | O que mostra | Autoria / origem | Página no Commons |
|---|---|---|---|---|
| blueprints/titanic-perfil-planos-1911.jpg | sim | Desenho técnico de época: perfil longitudinal do Titanic. | Arquivo fornecido pelo autor do museu (“Titanic Original Plans”); origem exata não verificada | — |
| engineering/popa-leme-dique-seco.jpg | sim | Fotografia de época: popa, leme e hélices de um navio da classe Olympic em dique seco; não confirmado se Titanic ou Olympic. | Arquivo fornecido pelo autor do museu; autoria não verificada | — |
| exterior/titanic-partida-southampton-1912.jpg | não (baixar com o script) | Fotografia de 1912. O Titanic deixa Southampton em 10 de abril de 1912. | F. G. O. Stuart · domínio público | https://commons.wikimedia.org/wiki/File:RMS_Titanic_3.jpg |
| construction/titanic-pronto-para-lancamento-1911.jpg | não (baixar com o script) | Fotografia de 1911. O casco na carreira do estaleiro Harland & Wolff, pronto para o lançamento. | Robert John Welch, fotógrafo da Harland & Wolff · domínio público | https://commons.wikimedia.org/wiki/File:RMS_Titanic_ready_for_launch%2C_1911.jpg |
| engineering/olympic-popa-leme-helices-1911.png | não (baixar com o script) | Fotografia de 1911 — navio gêmeo. Popa, leme e hélices do Olympic em dique seco. Não se conhecem fotografias das hélices do Titanic. | Coleção George Grantham Bain, Biblioteca do Congresso dos EUA · sem restrições conhecidas | https://commons.wikimedia.org/wiki/File:View_of_the_stern_and_rudder_of_the_Olympic_in_drydock.png |
| interiors/titanic-ginasio-1912.jpg | não (baixar com o script) | Imagem de 1912. O ginásio, em folheto da White Star Line. | White Star Line, “White Star Line Triple Screw Steamers” · domínio público | https://commons.wikimedia.org/wiki/File:Titanic_gymnasium.jpg |
| interiors/grande-escadaria-desenho-1912.jpg | não (baixar com o script) | Desenho de época, não fotografia. A Grande Escadaria num folheto promocional de 1912. Não se conhecem fotografias da escadaria do Titanic. | White Star Line · domínio público | https://commons.wikimedia.org/wiki/File:Drawing_of_the_Grand_Staircase_onboard_the_RMS_Titanic_from_the_1912_promotional_booklet.jpg |
| documents/iceberg-prinz-adalbert-1912.jpg | não (baixar com o script) | Fotografia de abril de 1912. Iceberg fotografado do vapor Prinz Adalbert, apontado como o provável iceberg da colisão. | Comissário-chefe do Prinz Adalbert · domínio público | https://commons.wikimedia.org/wiki/File:Titanic_iceberg.jpg |
| exterior/titanic-provas-de-mar-1912.jpg | não (baixar com o script) | Fotografia de 1912. O Titanic no início das provas de mar, em 2 de abril de 1912. | Autor desconhecido, via Arquivos Nacionais dos EUA · domínio público | https://commons.wikimedia.org/wiki/File:RMS_Titanic_sea_trials_April_2%2C_1912.jpg |

## Gerador de ingressos

`ingresso/index.html` é o gerador de ingressos fornecido pelo autor do museu, com fontes, imagens do ingresso e lista de passageiros já embutidas. Só a aparência da interface foi adaptada ao museu; o desenho e a exportação do ingresso (PNG 3000 × 1500) não foram alterados.

## Autoria

Desenvolvido por Davi Caetano — https://www.linkedin.com/in/davicaetanosilva/

## Sons

Mar, água no casco, máquinas, colisão, ruídos estruturais do naufrágio, curto-circuito no apagamento das luzes e foguetes são sintetizados no navegador (Web Audio, ruído filtrado); não há arquivos de efeitos de terceiros.

Apito e sino: `assets/audio/ship/apito-titanic.mp3` e `assets/audio/ship/sino-titanic.mp3`, gravações fornecidas pelo autor do museu (“Apito ou buzina Titanic.mp3” e “Sino Titanic.mp3”); origem e licença não verificadas. Só se o arquivo não carregar o museu toca a versão sintetizada.

Música — `assets/audio/ship/nearer-my-god-to-thee.mp3`: “Nearer, My God, to Thee”, letra de Sarah Flower Adams (1841), melodia tradicional. Gravação: regência de Randy Miller; álbum *Titanic: The Ultimate Collection* (Varèse Sarabande Records, 1998); distribuição Universal Music Group. Dados tirados dos metadados do YouTube informados pelo autor, não conferidos na fonte original. A atribuição não substitui a autorização para usar a gravação.

## Bibliotecas

three.js r128 (licença MIT), GLTFLoader e meshopt_decoder, carregados por CDN. Fontes Barlow, Barlow Condensed e IBM Plex Mono (Google Fonts, licença OFL).
