const express = require('express')
const path = require('path')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4 } = require('uuid')

const mongoose = require('mongoose')
const Chat = require('./models/messages')
const mongoDB = "mongodb+srv://user:sweets123@cluster0.ic26y.mongodb.net/message-database?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("connected to mongo db...")
}).catch(err => console.log(err));

const port = process.env.PORT || 3000;
let peers={};
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")));

//-------------------------------------------------------------------
// const { MongoClient } = require('mongodb');

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
//------------------------------------------------------------------


//DB-------------------------------------------------------------
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({
//     extended: true,
// }));
// const db = require('./queries')
// app.get("/:meet/room", db.getMessages);
// app.post("/:meet/room", db.createMessage);
// let meetIdentity=null;
// let emitMessages = ()=>{
//     db.getSocketMessages(meetIdentity).then((result) =>{
//         io.emit("broadcastMessage", result)
//     }).catch(console.log);
// }
//---------------------------------------------------------------
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

        socket.on("sendingMessage", (data)=>{
            console.log('server side', data.text);
            const chat = new Chat({text:data.text, meetID:meetId, userId:data.userId, userName:data.userName})
            chat.save().then(()=>{
                socket.to(meetId).emit("broadcastMessage", data);
            })
        })

        socket.on("hand-raise", (userId)=>{
            console.log('server side hand raise by', userId);
            socket.to(meetId).emit("hand-raised", userId);
        })
        socket.on("hand-down", (userId)=>{
            console.log('server side hand down by', userId);
            socket.to(meetId).emit("hand-put-down", userId);
        })
        socket.on("brb", (userId)=>{
            console.log('server side brb by', userId);
            socket.to(meetId).emit("be-right-back", userId);
        })
        socket.on("brb-back", (userId)=>{
            console.log('server side back by', userId);
            socket.to(meetId).emit("back", userId);
        })
    })   
})

server.listen(port)
