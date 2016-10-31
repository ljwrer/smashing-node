/**
 * Created by Ray on 2016/10/27.
 */
const http=require('http');
const qs=require('querystring');
const stdin=process.stdin;
const stdout=process.stdout;
const send=function (name) {
    http.request({
        host:'127.0.0.1',
        method:'POST',
        port:'3000',
        url:'/'
    },function (res) {
        res.on('data',function () {
            console.log('\n request complete!');
            stdout.write('\n your name: ')
        })
    }).end(qs.stringify({name:name}))
};
stdout.write('\n your name:');
stdin.setEncoding('utf-8');
stdin.resume();
stdin.on('data',function (name) {
    send(name)
});
