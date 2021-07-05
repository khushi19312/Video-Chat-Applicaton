const room_id_inp = document.querySelector("#room-id");
const end_call = document.querySelector('#end-call');
const chat = document.querySelector(".enable-chat")
const close = document.querySelector("#close")
const info= document.querySelector(".info");

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
let popup = document.querySelector('.infotext');
let textinfo = '<p><strong>meeting ID: </strong>'+ MEET_ID + '</p>';
popup.innerHTML +=textinfo;
let flaginfo=0;
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
//caption
