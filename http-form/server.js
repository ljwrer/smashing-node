/**
 * Created by Ray on 2016/10/27.
 */
const http=require('http');
const qs=require('querystring');
http.createServer(function (req,res) {
    const url=req.url;
    if('/'===url){
        sendForm.apply(this,arguments);
    }else if('/url'===url&&'POST'===req.method){
        sendResult.apply(this,arguments);
    }else {
        sendNotFound.apply(this,arguments);
    }
}).listen(3000);
var sendForm=function (req,res) {
    res.writeHead(200,{'Content-type':'text/html'});
    res.end([
        '<form method="post" action="/url">',
        '<h1>My form</h1>',
        '<fieldset>',
        '<label>Personal Information</label>',
        '<p>What is your Name</p>',
        '<input type="text" name="name">',
        '<p><button>Submit</button></p>',
        '</form>'
    ].join(''));
};
var sendResult=function (req,res) {
    res.writeHead(200,{'Content-type':'text/html'});
    const type=req.headers["content-type"];
    let body='';
    req.on('data',function (chunk) {
        body+=chunk;
    });
    req.on('end',function () {
        const message=qs.parse(body);
        const name=message.name;
        res.end(`<p>${name}</p><p>content-type:<em>${type}</em></p>`);
    });
};
var sendNotFound=function (req,res) {
    res.writeHead(404);
    res.end('not Found')
};