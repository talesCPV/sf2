class SF2_Player{
    constructor(player){
        this.side = 0
        this.vitally = 100
        this.pos = [0,30]
        this.status = 'idle'
        this.frame = 0

    }
}

SF2_Player.prototype.draw = function(P=1){
    console.log(this.spritejson)
    const w =  P ?60 : this.spritejson[this.status][this.frame].w // 60 
    const h =  P ?96 : this.spritejson[this.status][this.frame].h // 96 
    const x =  P ? 0 : this.spritejson[this.status][this.frame].x  // 0
    const y =  P ? 120 : this.spritejson[this.status][this.frame].y // 0
    const scale = 0.7
    console.log(w,h,x,y)

    if (this.canvas.getContext) {
        ctx = this.canvas.getContext('2d');
        ctx.clearRect(this.pos[0], this.pos[1], w, h);
//        this.img.onload = ()=> {
            const S = this.side;
            ctx.save();
            ctx.scale(S?1:-1, 1);
            ctx.translate(S ?0:w*-1, 0 );
//                        (img, sprite x, sprite y, sprite width, sprite heigth, screen x, screen y, scale x, scale y)
            ctx.drawImage(this.img,x * S?1:-1, y,w,h,this.pos[0]*(S ?1:(-1*scale) ),this.pos[1],w*scale,h*scale);
            ctx.restore();
            
//        }        
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
    }

}
