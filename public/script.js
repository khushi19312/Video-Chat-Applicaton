// import tippy from 'tippy.js';
// import 'tippy.js/dist/tippy.css';
const socket = io('/')
const peer = new Peer(undefined)
const videogrid = document.querySelector('.video-grid')
const uservideo = document.createElement('video')
uservideo.muted = true;
let conn =null;
let currentpeer;
let userIdentity = null;
let peers = {}
let myvideostream;
let callreceived;
let senders = [];

let promise = navigator.mediaDevices.getUserMedia({
    video: true, audio: true
})
promise.then((stream) => {
    myvideostream = stream;
    console.log(myvideostream.getAudioTracks()[0])
    addVideoStream(uservideo, stream)
    if(callreceived){
        callreceived.answer(myvideostream)
        peers[callreceived.peer]=callreceived;
        const video = document.createElement('video')
        // video.muted = true;
        callreceived.on('stream', (peervideostream) => {
            console.log('got video inside')
            currentpeer = callreceived.peerConnection;
            // peers[peeruserID] = call;
            addVideoStream(video, peervideostream)
        })
    }
    peer.on('call', (call) => {
        call.answer(myvideostream)
        peers[call.peer]=call;
        const video = document.createElement('video')
        // video.muted = true;
        call.on('stream', peervideostream => {
            currentpeer = call.peerConnection;
            // console.log(currentpeer);
            addVideoStream(video, peervideostream)
        })
    })
})
peer.on('call', (call) => {
    callreceived = call;
    currentpeer = call.peerConnection;
})
socket.on('user-connected', (userId) => {
    connectToNewUser(userId, myvideostream)
})
socket.on('user-disconnected', (userId) => {
    if (peers[userId]) peers[userId].close()
})
peer.on('open', id =>{
    socket.emit('join-meet', MEET_ID, id, socket.id)
    userIdentity = id;
})
const connectToNewUser = (userId, stream) => {
    console.log('in connectNewUser')
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    // video.muted = true;
    call.on('stream', (peervideostream) => {
        // console.log('got video in connectNewUser')
        addVideoStream(video, peervideostream)
        // peers[peeruserID] = call;
        currentpeer = call.peerConnection;
    })
    call.on('close', ()=>{
        video.remove()
    })
    peers[userId] = call;
}

