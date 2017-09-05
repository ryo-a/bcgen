const fs = require('fs');
const csv = require('csv-parse');
const parse = require('csv-parse/lib/sync');

exports.parse = function(csvFileName){
    //TODO: SJIS -> UTF-8
    let data = fs.readFileSync(csvFileName);
    var result = parse(data, { columns: true });
    return result;
}
