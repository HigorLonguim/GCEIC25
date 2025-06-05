const { Builder, By, Key, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return true;
  fs.mkdirSync(dirname, { recursive: true });
}

const screenshotsDir = path.join(__dirname, '..', 'fotos', 'impostos5');

(async () => {
  const screen = { width: 1024, height: 720 };
  const chromeOptions = new Options();
  chromeOptions.addArguments('--headless');
  chromeOptions.addArguments('--no-sandbox');
  chromeOptions.windowSize(screen);

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

  try {
    console.log('1) Abrindo site...');
    await driver.get('https://sergio.dev.br'); 
    await driver.sleep(5000);


    await takeScreenshot(driver, 'splash_screen.png');

    console.log('Testes finalizados.');

  } catch (err) {
    console.error('Erro durante os testes:', err);
  } finally {
    await driver.quit();
  }

  async function takeScreenshot(driver, fileName) {
    const image = await driver.takeScreenshot();
    const filePath = path.join(screenshotsDir, fileName);
    ensureDirectoryExistence(filePath);
    fs.writeFileSync(filePath, image, 'base64');
    console.log(`Screenshot salva em: ${filePath}`);
  }
})(); 