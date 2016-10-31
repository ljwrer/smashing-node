/**
 * Created by Ray on 2016/10/25.
 */
"use strict";
const http=require('http');
const fs=require('fs');
const path=require('path');
let port=3000;
http.createServer(function (req,res) {
    console.log(req.headers);
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write('hello');
    setTimeout(function () {
        res.end('<b> world</b>');
    },2000)
}).listen(port++);
http.createServer(function (req,res) {
    res.writeHead(200,{'Content-Type':'image/jpg'});
    var stream=fs.createReadStream(path.resolve(__dirname,'halo.jpg'));
    stream.on('data',function (data) {
        res.write(data)
    });
    stream.on('end',function () {
        res.end()
    });
}).listen(port++);
http.createServer(function (req,res) {
    res.writeHead(200,{'Content-Type':'image/jpg'});
    fs.createReadStream(path.resolve(__dirname,'halo.jpg')).pipe(res);
}).listen(port++);