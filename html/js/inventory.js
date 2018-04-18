Inventory.prototype.contents = [];
for(let y = 0; y < 5; y++){
    if(!Inventory.prototype.contents[y]){
        Inventory.prototype.contents.push([]);
    }
	for(let x = 0; x < 5; x++){
        if(!Inventory.prototype.contents[y][x]){
            Inventory.prototype.contents[y].push({
                'name':'',
                'stackSize':0,
                'maxStackSize':64,
                'stackable':true,
                /*
                 * x is the x pixel postion where we want to grab the image from inside of the main file
                 * y is the y pixel postion where we want to grab the image from inside of the main file
                 * w is width of the image
                 * h is height of the image
                 */
                'img':{
                    x:0,
                    y:0,
                    w:0,
                    h:0
                }
            }); 
        }
    }
}

/*
 * Event Listener area
 */

window.addEventListener('treeChopped', function(e){
    /*
     * e is the tree variable
     */
    for(y of this2.contents){
        for(content of y){
            debugger;
            if(content.name === "wood" && content.stackSize + e.detail.amountOfWood <= content.maxStackSize){
                content.stackSize += e.detail.amountOfWood;
                return;
            } else if(content.name === '') {
                content.name = "wood";
                content.maxStackSize = 999;
                content.stackSize = e.detail.amountOfWood;
                content.img = {
                    x:128,
                    y:96,
                    w:32,
                    h:32
                }
                return;
            }
        }
    }
    
})


function Inventory({ contents = Inventory.prototype.contents , w =  innerWidth/2, h = innerHeight/2 }){
    this.contents = contents; //The actual items
    this.inventorySlots = [];

    this.w = w;
    this.h = w+55;
    this.fillStyle = '#000000';
    this.textStyle = '#2a1e15';

    this.topLeftX = innerWidth - this.w;
    this.topLeftY = innerHeight - this.h;
}

