const room_id_inp = document.querySelector("#room-id");

if(room_id_inp) room_id_inp.addEventListener('keypress', (e)=>{
    if(e.key=='Enter') window.location.replace('/'+room_id_inp.value+'?email='+EmailId);
});
let redirect = ()=>{
    console.log("clicked")
    window.location.replace('/meet?email='+EmailId);
}



