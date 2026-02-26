class SF2_Player{
    constructor(){
        this.side = 0
        this.vitally = 100
        this.pos = [0,60]
        this.status = 'walk_ahead'
        this.frame = 0
        this.frame_direction = 0
        this.scale = 0.7
        this.speed_animate = 80
        this.spritejson = [{'idle':[{"x":0,"y":0,"w":60,"h":100}]}]
    }
}

SF2_Player.prototype.frameMotion = function(){
    const player = this

    function coil(player){
        player.frame += player.frame_direction ? -1 : 1
        player.frame_direction = [0,player.spritejson[player.status].length-1].includes(player.frame) ? !player.frame_direction : player.frame_direction
    }

    function repeat(player){
        player.frame += player.frame_direction ? -1 : 1
        player.frame = player.frame == player.spritejson[player.status].length ? 0 : player.frame
    }

    switch(this.status){
        case 'idle':
            coil(player)
        break
        case 'walk_ahead':
            repeat(player)
        break
    }
    this.draw()
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
        ctx.clearRect(this.pos[0], this.pos[1], w, h);
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
        })

        this.frameAnime = setInterval(()=>{
            this.frameMotion()
        }, this.speed_animate); 
     

    }
}
