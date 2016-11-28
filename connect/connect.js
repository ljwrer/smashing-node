/**
 * Created by Ray on 2016/10/31.
 */
const fs = require('fs');
const connect = require('connect');
const serveStatic = require('serve-static');
const compression = require('compression');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const Busboy = require('busboy');
const util = require('util');
const qs = require('qs');
const path = require('path');
const os = require('os');
const time = require('./request-time');
const app = connect();
app.use(compression());
app.use(morgan('tiny'));
app.use(time({time: 500}));
app.use(serveStatic(path.join(__dirname, 'static')));
app.use(bodyParser.raw());
app.use(cookieParser());
app.use(cookieSession({
    secret: 'my secret key'
}));
app.use(compression());
app.use(function a_d(req, res, next) {
    if ('/a' === req.url) {
        res.writeHead(200);
        res.end('quick');
    } else {
        next()
    }
});
app.use(function b_d(req, res, next) {
    if ('/b' === req.url) {
        res.writeHead(200);
        setTimeout(function () {
            res.end('slow');
        }, 1000)
    } else {
        next()
    }
});
app.use(function c_d(req, res, next) {
    if (req.url.indexOf('?') > 0) {
        res.writeHead(200);
        res.end('query');
        console.log(qs.parse(req.url.split('?')[1]));
        console.log(req._parsedOriginalUrl.query);
    } else {
        next()
    }
});
app.use(function d_d(req, res, next) {
    if ('POST' === req.method && '/upload' === req.url) {
        const busboy = new Busboy({headers: req.headers});
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            var saveTo = path.join('./uploads', filename);
            file.pipe(fs.createWriteStream(saveTo));
            // var temp=fs.createWriteStream(`./uploads/${filename}`);
            console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
            file.on('data', function (data) {
                // temp.write(data);
                console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
            });
            file.on('end', function () {
                console.log('File [' + fieldname + '] Finished');
            });
        });
        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        });
        busboy.on('finish', function () {
            console.log('Done parsing form!');
            res.writeHead(303, {Connection: 'close', Location: '/'});
            res.end();
        });
        req.pipe(busboy);
    } else {
        next()
    }
});

app.listen(3000);
