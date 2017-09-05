#!/usr/bin/env node
const os = require('os');
const fs = require('fs');
const path = require('path');
const commandLineArgs = require('command-line-args');
const chrome = require('./chrome.js');
const csv = require('./csvparse.js');

/* ---- set command-line-args ---- */
const optionDefinitions = [
    { name: 'csv', alias: 'c', type: String },
    { name: 'template', alias: 't', type: String, defaultValue: 'basic' },
    { name: 'size', alias: 's', type: String, defaultValue: 'A4' }
]
const options = commandLineArgs(optionDefinitions);

/* ---- error ---- */
if (options.csv == null) {
    console.error('[ERR!] CSV is not designated. You should designate a source csv file like: --csv carddata.csv');
    process.exit(1);
}

/* ---- set directories ---- */
let bcgenDir = path.dirname(process.argv[1]);
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
let templateName = options.template;
let templateDir = bcgenDir + '/templates/' + templateName
let templatePath = templateDir + '/' + options.size + '.html';

/* ---- read CSV data and jsonize---- */
let database = csv.parse(options.csv); //csvparse.js

/* ---- read template ---- */
const templateHTMLsrc = fs.readFileSync(templatePath, 'utf8');

/* ---- set exporting Dir ----*/
let exportDir = bcgenDir + '/exp';
//TODO: move template CSS/IMG files to expDir

/* ---- generating Data ---- */

for (var item in database) {
    //each item    
    var promise = new Promise(function (resolve){
        var HTMLbuffer = templateHTMLsrc;
        for (var key in database[item]) {
            var rexp = new RegExp('{' + key + '}', 'g');
            HTMLbuffer = HTMLbuffer.replace(rexp, database[item][key]);
        }
        
        var promiseData = new Object();
        promiseData.html = HTMLbuffer;
        promiseData.cardname = item;
        resolve(promiseData);
    });
    promise.then(function(value){
        
        let htmlFileName = exportDir + '/exported' + value.cardname + '.html'
        fs.writeFile(htmlFileName, value.html, function (err) {
            if (err) throw err;
            console.log("書き込み完了");
            chrome.printPDF('file:///' + path.resolve(htmlFileName), 'testpdf' + value.cardname + '.pdf', paperWidth, paperHeight);
        });
    });

}