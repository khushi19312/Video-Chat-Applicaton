const socket = io('/')
const peer = new Peer(undefined)
const sendroom = document.querySelector("#send-ex");
const messageroom = document.querySelector("#message-ex")
let outputroom = document.querySelector("#messages-ex")
const editusername = document.querySelector(".edit-name")
let userName="Lorem Ipsum";
// let EmailId="";
let nametext = document.querySelector(".username")
let userIdentity=null;

//email-username
let addtolist = (EmailId, userName) =>{
    participantlist[EmailId] = userName;
    // addtodiv();
}
let editname = ()=>{
    console.log("clicked")
    let newname = window.prompt("Enter new user name", "");
    if(newname){
        userName=newname;
        nametext.innerHTML = newname;
    } 
    addtolist(EmailId, userName)
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
    // participantlist[EmailId] = userName;
    console.log(EmailId, userName)
})
socket.on('user-disconnected', (userId) => {
    // if (participantlist[EmailId]) participantlist[EmailId].remove()
})
peer.on('open', id =>{
    socket.emit('join-meet', MEET_ID, id, socket.id)
    userIdentity = id;
    // console.log(EmailId, userName)
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
// let addtodiv = ()=>{
//     console.log(participantlist)
//     const partdiv = document.querySelector(".part");
//     let ptext='<p><strong>Me</strong><br>'+ EmailId +'</p>'
//     for(let i in participantlist.length){
//         ptext+='<p class="p"><strong>'+ i +'</strong><br>'+ participantlist[i] +'</p>'
//     }
//     partdiv.innerHTML = ptext
// }
