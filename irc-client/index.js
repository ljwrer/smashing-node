/**
 * Created by Ray on 2016/9/19.
 */
const net=require('net');
// net.connect(3000,'localhost',function () {
//     console.log('connect')
// });
const client=net.connect(6667,'irc.freenode.net');
client.setEncoding('utf-8');
client.on('connect', function () {
    console.log('connect');
    client.write('NICK mynick\r\n');
    client.write('USER mynick 0 * :realname\r\n');
    client.write('JOIN #node.js\r\n');
});
