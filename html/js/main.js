var ctx = null;
var mapName = 'testMap';
var tileW = 32, tileH = 32;
var mapW = 0, mapH = 0;
var currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0; baseSpeed = 250;

var canvas = document.querySelector('canvas');

var keysDown = {
	37 : false,
	38 : false,
	39 : false,
	40 : false
};// || e.keyCode === 87|| e.keyCode === 83|| e.keyCode ===65|| e.keyCode === 68


var toggle = {
	'mouse':{
		isDown: false,
		isLong: false,
		longTID: null,
		inventoryItem: null
	},
	'hotbar':0
}

var scrollCheck = function(e){
	console.log(e);
}

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

    return getTileForValue(x,y)
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

	let check = function(e, num){
		return e.keyCode === num;
	}

	window.addEventListener("keydown", function(e) {
		switch(e.keyCode){
			case 68:
				keysDown[39] = true;
				break;
			case 83:
				keysDown[40] = true;
				break;
			case 65:
				keysDown[37] = true;
				break;
			case 87:
				keysDown[38] = true;
				break;
		}

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

		//The user is pressing button 1
		if(check(e, 97) || check(e, 49)){
			toggle.hotbar = 0;
			player.inventory.equipped = player.inventory.contents[0][0];
		//The user is pressing button 2
		} else if(check(e, 98) || check(e, 50)){
			toggle.hotbar = 1;
			player.inventory.equipped = player.inventory.contents[0][1];
		//The user is pressing button 3
		} else  if(check(e, 99) || check(e, 51)){
			toggle.hotbar = 2;
			player.inventory.equipped = player.inventory.contents[0][2];
		//The user is pressing button 4
		} else if(check(e, 100) || check(e, 52)){
			toggle.hotbar = 3;
			player.inventory.equipped = player.inventory.contents[0][3];
		//The user is pressing button 5
		} else if(check(e, 101) || check(e, 53)){
			toggle.hotbar = 4;
			player.inventory.equipped = player.inventory.contents[0][4];
		}

		
	});
	window.addEventListener("keyup", function(e) {
		console.log(e.keyCode);
		switch(e.keyCode){
			case 68:
				keysDown[39] = false;
				break;
			case 83:
				keysDown[40] = false;
				break;
			case 65:
				keysDown[37] = false;
				break;
			case 87:
				keysDown[38] = false;
				break;
		}
		if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = false; }
		if(e.keyCode === 16){
			player.delayMove = player.delayMove * 1.5;
			running = false;
			console.log("Slow down!");
		}
		
	});

	
	window.addEventListener("mousedown", function(e){
		if(e.button !== 0){return;}
		toggle.mouse.isDown = true;
		toggle.mouse.isLong = false;
		clearTimeout(toggle.mouse.longTID);
		toggle.mouse.started = Date.now();
		toggle.mouse.longTID = setTimeout(function(){toggle.mouse.isLong = true},150);

		if(toggle.selection){
			toggle.selection.clearOnMove = true;
		}

		if(toggle.contextmenu){
			if(!toggle.contextmenu.getBox({})){
				document.getElementById("game").classList.remove('hovering');
				delete toggle.contextmenu;
			}
		}
	})

	window.addEventListener("mouseup", function(e){
		if(toggle.mouse.isDown && toggle.mouse.isLong && e.button === 0){
			toggle.mouse.isDown = false;
			toggle.mouse.isLong = false;

			if(toggle.mouse.inventoryItem){
				
				//Check to see where the mouse is and if its over another inventory slot, move the item there!;
				let newItemSlot = player.getClickedItem(mouse.x,mouse.y);
				console.log(newItemSlot);
				if(typeof newItemSlot === "undefined"){toggle.mouse.inventoryItem = null;return;}

				if(newItemSlot === toggle.mouse.inventoryItem){toggle.mouse.inventoryItem = null;return;}
				
				
				player.inventory.swapItems(newItemSlot.x,newItemSlot.y,toggle.mouse.inventoryItem.x,toggle.mouse.inventoryItem.y);
				toggle.mouse.inventoryItem = null;
			}
		} else if(toggle.mouse.isDown){
			toggle.mouse.isDown = false;
			toggle.mouse.started = 0;
			clearTimeout(toggle.mouse.longTID);
		} else if(toggle.mouse.isDown && e.button === 0){
			toggle.mouse.isDown = false;
			toggle.mouse.started = 0;
		}
	})

	window.addEventListener("mousemove", function(e){
		mouse.x = e.pageX;
		mouse.y = e.pageY;
		

		if(toggle.mouse.isDown && toggle.mouse.started && Date.now() > toggle.mouse.started + 75){
			console.log(Date.now() - toggle.mouse.started);
			toggle.mouse.isLong = true;
		} else if(toggle.mouse.isDown && inventoryOpen && toggle.mouse.started && Date.now() > toggle.mouse.started + 45){
			toggle.mouse.isLong = true;
		}

		if(toggle.selection && toggle.selection.clearOnMove){
			toggle.selection = null;
		}
		
	})

	window.addEventListener('contextmenu', function(e){
		e.preventDefault();
		let treeTile = map.getTile({x:mouse.x,y:mouse.y,map:'map_Trees'});    
		
		let x = mouse.x;
		let y = mouse.y;
		console.log((x-viewport.offset[0])/32,(y-viewport.offset[1])/32,map.getTilePos(x,y));
		if(treeTile){
			/* User right-clicked on tree! */
			let boxes = [{
				t:"Chop",
				h:36,
				hover:false,
				fontSize:18,
				x:x,
				y:y,
				clicked: function(){
					/* start chopping the tree */

					//Determine what kind of tree it is
					//TODO after we add multiple types change this
					let type = "oak";
					let choppingSpeed = 5000;

					//Based on what tree it is and what tool (if we have a tool) equiped how fast we will chop it down!
					if(toggle.contextmenu){
						toggle.chopping = new Tree({bottomLeft: this.bottomLeft, topRight: this.topRight, verify: this.verify,x:this.x,y:this.y});
						document.getElementById("game").classList.remove('hovering');
						delete toggle.contextmenu;
					}
					

				},
				verify: function({x,y}){
					/* verify if the user can chop this tree! */
					
					let tile = map.getTilePos(x,y);
					/*tree = new Array(4);
					for(let l = 0; l < tree.length; l++){
						tree.push([]);
					}*/
					let bottomLeft;
					let p = 0; //This is y
					let o = 0; //This is X
					//console.log(tile);
					map.getTile({tileX:tile.x,tileY:tile.y})
					
					while(map.getTile({tileX:tile.x,tileY:tile.y+p})){
						p++;
					}
					p -= 1;
					while(map.getTile({tileX:tile.x+o,tileY:tile.y+p})){
						//console.log("o",map.getTile({tileX:tile.x+o,tileY:tile.y+p}))
						o--;
					}
					o+=1;

					bottomLeft = {x:tile.x+o-1,y:tile.y+p+1};
					this.bottomLeft = bottomLeft;

					p = 0;
					o = 0;

					while(map.getTile({tileX:tile.x,tileY:tile.y+p})){
						p--;
					}
					p += 1;
					while(map.getTile({tileX:tile.x+o,tileY:tile.y+p})){
						o++;
					}
					o-=1;

					topRight = {x:tile.x+o+1,y:tile.y+p-1}
					this.topRight = topRight;

					/*
					 * If the user is within the area of the tree!
					 */
					if(player.tileFrom[0] >= bottomLeft.x && player.tileFrom[0] <= topRight.x && player.tileFrom[1] >= topRight.y && player.tileFrom[1] <= bottomLeft.y){
						return true;
					} else {
						return false;
					}

					map.drawTile(tile.x,tile.y);
					
				}
			}];
			toggle.contextmenu = new Contextmenu({boxes:boxes,x,y});
		}
	})


	viewport.screen = [document.getElementById('game').width,
		document.getElementById('game').height];
	
	requestAnimationFrame(drawGame);
};
let frame1 = true;

