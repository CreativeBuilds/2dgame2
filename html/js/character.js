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