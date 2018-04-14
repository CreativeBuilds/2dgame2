var ctx = null;
var mapName = 'testMap';
var tileW = 32, tileH = 32;
var mapW = 0, mapH = 0;
var currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0; baseSpeed = 250;

var keysDown = {
	37 : false,
	38 : false,
	39 : false,
	40 : false
};// || e.keyCode === 87|| e.keyCode === 83|| e.keyCode ===65|| e.keyCode === 68

var viewport = {
	screen		: [0,0],
	startTile	: [0,0],
	endTile		: [0,0],
	offset		: [0,0],
	update		: function(px, py) {
		this.offset[0] = Math.floor((this.screen[0]/2) - px);
		this.offset[1] = Math.floor((this.screen[1]/2) - py);

		var tile = [ Math.floor(px/tileW), Math.floor(py/tileH) ];

		this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0]/2) / tileW);
		this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1]/2) / tileH);

		if(this.startTile[0] < 0) { this.startTile[0] = 0; }
		if(this.startTile[1] < 0) { this.startTile[1] = 0; }

		this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0]/2) / tileW);
		
		this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1]/2) / tileH);

		if(this.endTile[0] >= mapW) { this.endTile[0] = mapW-1; }
		if(this.endTile[1] >= mapH) { this.endTile[1] = mapH-1; }
	}
};

var directions = {
	up: 0,
	right: 1,
	down: 2,
	left: 3
}

var mouse = {
	x:0,
	y:0
}

var player = new Player({ xSpawn:36, ySpawn:57 });
player.inventory = new Inventory({w: innerWidth/(4*1.15), h: innerWidth/(4*1.15)+55 });


function toIndex(x, y)
{
	return((y * mapW) + x);
}

var tiles = {};

let tileset = new Image();
tileset.onerror = function(){
	//Destroy the context
	ctx = null;
	alert("Failed to load the tileset, please refresh.");
}
tileset.onload = function(){
	tilesetLoaded = true;
}
tileset.src = 'imgs/map/tilemap2.png'

let playerset = new Image();

playerset.onerror = function(){
	//Destroy the context
	ctx = null;
	alert("Failed to load the playerset, please refresh.");
}
playerset.onload = function(){
	playersetLoaded = true;
}
playerset.src = 'imgs/map/player_tilemap.png'

var loops = -1;


/* Gets the values for tiles given the tileID*/
function getSprite({ num }){
	let tileInfo = getValue({num});
	if(tileInfo.sprites.length > 0){
		//The tile is animated // t === totalTimeItTakes
		let [sprites, t] = [tileInfo.sprites, 0];

		/*
		 * This for loop adds all the durations of each 'frame' or 'sprite' and adds it to t
		 */
		for(let x = 0; x < sprites.length; x++){
			t += sprites[x].d;
		}

		/*
		 * Remainder is equal to the time determining which frame is picked
		 */
		let remainder = Date.now() % t;

		let x = 0;
		let lastTime = 0;

		/*
		 * While the duration of the current frame and all the frames before it are less than
		 * the remainder then it will move to the next frame
		 */

		while(sprites[x].d + lastTime < remainder){
			
			lastTime += sprites[x].d;
			x++;

		}

		let currentFrame = sprites[x];

		return currentFrame;
		
	}
}
function getValue({ num }){
	let columns = 9;
    num = parseInt(num);
    x = num % columns;
    y = Math.floor(num/9);

    //console.log(x, y);

    if( x >= 0 && x <= 2 && y >= 0 && y <= 2){
        //It's a grass tile!
        return {'type':'grass','x':x,'y':y, 'tileInfo':tileTypes['grass'], sprites:[{x:x*32,y:y*32,w:32,h:32,d:200}]}
    } else if( x >= 3 && x <= 5 && y >= 0 && y <= 2){
        //It's a path tile!
        return {'type':'path','x':x,'y':y, 'tileInfo':tileTypes['path'], sprites:[{x:x*32,y:y*32,w:32,h:32,d:200}]}
    } else if( x >= 6 && x <= 8 && y >= 0 && y <= 2){
		//It's a water tile!
        return {'type':'water','x':x,'y':y, 'tileInfo':tileTypes['water'], sprites:[{x:x*32,y:y*32,w:32,h:32,d:500},{x:x*32,y:(y+3)*32,w:32,h:32,d:350},{x:x*32,y:(y+6)*32,w:32,h:32,d:200},{x:x*32,y:(y+9)*32,w:32,h:32,d:500}]}
    }  else if( x >= 0 && x <= 3 && y >= 3 && y <= 6){
		//It's a tree tile!
        return {'type':'tree','x':x,'y':y, 'tileInfo':tileTypes['tree'], sprites:[{x:x*32,y:y*32,w:32,h:32}]}
    } else {
		console.log("CONFLICT!", x, y);
	}
}