//TODO if the map gets to be so large we may need to increase the timeout time on this refresh timer! Or find a work around
var refresh = setTimeout(function(){
	location.reload();
},250)
/* Area to handle events from the socket! */

window.addEventListener('treeChopped', function(event){
	let obj = event.details;

	socket.emit('chopTree', {});
})

socket.on('connect', function(){
	socket.emit('loadmaps');
})

socket.on('map', function(){
	if(refresh){
		clearTimeout(refresh);
	}
})

socket.on('playerConnected', function(player){
	/* 
	 * Server will send us a player object
	 * this will have their position on the map
	 * image information
	 */
	
})


function drawGame()
{
	if(!tilesetLoaded || !playersetLoaded || !map.draw) { requestAnimationFrame(drawGame); return; }
	if(!map || !map.map || !map.map_Trees || !map.map_noWalk){ requestAnimationFrame(drawGame); return;}
	if(ctx==null) { return; }

	if(frame1){
		frame1 = !frame1;
		player.inventory.draw(ctx);
		player.inventory.setASlot({x:0,y:0,content:{img:{x:0,y:224,w:32,h:32},name:'axe',stackSize:1}})
	}

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
	/* draw selection */

	if(toggle.selection && toggle.selection.clearOnUpdate){
		toggle.selection = null;
	}

	if(toggle.selection){
		toggle.selection.draw();
	}
	player.draw();

	map.draw(map.map_Trees);

	if(toggle.chopping){
		toggle.chopping.draw();
	}

	player.drawHotbar();

	/*
	 * if inventory is open (i is pressed)
	 */
	if(inventoryOpen){
		player.inventory.draw(ctx);
	}

	/*
	 * If the user is holding their mouse button down
	 */
	if(toggle.mouse.isLong){
		//Checks to see if the user is holding the mouse down over an item in their inventory, and doesn't already have one selected
		if(inventoryOpen && !toggle.mouse.inventoryItem && player.getClickedItem(mouse.x,  mouse.y)){
			let test = player.getClickedItem(mouse.x,  mouse.y);
			if(test){
				if(test.name !== ''){
					toggle.mouse.inventoryItem = test;
				}
			}
		//User is holding onto an item
		} else if(inventoryOpen && toggle.mouse.inventoryItem) {
			let tile = toggle.mouse.inventoryItem.img;
			let boxWidth = player.inventory.inventorySlots[0][0].boxWidth * 0.8;
			ctx.drawImage(tileset, tile.x,tile.y,tile.w,tile.h, mouse.x - (boxWidth/2),mouse.y - (boxWidth/2),boxWidth,boxWidth);
		//Inventory is not open and the user is not holding an item
		//Check to see if the user is over any tiles
		//Make sure contextmenu isn't open!
		} else if(map.getTile({x:mouse.x, y:mouse.y,map:"map"}) && !toggle.contextmenu){
			if(!toggle.selection){
				toggle.selection = new Selection({tile1:map.getTilePos(mouse.x,mouse.y), tile2:map.getTilePos(mouse.x,mouse.y)});
				canvas.addEventListener('selection_done', function(){
					toggle.selection = null;
				})
			} else {
				toggle.selection.update(map.getTilePos(mouse.x,mouse.y));

			}
		}
	/*
	 * The mouse button is now up!
	 */
	} else if(!toggle.mouse.isDown) {
		/*
		 * Sets the selection to done, meaning any more mouse moving will not be registered and it will trigger an event
		 */
		if(toggle.selection){
			canvas.dispatchEvent(toggle.selection.done);
		}
		
	}

	if(toggle.contextmenu !== null && toggle.contextmenu && toggle.contextmenu.draw){
		console.log(toggle.contextmenu)
		toggle.contextmenu.check({});
		toggle.contextmenu.draw();
	}


	ctx.fillStyle = "#ff0000";
	ctx.fillText("FPS: " + framesLastSecond, 10, 20);

	lastFrameTime = currentFrameTime;
	requestAnimationFrame(drawGame);
}
