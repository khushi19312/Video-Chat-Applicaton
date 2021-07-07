const socket = io('/')
const peer = new Peer(undefined
)
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
    socket.emit('join-meet', MEET_ID, id)
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
let videoflag=0;
let audioflag=0;
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

//chat
// const send = document.querySelector("#send");
// const message = document.querySelector("#message");
// let output = document.querySelector("#messages");
// send.addEventListener("click", ()=>{
//     console.log('button clicked ', message.value);
//     output.innerHTML += '<p><strong>'+ 'Me' + ': </strong><br>' + message.value + '</p>';
//     socket.emit("sendingMessage", JSON.stringify({
//         text: message.value,
//         username: userIdentity
//     }));
// })
// socket.on('broadcastMessage', (data)=>{
//     console.log("hello")
//     console.log('client side ', data.text, data.username);
//     // output.innerHTML += '<p><strong>' + data.user.slice(0,6) + ': </strong><br>' + data.message + '</p>';
//     output.innerHTML = ""
//     data.forEach((msg)=>{
//         output.innerHTML += '<p><strong>' + msg.username.slice(0,6) + ': </strong><br>' + msg.text + '</p>';
//     })
// })
const send = document.querySelector("#send");
const message = document.querySelector("#message");
let output = document.querySelector("#messages");
send.addEventListener("click", ()=>{
    console.log('button clicked ', message.value);
    output.innerHTML += '<p><strong>'+ 'Me' + ': </strong><br>' + message.value + '</p>';
    socket.emit("sendingMessage", {
        text: message.value,
        userId: userIdentity,
        userName: "xyz"
    });
})
socket.on('broadcastMessage', (data)=>{
    console.log("hello")
    console.log('client side ', data.message);
    output.innerHTML += '<p><strong>' + data.userName + " "+ data.userId.slice(0,6) + ': </strong><br>' + data.text + '</p>';
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
        socket.emit("hand-raise", userIdentity);
        handflag=1;
    }
    else{
        hand.style.backgroundImage = "url('/icons/raising-hand.png')";
        hand.style.backgroundColor = "rgb(80, 80, 80)";
        socket.emit("hand-down", userIdentity);
        handflag=0;
    }
})
brb.addEventListener("click", ()=>{
    if(brbflag===0) {
        brb.style.backgroundImage = "url('/icons/clock-white.png')";
        brb.style.backgroundColor = "#6264a7";
        socket.emit("brb", userIdentity);
        brbflag=1;
    }
    else{
        brb.style.backgroundImage = "url('/icons/clock.png')";
        brb.style.backgroundColor = "rgb(80, 80, 80)";
        socket.emit("brb-back", userIdentity);
        brbflag=0;
    }
})
let text="";
socket.on("hand-raised", (userId)=>{
    console.log('hand raised by ', userId)
    noticelist.push('<p><strong>'+userId.slice(0,6)+'</strong> raised hand</p>')
    text=""
    for(let i=0; i<noticelist.length; ++i){
        if(peers[userId]) text+= noticelist[i];
    }
    // handnotice.innerHTML = '<p><strong>'+text+'</strong> raised hand</p>';
    notice.innerHTML = text;
})
socket.on("hand-put-down", (userId)=>{
    console.log('hand put down by ', userId)
    let index = noticelist.indexOf('<p><strong>'+userId.slice(0,6)+'</strong> raised hand</p>')
    if(index>-1) noticelist.splice(index, 1)
    text="";
    for(let i=0; i<noticelist.length; ++i){
        if(peers[userId]) text+= noticelist[i];
    }
    // handnotice.innerHTML = '<p><strong>'+text+'</strong> raised hand</p>';
    notice.innerHTML = text;
})
socket.on("be-right-back", (userId)=>{
    console.log('brb by ', userId)
    noticelist.push('<p><strong>'+userId.slice(0,6)+'</strong> will be right back</p>')
    text=""
    for(let i=0; i<noticelist.length; ++i){
        if(peers[userId]) text+= noticelist[i];
    }
    // handnotice.innerHTML = '<p><strong>'+text+'</strong> raised hand</p>';
    notice.innerHTML = text;
})
socket.on("back", (userId)=>{
    console.log('back by ', userId)
    let index = noticelist.indexOf('<p><strong>'+userId.slice(0,6)+'</strong> will be right back</p>')
    if(index>-1) noticelist.splice(index, 1)
    text="";
    for(let i=0; i<noticelist.length; ++i){
        if(peers[userId]) text+= noticelist[i];
    }
    // handnotice.innerHTML = '<p><strong>'+text+'</strong> raised hand</p>';
    notice.innerHTML = text;
})
//caption, status-implemented locally
const caption = document.querySelector(".caption")
let cctext = document.getElementById('caption-text');
let recognizing = false;
let recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
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
        }
    }
};
const capitalize = (s) => {
    let first_char = /\S/;
    return s.replace(first_char, (m) => { 
        return m.toUpperCase(); 
  }); 
}
caption.addEventListener("click", (event)=>{
    console.log('captions')
    if(recognizing) {
        caption.style.backgroundImage = "url('/icons/subtitles.png')";
        caption.style.backgroundColor = "rgb(80, 80, 80)";
        recognition.stop();
        cctext.style.display = "none";
        return;
    }
    else {
        caption.style.backgroundImage = "url('/icons/subtitles-white.png')";
        caption.style.backgroundColor = "#6264a7";
        cctext.style.display = "inline-block";
        recognition.start();
    }
})
//voice commands
document.addEventListener("keypress", (e)=>{
    if(e.key=='Shift'){
        //recognition
    }
})