//layout grid video
const addVideoStream = (video, stream) => {
    video.srcObject = stream
    console.log(peers)
    video.addEventListener('loadedmetadata', () => {
        // let {w, h} = layout();
        var num = Object.keys(peers).length + 1;
        console.log(num);
        if(num==1) {
            video.play()
            video.style.width = '1000px';
            video.style.height = 'auto';
            videogrid.style.setProperty("--cols", 1);
            videogrid.append(video);
        }
        else if(num>1 && num<=4){
            if(num==3) videogrid.style.setProperty('grid-auto-flow', 'row');
            videogrid.style.setProperty('grid-auto-flow', 'column');
            video.play()
            document.querySelector("video").style.width = '500px';
            video.style.width = '500px';
            video.style.height = 'auto';
            videogrid.style.setProperty("--cols", 2);
            // videogrid.style.setProperty("--rows", 2);
            videogrid.append(video);
        }
        else if(num>4 && num<=6){
            if(num==4) videogrid.style.setProperty('grid-auto-flow', 'row');
            videogrid.style.setProperty('grid-auto-flow', 'column');
            video.play()
            document.querySelectorAll("video").style.width = '400px';
            video.style.width = '400px';
            video.style.height = 'auto';
            videogrid.style.setProperty("--cols", 3);
            // videogrid.style.setProperty("--rows", 3);
            videogrid.append(video);
        }
        else if(num>6 && num<=12){
            if(num==5 || num==9) videogrid.style.setProperty('grid-auto-flow', 'row');
            videogrid.style.setProperty('grid-auto-flow', 'column');
            video.play()
            document.querySelector("video").style.width = '300px';
            video.style.width = '300px';
            video.style.height = 'auto';
            videogrid.style.setProperty("--cols", 4);
            videogrid.style.setProperty("--rows", 4);
            videogrid.append(video);
        }
    })
}
const addVideoStreamscreen = (video, stream) => {
    video.srcObject = stream
    console.log(peers)
    video.addEventListener('loadedmetadata', () => {
        // let {w, h} = layout();
        var num = Object.keys(peers).length + 2;
        console.log(num);
        if(num==1) {
            video.play()
            video.style.width = '1000px';
            video.style.height = 'auto';
            videogrid.style.setProperty("--cols", 1);
            videogrid.append(video);
        }
        else if(num>1 && num<=4){
            video.play()
            document.querySelector("video").style.width = '500px';
            video.style.width = '500px';
            video.style.height = 'auto';
            videogrid.style.setProperty("--cols", 2);
            // videogrid.style.setProperty("--rows", 2);
            videogrid.append(video);
        }
        else if(num>4 && num<=6){
            video.play()
            document.querySelectorAll("video").style.width = '400px';
            video.style.width = '400px';
            video.style.height = 'auto';
            videogrid.style.setProperty("--cols", 3);
            // videogrid.style.setProperty("--rows", 3);
            videogrid.append(video);
        }
        else if(num>6 && num<=12){
            video.play()
            document.querySelector("video").style.width = '300px';
            video.style.width = '300px';
            video.style.height = 'auto';
            videogrid.style.setProperty("--cols", 4);
            videogrid.style.setProperty("--rows", 4);
            videogrid.append(video);
        }
    })
}
const layout = ()=>{
    var num = Object.keys(peers).length + 1; 
    console.log(num);
    let w='800px';
    let h='550px';
    let col= 1;
    if (num > 1 && num <= 4) { 
        w = '400px';
        h = '225px';
        col=2;

    } else if (num > 4) {
        w = '200px';
        h = '112.5px';
        col=3;
    }
    return {w, h}
}

