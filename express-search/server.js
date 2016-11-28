/**
 * Created by Ray on 2016/11/28.
 */
const express = require('express');
const path = require('path');
const app = express();
const search = require('./search');
app.use('/search',search);
app.use(express.static('public'));

app.set('view engine','ejs');
app.set('views',path.join(__dirname, '/views'));

app.get('/', function(req, res){
    res.render('index');
});
app.get('/search',function (req,res) {
    console.log(req.query)
    search(req.query).then(function (data) {
        res.json(data)
    })
});

app.listen(3000);
