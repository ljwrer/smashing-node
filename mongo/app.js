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
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    name: 'my session',
    secret: 'my secret session key',
    resave: false,
    saveUninitialized: false,
}));
app.use(logger('dev'));
app.get('/', (req, res) => {
    res.render('pages/index', {auth: false})
});
app.get('/login', (req, res) => {
    res.render('pages/login')
});
app.get('/sign', (req, res) => {
    res.render('pages/sign')
});
app.post('/sign', (req, res ,next) => {
    const {email, first, last, password} = req.body.user;
    const user = new User({email, first, last, password});
    user.save()
        .then(()=>{res.redirect('/')})
        .catch(err=>{
            const errors = err.errors;
            if(errors){
                const message=[];
                Object.keys(errors).forEach(key=>{
                    const error = errors[key];
                    message.push(error.message)
                });
                err.message = message.join(' ');
            }
            console.log(err.message)
            next(err)
        })
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
            validator:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
            message:"无效的邮箱"
        },
        unique: [true,"重复的邮箱"],
        index:true
    },
    password: {
        type: String,
        minlength: [6,'密码太短']
    }
});
const uniqueValidator = require('mongoose-unique-validator');
userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);
app.listen(3000);