//controls
const audio= document.querySelector(".audio");
const video= document.querySelector(".video");
const screenshare= document.querySelector(".screenshare");
const chat = document.querySelector(".enable-chat")
const close = document.querySelector("#close")
const closecap = document.querySelector("#close-caption")
let popup = document.querySelector('.infotext');
const info= document.querySelector(".info");
let textinfo = '';
textinfo+='<p><strong>Meeting Details</strong></p>'
textinfo+='<p><strong>URL: </strong>https://khushi-vc-app.herokuapp.com/'+MEET_ID+'</p>'
textinfo+='<p><strong>Meet Id: </strong>'+MEET_ID+'</p>'
popup.innerHTML +=textinfo;
const end_call = document.querySelector('#end-call');
let videoflag=0;
let audioflag=0;
let flaginfo=0;
audio.addEventListener("click", ()=>{
    console.log('heard audio toggle')
    myvideostream.getAudioTracks()[0].enabled = !(myvideostream.getAudioTracks()[0].enabled);
    if(audioflag===0){
        audio.style.backgroundImage = 'url("/icons/microphone-slash.png")';
        audio.style.backgroundColor = "#6264a7";
        audioflag=1;
    }
    else{
        audio.style.backgroundImage = 'url("/icons/microphone.png")';
        audio.style.backgroundColor = "rgb(80, 80, 80)";
        audioflag=0;
    }
})
video.addEventListener("click", ()=>{
    console.log('heard video toggle')
    myvideostream.getVideoTracks()[0].enabled = !(myvideostream.getVideoTracks()[0].enabled);
    if(videoflag===1){
        video.style.backgroundImage = 'url("/icons/video-camera-close.png")';
        video.style.backgroundColor = "rgb(80, 80, 80)";
        videoflag=0;
    }
    else{
        video.style.backgroundImage = 'url("/icons/video-camera.png")';
        video.style.backgroundColor = "#6264a7";
        videoflag=1;
    }
})
screenshare.addEventListener("click", (event)=>{
    let displaypromise = navigator.mediaDevices.getDisplayMedia({
        video: {cursor: "always"},
        audio: {echocancellation: true, noiseSuppression: true}
    });
    displaypromise.then((stream)=>{
        // peer.call(userIdentity, stream);
        let videoTrack = stream.getVideoTracks()[0];
        console.log(currentpeer);
        screenshare.style.backgroundImage = 'url("/icons/upload-white.png")';
        screenshare.style.backgroundColor = "#6264a7";
        // let screen = document.createElement("video")
        // addVideoStreamscreen(screen, stream);
        videoTrack.onended = ()=>{
            let videoTrack = myvideostream.getVideoTracks()[0];
            let sender = currentpeer.getSenders().find((s)=>{
                return s.track.kind == videoTrack.kind
            })
            sender.replaceTrack(videoTrack)
            screenshare.style.backgroundImage = 'url("/icons/upload.png")';
            screenshare.style.backgroundColor = "rgb(80, 80, 80)";
            // screen.remove()
        }
        let sender = currentpeer.getSenders().find((s)=>{
            return s.track.kind == videoTrack.kind
        })
        sender.replaceTrack(videoTrack)
        
    })
})
chat.addEventListener("click", ()=>{
    console.log(document.querySelector(".chatbox").style.display);
    document.querySelector(".chatbox").style.display="block";
    chat.style.backgroundImage = "url('/icons/chat-bubbles-with-ellipsis.png')";
    chat.style.backgroundColor = "#6264a7";
    // chat.style.display = "none";
})
close.addEventListener("click", ()=>{
    console.log(document.querySelector(".chatbox").style.display);
    document.querySelector(".chatbox").style.display="none";
    chat.style.backgroundImage = "url('/icons/chat-bubbles-with-ellipsis (1).png')";
    chat.style.backgroundColor = "rgb(80, 80, 80)";
    // chat.style.display = "block";
})
closecap.addEventListener("click", ()=>{
    console.log(document.querySelector(".chatbox").style.display);
    document.querySelector(".live-caption").style.display="none";
    // chat.style.backgroundImage = "url('/icons/chat-bubbles-with-ellipsis (1).png')";
    // chat.style.backgroundColor = "rgb(80, 80, 80)";
    // chat.style.display = "block";
})
info.addEventListener("click", ()=>{
    if(flaginfo===0){
        popup.style.display = "block";
        info.style.backgroundImage = "url('/icons/info-white.png')";
        info.style.backgroundColor = "#6264a7";
        flaginfo=1;
    }
    else{
        console.log('close info')
        popup.style.display = "none";
        info.style.backgroundImage = "url('/icons/info.png')";
        info.style.backgroundColor = "rgb(80, 80, 80)";
        flaginfo=0;
    }
    
})
let endcall = ()=>{
    console.log(MEET_ID)
    window.location.replace('/'+MEET_ID+"?email="+EmailId);
}

//chat
const send = document.querySelector("#send");
const message = document.querySelector("#message");
let output = document.querySelector("#messages");
if(send) send.addEventListener("click", ()=>{
    console.log('button clicked ', message.value);
    // output.innerHTML += '<p><strong>'+ 'Me' + ': </strong><br>' + message.value + '</p>';
    socket.emit("sendingMessage", {
        text: message.value,
        userId: EmailId,
        userName: UName
    });
})
socket.on('broadcastMessage', (data)=>{
    console.log("hello")
    console.log('client side ', data);
    let text=""
    for(let i=0; i<data.length; ++i){
        if(data[i].userId === EmailId){
            text+='<p style="text-align: right;"><strong>Me </strong><br>' + data[i].text + '</p>';
        }
        else{
            text+='<p><strong>' + data[i].userName + ' </strong><br>' + data[i].text + '</p>';
        }
    }
    if(output) output.innerHTML = text;
})

