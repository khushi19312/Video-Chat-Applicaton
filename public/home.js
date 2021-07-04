const room_id_inp = document.querySelector("#room-id");
const end_call = document.querySelector('#end-call');
const chat = document.querySelector(".enable-chat")
const close = document.querySelector("#close")
const info= document.querySelector(".info");
const caption = document.querySelector(".caption")
// const iclose= document.querySelector("#infoclose");
if(room_id_inp) room_id_inp.addEventListener('keypress', (e)=>{
    if(e.key=='Enter') window.location.replace('/'+room_id_inp.value);;
});
let endcall = ()=>{
    window.location.replace('/');
}
let redirect = ()=>{
    console.log("clicked")
    window.location.replace('/meet');
}
chat.addEventListener("click", ()=>{
    console.log(document.querySelector(".chatbox").style.display);
    document.querySelector(".chatbox").style.display="block";
    // chat.style.display = "none";
})
close.addEventListener("click", ()=>{
    console.log(document.querySelector(".chatbox").style.display);
    document.querySelector(".chatbox").style.display="none";
    // chat.style.display = "block";
})
let notices = document.querySelector('#messages');
let textinfo = '<p><strong>meeting ID: </strong>'+ MEET_ID + '</p>';
notice.innerHTML +=textinfo;
let flaginfo=0;
info.addEventListener("click", ()=>{
    if(flaginfo===0){
        popup.style.display = "block";
        flaginfo=1;
    }
    else{
        console.log('close info')
        popup.style.display = "none";
        flaginfo=0;
    }
    
})
//caption
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
            cctext.innerHTML = capitalize(event.results[i][0].transcript);
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
    if(recognizing) {
        recognition.stop();
        cctext.style.display = "none";
        return;
    }
    else {
        cctext.style.display = "inline-block";
        recognition.start();
    }
})