
setBlood(1,30)
setBlood(2,90)


function setBlood(P,val){
    document.getElementById(`p${P}-blood`).style.width = `${val}%`
}


const ryu = new Ryu(document.getElementById('cnvScreen'))

ryu.spritejson.then(()=>{
    ryu.draw() 
})



//console.log(ryu)
