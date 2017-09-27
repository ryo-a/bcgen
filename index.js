#!/usr/bin/env node
const os = require('os');
const fs = require('fs-extra');
const path = require('path');
const commandLineArgs = require('command-line-args');
const chrome = require('./chrome.js');
const csv = require('./csvparse.js');

/* ---- set command-line-args ---- */
const optionDefinitions = [
    { name: 'csv', alias: 'c', type: String },
    { name: 'template', alias: 't', type: String},
    { name: 'size', alias: 's', type: String, defaultValue: 'A4' }
]
const options = commandLineArgs(optionDefinitions);

/* ---- error ---- */
if (options.csv == null) {
    console.error('\u001b[31m[ERR!]\u001b[0m CSV is not designated. You should designate a source csv file like: --csv carddata.csv');
    process.exit(1);
}

let templateName;
if (options.template == null){
    console.log('[WARN!] template directory is not designated. So bcgen use the default template.');
    templateName = 'basic-card';
    //TODO: DEFAULT TEMPLATE MODE
} else {
    templaneName = options.template;
}

/* ---- set directories ---- */
let bcgenDir = path.dirname(process.argv[1]) + '/bcgen';
let tempDir = os.tmpdir();

/* ---- set paper size ---- */
var paperWidth, paperHeight;

if (options.size == 'A4') {
    paperWidth = '8.27in';
    paperHeight = '11.7in';
} else if (options.size == 'single-landscape') {
    paperWidth = '91mm';
    paperHeight = '55mm';
} else if (options.size == 'single-portrait') {
    paperWidth = '55mm';
    paperHeight = '91mm';
} else { //A4
    paperWidth = '8.27in';
    paperHeight = '11.7in';
}

/* ---- set template ---- */
let templateDir = './' + templateName;
let templatePath = templateDir + '/' + options.size + '.html';

/* ---- read CSV data and jsonize---- */
let database = csv.parse(options.csv); //csvparse.js

/* ---- set exporting Dir ----*/
let exportDir = tempDir + '/bcgen';

console.log('expDir:' + exportDir);
fs.mkdirsSync(exportDir,function(err){
    if (err) {
        console.error(err);
        process.exit(1);
    }
    fs.copySync(templateDir,exportDir + '/' + templateName);
    console.log('EXPTMPL' + exportDir + '/' + templateName);
});

/* ---- read template ---- */
const templateHTMLsrc = fs.readFileSync(templatePath, 'utf8');
///Users/maki/dev/basic-card/A4.html'

/* ---- generating Data ---- */

for (var item in database) {
    //each item    
    var promise = new Promise(function (resolve){
        var HTMLbuffer = templateHTMLsrc;
        for (var key in database[item]) {
            var rexp = new RegExp('{' + key + '}', 'g');
            HTMLbuffer = HTMLbuffer.replace(rexp, database[item][key]);
        }
        
        var cardData = new Object();
        cardData.htmlSrc = HTMLbuffer;
        cardData.number = item;
        resolve(cardData);
    });
    promise.then(function(card){
        
        let htmlFileName = exportDir + '/exported' + card.number + '.html'
        console.log(path.resolve(htmlFileName));
        fs.writeFile(htmlFileName, card.htmlSrc, function (err) {
            if (err) throw err;
            console.log("書き込み完了");
            chrome.printPDF('chrome://version', 'xcard-' + card.number + '.pdf', paperWidth, paperHeight);
            /* /var/folders/gx/wp5plbq97nb5mknzrqz09md80000gn/T/bcgen/exported4.html */
            console.log(fs.readFileSync(path.resolve(htmlFileName), 'utf8'));
        });
    });

}