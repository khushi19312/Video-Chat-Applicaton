const express = require('express')
const path = require('path')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4 } = require('uuid')

const mongoose = require('mongoose')
const Chat = require('./models/messages')
const Part = require('./models/participants')
// const mongoDB = "mongodb+srv://user:sweets123@cluster0.ic26y.mongodb.net/message-database?retryWrites=true&w=majority";
const mongoDB = "mongodb+srv://user:sweets123@vc-application.ic26y.mongodb.net/message-database?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("connected to mongo db...")
}).catch(err => console.log(err));

const port = process.env.PORT || 3000;
let peers={};
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "/public/")));


app.get('/', (req, res)=>{
    //make homepage.ejs
    res.render('homepage.ejs', {EmailId: req.query.email})
    // res.redirect(`/${v4()}`)
})
app.get('/meet', (req, res)=>{
    //make homepage.ejs
    res.redirect(`/${v4()}?email=${req.query.email}`)
}) 
app.get('/:meet', (req, res)=>{
    res.render('room.ejs', { meetId: req.params.meet, EmailId: req.query.email })
})
app.get('/meet/:meet', (req, res)=>{
    res.render('meet.ejs', { meetId: req.params.meet, EmailId: req.query.email, Name: req.query.name })
})

io.on('connection', socket => {
    socket.on('join-meet', (meetId, userId, socketId)=>{
        socket.join(meetId)
        socket.to(meetId).emit('user-connected', userId)
        
        Part.find({meetID: meetId}, (err, result)=>{
            if(err) throw err;
            else{
                console.log(result);
                io.to(socketId).emit("participants", result);
            }
        })
        Chat.find({meetID: meetId}, (err, result)=>{
            if(err) throw err;
            else{
                // console.log(result);
                io.to(socketId).emit("broadcastMessage", result);
            }
        })
        socket.on('disconnect', ()=> {
            // console.log('disconntect', userId)
            socket.to(meetId).emit('user-disconnected', userId)
        })

        socket.on("sendingMessage", (data)=>{
            console.log('server side', data.text);
            const chat = new Chat({text:data.text, meetID:meetId, userId:data.userId, userName:data.userName})
            chat.save().then(()=>{
                //retrieve from the database where meeting id is meetID  --> array data
                Chat.find({meetID: meetId}, (err, result)=>{
                    if(err) throw err;
                    else{
                        // console.log(result);
                        io.to(meetId).emit("broadcastMessage", result);
                    }
                })
                
            })
        })

        socket.on("hand-raise", (username, userId)=>{
            console.log('server side hand raise by', username, userId);
            socket.to(meetId).emit("hand-raised", username, userId);
        })
        socket.on("hand-down", (username, userId)=>{
            console.log('server side hand down by', username, userId);
            socket.to(meetId).emit("hand-put-down", username, userId);
        })
        socket.on("brb", (username, userId)=>{
            console.log('server side brb by', username, userId);
            socket.to(meetId).emit("be-right-back", username, userId);
        })
        socket.on("brb-back", (username, userId)=>{
            console.log('server side back by', username, userId);
            socket.to(meetId).emit("back", username, userId);
        })
        socket.on("caption-broadcast", (data)=>{
            console.log(data.text)
            socket.to(meetId).emit("captions", data);
        })
        socket.on("caption-stopped", ()=>{
            console.log("end")
            socket.to(meetId).emit("captions-stop");
        })
        socket.on("new-participant", (data)=>{
            console.log('server side np', data);
            const part = new Part({EmailId:data.email, userName:data.user, meetID:meetId})
            part.save().then(()=>{
                //retrieve from the database where meeting id is meetID  --> array data
                Part.find({meetID: meetId}, (err, result)=>{
                    if(err) throw err;
                    else{
                        console.log(result);
                        io.to(meetId).emit("participants", result);
                    }
                })
                
            })
        })
        socket.on("participant-name-update", (data)=>{
            console.log('server side', data);
            // let oldval = null;
            let oldval = {EmailId: data.email};
            var newval = { $set: {userName:data.user, meetID:meetId} };
            Part.updateOne(oldval, newval, (err, result)=>{
                if(err) throw err
                else{
                    Part.find({meetID: meetId}, (err, result)=>{
                        if(err) throw err;
                        else{
                            console.log(result);
                            io.to(meetId).emit("participants", result);
                        }
                    })
                }
            }); 
        })

    })   
})

server.listen(port)
