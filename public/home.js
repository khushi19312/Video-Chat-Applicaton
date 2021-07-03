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
    chat.style.display = "none";
})
close.addEventListener("click", ()=>{
    console.log(document.querySelector(".chatbox").style.display);
    document.querySelector(".chatbox").style.display="none";
    chat.style.display = "block";
})
let popup = document.querySelector('.infotext');
let text = '<p><strong>meeting ID: </strong>'+ MEET_ID + '</p>';
popup.innerHTML +=text;
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
// iclose.addEventListener("click", ()=>{
//     console.log('close info')
//     popup.style.display = "none";
// })