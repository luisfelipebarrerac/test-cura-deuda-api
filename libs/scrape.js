/* eslint-disable no-undef */
const puppeteer = require('puppeteer');
const unzipper = require('unzipper');
const config = require('../config');
const path = require('path');
const fs = require('fs');

//#region Global Const
const url = config.url;
const pupLaunch = config.pupLaunch;
const filePath = path.resolve(__dirname, 'temp');
const oldPath = config.filePath;
const zipPath = config.zipPath;
const xlsPath = path.join(__dirname, '../uploadXls/');
//#endregion

const main = async () => {
  try {
    await downloadXlsZip();
    //await renameFile();
    //await unZip();
  } catch (error) {
    console.error(error)
  }
};

//#region Functions
async function downloadXlsZip() {
  try {
    const browser = await puppeteer.launch(pupLaunch);
    const page = await browser.newPage();
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      userDataDir: './',
      downloadPath: filePath
    });
    await page.goto(url);
    await page.waitForSelector('input#btnDescarga');
/*     const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: filePath
    }); */
    await page.click('input#btnDescarga');
    await page.waitForTimeout(10000);
    await browser.close();  
  } catch (error) {
    console.error(error);
  }
}

async function renameFile() {
  fs.rename(oldPath, zipPath, () => {
    console.log('\nFile Downloaded!\n');
  });
}

async function unZip() {
  fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: xlsPath }));
}
//#endregion


main();

