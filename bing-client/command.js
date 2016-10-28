/**
 * Created by Ray on 2016/10/28.
 */
const axios=require('axios');
const BING_API_KEY='4802bf5b5bd54249b6bd549f06bbd34a';
const BING_REQUEST_HEADER='Ocp-Apim-Subscription-Key';
const program = require('commander');
const api=function api_d(name) {
    return axios.get('https://api.cognitive.microsoft.com/bing/v5.0/search',{
        headers: {[BING_REQUEST_HEADER]: BING_API_KEY},
        params:{
            q:name,
            count:10,
            mkt:'zh-CN'
        }
    })
};
const showResult=function (data) {
    const outResult=data.webPages.value.map(item=>item.name);
    console.log(outResult.join('\n'));
};
const query=function query_d(name) {
    api(name).then(res=>{
        showResult(res.data)
    }).catch(console.log)
};
program
    .version('0.0.1')
    .option('-s, --search [q]', 'get search result by Bing')
    .parse(process.argv);
if(program.search){
    query(program.search)
}