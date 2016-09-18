const colors = require('colors/safe');
const theme = require('colors/themes/generic-logging');
colors.setTheme(theme);
const net = require('net');
let count = 0;
let users={};
var server = net.createServer(function (conn) {
    conn.setEncoding('utf8');
    console.log(colors.silly('new connection!'));
    conn.write(colors.silly('welcome to node-chart \nthere are '+count+' people\nplease write your name and press enter:'))
    count++;
    let nickName;
    const broadcast=function (msg,exceptMe) {
        for (let i in users) {
            if (!exceptMe || i!==nickName){
                users[i].write(colors.silly(msg)+'\n')
            }
        }
    };
    conn.on('data',function (data) {
        data=data.replace(/[\r\n]/g,'');
        if(!nickName){
            if(users[data]){
                conn.write(data+' already in use,try again');
                return;
            }else {
                nickName=data;
                users[nickName]=conn;
                broadcast(nickName+" join in");
            }
        }else {
            broadcast(nickName+':'+data);
        }
        console.log(nickName+':'+data);
    });
    conn.on('close', function () {
        count--;
        if(nickName){
            delete users[nickName];
            broadcast(nickName + ' left the room');
        }
    });
    conn.on('error',function () {

    })
});
server.listen(3000, function (conn) {
    console.log('server listening on *:3000')
});