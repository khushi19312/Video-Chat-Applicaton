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
    // console.log('promise true')
    myvideostream = stream;
    addVideoStream(uservideo, stream)
    if(callreceived){
        callreceived.answer(myvideostream)
        const video = document.createElement('video')
        video.muted = true;
        callreceived.on('stream', peervideostream => {
            console.log('got video inside')
            currentpeer = callreceived.peerConnection;
            console.log(currentpeer);
            addVideoStream(video, peervideostream)
        })
    }
    peer.on('call', (call) => {
        console.log('stream received')
        call.answer(myvideostream)
        const video = document.createElement('video')
        video.muted = true;
        call.on('stream', peervideostream => {
            console.log('got video inside')
            currentpeer = call.peerConnection;
            console.log(currentpeer);
            addVideoStream(video, peervideostream)
        })
    })
})

peer.on('call', (call) => {
    callreceived = call;
    currentpeer = call.peerConnection;
    console.log(currentpeer);
})

socket.on('user-connected', (userId) => {
    console.log('connected')
    connectToNewUser(userId, myvideostream)
    // conn = peer.connect(userId);
    console.log('return')
})
socket.on('user-disconnected', (userId) => {
    // console.log(userId);
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
    video.muted = true;
    call.on('stream', (peervideostream) => {
        console.log('got video in connectNewUser')
        addVideoStream(video, peervideostream)
        currentpeer = call.peerConnection;
    })
    call.on('close', ()=>{
        video.remove()
    })
    peers[userId] = call;
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
        console.log('rendering video ', Object.keys(peers).length)
        let cont = document.createElement('div');
        cont.className = 'container';
        videogrid.append(cont);
        cont.append(video);
        layout();
    })
}
const layout = ()=>{
    var num = Object.keys(peers).length + 1; 
    console.log(num);
    let w='800px';
    let h='auto';
    let col= 1;
    if (num > 1 && num <= 4) { 
        w = '500px';
        h = 'auto';
        col=2;

    } else if (num > 4) {
        // rowHeight = '24vh';
        w = '300px';
        h = 'auto';
        col=3;
    }
    document.querySelector(".video-grid").style.setProperty('--width', w);
    document.querySelector(".video-grid").style.setProperty('--height', h);
    document.querySelector(".video-grid").style.setProperty('--cols', col);
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
        audio.style.backgroundImage = 'url("/icons/icons8-mute-unmute-96.png")';
        audioflag=1;
    }
    else{
        audio.style.backgroundImage = 'url("/icons/icons8-microphone-96.png")';
        audioflag=0;
    }
})
video.addEventListener("click", ()=>{
    console.log('heard video toggle')
    myvideostream.getVideoTracks()[0].enabled = !(myvideostream.getVideoTracks()[0].enabled);
    if(videoflag===1){
        video.style.backgroundImage = 'url("/icons/video-camera-close.png")';
        videoflag=0;
    }
    else{
        video.style.backgroundImage = 'url("/icons/video-camera.png")';
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
        let screen = document.createElement("video")
        addVideoStream(screen, stream);
        videoTrack.onended = ()=>{
            let videoTrack = myvideostream.getVideoTracks()[0];
            let sender = currentpeer.getSenders().find((s)=>{
                return s.track.kind == videoTrack.kind
            })
            sender.replaceTrack(videoTrack)
            screen.remove()
        }
        let sender = currentpeer.getSenders().find((s)=>{
            return s.track.kind == videoTrack.kind
        })
        sender.replaceTrack(videoTrack)
        
    })
})

//chat
const send = document.querySelector("#send");
const message = document.querySelector("#message");
let output = document.querySelector("#messages");
send.addEventListener("click", ()=>{
    console.log('button clicked ', message.value);
    output.innerHTML += '<p><strong>'+ 'Me' + ': </strong><br>' + message.value + '</p>';
    socket.emit("sendingMessage", {
        message: message.value,
        user: userIdentity
    });
})
socket.on('broadcastMessage', (data)=>{
    console.log("hello")
    console.log('client side ', data.message);
    output.innerHTML += '<p><strong>' + data.user.slice(0,6) + ': </strong><br>' + data.message + '</p>';
})



