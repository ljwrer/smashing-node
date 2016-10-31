/**
 * Created by Ray on 2016/10/31.
 */
const connect = require('connect');
const serveStatic = require('serve-static');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const time = require('./request-time');
const app = connect();
app.use(compression());
app.use(morgan('dev'));
app.use(time({time:500}));
app.use(serveStatic(path.join(__dirname, 'static')));
app.use(function (req,res,next) {
    if('/a'===req.url){
        res.writeHead(200);
        res.end('quick');
    }else {
        next()
    }
});
app.use(function (req,res,next) {
    if('/b'===req.url){
        res.writeHead(200);
        setTimeout(function () {
            res.end('slow');
        },1000)
    }else {
        next()
    }
});
app.listen(3000);
