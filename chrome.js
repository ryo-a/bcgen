const puppeteer = require('puppeteer');

exports.printPDF = function(targetURI,pdfFileName,paperWidth,paperHeight){
    console.log(targetURI);
    console.log(pdfFileName);
    
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(targetURI, {waitUntil: 'networkidle'});
        await page.pdf({path: pdfFileName, width: paperWidth, height: paperHeight,printBackground: true});
      
        browser.close();
        console.log('complete');
      })();
}
