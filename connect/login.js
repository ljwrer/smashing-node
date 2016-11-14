/**
 * Created by Ray on 2016/11/14.
 */
const connect = require('connect');
const serveStatic = require('serve-static');
const cookieSession = require('cookie-session');
const path = require('path');
const app = connect();
app.use(serveStatic(path.join(__dirname, 'static')));
app.use(function (req, res, next) {
    if ('POST' === req.method && '/login' === req.url) {

    } else {
        next()
    }
});
app.listen(3000);