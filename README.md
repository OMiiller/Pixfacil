# Pix Fácil

Demonstração estática de Pix copia e cola e QR code, com HTML, CSS e JavaScript.
Não realiza pagamentos nem confirma recebimentos. A chave é fictícia.

## Executar

Abra `index.html` no navegador. Não há instalação, build ou serviços externos.
Digite um valor entre R$ 0,01 e R$ 999.999,99, usando vírgula ou ponto para os
centavos, sem separador de milhar. Clique em **Gerar Pix** para ver o código
e o QR correspondente. Alterar o valor descarta o resultado anterior.

## Configuração

Os dados de demonstração ficam em `config.js`. Mantenha-os durante os testes.
As instruções para trocar a chave e os dados do recebedor estão nesse arquivo.
Não inclua senhas, tokens ou credenciais: todos os arquivos são públicos.
Uma chave real deve estar cadastrada no banco; esta página não consulta o DICT.

## GitHub Pages

Publique a branch `main`, pasta `/(root)`, em **Settings > Pages > Deploy from a branch**.
Os caminhos são relativos e funcionam sob `/pix-facil/`. O arquivo `.nojekyll`
permite servir diretamente os arquivos estáticos.

Arquivos necessários: `index.html`, `style.css`, `config.js`, `script.js`,
`vendor/qrcode.js` e `vendor/LICENSE-qrcode.txt`.

## Biblioteca de QR code

QR Code Generator de Kazuhiko Arase, distribuído localmente sob licença MIT.
Fonte: https://github.com/kazuhikoarase/qrcode-generator
Licença preservada em `vendor/LICENSE-qrcode.txt`.
