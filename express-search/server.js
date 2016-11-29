/**
 * Created by Ray on 2016/11/28.
 */
const express = require('express');
const logger = require('morgan');
const path = require('path');
const app = express();
const search = require('./search');
app.use('/search',search);
app.use(express.static('public'));
app.use(logger('dev'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname, '/views'));
app.get('/', function(req, res){
    res.render('index');
});
app.listen(3000);
