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

    api(req.query).then(function (data) {
        var result=[];
        if(data.data&&data.data.webPages){
            result = data.data.webPages;
        }
        res.render('result',{result});
    }).catch(function (err) {
        console.log(err);
        res.end("not found")
    })
});
module.exports=router;
