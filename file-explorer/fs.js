/**
 * Created by Ray on 2016/9/14.
 */
const fs=require('fs');
// fs.readFile('./deep.js','utf8',function (err,content) {
//     console.log(content)
// });
let stream=fs.createReadStream('./d3.js','utf-8');
let i=0;
stream.on('data',function (chunk) {
    console.log(i++,':',chunk.slice(0,10));
});
stream.on('end',function (data) {
    console.log(data);
})