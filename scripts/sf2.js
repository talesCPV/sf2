document.addEventListener('keydown', (event) => {
    sf2.key_press(event,1)
    console.log(event.key)
})

document.addEventListener('keyup', (event) => {
//    sf2.key_press(event,0)
})

/*   MAIN CLASS   */

class SF2{
    constructor(id,p1='Ryu',p2='Ken'){
        this.keys = []
        this.key_time = 5
        this.hi_score = 0
        this.time = 99
        this.key_wait= [15,15]
        this.p1 = p1
        this.p2 = p2
        this.fps = 60
        this.clockCount = 0
        this.screen_x = 100
        this.makeScreen()
        this.createPlayer(1,p1)
        this.createPlayer(2,p2)
        this.setScore()

        this.img = new Image()
        this.img.src =  'assets/sprites/backgrounds/honda.jpg'

        document.getElementById(id).appendChild(this.screen)

        this.runtime = setInterval(()=>{

            if(this.p1.pos[0] > this.p2.pos[0]){
                this.p1.side = 1
                this.p2.side = 0
            }else{
                this.p1.side = 0
                this.p2.side = 1
            }

            this.screenClear()
            this.p1.frameMotion()
            this.p2.frameMotion()
            this.setClock()
            this.joystick()

            this.key_wait[0]--
            if(this.key_wait[0] < 0){
                this.keys.splice(-1)
                this.key_wait[0] = this.key_wait[1]
            }

        },1000/this.fps); 
    }
}

SF2.prototype.key_press = function(e,press=1){
    e.preventDefault()
    if(!this.keys.includes(e.key) && press){
        this.keys.push(e.key)
    }else  if(this.keys.includes(e.key) && !press){
        this.keys.splice(this.keys.indexOf(this.keys),1)
        console.log(this.keys)
    }
}

SF2.prototype.joystick = function(){

    const sf2 = this

    function move(P){

        const on_air = P.jmp.on_air

        if(sf2.keys.includes(P.spritejson.joystick.UP) && !on_air){
            P.jmp.up = 1
            P.anime.frame = 0
            P.anime.status = 'jump'
        }else if(sf2.keys.includes(P.spritejson.joystick.DW) && !on_air){
        }else if(sf2.keys.includes(P.spritejson.joystick.LF) && !on_air){
            P.anime.status = 'walk_ahead'
        }else if(sf2.keys.includes(P.spritejson.joystick.RG) && !on_air){
        }else if(sf2.keys.includes(P.spritejson.joystick.PW)){
        }else if(sf2.keys.includes(P.spritejson.joystick.PM)){
        }else if(sf2.keys.includes(P.spritejson.joystick.PS)){
        }else if(sf2.keys.includes(P.spritejson.joystick.KW)){
        }else if(sf2.keys.includes(P.spritejson.joystick.KM)){
        }else if(sf2.keys.includes(P.spritejson.joystick.KS)){
    
        }else if(!on_air){
            P.anime.status = 'idle'
        }
    }

    try{
        move(this.p1)
        move(this.p2)
    }catch{
        console.error('Not Load Yet')
    }




}

SF2.prototype.makeScreen = function(){
    this.screen = document.createElement('div')
    this.screen.className =  'screen'

    const top = document.createElement('div')
    this.screen.appendChild(top)
    top.className =  'top'

    const score = document.createElement('div')
    top.appendChild(score)
    score.className =  'score'
    score.innerHTML = '<div>1P</div><div id="p1-score">000000</div><div>HI</div><div id="hi-score">000000</div><div>2P</div><div id="p2-score">000000</div>'

    const bar_energy = document.createElement('div')
    top.appendChild(bar_energy)
    bar_energy.className =  'bar-energy'
    bar_energy.innerHTML = '<div class="bar"><div id="p1-blood" class="blood"></div></div><div class="KO">KO</div><div class="bar bar-rigth"><div id="p2-blood" class="blood"></div></div>'

    const bar_name = document.createElement('div')
    top.appendChild(bar_name)
    bar_name.className =  'bar-name'
    bar_name.innerHTML = '<div id="p1-name"></div><div id="time">00</div><div id="p2-name"></div>'

    this.canvas = document.createElement('canvas')
    this.canvas.id = 'cnvScreen'

    this.screen.appendChild(this.canvas)
}

SF2.prototype.screenClear = function(){
    ctx = this.canvas.getContext('2d');
    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.drawBG()
}

SF2.prototype.createPlayer = function(N,P){
    let player
    switch(P){
        case 'Ryu':
            player = new Ryu(this.canvas)
        break
        case 'Ken':
            player = new Ken(this.canvas)
        break
    }

    if(N==1){
        this.p1 = player
    }else{
        this.p2 = player
        this.p2.side = 1
        this.p2.pos[0] = 200
    }

}

SF2.prototype.setScore = function(){
   this.screen.querySelector('#p1-score').innerHTML = this.p1.score.toString().padStart(6,0)
   this.screen.querySelector('#p2-score').innerHTML = this.p2.score.toString().padStart(6,0) 
   this.screen.querySelector('#p1-name').innerHTML = this.p1.name.toUpperCase()
   this.screen.querySelector('#p2-name').innerHTML = this.p2.name.toUpperCase()
}

