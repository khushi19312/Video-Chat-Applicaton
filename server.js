//using expressJS, http, and socket.io
const express = require('express')
const path = require('path')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
//using uuid to generate random IDs
const { v4 } = require('uuid')
const port = process.env.PORT || 3000;
let peers={};

//using mongo db and mongoose to set up and communicate with the database
const mongoose = require('mongoose')
const Chat = require('./models/messages')
const Part = require('./models/participants')
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants')
const mongoDB = "mongodb+srv://user:sweets123@vc-application.ic26y.mongodb.net/message-database?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("connected to mongo db...")
}).catch(err => console.log(err));


app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "/public/")));


app.get('/', (req, res)=>{
    //landing page or the homepage --> homepage.ejs is rendered on opening the link
    res.render('homepage.ejs', {EmailId: req.query.email})
})
app.get('/meet', (req, res)=>{
    //redirecting to room
    res.redirect(`/${v4()}?email=${req.query.email}`)
}) 
app.get('/:meet', (req, res)=>{
    //redirecting to room
    res.render('room.ejs', { meetId: req.params.meet, EmailId: req.query.email })
})
app.get('/meet/:meet', (req, res)=>{
    //redirecting to the video call meeting from the room
    res.render('meet.ejs', { meetId: req.params.meet, EmailId: req.query.email, Name: req.query.name })
})
//on socket connection
io.on('connection', socket => {
    //listening for socket event of joining the meeting
    socket.on('join-meet', (meetId, userId, socketId)=>{
        socket.join(meetId)
        socket.to(meetId).emit('user-connected', userId)
        //getting all the partiipants who are a part of the room from the data base 
        //on connection and joining to the room and sending the data to the specific peer
        Part.find({meetID: meetId}, (err, result)=>{
            if(err) throw err;
            else{
                // console.log(result);
                io.to(socketId).emit("participants", result);
            }
        }).catch(err => console.log(err))
        //getting the already sent and saved messages from the data base on connection and 
        //joining to the room and sending the data to the specific peer
        Chat.find({meetID: meetId}, (err, result)=>{
            if(err) throw err;
            else{
                // console.log(result);
                io.to(socketId).emit("broadcastMessage", result);
            }
        }).catch(err => console.log(err))
        //disconnecting 
        socket.on('disconnect', ()=> {
            // console.log('disconntect', userId)
            socket.to(meetId).emit('user-disconnected', userId)
        })
        //listening to the event of a message being sent from one of the peers
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
                
            }).catch((err)=>{
                throw err;
            })
        })
        //listening to the event of hand raise from one of the peers
        socket.on("hand-raise", (username, userId)=>{
            console.log('server side hand raise by', username, userId);
            socket.to(meetId).emit("hand-raised", username, userId);
        })
        //listening to the event of hand down from one of the peers
        socket.on("hand-down", (username, userId)=>{
            console.log('server side hand down by', username, userId);
            socket.to(meetId).emit("hand-put-down", username, userId);
        })
        //listening to the event of brb from one of the peers
        socket.on("brb", (username, userId)=>{
            console.log('server side brb by', username, userId);
            socket.to(meetId).emit("be-right-back", username, userId);
        })
        //listening to the event of back from one of the peers
        socket.on("brb-back", (username, userId)=>{
            console.log('server side back by', username, userId);
            socket.to(meetId).emit("back", username, userId);
        })
        //listening to the event of caption being broadcase from one of the peers
        socket.on("caption-broadcast", (data)=>{
            console.log(data.text)
            socket.to(meetId).emit("captions", data);
        })
        //listening to the event of end of caption broadcast from one of the peers
        socket.on("caption-stopped", ()=>{
            console.log("end")
            socket.to(meetId).emit("captions-stop");
        })
        //listening to the event of a new peer joining the meet room
        socket.on("new-participant", (data)=>{
            console.log('server side np', data);
            let flag=0;
            let res=null;
            Part.find({meetID: meetId}, (err, result)=>{
                if(err) throw err;
                else {
                    if(result) for(let i=0; i<result.length; ++i){
                        if(result[i].EmailId===data.email){
                            flag=1;
                        }
                    }
                    const part = new Part({EmailId:data.email, userName:data.user, meetID:meetId})
                    if(flag===0) part.save().then(()=>{
                        //retrieve from the database where meeting id is meetID  --> array data
                        console.log("saved")
                        Part.find({meetID: meetId}, (err, result2)=>{
                            if(err) throw err;
                            else{
                                console.log("emitting participants");
                                io.to(meetId).emit("participants", result2);
                            }
                        }).catch((err)=>{
                            console.log(err);
                        })
                    }).catch((err)=>{
                        console.log(err);
                    })
                }
            }).catch(err => console.log(err))
            
        })
        //listening to the event of a peer changing their in a room
        socket.on("participant-name-update", (data)=>{
            console.log('server side', data);
            let oldval = {EmailId: data.email};
            var newval = { $set: {userName:data.user, meetID:meetId} };
            Part.updateOne(oldval, newval, (err, result)=>{
                if(err) throw err
                else{
                    Part.find({meetID: meetId}, (err, result2)=>{
                        if(err) throw err;
                        else{
                            console.log(result2);
                            io.to(meetId).emit("participants", result2);
                        }
                    }).catch(err => console.log(err))
                }
            }).catch(err => console.log(err)); 
        })
    })   
})

server.listen(port)
