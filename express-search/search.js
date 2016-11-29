/**
 * Created by Ray on 2016/11/28.
 */
const BING_API_KEY = '4802bf5b5bd54249b6bd549f06bbd34a';
const BING_REQUEST_HEADER = 'Ocp-Apim-Subscription-Key';
const router=require('express').Router();
const axios = require('axios');
const api = function api_d({q,count=10}) {
    return axios.get('https://api.cognitive.microsoft.com/bing/v5.0/search', {
        headers: {[BING_REQUEST_HEADER]: BING_API_KEY},
        params: {
            q,
            count,
            mkt: 'zh-CN'
        }
    })
};
router.get('/',function (req,res,next) {
    const start=Date.now();
    api(req.query).then(function (data) {
        let result=[];
        let amount=0;
        if(data.data&&data.data.webPages){
            const web=data.data.webPages;
            result = web.value;
            amount = web.totalEstimatedMatches;
        }
        res.render('result',{result,time:Date.now()-start,amount});
    }).catch(err=>next(err))
});
const foo=function () {
    return axios.get('http://localhost:3001/users/detail')
};
router.get('/detail',function (req,res,next) {
    // const start=Date.now();
    // axios.all([foo(),foo()]).then(axios.spread(function () {
    //     res.json({
    //         time:Date.now()-start
    //     })
    // })).catch(err=>next(err))
    axios.get('http://localhost:3001/users/detail').then(data=>{
        res.json(data.data)
    }).catch(err=>next(err))
})
module.exports=router;
