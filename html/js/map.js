function Map(mapName){


	this.image = null;
	this.lastImage = null;

	let image = null;

	this.map;

	/*
	 * Nowalk is restricting where the player can walk
	 */
	this.map_noWalk;

	/*
	 * Z2-T is where trees/bushes are
	 */
	this.map_Trees;

	let ree = this;

	$(document).ready(function(){
		$.getJSON(`/maps/${mapName}.json`, function(data){
			ree.map = data;
			$.getJSON(`/maps/${mapName}_noWalk.json`, function(data){
				ree.map_noWalk = data;
				$.getJSON(`/maps/${mapName}_Z2-T.json`, function(data){
					ree.map_Trees = data;

					mapW = ree.map[0].length, mapH = ree.map.length; 

					let glob = ree;
					ree.values = getValue;

					ree.draw = function(map){
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
					
				})
			})
		})
		
		
	})

	

	

	
}


Map.prototype.canWalk = function(x,y){
    //Takes coordinates in tiles not pixels
    if(this.map_noWalk[y][x] === "0"){ return false; }else {
        return (this.values({num:this.map[y][x]}).tileInfo.canWalk);
    }
    
}

/*
 * Takes mouse positions and returns tile
 */
Map.prototype.getTile = function({x,y, map = "map_Trees", tileX, tileY}){
    if(!tileX){
        tileX = Math.floor((x-viewport.offset[0])/tileW);
    }

    if(!tileY){
        tileY = Math.floor((y- viewport.offset[1])/tileH);
    }
    
    

    let num = parseInt(this[map][tileY][tileX]);
    if(num !== -1){
        let tile = getValue({ num });
        return tile;
    }
}

Map.prototype.getTilePos = function(x,y){
    return {
        x:Math.floor((x-viewport.offset[0])/tileW),
        y:Math.floor((y- viewport.offset[1])/tileH)
    }
}

Map.prototype.drawTile = function(x,y){
    x = (x*32) + viewport.offset[0];
    y = y*32 + viewport.offset[1];
    ctx.fillStyle="black"
    ctx.fillRect(x,y,32,32)
}

Map.prototype.updateTile = function({tileX, tileY, newNum, map}){
    this[map][tileY][tileX] = newNum;
    return this[map][tileY][tileX];
}