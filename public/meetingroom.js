const socket = io('/')
const peer = new Peer(undefined)
//Variable for the meetinf room (outside the call) page
const sendroom = document.querySelector("#send-ex");
const messageroom = document.querySelector("#message-ex")
let outputroom = document.querySelector("#messages-ex")
const editusername = document.querySelector(".edit-name")
let nametext = document.querySelector(".username")
let userIdentity=null;
let userName="Lorem Ipsum";

//functions to manage email and username(nick-names) --> input and updation
let flagcheck=0;
//Users are given an option to change their user-name anytime, this would personalise the experiece
//this would also make the experience specific to which meeting they are attending.
//When the user changes their name, their name has to be updated in the database
let editname = ()=>{
    console.log("clicked")
    let newname = window.prompt("Enter new user name", "");
    if(newname){
        userName=newname;
        nametext.innerHTML = newname;
    } 
    //to update the database
    socket.emit("participant-name-update", {email: EmailId, user:userName})
}
let addtolist = () =>{
    if(flagcheck===0) {
        console.log("emited")
        flagcheck=1;
    }
}
let func = ()=>{
    let email = "";
    if(EmailId==="") {
        email = window.prompt("Enter your Email ID", "abc@xyz.com");
        if(email){
            EmailId=email;
        }
    }
    addtolist(EmailId, userName)
}

//Functions to redirect from the room to either outside the room --> homepage
// or to the video call (i.e. the meeting) 
let exitroom = ()=>{
    window.location.replace('/?email='+EmailId);
}
let redirectcall = ()=>{
    console.log("clicked")
    window.location.replace('/meet/'+MEET_ID+"?email="+EmailId+"&name="+userName);
}

//Using web sockets and webRTC through peerJS to establidh a connection between the peers to enable communication.
socket.on('user-connected', (userId) => {
    userIdentity=userId
    // socket.emit("new-participant", {email: EmailId, user:userName})
})
socket.on('user-disconnected', (userId) => {
    // if (participantlist[EmailId]) participantlist[EmailId].remove()
})
peer.on('open', id =>{
    socket.emit('join-meet', MEET_ID, id, socket.id)
    userIdentity = id;
    console.log(EmailId, userName)
    //as soon as a peer is connected, their emailid and username are added to the database
    socket.emit("new-participant", {email: EmailId, user:userName})
})

//Chat - Functions to implement the chat function in the room, these messages are consistent and 
//permanent for the entire room, whoever joins the room or the video meeting, will be able to see all 
//the messages and send messages for all the peers to see.
sendroom.addEventListener("click", ()=>{
    console.log('button clicked ', messageroom.value);
    // output.innerHTML += '<p><strong>'+ 'Me' + ': </strong><br>' + messageroom.value + '</p>';
    socket.emit("sendingMessage", {
        text: messageroom.value,
        userId: EmailId,
        userName: userName
    });
    console.log('emitted')
})
socket.on('broadcastMessage', (data)=>{
    console.log("hello")
    console.log('client side ', data);
    let text=""
    for(let i=0; i<data.length; ++i){
        if(data[i].userId === EmailId){
            text+='<p style="text-align: right;"><strong>Me' + ' </strong><br>' + data[i].text + '</p>';
        }
        else{
            text+='<p><strong>' + data[i].userName + ' </strong><br>' + data[i].text + '</p>';
        }
    }
    outputroom.innerHTML = text;
    // socket.emit("new-participant", {email: EmailId, user:userName})
})

//Invite - to invite other participants to join the room. 
//The meeting url and the meeting ID can be shared
const invite = document.querySelector(".invite")
const info = document.querySelector(".info")
let inviteflag = 0;
invite.addEventListener("click", ()=>{
    if(inviteflag===0){
        info.style.display = "block";
        inviteflag=1;
    }
    else{
        info.style.display = "none";
        inviteflag=0;
    }
})

//Participants, in order to maintain a list of all the participant that join the room, the Email-id
//and the current user name of the user in stored in a database and retrieved. The retrieved list
// is obtained as a result of listening to the event of the list being braodcasted from the server.
const partdiv = document.querySelector(".part");
socket.on("participants", (data)=>{
    console.log("got event")
    let ptext='<p><strong>Me</strong><br>'+ EmailId +'</p>'
    console.log(ptext)
    for(let i=0; i<data.length; ++i){
        if(data[i].EmailId === EmailId){
            continue;
        }
        else{
            ptext+='<p><strong>'+data[i].userName+'</strong><br>'+ data[i].EmailId +'</p>';
        }
        console.log(ptext)
    }
    partdiv.innerHTML = ptext;
})
