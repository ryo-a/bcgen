const fs = require('fs');
const csv = require('csv-parse');
const parse = require('csv-parse/lib/sync');
const iconv = require('iconv-lite');
const jschardet = require('jschardet');

exports.parse = function(csvFileName){
    let data = fs.readFileSync(csvFileName);
    let encodedData = iconv.decode(data, jschardet.detect(data).encoding);
    var result = parse(encodedData, { columns: true });
    return result;
}
