const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH=canvas.width= 1000;
const CANVAS_HEIGHT=canvas.height =700;

// const collisionCanvas = document.getElementById('collisioncanvas');
// const collisionctx = collisionCanvas.getContext('2d');
//  collisionCanvas.width=1000;
//  collisionCanvas.height=700;


let ravens= [];
let timeToNextRaven=0;
let ravenInterval=500;
let lastTime=0;
let score=0;
ctx.font ='100px Impact';



class Raven {

    constructor(){

        this.spriteWidth=271;
        this.spriteHeight=194;
        // this.sizeModifier=Math.random()*0.6+0.4;
        this.sizeModifier=1
        this.width=this.spriteWidth*this.sizeModifier;
        this.height=this.spriteHeight*this.sizeModifier;
        this.x=canvas.width;
        this.y=Math.random()*(canvas.height-this.height);
        this.directionX=Math.random()*5+3;
        this.directionY=Math.random()*5-2.5;
        this.markedForDeletion=false;
        this.image=new Image();
        this.image.src='Images\\raven.png';
        this.frame=0;
        this.maxFrame=4;
        this.timeSinceFlap=0;
        this.flapInterval=Math.random()*50+50;
        //  this.randomColors = [200,200,200]
        this.randomColors = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)]
        this.color = 'rgb('+this.randomColors[0]+','+this.randomColors[1]+','+this.randomColors[2]+')';

    }

    update(deltatime){

        if (this.y<0 || this.y > canvas.height - this.height)

        {
        
            this.directionY=this.directionY*-1;

        }


        this.x -= this.directionX;
        this.y += this.directionY;

        if (this.x <0 - this.width) this.markedForDeletion=true;

      
        this.timeSinceFlap += deltatime;

        if(this.timeSinceFlap>this.flapInterval)

        {
            if(this.frame>this.maxFrame) this.frame=0;
            else this.frame++;
            this.timeSinceFlap = 0;


        }

    

    }

    draw() {

        ctx.fillStyle=this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image,this.frame*this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x,this.y, this.width,this.height);
        
    }

}

    function drawScore(){

        ctx.fillStyle = 'black';
        ctx.fillText('Score:'+score,50,75);
        ctx.fillStyle = 'white';
        ctx.fillText('Score:'+score,55,80);

    }

    window.addEventListener('click', function(e)
    
    
        {

            const detecPixelColor = ctx.getImageData(e.x,e.y,1,1);
            const pc = detecPixelColor.data;
            console.log(pc);
            ravens.forEach(o => 
                
                {

                    if(o.randomColors[0]===pc[0] && o.randomColors[1]===pc[1] && o.randomColors[2]===pc[2])

                    {
                        o.markedForDeletion=true;
                        score++;

                    }


                }
                
                );




        }) ;


    function animate(timestamp){

        ctx.clearRect(0,0,canvas.width,canvas.height);
        // collisionctx.clearRect(0,0,canvas.width,canvas.height);
        let deltatime = timestamp - lastTime;
        lastTime = timestamp;
        timeToNextRaven += deltatime;
        if(timeToNextRaven>ravenInterval)
        {
            ravens.push(new Raven());
            timeToNextRaven=0;
            ravens.sort(function(a,b)
            
            
            
                {

                    return a.width-b.width;

                }
            
            
            );


        };

        drawScore();
        [...ravens].forEach(o => o.update(deltatime));
        [...ravens].forEach(o => o.draw());
        ravens=ravens.filter(o => !o.markedForDeletion);

        requestAnimationFrame(animate);

    }

    animate(0);