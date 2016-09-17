const colors = require('colors/safe');
const theme=require('colors/themes/generic-logging');
colors.setTheme(theme);
const net=require('net');
var server=net.createServer(function (conn) {
   console.log(colors.silly('server listen on *:3000'))
});
server.listen(3000,function (conn) {
    console.log('server listening on *:3000')
});