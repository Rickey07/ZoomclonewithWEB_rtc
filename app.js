const express = require('express');
const app = express();
const {v4:uuidV4} = require('uuid');
const server = require('http').Server(app)
const io = require('socket.io')(server);
app.set('view engine' , 'ejs');
app.use(express.static('public'));

app.get('/' , (req , res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room' , (req ,res) => {
    res.render('room' , {roomId: req.params.room})
})

io.on('connection' , socket => {
    console.log('connected')
    socket.on('join-room' , (roomId , userId) => {
        socket.join(roomId);
        socket.to(userId).broadcast.emit('user-connected' , userId);
    });

    socket.on('disconnect' , () => {
        console.log('disconnected');
        socket.to(roomId).broadcast.emit('user-disconnected' , userId);
    })
})

server.listen(process.env.PORT || 3000 , () => {
    console.log('server started')
});