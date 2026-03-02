const keys = {}
document.addEventListener('keydown', (event) => {
    keys[event.key] = true
    event.preventDefault()
    sf2.p1.move(event.key)         
})

document.addEventListener('keyup', (event) => {
    keys[event.key] = true
    event.preventDefault()
    sf2.p1.stop()
})

class SF2{
    constructor(id,p1="Ryu",p2='Ken'){
        this.keys = {}
        this.hi_score = 0
        this.time = 99
        this.p1 = p1
        this.p2 = p2
        this.fps = 10
        this.clockCount = 0
        this.makeScreen()
        this.createPlayer(1,'Ryu')
        this.createPlayer(2,'Ken')

        this.setScore()

        document.getElementById(id).appendChild(this.screen)

        this.runtime = setInterval(()=>{
            this.screenClear()
            this.p1.frameMotion()
            this.p2.frameMotion()
            this.setClock()
        },1000/this.fps); 
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
    if(this.clockCount >= 1000){
        this.clockCount = 0
        this.time --
        this.screen.querySelector('#time').innerHTML = this.time
    }
}

SF2.prototype.setBlood = function(P,val){
    document.getElementById(`p${P}-blood`).style.width = `${val}%`
}

class SF2_Player{
    constructor(){
        this.score = 0
        this.name = 'X'
        this.side = 0
        this.vitally = 100
        this.pos = [0,60]
        this.status = 'idle'
        this.frame = 0
        this.frame_direction = 0
        this.scale = 1
        this.spritejson = [{'idle':[{"x":0,"y":0,"w":60,"h":100}]}]
        this.pixel_move = 8
    }
}

SF2_Player.prototype.frameMotion = function(){
    const player = this

    function coil(player){
        player.frame += player.frame_direction ? -1 : 1
        player.frame_direction = [0,player.spritejson[player.status].length-1].includes(player.frame) ? !player.frame_direction : player.frame_direction
    }

    function repeat(player){
        player.frame += 1
        player.frame = player.frame == player.spritejson[player.status].length ? 0 : player.frame
    }

    function once(player){
        player.frame += player.frame < player.spritejson[player.status].length-1 ? (player.frame_direction ? -1 : 1 ): 0
    }

    function jump(player){
//        player.pos[1] -= 10
    }

    switch(this.status){
        case 'idle':
            coil(player)
        break
        case 'walk_ahead':
            repeat(player)
            this.pos[0] += this.pixel_move
        break
        case 'walk_back':
            repeat(player)
            this.pos[0] -= this.pixel_move

        break
        case 'jump_spin':
            repeat(player)
            jump(player)
        break
        case 'jump':
            repeat(player)
            jump(player)
        break           
    }
    this.draw()
}

SF2_Player.prototype.move = function(key){

    switch(key){
        case 'ArrowUp':
            this.status = 'jump'
        break
        case 'ArrowDown':
            console.log('P1 Down')
        break
        case 'ArrowLeft':
            this.status = 'walk_back'
        break
        case 'ArrowRight':
             this.status = 'walk_ahead'
        break
        default:
            console.log(key)
    }
}

SF2_Player.prototype.stop = function(){
    this.frame = 0
    this.frame_direction = 0
    this.status = 'idle'
}

SF2_Player.prototype.draw = function(){
    const w =  this.spritejson[this.status][this.frame].w // 60 
    const h =  this.spritejson[this.status][this.frame].h // 96 
    const x =  this.spritejson[this.status][this.frame].x // 0
    const y =  this.spritejson[this.status][this.frame].y // 0
    const flip_x = this.side ?0:w*-1
    const scale_x = this.side?1:-1
    const pos_x = this.pos[0]*(this.side ?1:(-1*this.scale))
    const pos_y = this.pos[1]

//x  * (this.side?1:-1) 

    if (this.canvas.getContext) {
        ctx = this.canvas.getContext('2d');
//        ctx.clearRect(this.pos[0], this.pos[1], w, h);
        ctx.save();
        ctx.scale(scale_x, 1);
        ctx.translate(flip_x, 0 );
        ctx.drawImage(this.img,x,y,w,h,pos_x,pos_y,w*this.scale,h*this.scale);
        ctx.restore();            
    }
}

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