document.addEventListener('keydown', (event) => {
    event.preventDefault()
    sf2.p1.joystick(event.key)         
})

document.addEventListener('keyup', () => {
    sf2.p1.joystick(0)
})

class SF2{
    constructor(id,p1="Ryu",p2='Ken'){
        this.keys = {}
        this.hi_score = 0
        this.time = 99
        this.p1 = p1
        this.p2 = p2
        this.fps = 60
        this.clockCount = 0
        this.makeScreen()
        this.createPlayer(1,'Ryu')
        this.createPlayer(2,'Ken')

        this.setScore()

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
        this.keys = []
        this.pos = [0,60]

        this.move_direct = 'S'

        this.anime = new Object
            this.anime.status = 'idle'
            this.anime.frame = 0
            this.anime.frame_direction = 0
            this.anime.fps = 0.2
            this.anime.fps_count = 0

        this.jmp = new Object
            this.jmp.on_air = 0
            this.jmp.max_height = 50
            this.jmp.height = 0
            this.jmp.up = 0
            this.jmp.pixels = 3

        this.scale = 1
        this.spritejson = [{'idle':[{"x":0,"y":0,"w":60,"h":100}]}]
        this.pixel_move = 3
    }
}

SF2_Player.prototype.frameMotion = function(){
    const player = this

    function coil(player){
        player.anime.frame += player.anime.frame_direction ? -1 : 1
        player.anime.frame_direction = [0,player.spritejson[player.anime.status].length-1].includes(player.anime.frame) ? !player.anime.frame_direction : player.anime.frame_direction
    }

    function repeat(player){
        player.anime.frame += 1
        player.anime.frame = player.anime.frame == player.spritejson[player.anime.status].length ? 0 : player.anime.frame
    }

    function once(player){
        player.anime.frame += player.anime.frame < player.spritejson[player.anime.status].length-1 ? (player.anime.frame_direction ? -1 : 1 ): 0
    }

    function jump(player){
        if(player.jmp.on_air){
            player.jmp.height += player.jmp.pixels * (player.jmp.up ? 1 : -1)
            player.jmp.up = (player.jmp.height >= player.jmp.max_height) ? 0 : player.jmp.up
            player.jmp.on_air = player.jmp.height > 0
        }else{
            player.jmp.height = 0
        }
    }

    this.anime.fps_count += this.anime.fps

    // Sprite Frame Motion
    if(this.anime.fps_count >= 1){
        this.anime.fps_count -= 1
        switch(this.move_direct){
            case 'S':
                this.anime.status = 'idle'
                coil(player)
            break
            case 'R':
                this.anime.status = this.anime.side ? 'walk_ahead' : 'walk_back'
                repeat(player)
            break
            case 'L':
                this.anime.status = this.anime.side ? 'walk_ahead' : 'walk_back'
                repeat(player)    
            break
            case 'UR':
                repeat(player)
                jump(player)
            break
            case 'jump':
                this.jump()
                repeat(player)
                jump(player)
            break           
        }
    }

//  Every Frame   
    switch(this.anime.status){
        case 'walk_ahead':
            this.pos[0] += this.pixel_move
        break
        case 'walk_back':
            this.pos[0] -= this.pixel_move

        break
        case 'jump_spin':
        break
        case 'jump':
        break
    }

    jump(player)
    this.draw()
}

SF2_Player.prototype.joystick = function(key){
    if(!this.keys.includes(key)){
        this.keys.push(key)
    }
    console.log(this.keys)


/*
    if(key){
        if(!this.jmp.on_air){
            switch(key){
                case 'ArrowUp':
                    this.move_direct = 'U'
                break
                case 'ArrowDown':
                    this.move_direct = 'D'
                break
                case 'ArrowLeft':
                    this.move_direct== (this.move_direct+'L').substring(0,2)
                    console.log('LEFT',this.move_direct)                    
                    this.anime.status = this.side ? 'walk_back' : 'walk_ahead'
                break
                case 'ArrowRight':
                    this.move_direct== (this.move_direct+'R').substring(0,2)
//                    this.status = !this.side ? 'walk_back' : 'walk_ahead'
                break
                default:
                    this.move_direct = 'S'
//                    console.log(key)
            }
            console.log(this.move_direct)
        }
    }else{ // KEY UP
        if(!this.jmp.on_air){
            this.anime.frame = 0
            this.anime.frame_direction = 0
            this.anime.status = 'idle'
            this.jmp.height = 0
            this.jmp.up = 0
            this.jmp.on_air = 0
        }
    }
*/

}

SF2_Player.prototype.jump = function(){
    if(!this.jmp.on_air){
        this.jmp.on_air = 1    
        this.jmp.up = 1
    }
}


SF2_Player.prototype.draw = function(){
    const w =  this.spritejson[this.anime.status][this.anime.frame].w
    const h =  this.spritejson[this.anime.status][this.anime.frame].h
    const x =  this.spritejson[this.anime.status][this.anime.frame].x
    const y =  this.spritejson[this.anime.status][this.anime.frame].y
    const flip_x = this.side ?0:w/2*-1
    const scale_x = this.side?1:-1
    const pos_x = (this.pos[0]*(this.side ?1:(-1*this.scale))) - w/2
    const pos_y = this.pos[1] - this.jmp.height

//x  * (this.side?1:-1) 

    if (this.canvas.getContext) {
        ctx = this.canvas.getContext('2d');
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