const room_id_inp = document.querySelector("#room-id");
const end_call = document.querySelector('#end-call');
const chat = document.querySelector(".enable-chat")
const close = document.querySelector("#close")
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
    chat.style.display = "none";
})
close.addEventListener("click", ()=>{
    console.log(document.querySelector(".chatbox").style.display);
    document.querySelector(".chatbox").style.display="none";
    chat.style.display = "block";
})
