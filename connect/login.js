/**
 * Created by Ray on 2016/11/14.
 */
const connect = require('connect');
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const fs = require("fs");
const app = connect();
const user=require('./user');
console.log(user)
app.use(cookieParser());
app.use(cookieSession({
    name: 'my session',
    secret: 'my secret session key',
    maxAge: 0// 24 hours
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));
const checkLogin = function checkLogin_d(req, res, next) {
    if ('/' === req.url && req.session.logged_in) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        console.log(req.cookies)
        res.end(`Welcome back <b>${req.session.name}</b><a href="/logout">logout</a>`)
    }else {
        next()
    }
};
const showLoginForm = function showLoginForm_d(req, res, next) {
    if ('/' === req.url && 'GET' === req.method) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        fs.createReadStream(path.resolve('static/login.html')).pipe(res)
    }else {
        next();
    }
};
const checkMessage = function checkMessage_d(req, res, next) {
    if ('/login' === req.url && 'POST' === req.method){
        const name=req.body.name;
        const password=req.body.password;
        if(!user[name]||user[name].password!=password){
            res.end('Bad username/password!')
        }else {
            req.session.name=user[name].name;
            req.session.logged_in=true;
            res.end('authenticated!');
        }
    }else {
        next()
    }
};
const logout = function logout_d(req,res,next) {
    if('/logout'===req.url){
        req.session.logged_in=false;
        res.writeHead(200);
        res.end('logged out')
    }else {
        next()
    }
};

app.use(checkLogin);
app.use(showLoginForm);
app.use(checkMessage);
app.use(logout);
app.use(serveStatic(path.join(__dirname, 'static')));

app.listen(3000);