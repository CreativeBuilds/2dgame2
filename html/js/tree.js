function Tree({ bottomLeft, topRight, choppingSpeed = 5000, verify,x,y,amountOfWood = 4}){

    this.bottomLeft = bottomLeft;
    this.topRight = topRight;

    this.xOffset = viewport.offset[0];
    this.yOffset = viewport.offset[1];

    this.tool = player.inventory.equipped;

    this.started = Date.now();

    this.b = 5;
    this.h = 16;

    this.amountOfWood = amountOfWood;

    this.diff = function(num){
        if(num === 0){
            return this.xOffset - viewport.offset[0];
        } else {
            return this.yOffset - viewport.offset[1];
        }
    }

    //TODO if we add multiplier support check to see if the user that moved is us
    window.addEventListener('usermoved', function(e){
        toggle.chopping = null;
    })

    this.draw = function(){
        /*
         * Draw a bar showing how long it will take to mine it and progress, counting down;
         */
        console.log("Drawing!");

        let tool = player.inventory.equipped;

        if(tool !== this.tool){
            toggle.chopping = null;
            return;
        }

        if(!verify({x:x - this.diff(0),y:y - this.diff(1)})){
            toggle.chopping = null;
            return;
        }

        this.miningSpeed;
        if(tool.name === '' || !tool.miningSpeed){
            this.miningSpeed = 1;
        } else {
            this.miningSpeed = tool.miningSpeed;
        }

        let howLong = Math.round(choppingSpeed/this.miningSpeed);
        this.finish = this.started + howLong;

        let delta = this.finish - Date.now();

        if(delta <= 0){
            //Tree has been chopped!
            let ree =this;
            let event = new CustomEvent('treeChopped',{detail:ree});

            for(let y = this.topRight.y; y < this.bottomLeft.y; y++){
                for(let x = this.bottomLeft.x; x< this.topRight.x; x++){
                    map.updateTile({tileX:x,tileY:y,map:"map_Trees",newNum:"-1"});
                    map.updateTile({tileX:x,tileY:y,map:"map_noWalk",newNum:"-1"});
                }
            }

            window.dispatchEvent(event);
            toggle.chopping = null;
            return;
        }

        let multiplier = delta/howLong;


        let xLeft = this.bottomLeft.x+1;
        let yUp = this.topRight.y+1;

        let xDiff = this.topRight.x - this.bottomLeft.x - 1;

        ctx.save();
        ctx.fillStyle = 'black';

        ctx.fillRect((xLeft*32) + viewport.offset[0], (yUp*32) - this.b - this.h + viewport.offset[1], xDiff*32, this.h);

        ctx.fillStyle = 'green';

        ctx.fillRect((xLeft*32) + viewport.offset[0], (yUp*32) - this.b - this.h+ viewport.offset[1], (xDiff*32*multiplier), this.h);
        

        ctx.restore();
    }
}