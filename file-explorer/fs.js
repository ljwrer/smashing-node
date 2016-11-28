/**
 * Created by Ray on 2016/9/14.
 */
const fs = require('fs');
let stream = fs.createReadStream('./d3.js', 'utf-8');
let i = 0;
stream.on('data', function (chunk) {
    console.log(i++ + ":", chunk.slice(0, 30));
});
stream.on('end', function (data) {
    console.log('end');
});
const files = fs.readdirSync(process.cwd());
files.forEach(function (filename) {
    fs.watchFile(process.cwd() + '/' + filename, function () {
        console.log('-', filename, 'changed');
    })
})