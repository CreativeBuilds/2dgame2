function Contextmenu({x = mouse.x, y = mouse.y, boxes = [], w = 108}){
    
    this.boxes = boxes;
    this.boxes.push({
        "t":'Close',
        "h":36,
        "clicked":function(){
            console.log("I was clicked bish!");
            document.getElementById("game").classList.remove('hovering');
            toggle.contextmenu = null;
        },
        'hover':false,
        'fontSize':18
    });

    this.x = x;
    this.y = y;
    this.w = w;
    this.h;

    this.getBox = function({x = mouse.x,y = mouse.y}){
        //Return the box the mouse is over!
        if(!this.h){return;}
        if(x >= this.x && x <= this.x + this.w){
            if(y >= this.y && y <= y + this.h){
                //Get the box, the mouse is in the contextmenu
                let h = 5 + this.y;
                for(x of this.boxes){
                    if(y >= h && y <= h+x.h){
                        return x;
                    }
                    h+=x.h+5;
                }
            }
        }
    }

    let ree = this;

    window.addEventListener('mousedown', function(e){
        if(e.button !== 0){return;}
        let box = ree.getBox({});
        if(!box){return;}

        if(box.clicked && typeof box.clicked === "function"){
            box.clicked();
        }
    })

    this.draw = function(){
        let b = 0;
        let w = this.w;
        let h = 5;

        if(boxes.length === 0){h = 50} else if (!this.h){
            let l = -1;
            for(x of this.boxes){
                l++;
                if(!x.h){x.h = 50}

                h += x.h + 5;
                if(l+1 === boxes.length){
                    this.h = h;
                }
            }
        } else {
            h = this.h;
        }

        ctx.save();
        ctx.fillStyle = '#2c2016';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;
        ctx.fillRect(this.x, this.y, this.w, h);
        b+=5;

        let o = -1;
        let yOffset = 0;
        let textStyle = "white";
        for(x of this.boxes){
            o++;
            ctx.fillStyle = '#5c483a';
            if(x.hover){
                console.log("Hovering!");
                ctx.fillStyle = '#725948';
            }

            if(x.verify && x.verify({x:this.x, y:this.y}) !== true){
                ctx.fillStyle = '#140e0a'
                textStyle = "#2a1e15"
            }
            
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 0;
            ctx.fillRect(this.x + b, this.y + b + (b*o) + yOffset,  this.w - b*2, x.h);

            ctx.fillStyle = textStyle;
            ctx.textAlign="center";
            ctx.font = `${x.fontSize}px Arial, Helvetica, sans-serif`
            ctx.fillText(x.t.toUpperCase(), this.x + (this.w/2), this.y + b + (b*o) + yOffset + (x.fontSize/4) + (x.h/2));
            yOffset += x.h;
        }

        //Draw the text BOX
        
        
        ctx.restore();
    }

    this.check = function({x = mouse.x, y = mouse.y}){
        //It uses getBox and if it returns true, return true, if not set hover on all boxes to false;
        let box = this.getBox({x,y});
        if(box){
            console.log("There is a box")
            for(x of this.boxes){
                if(box === x){
                    console.log("the boxes now match!");
                    x.hover = true;
                    document.getElementById("game").classList.add('hovering');
                } else {
                    x.hover = false;
                }
            }
        } else {
            document.getElementById("game").classList.remove('hovering');
            for(x of this.boxes){
                x.hover = false;
                
            }
        }
        
    }
}