//activity board
const hand = document.querySelector(".hand");
const brb = document.querySelector(".brb");
let notice = document.querySelector("#messages-notice");
let handflag=0;
let brbflag=0;
let noticelist=[]
hand.addEventListener("click", ()=>{
    if(handflag===0) {
        hand.style.backgroundImage = "url('/icons/raising-hand-white.png')";
        hand.style.backgroundColor = "#6264a7";
        socket.emit("hand-raise", UName, userIdentity);
        handflag=1;
    }
    else{
        hand.style.backgroundImage = "url('/icons/raising-hand.png')";
        hand.style.backgroundColor = "rgb(80, 80, 80)";
        socket.emit("hand-down", UName, userIdentity);
        handflag=0;
    }
})
brb.addEventListener("click", ()=>{
    if(brbflag===0) {
        brb.style.backgroundImage = "url('/icons/clock-white.png')";
        brb.style.backgroundColor = "#6264a7";
        socket.emit("brb", UName, userIdentity);
        brbflag=1;
    }
    else{
        brb.style.backgroundImage = "url('/icons/clock.png')";
        brb.style.backgroundColor = "rgb(80, 80, 80)";
        socket.emit("brb-back", UName, userIdentity);
        brbflag=0;
    }
})
let text="";
socket.on("hand-raised", (usern, userId)=>{
    console.log('hand raised by ', usern)
    noticelist.push('<p><strong>'+usern+'</strong> raised hand</p>')
    text=""
    for(let i=0; i<noticelist.length; ++i){
        if(peers[userId]) text+= noticelist[i];
    }
    // handnotice.innerHTML = '<p><strong>'+text+'</strong> raised hand</p>';
    notice.innerHTML = text;
})
socket.on("hand-put-down", (usern, userId)=>{
    console.log('hand put down by ', usern)
    let index = noticelist.indexOf('<p><strong>'+usern+'</strong> raised hand</p>')
    if(index>-1) noticelist.splice(index, 1)
    text="";
    for(let i=0; i<noticelist.length; ++i){
        if(peers[userId]) text+= noticelist[i];
    }
    // handnotice.innerHTML = '<p><strong>'+text+'</strong> raised hand</p>';
    notice.innerHTML = text;
})
socket.on("be-right-back", (usern, userId)=>{
    console.log('brb by ', usern)
    noticelist.push('<p><strong>'+usern+'</strong> will be right back</p>')
    text=""
    for(let i=0; i<noticelist.length; ++i){
        if(peers[userId]) text+= noticelist[i];
    }
    // handnotice.innerHTML = '<p><strong>'+text+'</strong> raised hand</p>';
    notice.innerHTML = text;
})
socket.on("back", (usern, userId)=>{
    console.log('back by ', usern)
    let index = noticelist.indexOf('<p><strong>'+usern+'</strong> will be right back</p>')
    if(index>-1) noticelist.splice(index, 1)
    text="";
    for(let i=0; i<noticelist.length; ++i){
        if(peers[userId]) text+= noticelist[i];
    }
    // handnotice.innerHTML = '<p><strong>'+text+'</strong> raised hand</p>';
    notice.innerHTML = text;
})

