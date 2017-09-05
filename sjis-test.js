var jschardet = require('jschardet');
const fs = require('fs');
const csv = require('csv-parse');
const parse = require('csv-parse/lib/sync');


let data = fs.readFileSync(csvFileName);
var result = parse(data, { columns: true });
console.log(result);