#!/usr/bin/env node
const axios=require('axios');
const co=require('co');
const prompt=require('co-prompt');
const BING_API_KEY='4802bf5b5bd54249b6bd549f06bbd34a';
const BING_REQUEST_HEADER='Ocp-Apim-Subscription-Key';
const program = require('commander');
const api=function api_d(name,count=10) {
    return axios.get('https://api.cognitive.microsoft.com/bing/v5.0/search',{
        headers: {[BING_REQUEST_HEADER]: BING_API_KEY},
        params:{
            q:name,
            count:count,
            mkt:'zh-CN'
        }
    })
};
const showResult=function showResult_d(data) {
    const outResult=data.webPages.value.map(item=>item.name);
    console.log(outResult.join('\n'));
};
const query=function query_d(name,count=10) {
    api(name,count).then(res=>{
        showResult(res.data)
    }).catch(console.log).then(function () {
        process.exit(0)
    })
};
program
    .version('0.0.1')
    .option('-s, --search [q]', 'get search result by Bing',query)
    .option('-S, --searchCommand', 'get search result by Bing ...',()=>{
        co(function *() {
            let name = yield prompt('query name: ');
            let count = yield prompt('count: ')||10;
            query(name,count);
        });
    })
    .parse(process.argv);
// if(!program.args.length){
//     program.help()
// }
