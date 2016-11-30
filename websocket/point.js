/**
 * Created by Ray on 2016/11/30.
 */
const express =require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
server.listen(3001);
app.use(express.static('./'));
io.on('connection',function (socket) {
    socket.on('hello',function (data) {
        const time=Date.now();
        socket.emit('this',data);
        io.emit('this',{io:time});
        socket.broadcast.emit('this',{broadcast:time});
    });
});