SF2.prototype.setClock = function(){
    this.clockCount += 1000/this.fps
    if(this.clockCount >= 1000 && this.time > 0){
        this.clockCount = 0
        this.time --
        this.screen.querySelector('#time').innerHTML = this.time
    }
}

SF2.prototype.setBlood = function(P,val){
    document.getElementById(`p${P}-blood`).style.width = `${val}%`
}

SF2.prototype.drawBG = function(){
    if (this.canvas.getContext) {
        ctx = this.canvas.getContext('2d');
        ctx.drawImage(this.img,0,0,7000,1230,-this.screen_x,0,1000,this.canvas.height);
    }
}


/*   PLAYER CLASS   */

class SF2_Player{
    constructor(){
        this.score = 0
        this.name = 'X'
        this.side = 0
        this.vitally = 100
        this.floor = 180
        this.pos = [0,60]

        this.anime = new Object
            this.anime.status = 'idle'
            this.anime.frame = 0
            this.anime.frame_direction = 0
            this.anime.fps = 0.2
            this.anime.fps_count = 0

        this.jmp = new Object
            this.jmp.on_air = 0
            this.jmp.max_height = 70
            this.jmp.up = 0
            this.jmp.pixels = 5

        this.scale = 1
        this.spritejson = []
        this.pixel_move = 3
    }
}

SF2_Player.prototype.frameMotion = function(){
    const player = this
    player.anime.frame = player.anime.frame >= player.spritejson[player.anime.status].length ? 0 : player.anime.frame

    function coil(){
        player.anime.frame += player.anime.frame_direction && player.anime.frame>0 ? -1 : 1
        player.anime.frame_direction = [0,player.spritejson[player.anime.status].length-1].includes(player.anime.frame) ? !player.anime.frame_direction : player.anime.frame_direction
    }

    function repeat(){
        player.anime.frame += 1
//        player.anime.frame = player.anime.frame >= player.spritejson[player.anime.status].length ? 0 : player.anime.frame
    }

    function once(){
        player.anime.frame += player.anime.frame < player.spritejson[player.anime.status].length-1 ? (player.anime.frame_direction && player.anime.frame>0 ? -1 : 1 ): 0
    }

    this.anime.fps_count += this.anime.fps

//console.log(player.anime.frame)

    // Sprite Frame Motion
    if(this.anime.fps_count >= 1){
        this.anime.fps_count -= 1
        switch(this.anime.status){
            case 'idle':
                coil()
            break
            case 'walk_ahead':
                repeat()
            break
            case 'walk_back':
                repeat()
            break
            case 'jump_spin':
                once()
            break
            case 'jump':
                once()
            break
        }
    }

//  Every Frame   

    this.jump()
    this.draw()
//    this.move()
}


SF2_Player.prototype.jump = function(){
    if(this.pos[1] < this.floor || this.jmp.up){
        this.jmp.on_air = 1
        this.pos[1] += this.jmp.up ? -this.jmp.pixels : this.jmp.pixels
        this.jmp.up = (this.floor - this.pos[1]) > this.jmp.max_height ? 0 : this.jmp.up
//        this.anime.status = 'jump'
    }else{
        this.pos[1] = this.floor
        this.anime.frame = this.jmp.on_air ? 0 : this.anime.frame
        this.jmp.on_air = 0
//        this.anime.status = 'idle'
    }
}

SF2_Player.prototype.draw = function(){
    try{
        const w =  this.spritejson[this.anime.status][this.anime.frame].w
        const h =  this.spritejson[this.anime.status][this.anime.frame].h
        const x =  this.spritejson[this.anime.status][this.anime.frame].x
        const y =  this.spritejson[this.anime.status][this.anime.frame].y
        const flip_x = this.side ?0:w/2*-1
        const scale_x = this.side?1:-1
        const pos_x = (this.pos[0]*(this.side ?1:(-1*this.scale))) - w/2
        const pos_y = this.pos[1] //* this.scale
    
    //x  * (this.side?1:-1) 
    
        if (this.canvas.getContext) {
            ctx = this.canvas.getContext('2d');
            ctx.save();
            ctx.scale(scale_x, 1);
            ctx.translate(flip_x, -h );
            ctx.drawImage(this.img,x,y,w,h,pos_x,pos_y,w*this.scale,h*this.scale);
            ctx.restore();            
        }

    }catch{null}

}

SF2_Player.prototype.move = function(){

    if(this.keys.UP){
        if(!this.jmp.on_air){
            this.jmp.up = 1
        }
    }else if(this.keys.DW){
    }else if(this.keys.LF){
    }else if(this.keys.RG){
    }else if(this.keys.PW){
    }else if(this.keys.PM){
    }else if(this.keys.PS){
    }else if(this.keys.KW){
    }else if(this.keys.KM){
    }else if(this.keys.KS){

    }


}


/*  CARACTERS CLASSES  */


class Ryu extends SF2_Player {
    constructor(CV) {
        super()
        this.name = "Ryu"
        this.canvas = CV
        this.img = new Image()
        this.img.src =  'assets/sprites/Ryu.png'
        this.spritejson = fetch('assets/sprites/Ryu.json').then(response => response.text()).then((txt)=>{
            this.spritejson = JSON.parse(txt)
            this.scale = this.spritejson.scale
        })
    }
}

class Ken extends Ryu {
    constructor(CV){
        super()
        this.name = "Ken"
        this.canvas = CV
        this.img.src =  'assets/sprites/Ken.png'
    }
}