/**
 * Created by Ray on 2016/10/27.
 */
const qs = require('querystring');
var result = qs.parse('aa=bb');
console.log(result);
result = qs.parse('aa=bb+cc');
console.log(result);

