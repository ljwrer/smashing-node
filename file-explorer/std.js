/**
 * Created by Ray on 2016/9/13.
 */
process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
    var chunk = process.stdin.read();
    if (chunk !== null&&chunk.length>0) {
        process.stdout.write(`data: ${chunk}`);
    }else {
        process.stdin.end();
    }
});

process.stdin.on('end', () => {
    process.stdout.write('end');
});