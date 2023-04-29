const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    // Launch a new Puppeteer instance and create a new page
    const browser = await puppeteer.launch({headless: 'new' });
    const page = await browser.newPage();

    await page.goto(process.env.Site);
    await new Promise(resolve => setTimeout(resolve, 5000));
    const screenshot1 = await page.screenshot({ fullPage: true });

    await page.goto(process.env.External);
    await new Promise(resolve => setTimeout(resolve, 5000));
    const screenshot2 = await page.screenshot({ fullPage: true });

    await page.goto(process.env.ExternalAnalytics);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const screenshot3 =await page.screenshot({ fullPage: true });

    await browser.close();

    const screenshotsDir = path.join(__dirname, 'screenshots');
    const filename1 = `sitepages-${Date.now()}.png`;
    const filename2 = `externalpage-${Date.now()}.png`;
    const filename3 = `externalpageanalytics-${Date.now()}.png`;

    const screenshot1Path = path.join(screenshotsDir,filename1);
    const screenshot2Path = path.join(screenshotsDir,filename2);
    const screenshot3Path = path.join(screenshotsDir,filename3);

    const stream1 = fs.createWriteStream(screenshot1Path);
    stream1.write(screenshot1);
    stream1.end();

    const stream2 = fs.createWriteStream(screenshot2Path);
    stream2.write(screenshot2);
    stream2.end();

    const stream3 = fs.createWriteStream(screenshot3Path);
    stream3.write(screenshot3);
    stream3.end();

    // Send the screenshot as the response
    res.set('Content-Type', 'image/png');
    res.send(screenshot2);
});

app.get('/loadtest/:count', async (req, res) => {
    // Launch a new Puppeteer instance and create a new page
    const browser = await puppeteer.launch({headless: 'new' });
    const page = await browser.newPage();
    const {count} = req.params;

    for(let i=0;i<count;i++){
        await page.goto(process.env.Site);
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    //this will show the added requests in the screenshot
    await page.goto(process.env.ExternalAnalytics);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const screenshot1 =await page.screenshot({ fullPage: true });

    await browser.close();
    // Send the screenshot as the response
    res.set('Content-Type', 'image/png');
    res.send(screenshot1);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
