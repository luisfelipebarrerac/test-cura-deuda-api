//#region File Dependencies 
/* eslint-disable no-undef */
const puppeteer = require('puppeteer');
const unzipper = require('unzipper');
const config = require('../config');
const path = require('path');
const fs = require('fs');
//#endregion

//#region Global Const
const url = config.url;
const pupLaunch = config.pupLaunch;
const tempPath = path.resolve(__dirname, config.tempPath);
const zipPath = path.join(__dirname, config.zipPath);
const xlsPath = path.join(__dirname, config.xlsPath);
//#endregion

//#region Functions
async function downloadXlsZip() {
  try {
    const browser = await puppeteer.launch(pupLaunch);
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('input#btnDescarga');
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: tempPath
    });
    await page.click('input#btnDescarga');
    await page.waitForTimeout(10000);
    await browser.close();
    console.log('File Downloaded...');
  } catch (error) {
    console.error(error);
  }
}

async function deleteTemp() {
  fs.unlink(zipPath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  console.log('Temp file deleted...');
}

async function unZip() {
  fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: xlsPath }));
  console.log('File unzipped...');
}
//#endregion

const main = async () => {
  try {
    await downloadXlsZip();
    //await renameFile();
    await unZip();
    await deleteTemp();
  } catch (error) {
    console.error(error);
  }
};

main();