Inventory.prototype.setASlot = function({x,y,content}){
    //X is the x position going left -> right
    //Y is the y position going up -> down

    let oldContent = this.contents[y][x];
    outter: for(var key in content){
        console.log(key);
        if(!content.hasOwnProperty(key)) continue outter;
        if(!oldContent.hasOwnProperty(key)){ continue outter;}

        this.contents[y][x][key] = content[key];
        console.log(this.contents[y][x][key], content[key], oldContent, this.contents[y][x]);
    }

    return this.contents[y][x]
}
let this2 = this;
Inventory.prototype.draw = function(ctx){
    //Draw the Border;
    this2 = this;
    ctx.save();
    ctx.fillStyle = '#2c2016';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    ctx.fillRect(this.topLeftX, this.topLeftY, this.w, this.h);

    //Draw the text BOX
    ctx.fillStyle = '#5c483a';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 3;
    ctx.fillRect(this.topLeftX + 5, this.topLeftY + 5, this.w - 10, 50);

    ctx.font="2.4vw Arial, Helvetica, sans-serif"; 
    ctx.textAlign="center";
    ctx.fillStyle= this.textStyle;
    ctx.fillText("INVENTORY", this.topLeftX + (this.w/2), this.topLeftY + 45);

    let spaceLeftX = Math.floor(this.w - 15);
    let spaceLeftY = Math.floor(this.h - 55);

    let boxWidth = Math.floor((spaceLeftX-30)/5);
    this.boxWidth = boxWidth;
    for(let y = 0; y < 5; y ++){
        if(!this.inventorySlots[y]){
            this.inventorySlots.push([]);
        }
        if(!this.contents[y]){
            this.contents.push([]);
        }
        inner: for(let x = 0; x < 5; x++){
            let o = this.inventorySlots[y][x]; 
            if(!this.inventorySlots[y][x]){
                //TODO determine how much the width of one box is going to be!;
                
                if(x === toggle.hotbar && y === 0){
                    ctx.fillStyle="#8f715d";
                    this.equipped = this.contents[y][x];
                } else {
                    ctx.fillStyle = '#5c483a';
                }
                ctx.shadowColor = 'black';
                ctx.shadowBlur = 3;
                ctx.fillRect(this.topLeftX + 12.5 + ((boxWidth+5)*x), this.topLeftY + 65 + ((boxWidth+5)*y), boxWidth, boxWidth);
                this.inventorySlots[y].push({
                    'x':this.topLeftX + 12.5 + ((boxWidth+5)*x),
                    'y':this.topLeftY + 65 + ((boxWidth+5)*y),
                    'xInArray':x,
                    'yInArray':y,
                    'boxWidth': boxWidth,
                    'topLeftX':this.topLeftX,
                    'topLeftY':this.topLeftY,
                    'info':{
                        'x':this.topLeftX,
                        'y':this.topLeftY - this.w/3*2 - 5,
                        'w':this.w,
                        'h':this.w/3*2
                    },
                    'isHover':function(x,y){
                        //The x and y is the position of the mouse
                        return x > this.x && x <= this.x + boxWidth && y > this.y && y < this.y + boxWidth;
                    }
                })
                if(!this.contents[y]){
                    this.contents[y].push({})
                }
            } else {
                if(x === toggle.hotbar && y === 0){
                    ctx.fillStyle="#8f715d";
                    this.equipped = this.contents[y][x];
                } else {
                    ctx.fillStyle = '#5c483a';
                }
                ctx.shadowColor = 'black';
                ctx.shadowBlur = 0;
                ctx.fillRect(o.x, o.y, boxWidth, boxWidth);

                /* draw the image of the item if there is one */
                //The image is tileset
                
                if(this.contents[y][x] && this.contents[y][x].img.w !== 0){
                    let tile = this.contents[y][x].img;
                    if(toggle.mouse.inventoryItem && toggle.mouse.inventoryItem.x === x && toggle.mouse.inventoryItem.y === y ){
                        //ctx.drawImage(tileset, tile.x,tile.y,tile.w,tile.h, mouse.x - (boxWidth/2),mouse.y - (boxWidth/2),boxWidth,boxWidth);
                        
                    } else {
                        ctx.drawImage(tileset, tile.x,tile.y,tile.w,tile.h, this.topLeftX + 12.5 + ((boxWidth+5)*x),this.topLeftY + 65 + ((boxWidth+5)*y),boxWidth,boxWidth);
                    }

                    ctx.fillStyle = "white";
                    ctx.font = `1vw Arial, Helvetica, sans-serif`
                    ctx.textAlign = "left";
                    if(this.contents[y][x].stackSize > 1){
                        ctx.fillText("x"+this.contents[y][x].stackSize, this.topLeftX + 12.5 + 3+ ((boxWidth+5)*x),this.topLeftY + 65 - 3 + ((boxWidth+5)*y)+boxWidth);
                    }
                    
                }

                let l = this.contents[y][x];
                if(o.isHover(mouse.x, mouse.y)){
                    //If the mouse is hovering over this object then
    
                    if(!this.contents[y][x]){continue inner;}
                    if(this.contents[y][x] === {}){continue inner;}
                    
                    //Draw more information!

                    if(l.name === ''){
                        continue inner;
                    }

                    ctx.fillStyle = '#2c2016';
                    ctx.shadowColor = 'black';
                    ctx.shadowBlur = 3;
                    ctx.fillRect(o.info.x, o.info.y, o.info.w, o.info.h);

                    ctx.fillStyle = '#5c483a';
                    ctx.fillRect(o.info.x + 5, o.info.y + 5, o.info.w - 10, o.info.h - 10);

                    ctx.font="1.2vw Arial, Helvetica, sans-serif"; 
                    ctx.textAlign="center";
                    ctx.fillStyle= this.textStyle;
                    ctx.fillText(this.contents[y][x].name, o.info.x + (this.w/2), o.info.y + 25);

                    /*
                     * Draw the amount of items and how many items there can be!
                     */

                     

                     if(l.stackable){
                        ctx.font="17px Arial, Helvetica, sans-serif"; 
                        ctx.textAlign="left";
                        ctx.fillStyle= this.textStyle;
                        ctx.fillText("x"+this.contents[y][x].stackSize.toString(), o.topLeftX + 10, o.topLeftY - 17);
                     }
                }
            }

            
            
        }
    }

    console.log();

    /*ctx.fillStyle = '#2c2016';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 0;
    ctx.fillRect(this.topLeftX, this.topLeftY + 50, this.w, 5);*/
    ctx.restore();


}

Inventory.prototype.swapItems = function(x1,y1,x2,y2){
    let temp = this.contents[y1][x1];
    this.contents[y1][x1] = this.contents[y2][x2];
    this.contents[y2][x2] = temp;
}