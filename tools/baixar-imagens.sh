#!/bin/sh
# Baixa as imagens históricas (domínio público, Wikimedia Commons) para assets/images/historical
cd "$(dirname "$0")/../assets/images/historical" || exit 1
curl -L -A 'MuseuTitanic/1.0 (uso educativo)' -o 'titanic-partida-southampton-1912.jpg' 'https://commons.wikimedia.org/wiki/Special:FilePath/RMS%20Titanic%203.jpg?width=1000'
curl -L -A 'MuseuTitanic/1.0 (uso educativo)' -o 'titanic-pronto-para-lancamento-1911.jpg' 'https://commons.wikimedia.org/wiki/Special:FilePath/RMS%20Titanic%20ready%20for%20launch%2C%201911.jpg?width=1000'
curl -L -A 'MuseuTitanic/1.0 (uso educativo)' -o 'olympic-popa-leme-helices-1911.png' 'https://commons.wikimedia.org/wiki/Special:FilePath/View%20of%20the%20stern%20and%20rudder%20of%20the%20Olympic%20in%20drydock.png?width=1000'
curl -L -A 'MuseuTitanic/1.0 (uso educativo)' -o 'titanic-ginasio-1912.jpg' 'https://commons.wikimedia.org/wiki/Special:FilePath/Titanic%20gymnasium.jpg?width=1000'
curl -L -A 'MuseuTitanic/1.0 (uso educativo)' -o 'grande-escadaria-desenho-1912.jpg' 'https://commons.wikimedia.org/wiki/Special:FilePath/Drawing%20of%20the%20Grand%20Staircase%20onboard%20the%20RMS%20Titanic%20from%20the%201912%20promotional%20booklet.jpg?width=1000'
curl -L -A 'MuseuTitanic/1.0 (uso educativo)' -o 'iceberg-prinz-adalbert-1912.jpg' 'https://commons.wikimedia.org/wiki/Special:FilePath/Titanic%20iceberg.jpg?width=1000'
curl -L -A 'MuseuTitanic/1.0 (uso educativo)' -o 'titanic-provas-de-mar-1912.jpg' 'https://commons.wikimedia.org/wiki/Special:FilePath/RMS%20Titanic%20sea%20trials%20April%202%2C%201912.jpg?width=1000'
