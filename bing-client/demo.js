/**
 * Created by Ray on 2016/10/27.
 */
const http=require('http');
const colors=require('colors');
const BING_API_KEY='4802bf5b5bd54249b6bd549f06bbd34a';
const BING_REQUEST_HEADER='Ocp-Apim-Subscription-Key';
http.createServer(function (req,res) {
    res.writeHead(200,{'Content-type':'text/html'});
    res.end('hello world')
}).listen(3000);
http.request({
    host:'127.0.0.1',
    port:3000,
    url:'/',
    method:'GET'
},function (res) {
    let body='';
    res.setEnCoding('utf8');
    res.on('data',function (chunk) {
        body+=chunk;
    });
    res.on('end',function () {
        console.log(`we got ${colors.yellow(body)}!\n`);
    })
}).end();