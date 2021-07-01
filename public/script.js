const socket = io('/')
const peer = new Peer(undefined
//     , {
//     host:'peerjs-server.herokuapp.com',
//     port: '3001'
// }
)
const videogrid = document.getElementById('video-grid')
const uservideo = document.createElement('video')
uservideo.muted = true;
let peers = {}
let myvideostream;
let callreceived=null;
let promise = navigator.mediaDevices.getUserMedia({
    video: true, audio: true
})
promise.then((stream) => {
    console.log('promise true')
    myvideostream = stream;
    addVideoStream(uservideo, stream)

    if(callreceived){
        callreceived.answer(myvideostream)
        const video = document.createElement('video')
        video.muted = true;
        callreceived.on('stream', peervideostream => {
            console.log('got video inside')
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
            addVideoStream(video, peervideostream)
        })
    })
})

peer.on('call', (call) => {
    // console.log('call outside', myvideostream)
    // call.answer(myvideostream)
    
    // const video = document.createElement('video')
    // video.muted = true;
    // call.on('stream', peervideostream => {
    //     console.log('got video outside')
    //     addVideoStream(video, peervideostream)
    // })
    callreceived = call;
})
let conn =null;
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
let userIdentity = null;
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
        console.log('rendering video')
        videogrid.append(video)
    })
}

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

