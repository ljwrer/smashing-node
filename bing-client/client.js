/**
 * Created by Ray on 2016/10/27.
 */
const http=require('http');
const https=require('https');
const colors=require('colors');
const qs=require('querystring');
const stdin=process.stdin;
const stdout=process.stdout;
const BING_API_KEY='4802bf5b5bd54249b6bd549f06bbd34a';
const BING_REQUEST_HEADER='Ocp-Apim-Subscription-Key';
const getBingSearchResult=function (q,cb) {
    https.request({
        host:'api.cognitive.microsoft.com',
        path:'/bing/v5.0/search?'+qs.stringify({
            q:q,
            count:10,
            mkt:'zh-CN'
        }),
        headers:{
            [BING_REQUEST_HEADER]:BING_API_KEY
        }
    },function (res) {
        let body='';
        res.on('data',function (chunk) {
            body+=chunk;
        });
        res.on('end',function () {
            cb(JSON.parse(body))
        });
    }).end()
};
// const search=process.argv.slice(2).join(' ').trim();
stdin.on('data',function (data) {
    getBingSearchResult(data.replace('\n',''),function (data) {
        if(data.webPages){
            const outResult=data.webPages.value.map(item=>item.name);
            console.log(outResult.join('\n'))
        }else {
            console.log('no result')
        }
        start();
    })
});
const start=function () {
    stdout.write('\nenter search key:');
    stdin.setEncoding('utf8');
    stdin.resume();
};
start();