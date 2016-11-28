/**
 * Created by Ray on 2016/10/31.
 */
module.exports = function (opts) {
    const time = opts.time || 100;
    return function (req, res, next) {
        const timer = setTimeout(function () {
            console.log('taking too long! %s %s', req.method, req.url);
        }, time);
        const end = res.end;
        res.end = function (chunk, encoding) {
            res.end = end;
            res.end(chunk, encoding);
            clearTimeout(timer);
        };
        next();
    };
}