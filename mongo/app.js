/**
 * Created by Ray on 2016/12/2.
 */
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const assert = require('assert');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('morgan');
const qs = require('querystring');
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    name: 'token',
    secret: 'my secret session key',
    resave: false,
    saveUninitialized: false,
}));
app.use(logger('dev'));
app.get('/', (req, res) => {
    const logged_in = req.session.logged_in;
    res.locals.logged_in = logged_in;
    console.log(logged_in);
    if (logged_in) {
        User.findById(logged_in).then(doc => {
            res.locals.fullName = doc.fullName;
            res.render('pages/index')
        })
    } else {
        res.render('pages/index')
    }

});
app.get('/login', (req, res) => {
    res.locals.email = req.query.email;
    res.render('pages/login')
});
app.post('/login', (req, res, next) => {
    User.findOne(req.body.user).then(doc => {
        if(doc){
            req.session.logged_in = doc._id;
            res.redirect('/');
        }else {
            throw new Error('邮箱或密码错误')
        }
    }).catch(next)
});
app.get('/sign', (req, res) => {
    res.render('pages/sign')
});
app.post('/sign', (req, res, next) => {
    const user = new User(req.body.user);
    user.save()
        .then((doc) => {
            const email = doc.email;
            const query = qs.stringify({email});
            res.redirect(`/login?${query}`);
        })
        .catch(err => {
            const errors = err.errors;
            if (errors) {
                const message = [];
                Object.keys(errors).forEach(key => {
                    const error = errors[key];
                    message.push(error.message)
                });
                err.message = message.join(' ');
            }
            console.log(err.message);
            next(err)
        })
});
app.get('/logout',(req,res)=>{
    req.session.logged_in = null;
    res.redirect('/');
});
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;
    // render the error page
    res.status(err.status || 500);
    res.render('common/error');
});
mongoose.connect('mongodb://localhost/smashing');
const userSchema = mongoose.Schema({
    first: {
        type: String,
        require: true
    },
    last: {
        type: String,
        require: true
    },
    email: {
        type: String,
        validate: {
            validator: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
            message: "无效的邮箱"
        },
        unique: true,
        index: true
    },
    password: {
        type: String,
        minlength: [6, '密码太短']
    }
});
const uniqueValidator = require('mongoose-unique-validator');
userSchema.plugin(uniqueValidator, {
    message: '{PATH}已存在'
});
userSchema.virtual('fullName').get(function () {
    return `${this.first} ${this.last}`
});
const User = mongoose.model('User', userSchema);
app.listen(3000);
