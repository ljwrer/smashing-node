/**
 * Created by Ray on 2016/10/25.
 */
"use strict";
require('http').createServer(function (req,res) {
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write('hello');
    setTimeout(function () {
        res.end('<b> world</b>');
    },2000)
}).listen(3000);