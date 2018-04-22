function Tree({ bottomLeft, topRight, choppingSpeed = 5000, verify,x,y,amountOfWood = 4}){

    this.bottomLeft = bottomLeft;
    this.topRight = topRight;

    /* These are calculated by the player based on their viewport offset */
    // this.xOffset = viewport.offset[0];
    // this.yOffset = viewport.offset[1];

    /* This is going to be needed when the tree is chopped, but that depends on the player so we dont need it for now */
    // this.tool = player.inventory.equipped;
    // this.started = Date.now();

    this.b = 5;
    this.h = 16;

    this.amountOfWood = Math.floor(Math.random() * 3) + 3  ;

    if(amountOfWood){
        //Generate between a couple numbers
        this.amountOfWood = amountOfWood
    }

    // this.diff = function(num){
    //     if(num === 0){
    //         return this.xOffset - viewport.offset[0];
    //     } else {
    //         return this.yOffset - viewport.offset[1];
    //     }
    // }

    this.isClose = function(coords){
        if(coords.x < this.bottomLeft.x || coords.x > this.topRight.x){
            return false;
        } else if(coords.y < this.topRight.y || coords.y > this.bottomLeft.y){
            return false;
        } else {
            return true;
        }
    }

    this.treeChopping = false;
    this.userChopping = null;
    this.startTime = null;

    //TODO if we add multiplier support check to see if the user that moved is us

    /* This takes a time in how long the user will take to mine it, calculate outside of this function
     * User coords
     * Test to see if user is within these coords
     * If they are then chop the tree, if not cancel
     * CALLED EVERY TICK
     * 
     * RETURN VALUES
     *  0 false, user can't chop tree
     *  1 User can chop tree, but isn't done
     *  2 User can chop tree, and has finished chopping tree
     */
    
    this.chop = function({user,miningTime}){
        if(this.userChopping){return 0;}
        if(!this.isClose(user.coords)){
            this.treeChopping = false;
            this.userChopping = null;
            return 0;
        }
        //Set miningTime to 0 if you don't want the user to mine!
        if(miningTime === 0){
            this.treeChopping = false;
            this.userChopping = null;
            return 0;
        }

        if(this.startTime === null || this.endTime === null){
            this.startTime = Date.now();
            this.endTime = Date.now() + miningTime;
        }

        if(this.endTime > Date.now()){
            return 2;
        }

        return 1;
        
    }

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

exports = Tree;