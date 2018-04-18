function Character({ xSpawn = 0, ySpawn = 0 , baseSpeed = 250})
{
	this.tileFrom	= [xSpawn,ySpawn]; //Position is X,y not Y,X
	this.tileTo		= [xSpawn,ySpawn];
	this.timeMoved	= 0;
	this.dimensions	= [32,32];
	this.position	= [this.tileFrom[0]*tileW,this.tileFrom[1]*tileH];
	this.delayMove	= baseSpeed;

	this.direction = directions.up;

	this.sprites = {};
	this.sprites[directions.up] = [{x:0,y:0,w:32,h:32}];
	this.sprites[directions.right] = [{x:32,y:0,w:32,h:32}];
	this.sprites[directions.down] = [{x:64,y:0,w:32,h:32}];
	this.sprites[directions.left] = [{x:96,y:0,w:32,h:32}];

}
Character.prototype.placeAt = function(x, y)
{
	this.tileFrom	= [x,y];
	this.tileTo		= [x,y];
	this.position	= [((tileW*x)+((tileW-this.dimensions[0])/2)),
		((tileH*y)+((tileH-this.dimensions[1])/2))];
};
Character.prototype.processMovement = function(t)
{
	let x = this.tileFrom[0];
	let y = this.tileFrom[1];
	let moveSpeed = this.delayMove / map.values({ num: map.map[y][x] }).tileInfo.moveSpeed;
	if(this.tileFrom[0]==this.tileTo[0] && this.tileFrom[1]==this.tileTo[1]) { return false; }

	if((t-this.timeMoved)>=moveSpeed)
	{
		this.placeAt(this.tileTo[0], this.tileTo[1]);
	}
	else
	{
		this.position[0] = (this.tileFrom[0] * tileW) + ((tileW-this.dimensions[0])/2);
		this.position[1] = (this.tileFrom[1] * tileH) + ((tileH-this.dimensions[1])/2);

		if(this.tileTo[0] != this.tileFrom[0])
		{
			var diff = (tileW / moveSpeed) * (t-this.timeMoved);
			this.position[0]+= (this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff);
		}
		if(this.tileTo[1] != this.tileFrom[1])
		{
			var diff = (tileH / moveSpeed) * (t-this.timeMoved);
			this.position[1]+= (this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff);
		}

		this.position[0] = Math.round(this.position[0]);
		this.position[1] = Math.round(this.position[1]);
	}

	if(this.playerMove){
		this.playerMove();
	}

	return true;
}
Character.prototype.draw = function(){
	//Get the image of the character facing
	
	let obj = this.sprites[this.direction][0];
	ctx.drawImage(playerset, obj.x, obj.y, obj.w, obj.h, player.position[0] + viewport.offset[0], viewport.offset[1]+ player.position[1], tileW, tileH);
	
}

Player = Character;

Player.prototype.inventory = [];
for(let y = 0; y < 5; y++){
    if(!Player.prototype.inventory[y]){
        Player.prototype.inventory.push([]);
    }
	for(let x = 0; x < 5; x++){
        if(!Player.prototype.inventory[y][x]){
            Player.prototype.inventory.push({
                'itemName':'',
                'stackSize':0,
                'maxStackSize':64
            }); 
        }
    }
}

Player.prototype.setInventory = function(newInv){
	this.inventory = newInv;
}

Player.prototype.drawHotbar = function(){
	//Draw the Border;
	/*
	 * This is the width of an inventory item
	 */
	let boxWidth = this.inventory.inventorySlots[0][0].boxWidth;

	/*
	 * w = width
	 * h = height
	 * b = border
	 */
	
	let b = 5;
	//W = border of item slots + itemSlot width * 5 for 5 slots + the border of the div
	let w = (b*6)+(boxWidth*5);
	let h = boxWidth+(b*2);

	let topLeftX = innerWidth/2 - (w/2);
	let topLeftY = innerHeight-h;

    ctx.save();
    ctx.fillStyle = '#2c2016';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    ctx.fillRect(topLeftX, topLeftY, w, h);

    //Draw the text BOX
    /*ctx.fillStyle = '#5c483a';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 3;
	ctx.fillRect(topLeftX + b, topLeftY + b, w - b*2, h-b*2);*/

	for(let x = 0; x < 5; x++){

		if(x === toggle.hotbar){
			ctx.fillStyle="#8f715d";
		} else {
			ctx.fillStyle = '#5c483a';
		}
		
		ctx.shadowColor = 'black';
		ctx.shadowBlur = 3;
		ctx.fillRect(topLeftX + b + (x*(boxWidth+5)), topLeftY + b, boxWidth, boxWidth);

		let content = player.inventory.contents[0][x]
		if(!content){continue;}

		let tile = content.img;
		ctx.drawImage(tileset, tile.x,tile.y,tile.w,tile.h, topLeftX + b + (x*(boxWidth+5)),topLeftY + b,boxWidth,boxWidth);

		ctx.fillStyle = "white";
		ctx.font = `1vw Arial, Helvetica, sans-serif`
		ctx.textAlign = "left";

		if(this.inventory.contents[0][x].stackSize > 1){
			ctx.fillText("x"+this.inventory.contents[0][x].stackSize, topLeftX + b + (x*(boxWidth+5)) + 3,topLeftY + b -3 +boxWidth);
		}
		
		
	}
	ctx.restore();
}

Player.prototype.checkInventorySlot = function(x, y){
	return this.inventory.contents[y][x];
}

Player.prototype.getClickedItem = function(x,y){
	if(x < this.inventory.topLeftX || y < this.inventory.topLeftY){return;}
	//l is equal to y; o is equal to x;
	for(let l = 0; l < this.inventory.inventorySlots.length; l++){
		for(let o = 0; o < this.inventory.inventorySlots[l].length; o++){
			let obj = this.inventory.inventorySlots[l][o];
			if(obj.x <= x && obj.x + obj.boxWidth >= x && obj.y <= y && obj.y + obj.boxWidth >= y){
				/*
				 * check to see if the item exists in the slot!
				 */
				let content = this.checkInventorySlot(o, l);
				console.log("content", content);
				content.x = o;
				content.y = l;
				return content;
			}
		}
	}
}

Player.prototype.handleMove = new CustomEvent('usermoved', this);

Player.prototype.playerMove = function(){
	window.dispatchEvent(this.handleMove);
}