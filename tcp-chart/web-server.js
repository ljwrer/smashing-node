/**
 * Created by Ray on 2016/9/18.
 */
require('http').createServer(function (req,res) {
    console.log(Object.keys(req));
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end('<h1>Hello world!</h1>');
}).listen(3000);
