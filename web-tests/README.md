# Testes automatizados Selenium para Flutter Web

Este diretório contém scripts para automação de testes end-to-end na versão web do app Flutter, tirando prints das telas.

## Como rodar

1. Instale o Node.js e o ChromeDriver compatível com seu navegador Chrome.
2. Instale as dependências:
   ```bash
   npm install selenium-webdriver
   ```
3. Execute o script:
   ```bash
   node test_screenshots.js
   ```

Os prints serão salvos em `../fotos/impostos5`.

Edite o script para alterar a URL do app ou adicionar novos fluxos de teste. 