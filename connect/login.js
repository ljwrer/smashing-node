/**
 * Created by Ray on 2016/11/14.
 */
const connect = require('connect');
const serveStatic = require('serve-static');
// const cookieParser = require('cookie-parser');
// const cookieSession = require('cookie-session');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const auth = require('basic-auth');
const basicAuth = require('basic-auth-connect');
const morgan = require('morgan');
const path = require('path');
const fs = require("fs");
const app = connect();
const user = require('./user');
console.log(user);
// app.use(cookieParser());

// app.use(cookieSession({
//     name: 'my session',
//     secret: 'my secret session key',
//     maxAge: 0// 24 hours
// }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({
    name:'my session',
    secret: 'my secret session key',
    resave: false,
    saveUninitialized: false,
    // store: new RedisStore
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('tiny'));
const authMiddleWare=function (req, res , next) {
    var credentials = auth(req)
    if (!credentials || credentials.name !== 'ray' || credentials.pass !== 'secret') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.end('Access denied')
    } else {
        next();
    }
}
const saveViews = function saveViews_d(req, res, next) {
    console.log(req.session.views);
    req.session.views = (req.session.views || 0) + 1;
    next();
};
const checkLogin = function checkLogin_d(req, res, next) {
    if ('/' === req.url && req.session.logged_in) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        console.log(req.cookies)
        res.end(`Welcome back <b>${req.session.name}</b><a href="/logout">logout</a>`)
    } else {
        next()
    }
};
const showLoginForm = function showLoginForm_d(req, res, next) {
    if ('/' === req.url && 'GET' === req.method) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        fs.createReadStream(path.resolve('static/login.html')).pipe(res)
    } else {
        next();
    }
};
const checkMessage = function checkMessage_d(req, res, next) {
    if ('/login' === req.url && 'POST' === req.method) {
        const name = req.body.name;
        const password = req.body.password;
        if (!user[name] || user[name].password != password) {
            res.end('Bad username/password!')
        } else {
            req.session.name = user[name].name;
            req.session.logged_in = true;
            res.end('authenticated!');
        }
    } else {
        next()
    }
};
const logout = function logout_d(req, res, next) {
    if ('/logout' === req.url&&'/resource'===req.url) {
        req.session.logged_in = false;
        res.writeHead(200);
        res.end('logged out')
    } else {
        next()
    }
};
const usePut = function usePut_d(req, res, next) {
    if('PUT'===req.method){
        res.end('got from put');
    }
    next();
};
app.use(authMiddleWare);
app.use(saveViews);
app.use(checkLogin);
app.use(showLoginForm);
app.use(checkMessage);
app.use(logout);
app.use(usePut);
app.use(serveStatic(path.join(__dirname, 'static')));

app.listen(3000);
