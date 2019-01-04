/**
*** Sprite Class for the key 
**/

import isMobile from '../utils/mobile-check'

class Key extends Phaser.Sprite {

	constructor(game, x, y, label, name, keyMat){
		super(game, x, y, null)

        this.xOrig = x
        this.yOrig = y
        
        this.prevX = x
        this.prevY = y 

		this.keyLabel = label
        this.name = name
        this.keyMat = keyMat

		this.init()
	}

	init(){
        this.keyCaptured = false

        this.safetile = 4
        this.gridsize = 64
        this.speed = 260
        this.turnSpeed = 150
        this.threshold = 6
        this.marker = new Phaser.Point()
        this.turnPoint = new Phaser.Point()
        this.direction = Phaser.LEFT
        this.current = this.direction
        this.directions = [ null, null, null, null, null ]
        this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ]

        this.turnTimer = 0
        this.TURNING_COOLDOWN = 150     
        this.RETURN = "return"
        this.STAY = "stay"

        this.mode = this.STAY
        this.hitBox = null

		this.glowTween = null
        
        this.anchor.set(0.5)
        this.game.physics.arcade.enable(this)
        this.body.setSize(32, 32, 0, 0)

		this.create()
	}

	create(){
		this.glow = new Phaser.Sprite(this.game, 0, 0, 'key-glow')
		this.addChild(this.glow)
		this.glow.anchor.set(0.5)

		this.keySprite = new Phaser.Sprite(this.game, 0, 0, this.keyLabel)
		this.addChild(this.keySprite)
		this.keySprite.anchor.set(0.5)

		this.glowTween = this.game.add.tween(this.glow).to( { alpha: 0 }, 1500, Phaser.Easing.Quadratic.Out, true, 0, -1, true);
	
		//create collision hitbox for hacher
		this.hitBox = new Phaser.Sprite(this.game, 0, 0, null)
		this.game.physics.arcade.enable(this.hitBox)
		this.addChild(this.hitBox)
		this.hitBox.body.setSize(40, 40, -20, -20)
        
        //FOR TESTING
        //this.hitBox.body.enable = false

		this.game.add.existing(this)
		this.move(this.direction)
	}

	disableKey(){
        this.keyCaptured = true
		this.hitBox.body.enable = false
		this.alpha = 0
	}

	enableKey(){
        this.keyCaptured = false
		this.hitBox.body.enable = true
		this.alpha = 1
	}

	setKeyPos(x,y){
		this.x = x
		this.y = y
	}

	//called every frame
	update(){
		let currState = this.game.state.callbackContext

		this.game.physics.arcade.collide(this, currState.layer);

        //movement code
        var x = this.game.math.snapToFloor(Math.floor(this.x), this.gridsize) / this.gridsize;
        var y = this.game.math.snapToFloor(Math.floor(this.y), this.gridsize) / this.gridsize;

        if (this.x < 0) {
            this.x = currState.map.widthInPixels - 2;
        }
        if (this.x >= currState.map.widthInPixels - 1) {
            this.x = 1;
        }   

        /*if( this.name = 'bottom-key'){
        	console.log( this.game.math.fuzzyEqual((x * this.gridsize) + (this.gridsize /2), this.x, this.threshold) )
        	console.log( this.game.math.fuzzyEqual((y * this.gridsize) + (this.gridsize /2), this.y, this.threshold) )
        }*/

        /*if( this.name == 'bottom-key'){
        	console.log('x:'+x+' y:'+y+' this.gridsize:'+this.gridsize+' this.x:'+this.x+' this.y:'+this.y+' this.threshold:'+this.threshold)
        }*/


        if (this.game.math.fuzzyEqual((x * this.gridsize) + (this.gridsize /2), this.x, this.threshold) &&
           this.game.math.fuzzyEqual((y * this.gridsize) + (this.gridsize /2), this.y, this.threshold)) {

            //  Update our grid sensors
            this.directions[0] = currState.map.getTile(x, y, currState.layer)
            this.directions[1] = currState.map.getTileLeft(currState.layer.index, x, y) || this.directions[1]
            this.directions[2] = currState.map.getTileRight(currState.layer.index, x, y) || this.directions[2]
            this.directions[3] = currState.map.getTileAbove(currState.layer.index, x, y) || this.directions[3]
            this.directions[4] = currState.map.getTileBelow(currState.layer.index, x, y) || this.directions[4]

            let possibleExits = this.possibleDirections()
            let nextDirection = this.chooseNextDirection(possibleExits)
            this.move(nextDirection)
        }
	}

	chooseNextDirection(possibleExits){
        
        let bestDecision = this.current
        let x = this.game.math.snapToFloor(Math.floor(this.x), this.gridsize) / this.gridsize;
        let y = this.game.math.snapToFloor(Math.floor(this.y), this.gridsize) / this.gridsize;
        
        this.keyDestination = this.getKeyDestination();
        //console.log(this.keyDestination)
        switch(this.mode){

            case this.RETURN:
            if (this.turnTimer < this.game.time.time) {
                let distanceToObj = 999999;
                let direction, decision;
                for (let i=0; i<possibleExits.length; i++) {
                    direction = possibleExits[i];
                    switch (direction) {
                        case Phaser.LEFT:
                            decision = new Phaser.Point((x-1)*this.gridsize + (this.gridsize/2), 
                                                        (y * this.gridsize) + (this.gridsize / 2));
                            break;
                        case Phaser.RIGHT:
                            decision = new Phaser.Point((x+1)*this.gridsize + (this.gridsize/2), 
                                                        (y * this.gridsize) + (this.gridsize / 2));
                            break;
                        case Phaser.UP:
                            decision = new Phaser.Point(x * this.gridsize + (this.gridsize/2), 
                                                        ((y-1)*this.gridsize) + (this.gridsize / 2));
                            break;
                        case Phaser.DOWN:
                            decision = new Phaser.Point(x * this.gridsize + (this.gridsize/2), 
                                                        ((y+1)*this.gridsize) + (this.gridsize / 2));
                            break;
                        default:
                            break;
                    }
                    let dist = this.keyDestination.distance(decision);
                    if (dist < distanceToObj) {
                        bestDecision = direction;
                        distanceToObj = dist;
                    }
                }

                this.turnPoint.x = (x * this.gridsize) + (this.gridsize / 2);
                this.turnPoint.y = (y * this.gridsize) + (this.gridsize / 2);

                // snap to grid exact position before turning
                this.x = this.turnPoint.x;
                this.y = this.turnPoint.y;                    
                this.body.reset(this.turnPoint.x, this.turnPoint.y);

                this.turnTimer = this.game.time.time + this.TURNING_COOLDOWN;
            }
            break;

            case this.STAY:
            	bestDecision = Phaser.NONE
            break;
        }
        return bestDecision		
	}

    getPosition() {
        return new Phaser.Point(this.x, this.y)
    }

	getKeyDestination(){
    	let currState = this.game.state.callbackContext
        //return currState.player.getPosition()
        return this.keyMat.getPosition()
    }

    move(direction) {

        let speed = this.speed
        this.current = direction
        
        if (this.current === Phaser.NONE) {
            this.body.velocity.x = this.body.velocity.y = 0
            return
        }

        if (direction === Phaser.LEFT || direction === Phaser.UP) {
            speed = -speed
        }
        if (direction === Phaser.LEFT || direction === Phaser.RIGHT) {
            this.body.velocity.x = speed
        } else {
            this.body.velocity.y = speed
        }
    }

    possibleDirections(){
        
        let nextDirections = []

        if( this.directions[1].index == this.safetile && this.opposites[this.current] != Phaser.LEFT ) nextDirections.push(Phaser.LEFT)
        if( this.directions[2].index == this.safetile && this.opposites[this.current] != Phaser.RIGHT ) nextDirections.push(Phaser.RIGHT)
        if( this.directions[3].index == this.safetile && this.opposites[this.current] != Phaser.UP ) nextDirections.push(Phaser.UP)
        if( this.directions[4].index == this.safetile && this.opposites[this.current] != Phaser.DOWN ) nextDirections.push(Phaser.DOWN)

        return nextDirections
    }

}

export default Key