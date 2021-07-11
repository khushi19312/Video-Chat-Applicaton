const socket = io('/')
const peer = new Peer(undefined)
//
const sendroom = document.querySelector("#send-ex");
const messageroom = document.querySelector("#message-ex")
let outputroom = document.querySelector("#messages-ex")
const editusername = document.querySelector(".edit-name")
let nametext = document.querySelector(".username")
let userIdentity=null;
let userName="Lorem Ipsum";

//functions to manage email-username input and updation
let flagcheck=0;
let addtolist = () =>{
    console.log("heellooo", flagcheck)
    if(flagcheck===0) {
        console.log("emited")
        flagcheck=1;
    }
}
let editname = ()=>{
    console.log("clicked")
    let newname = window.prompt("Enter new user name", "");
    if(newname){
        userName=newname;
        nametext.innerHTML = newname;
    } 
    socket.emit("participant-name-update", {email: EmailId, user:userName})
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

//controls
let exitroom = ()=>{
    window.location.replace('/?email='+EmailId);
}
let redirectcall = ()=>{
    console.log("clicked")
    window.location.replace('/meet/'+MEET_ID+"?email="+EmailId+"&name="+userName);
}

//chat
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
    socket.emit("new-participant", {email: EmailId, user:userName})
})
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

//invite
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

//participants
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
