/**
 * Created by Ray on 2016/10/27.
 */
const http=require('http');
const qs=require('querystring');
http.createServer(function (req,res) {
    res.writeHead(200,{'Content-type':'text/html'});
    const type=req.headers["content-type"];
    let body='';
    req.on('data',function (chunk) {
        body+=chunk;
    });
    req.on('end',function () {
        const message=qs.parse(body);
        const name=message.name;
        res.end('Done!');
        console.log(`got name ${name}`)
    });
}).listen(3000);
