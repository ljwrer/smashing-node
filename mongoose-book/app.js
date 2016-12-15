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
    Book.find()
        .populate({
            path: 'reader',
            select: {
                name: 1,
                _id: 0
            }
        })
        .then(books => {
            console.log(books);
            res.locals.books = books ? books : [];
            res.render('pages/index', {title: 'home'});
        })

});
app.get('/add', (req, res) => {
    res.render('pages/add', {
        title: "新增"
    })
});
app.post('/add', (req, res, next) => {
    const {book, person} = req.body.book;
    Promise.all([
        Book.findOneAndUpdate({name: book}, {}, {upsert: true, new: true}),
        Person.findOneAndUpdate({name: person}, {}, {upsert: true, new: true})
    ]).then(([bookDoc, PersonDoc]) => Promise.all([
            bookDoc.update({$addToSet: {reader: PersonDoc._id}}),
            PersonDoc.update({$addToSet: {books: bookDoc._id}})
        ])
    ).then(() => res.redirect('/'))
        .catch(next)
});
app.get('/book', (req, res) => {
    res.render('pages/book', {
        title: '根据书名查找'
    })
});
app.get('/bookResult', (req, res, next) => {
    const name = req.query.book;
    res.locals.title = '根据书名查找结果';
    res.locals.name = name;
    res.locals.reader = [];
    Book.findOne({name}, {__v: 0, _id: 0})
        .populate('reader', {name: 1, _id: 0})
        .then(result => res.render('pages/bookResult', result))
        .catch(next)
});
app.get('/person', (req, res) => {
    res.render('pages/person', {
        title: '根据人名查找'
    })
});
app.get('/personResult', (req, res, next) => {
    const name = req.query.person;
    res.locals.title = '根据人名查找结果';
    res.locals.name = name;
    res.locals.books = [];
    Person.findOne({name}, {__v: 0, _id: 0})
        .populate('books', {name: 1, _id: 0})
        .then(result => res.render('pages/personResult', result))
        .catch(next)
})
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;
    // render the error page
    res.status(err.status || 500);
    res.render('common/error', {title: 'Error'});
});
mongoose.connect('mongodb://localhost/bookstore');
const Schema = mongoose.Schema;
const bookSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    reader: [{
        type: Schema.Types.ObjectId,
        ref: 'Person'
    }]
});
const personSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    books: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }]
});
const Book = mongoose.model('Book', bookSchema);
const Person = mongoose.model('Person', personSchema);
app.listen(3000);