function Map(mapName){


	this.image = null;
	this.lastImage = null;

	let image = null;

	this.map = require(__dirname + `/maps/${mapName}.json`);
	/*
	 * Nowalk is restricting where the player can walk
	 */
	this.map_noWalk = require(__dirname + `/maps/${mapName}_noWalk.json`);
	/*
	 * Z2-T is where trees/bushes are
	 */
	this.map_Trees = require(__dirname + `/maps/${mapName}_Z2-T.json`);

	mapW = this.map[0].length, mapH = this.map.length; 

	let glob = this;
	this.values = getValue;

	this.draw = function(map){
		for(let y = viewport.startTile[1]; y <= viewport.endTile[1]; ++y)
		{
			inner: for(let x = viewport.startTile[0]; x <= viewport.endTile[0]; ++x)
			{
				/*
				 * Get the tile type using this.values[this.map[y][x]].sprite
				 */
				let num = parseInt(map[y][x]);
				if(num === -1){continue inner;}
				
				let tile = getSprite({ num });
				ctx.drawImage(tileset, tile.x,tile.y,tile.w,tile.h, viewport.offset[0]+(x*tileW),viewport.offset[1]+(y*tileH),tileW,tileH);
			}
		}
		
	}

	this.canWalk = function(x,y){
		//Takes coordinates in tiles not pixels
		if(this.map_noWalk[y][x] === "0"){ return false; }else {
			return (this.values({num:this.map[y][x]}).tileInfo.canWalk);
		}
		
	}
	
}


let map = new Map(mapName);
let inventoryOpen = false;


window.onload = function()
{
	ctx = document.getElementById('game').getContext("2d");

	document.getElementById('game').width = window.innerWidth;
	document.getElementById('game').height = window.innerHeight;
	
	
	ctx.font = "bold 10pt sans-serif";

	//TODO redo the keydown system

	let running = false;
	window.addEventListener("keydown", function(e) {
		if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = true; }
		if(e.keyCode === 16 && !running){
			player.delayMove = player.delayMove / 1.5;
			running = true;
			console.log("Speed up!")
		}
		if(e.keyCode === 73 && !inventoryOpen){
			inventoryOpen = true;
		} else if(e.keyCode === 73 && inventoryOpen || e.keyCode === 27 && inventoryOpen){
			inventoryOpen = false;
		}
	});
	window.addEventListener("keyup", function(e) {
		if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = false; }
		if(e.keyCode === 16){
			player.delayMove = player.delayMove * 1.5;
			running = false;
			console.log("Slow down!");
		}
		
	});

	window.addEventListener("mousemove", function(e){
		mouse.x = e.pageX;
		mouse.y = e.pageY;
	})

	viewport.screen = [document.getElementById('game').width,
		document.getElementById('game').height];
	
	requestAnimationFrame(drawGame);
};

function drawGame()
{
	if(!tilesetLoaded || !playersetLoaded) { requestAnimationFrame(drawGame); return; }
	if(ctx==null) { return; }

	var currentFrameTime = Date.now();
	var timeElapsed = currentFrameTime - lastFrameTime;
	ctx.clearRect(0,0,innerWidth,innerHeight);

	var sec = Math.floor(Date.now()/1000);
	if(sec!=currentSecond)
	{
		currentSecond = sec;
		framesLastSecond = frameCount;
		frameCount = 1;
	}
	else { frameCount++; }

	if(!player.processMovement(currentFrameTime))
	{
		let oldX = player.tileFrom[0];
		let oldY = player.tileFrom[1];

		if(keysDown[38] && player.tileFrom[1]>0 && map.canWalk(player.tileTo[0], player.tileTo[1] - 1)) { player.tileTo[1]-= 1; player.direction = directions.up; }
		else if(keysDown[40] && player.tileFrom[1]<(mapH-1) && map.canWalk(player.tileTo[0], player.tileTo[1] + 1)) { player.tileTo[1]+= 1; player.direction = directions.down; }
		else if(keysDown[37] && player.tileFrom[0]>0  && map.canWalk(player.tileTo[0] - 1, player.tileTo[1])) { player.tileTo[0]-= 1; player.direction = directions.left; }
		else if(keysDown[39] && player.tileFrom[0]<(mapW-1) && map.canWalk(player.tileTo[0] + 1, player.tileTo[1])) { player.tileTo[0]+= 1; player.direction = directions.right; }
		//console.log(map.canWalk(player.tileTo[0], player.tileTo[1]));

		if(player.tileFrom[0]!=player.tileTo[0] || player.tileFrom[1]!=player.tileTo[1])
		{ player.timeMoved = currentFrameTime; }
	}

	viewport.update(player.position[0] + (player.dimensions[0]/2),
		player.position[1] + (player.dimensions[1]/2));

	map.draw(map.map);
	player.draw();
	map.draw(map.map_Trees);

	/*
	 * if inventory is open (i is pressed)
	 */
	if(inventoryOpen){
		player.inventory.draw(ctx);
	}

	ctx.fillStyle = "#ff0000";
	ctx.fillText("FPS: " + framesLastSecond, 10, 20);

	lastFrameTime = currentFrameTime;
	requestAnimationFrame(drawGame);
}