//caption, status-implemented locally
// const caption = document.querySelector(".caption")
// let capflag=0;
// let cctext = document.getElementById('caption-text');
// let recognizing = true;
// let recognition = new webkitSpeechRecognition();
// recognition.continuous = true;
// recognition.interimResults = true;
// let cursocket = null;
// recognition.onstart = () => {
//     recognizing = true;
// };
// recognition.onend = () => {
//     recognizing = false;
// };
// recognition.onresult = (event) => {
//     for (let i = event.resultIndex; i < event.results.length; ++i) {
//         if(event.results[i][0].confidence > 0.4) {
//             console.log(capitalize(event.results[i][0].transcript))
//             if(audioflag===0) cctext.innerHTML = capitalize(event.results[i][0].transcript);
//             console.log(capitalize(event.results[i][0].transcript))
//             socket.emit("caps", {text:capitalize(event.results[i][0].transcript), user: userName, tosocket: cursocket})
//         }
//     }
// };
// const capitalize = (s) => {
//     let first_char = /\S/;
//     return s.replace(first_char, (m) => { 
//         return m.toUpperCase(); 
//   }); 
// }
// let caps = document.querySelector(".captions");
// let textcap=""
// socket.on("caps-broadcast", (data)=>{
//     console.log(data.text)
//     textcap = '<p>'+data.username+': '+ data.text +'</p>';
//     caps.innerHTML+=textcap;
// })
// caption.addEventListener("click", (event)=>{
//     console.log('captions')
//     if(capflag) {
//         caption.style.backgroundImage = "url('/icons/subtitles.png')";
//         caption.style.backgroundColor = "rgb(80, 80, 80)";
//         // recognition.stop();
//         document.querySelector(".live-captions").style.display = "inline-block";
//         // return;
//         socket.emit("req-caption-end", socket.id);
//     }
//     else {
//         caption.style.backgroundImage = "url('/icons/subtitles-white.png')";
//         caption.style.backgroundColor = "#6264a7";
//         document.querySelector(".live-captions").style.display = "inline-block";
//         // recognition.start();
//         socket.emit("req-caption", socket.id);
//     }
// })
// socket.on("req-caption-broadcast", (socketId)=>{
//     console.log("caption req")
//     caption.style.backgroundImage = "url('/icons/subtitles-white.png')";
//     caption.style.backgroundColor = "#6264a7";
//     cctext.style.display = "inline-block";
//     recognition.start();
//     cursocket = socketId;
// })
// socket.on("req-caption-end-broadcast", ()=>{
//     console.log("caption req cancel")
//     caption.style.backgroundImage = "url('/icons/subtitles.png')";
//     caption.style.backgroundColor = "rgb(80, 80, 80)";
//     recognition.stop();
//     cctext.style.display = "none";
//     cursocket = null;
// })

const caption = document.querySelector(".caption")
let cctext = document.getElementById('caption-text');
let caps = document.querySelector(".captions");
let recognizing = false;
let recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;
recognition.onstart = () => {
    recognizing = true;
};
recognition.onend = () => {
    recognizing = false;
};
recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if(event.results[i][0].confidence > 0.4) {
            console.log(capitalize(event.results[i][0].transcript))
            if(audioflag===0) cctext.innerHTML = capitalize(event.results[i][0].transcript);
            console.log(capitalize(event.results[i][0].transcript))
            socket.emit("caption-broadcast", ({text:capitalize(event.results[i][0].transcript), user: UName}))
        }
    }
};
const capitalize = (s) => {
    let first_char = /\S/;
    return s.replace(first_char, (m) => { 
        return m.toUpperCase(); 
  }); 
}
let capflag=0;
caption.addEventListener("click", (event)=>{
    console.log('captions')
    if(capflag===1) {
        caption.style.backgroundImage = "url('/icons/subtitles.png')";
        caption.style.backgroundColor = "rgb(80, 80, 80)";
        recognition.stop();
        socket.emit("caption-stopped");
        cctext.style.display = "none";
        capflag=0;
    }
    else {
        caption.style.backgroundImage = "url('/icons/subtitles-white.png')";
        caption.style.backgroundColor = "#6264a7";
        cctext.style.display = "inline-block";
        recognition.start();
        capflag=1;
    }
})
let textcap="";
let speaker = document.querySelector("#speaker");
socket.on("captions", (data)=>{
    console.log(data.text)
    document.querySelector(".live-captions").style.display = "block";
    speaker.textContent = data.user;
    textcap = '<p>'+data.text +'</p>';
    caps.innerHTML+=textcap;
})
socket.on("captions-stop", ()=>{
    console.log("end")
    document.querySelector(".live-captions").style.display = "none";
})

