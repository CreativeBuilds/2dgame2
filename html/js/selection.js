function Selection({tile1, tile2}){
    /* X's and Y's are tile postions! */
    this.tile1 = tile1 || null;
    this.tile2 = tile2 || null;
    /* Go through and get the tiles for both mouse positions */
    this.init = function(mouseX1,mouseY1,mouseX2,mouseY2){
        this.tile1 = map.getTilePos(mouseX1,mouseY1);
        this.tile2 = map.getTilePos(mouseX2,mouseY2);
    }

    this.update = function(tile2){
        this.tile2 = tile2;
    }

    this.done = new CustomEvent('selection_done');

    /* Needs to draw an overlay of transparent green tiles to show selection */
    this.draw = function(){
        if(!this.tile1 || !this.tile2){return;}

        let start = {};
        let end = {};

        
        if(this.tile1.x < this.tile2.x){
            start.x = this.tile1.x;
            end.x = this.tile2.x;
        } else {
            start.x = this.tile2.x;
            end.x = this.tile1.x;
        }

        if(this.tile1.y < this.tile2.y){
            start.y = this.tile1.y;
            end.y = this.tile2.y;
        } else {
            start.y = this.tile2.y;
            end.y = this.tile1.y;
        }
        let yDiff = end.y - start.y;
        let xDiff = end.x - start.x;

        for(let y = 0; y < yDiff + 1; y++){
            for(let x = 0; x< xDiff + 1; x++){
                /*
                 * Detect wether or not its a border piece using x,y
                 */
                let up = false;
                let right = false;
                let down = false;
                let left = false;

                if(x === 0){
                    //It's on the left side!
                    left = true;

                } else if(x === xDiff){
                    //It's on the right side!
                    right = true;
                }

                if(y === 0){
                    //It's on the top
                    up = true;
                } else if (y === yDiff){
                    //It's on the bottom
                    down = true;
                }

                let tileXPixel;
                let tileYPixel;

                if(up){
                    tileYPixel = 0;
                } else if(down){
                    tileYPixel = 64;
                } else {
                    tileYPixel = 32;
                }

                if(left){
                    tileXPixel = 288;
                    

                } else if(right){
                    tileXPixel = 288 + 64;
                } else {
                    //Draw center
                    tileXPixel = 288 + 32;
                }

                //TODO Change getTile
                let treeTile = map.getTile({x:(start.x+x)*32+viewport.offset[0],y:(start.y+y)*32+viewport.offset[1]});
                

                if(treeTile){
                    tileYPixel += 96;
                }

                ctx.drawImage(tileset, tileXPixel,tileYPixel,tileW,tileH, viewport.offset[0]+((start.x+x)*tileW),viewport.offset[1]+((start.y+y)*tileH),tileW,tileH);
            }
        }
    }
}