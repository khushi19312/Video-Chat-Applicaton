const room_id_inp = document.querySelector("#room-id");
const end_call = document.querySelector('#end-call');
room_id_inp.addEventListener('keypress', (e)=>{
    if(e.key=='Enter') window.location.replace('/'+room_id_inp.value);;
});
let endcall = ()=>{
    window.location.replace('/');
}
let redirect = ()=>{
    console.log("clicked")
    window.location.replace('/meet');
}