//voice commands
const vcmdbtn = document.querySelector(".v-cmd");
const vcmdinstructions = document.querySelector(".voice-commands")
let vcmdflag=0;
let commands = false;
let rec = new webkitSpeechRecognition();
rec.continuous = true;
rec.interimResults = true;
rec.onstart = () => {
    console.log("started")
};
rec.onend = () => {
    console.log("stopped");
};
rec.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        console.log(event.results[i][0].transcript)
        if(event.results[i][0].confidence > 0.4) {
            if(event.results[i][0].transcript === "hand"){
                hand.style.backgroundImage = "url('/icons/raising-hand-white.png')";
                hand.style.backgroundColor = "#6264a7";
                socket.emit("hand-raise", UName, userIdentity)
                handflag=1;
            }
            if(event.results[i][0].transcript === "brb" || event.results[i][0].transcript === "be right back"){
                brb.style.backgroundImage = "url('/icons/clock-white.png')";
                brb.style.backgroundColor = "#6264a7";
                socket.emit("brb", UName, userIdentity)
                brbflag=1;
            }
            if(event.results[i][0].transcript === "hand down"){
                hand.style.backgroundImage = "url('/icons/raising-hand.png')";
                hand.style.backgroundColor = "rgb(80, 80, 80)";
                socket.emit("hand-down", UName, userIdentity)
                handflag=0;
            }
            if(event.results[i][0].transcript === "back"){
                brb.style.backgroundImage = "url('/icons/clock.png')";
                brb.style.backgroundColor = "rgb(80, 80, 80)";
                socket.emit("brb-back", UName, userIdentity)
                brbflag=0;
            }
        }
    }
};
let commandflag=0;
window.addEventListener("keydown", (e)=>{
    console.log(e)
    let keycode = e.key;
	if(keycode==="v"){
        if(commandflag===0) {
            rec.start();
            commandflag=1;
        }
        else{
            rec.stop();
            commandflag=0;
        } 
    }
})
vcmdbtn.addEventListener("click", ()=>{
    if(vcmdflag===0){
        vcmdbtn.style.backgroundImage = "url('/icons/voice-white.png')";
        vcmdbtn.style.backgroundColor = "#6264a7";
        vcmdinstructions.style.display = "block";
        vcmdflag=1;
    }
    else{
        vcmdbtn.style.backgroundImage = "url('/icons/voice.png')";
        vcmdbtn.style.backgroundColor = "rgb(80, 80, 80)";
        vcmdinstructions.style.display = "none";
        vcmdflag=0;
    }
})

//button hover --> tippy.js

tippy('.audio', {
    content: 'Toggle audio input',
    arrow: false,
    theme: 'custom',
});
tippy('.video', {
    content: 'Toggle video input',
    arrow: false,
    theme: 'custom',
});
tippy('.call', {
    content: 'Disconnect Call',
    arrow: false,
    theme: 'custom',
});
tippy('.screenshare', {
    content: 'Share Screen',
    arrow: false,
    theme: 'custom',
});
tippy('.info', {
    content: 'Meeting Information',
    arrow: false,
    theme: 'custom',
});
tippy('.caption', {
    content: 'Enable speech caption for peers',
    arrow: false,
    theme: 'custom',
});
tippy('.hand', {
    content: 'Raise Hand',
    arrow: false,
    theme: 'custom',
});
tippy('.brb', {
    content: 'Enable be right back',
    arrow: false,
    theme: 'custom',
});
tippy('.enable-chat', {
    content: 'Open chat box',
    arrow: false,
    theme: 'custom',
});
tippy('.v-cmd', {
    content: 'Video commands',
    arrow: false,
    theme: 'custom',
});
tippy('#close', {
    content: 'Close chat box',
    arrow: false,
    theme: 'custom',
});
tippy('#close-caption', {
    content: 'Close caption box',
    arrow: false,
    theme: 'custom',
});
