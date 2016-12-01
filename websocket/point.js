/**
 * Created by Ray on 2016/11/30.
 */
const express = require('express');
const _ = require('lodash');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(express.static('./'));
const POINT_GROUP = 'point group';
io.on('connection', function (socket) {
    socket.join(POINT_GROUP);
    socket.on('hello', function (data) {
        const time = Date.now();
        socket.emit('this', data);
        io.emit('this', {io: time});
        socket.broadcast.emit('this', {broadcast: time});
    });
    socket.on('point', function (position) {
        socket.broadcast.to(POINT_GROUP)
            .emit('position', Object.assign({id: socket.id}, position))
    });
    socket.on('disconnect', function () {
        socket.broadcast.to(POINT_GROUP)
            .emit('remove',socket.id)
    });
});
server.listen(3000);
