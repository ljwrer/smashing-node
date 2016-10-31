/**
 * Created by Ray on 2016/10/31.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const server = function (type, path) {
    this.writeHead(200, {'Content-Type': type});
    fs.createReadStream(path).pipe(this);
};
const sendHtml = function (res) {
    server.call(res, 'text/html', path.join(__dirname, 'static', 'index.html'))
};
const sendImage = function (res, imagePath) {
    const absPath = path.join(__dirname, 'static', imagePath);
    fs.stat(absPath, function (err, stat) {
        if (err || !stat.isFile()) {
            send404(res)
        } else {
            server.call(res, 'image/jpg', absPath)
        }
    });
};
const send404 = function (res) {
    res.writeHead(404);
    res.end('not found');
};
http.createServer(function (req, res) {
    const url = req.url;
    const method = req.method;
    console.info('%s %s %s', method, url, Date());
    if (method === 'GET') {
        if ('/' === url) {
            sendHtml(res);
        } else if ('/images' === url.slice(0, 7) && '.jpg' === url.slice(-4)) {
            sendImage(res, url);
        } else {
            send404(res)
        }
    } else {
        send404(res)
    }
}).listen(3000);