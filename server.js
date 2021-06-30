const express = require('express')
const path = require('path')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4 } = require('uuid')
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")));
app.get('/', (req, res)=>{
    //make homepage.ejs
    res.render('homepage')
    // res.redirect(`/${v4()}`)
})
app.get('/meet', (req, res)=>{
    //make homepage.ejs
    res.redirect(`/${v4()}`)
})

app.get('/:meet', (req, res)=>{
    res.render('meet', { meetId: req.params.meet })
})

io.on('connection', socket => {
    socket.on('join-meet', (meetId, userId)=>{
        socket.join(meetId)
        socket.to(meetId).emit('user-connected', userId)

        socket.on('disconnect', ()=> {
            // console.log('disconntect', userId)
            socket.to(meetId).emit('user-disconnected', userId)
        })
    })
    socket.on("sendingMessage", (data)=>{
        console.log('server side');
        upgradedServer.emit("broadcastMessage", data);
    })
    
})

server.listen(port)
