/**
*** Sprite Class for all the hacker types
**/

import isMobile from '../utils/mobile-check'
import Utils from '../utils/_utils'
import EnemyPointsController from '../controllers/enemy-points-controller'
import CloseCallController from '../controllers/close-call-controller'

class Hacker extends Phaser.Sprite {

	constructor(game, x, y, label, name, startDir, mySpawnPoint){
		super(game, x, y, null)

		this.startDir = startDir
		this.keyLabel = label
		this.name = name
        this.mySpawnPoint = mySpawnPoint
		this.init()
	}

	init(){

	    this.safetile = 4
	    this.gridsize = 64

	    this.dying = false
	    this.hasKey = false
        this.isEscaping = false
        this.escapeSpawn = null
	    this.keyName = ''
	    this.basePoints = 50
        this.keyPointsMultiplier = 2
	    this.boostPointsMultiplier = 2

        this.playerRef = null
        this.hitBox = null

        this.speed = 140
        this.hasKeySpeed = 100
	    this.dashSpeed = 220
	    this.turnSpeed = 150
        this.dashProbability = 0
	    this.direction = this.startDir
	    this.lastDirection = this.current = this.direction
	    this.openDirections = []
	    this.threshold = 6

        this.huntDistance = 4
        this.dashDistance = 4


	    this.turnTimer = 0;
	    this.TURNING_COOLDOWN = 150;
	    this.RANDOM     = "random";
	    this.HUNT       = "hunt";
        this.SCATTER    = "scatter";
	    this.AVOID       = "avoid";
	    this.STOP       = "stop";

	    this.mode = this.RANDOM;

	    this.turnPoint = new Phaser.Point();
        this.scatterDestination = new Phaser.Point(8 * this.gridsize, 10 * this.gridsize);

        this.currPos = {x:0,y:0}

	    this.directions = [ null, null, null, null, null ];
	    this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];


        this.anchor.set(0.5)
        this.game.physics.arcade.enable(this)
        this.body.setSize(32, 32, 0, 0)


        if(this.name == 'dreg'){
            this.basePoints = 50
            this.huntDistance = 4
            this.dashDistance = 3
            this.speed = 140
            this.huntSpeed = 140
            this.hasKeySpeed = 95
            this.dashSpeed = 250
            this.dashProbability = 0.20
            this.scatterDestination = new Phaser.Point(0, 0)
        }
        if(this.name == 'lardmin'){
            this.basePoints = 75 
            this.huntDistance = 6
            this.dashDistance = 4
            this.speed = 160
            this.huntSpeed = 160
            this.hasKeySpeed = 90
            this.dashSpeed = 220
            this.dashProbability = 0.75
            this.scatterDestination = new Phaser.Point(0, 14 * this.gridsize);
        }
        if(this.name == 'meanboye'){
            this.basePoints = 100
            this.huntDistance = 6
            this.dashDistance = 10
            this.speed = 180
            this.huntSpeed = 300
            this.hasKeySpeed = 85
            this.dashSpeed = 200
            this.dashProbability = 0.45
            this.scatterDestination = new Phaser.Point(27 * this.gridsize, 0)
            this.mode = this.SCATTER
        }

        this.utils = new Utils(this.game)
		this.create()
	}

	create(){
        let currState = this.game.state.callbackContext
        this.playerRef = currState.player

		this.glow = new Phaser.Sprite(this.game, 0, 0, 'hacker-'+this.name+'-glow')
		this.addChild(this.glow)
		this.glow.anchor.set(0.5)
		this.glow.animations.add('idle',[0,1,0,0])
        if( this.name == 'meanboye' )this.glow.animations.add('idle',[0,1,0,1,0,0,0])
        this.glow.animations.add('has-key',[2,3,3,3])
		this.glow.animations.add('escaping',[3])
		this.glow.animations.add('death',[5,6,7,8])
		this.glow.animations.play('idle', 3, true)

        this.keyGlow = new Phaser.Sprite(this.game, 0, 0, 'hacker-'+this.name+'-glow-key')
        this.addChild(this.keyGlow)
        this.keyGlow.anchor.set(0.5)
        this.keyGlow.alpha = 0
        this.keyGlow.animations.add('idle',[0])

        this.deathExplosion = new Phaser.Sprite(this.game, 0, 0, 'hacker-death-explosion')
        this.addChild(this.deathExplosion)
        this.deathExplosion.anchor.set(0.5)
        this.deathExplosion.alpha = 0
        this.deathExplosion.animations.add('idle',[0])
        this.deathExplosion.animations.add('escape',[0,1,2,3])
        this.deathExplosionAnim = this.deathExplosion.animations.add('explode',[0,1,2,3])
        this.deathExplosionAnim.onComplete.add(()=>{
            this.deathExplosion.alpha = 0
        })

        //death shockwave
        let deathShockwaveBitmap = new Phaser.BitmapData(this.game, 'death-shockwave', 150, 150)
        deathShockwaveBitmap.circle(75, 75, 75, '#ffffff');
        this.deathShockwave = new Phaser.Sprite(this.game, 20, 0, deathShockwaveBitmap)
        this.deathShockwave.alpha = 1
        this.deathShockwave.anchor.setTo(0.5, 0.5) 
        this.deathShockwave.scale.setTo(0, 0)
        this.addChild( this.deathShockwave )
        this.deathShockwave.x -= 20

        //death shockwave w/ key
        let deathShockwaveKeyBitmap = new Phaser.BitmapData(this.game, 'death-shockwave-key', 150, 150)
        deathShockwaveKeyBitmap.circle(75, 75, 75, '#ffe88a');
        this.deathShockwaveKey = new Phaser.Sprite(this.game, 20, 0, deathShockwaveKeyBitmap)
        this.deathShockwaveKey.alpha = 1
        this.deathShockwaveKey.anchor.setTo(0.5, 0.5) 
        this.deathShockwaveKey.scale.setTo(0, 0)
        this.addChild( this.deathShockwaveKey )
        this.deathShockwaveKey.x -= 20

        //death shockwave from boost
        let deathShockwaveBoostBitmap = new Phaser.BitmapData(this.game, 'death-shockwave-boost', 150, 150)
        deathShockwaveBoostBitmap.circle(75, 75, 75, '#20f3f2');
        this.deathShockwaveBoost = new Phaser.Sprite(this.game, 20, 0, deathShockwaveBoostBitmap)
        this.deathShockwaveBoost.alpha = 1
        this.deathShockwaveBoost.anchor.setTo(0.5, 0.5) 
        this.deathShockwaveBoost.scale.setTo(0, 0)
        this.addChild( this.deathShockwaveBoost )
        this.deathShockwaveBoost.x -= 20


		this.hackerSprite = new Phaser.Sprite(this.game, 0, 0, this.keyLabel)
		this.addChild(this.hackerSprite)
		this.hackerSprite.anchor.set(0.5)

		this.eye = new Phaser.Sprite(this.game, 0, 0, 'hacker-eye')
		this.addChild(this.eye)
		this.eye.anchor.set(0.5)
		this.eye.y = 1
		this.eye.animations.add('up',[0])
		this.eye.animations.add('right',[1])
		this.eye.animations.add('down',[2])
		this.eye.animations.add('left',[3])

        this.hackerSprite.animations.add('idle',[0,1,0,0])
		if( this.name == 'meanboye' )this.hackerSprite.animations.add('idle',[0,1,0,1,0,0,0])

		this.hackerSprite.animations.add('has-key',[2,3,3,3])
        this.hackerSprite.animations.add('escaping',[3])
		this.deathAnimation = this.hackerSprite.animations.add('death',[5,6,7,8])
    	this.deathAnimation.onComplete.add(()=>{
            this.hackerSprite.alpha = 0
    		this.glow.alpha = 0
    	})		
		this.hackerSprite.animations.play('idle', 3, true)

		//create collision hitbox for hacher
		this.hitBox = new Phaser.Sprite(this.game, 0, 0, null)
		this.game.physics.arcade.enable(this.hitBox)
		this.addChild(this.hitBox)
		this.hitBox.body.setSize(40, 40, -20, -20)

        let ecsapeBGBitmap = new Phaser.BitmapData(this.game, 'ecsape-bg', 75, 30)
        ecsapeBGBitmap.rect( 0, 0, 75, 30,'#f8d959')
        this.ecsapeBG = new Phaser.Sprite(this.game, 0, 0, ecsapeBGBitmap)
        this.ecsapeBG.alpha = 0     
        this.ecsapeBG.anchor.set(0.5,0.5)
        this.addChild(this.ecsapeBG)

        this.pointsController = new EnemyPointsController(this.game, this, this.name)
        this.closeCallController = new CloseCallController(this.game)

        this.getKeySnd = new Howl({src: ['audio/get_key2.mp3','audio/get_key2.ogg']})
        this.enemyDeathSnd = new Howl({src: ['audio/enemy_death.mp3','audio/enemy_death.ogg']})
        this.deathWithKeySnd = new Howl({src: ['audio/death_with_key.mp3','audio/death_with_key.ogg']})

		this.move(this.direction)	

	}

	//called every frame
	update(){

		let currState = this.game.state.callbackContext

		this.game.physics.arcade.collide(this, currState.layer);

        //this.checkDistanceToKeys()
        //this.checkDistanceToPlayer()

        //movement code
        var x = this.game.math.snapToFloor(Math.floor(this.x), this.gridsize) / this.gridsize;
        var y = this.game.math.snapToFloor(Math.floor(this.y), this.gridsize) / this.gridsize;

        if (this.x < 0) {
            this.x = currState.map.widthInPixels - 2;
        }
        if (this.x >= currState.map.widthInPixels - 1) {
            this.x = 1;
        }   

        if (this.game.math.fuzzyEqual((x * this.gridsize) + (this.gridsize /2), this.x, this.threshold) &&
           this.game.math.fuzzyEqual((y * this.gridsize) + (this.gridsize /2), this.y, this.threshold) && (!this.dying)) {
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

    /**
    *** Return an array of the new possible directions the
    *** hacker can travel when they reach an intersection
    **/    
    possibleDirections(){
        
        let nextDirections = []

        if( this.directions[1].index == this.safetile && this.opposites[this.current] != Phaser.LEFT ) nextDirections.push(Phaser.LEFT)
        if( this.directions[2].index == this.safetile && this.opposites[this.current] != Phaser.RIGHT ) nextDirections.push(Phaser.RIGHT)
        if( this.directions[3].index == this.safetile && this.opposites[this.current] != Phaser.UP ) nextDirections.push(Phaser.UP)
        if( this.directions[4].index == this.safetile && this.opposites[this.current] != Phaser.DOWN ) nextDirections.push(Phaser.DOWN)

        return nextDirections
    }

    /**
    *** Choose next direction and movement behavior
    **/  
	chooseNextDirection(possibleExits){
        
        let bestDecision = this.current
        let x = this.game.math.snapToFloor(Math.floor(this.x), this.gridsize) / this.gridsize;
        let y = this.game.math.snapToFloor(Math.floor(this.y), this.gridsize) / this.gridsize;
        
        this.hackerDestination = this.getHackerDestination();

        switch(this.mode){
            case this.RANDOM:
                if (this.turnTimer < this.game.time.time){
                    let select = Math.floor(Math.random() * possibleExits.length);
                    let direction = possibleExits[select];

                    this.turnPoint.x = (x * this.gridsize) + (this.gridsize / 2);
                    this.turnPoint.y = (y * this.gridsize) + (this.gridsize / 2);

                    // snap to grid exact position before turning
                    this.x = this.turnPoint.x;
                    this.y = this.turnPoint.y;

                    this.body.reset(this.turnPoint.x, this.turnPoint.y);
                    bestDecision = direction;  

                    this.turnTimer = this.game.time.time + this.TURNING_COOLDOWN;                  
                }

            break;

            case this.HUNT:
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
                        let dist = this.hackerDestination.distance(decision);
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

            case this.AVOID:
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

                        let dist = this.hackerDestination.distance(decision);
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

            case this.SCATTER:
                this.hackerDestination = new Phaser.Point(this.scatterDestination.x, this.scatterDestination.y);
                this.mode = this.HUNT;            
            break;

            case this.TO_SPAWN:
            break;

            case this.STOP:
            break;
        }

        return bestDecision		
	}


    getHackerDestination(){
    	//let currState = this.game.state.callbackContext
        //return currState.player.getPosition()

        if( this.checkDistanceToKeys() && !this.hasKey ){
            this.mode = this.HUNT
            return this.checkDistanceToKeys()
        }
        else if( this.hasKey ){
            this.mode = this.HUNT
            return this.mySpawnPoint.getPosition()
        }
        else if( !this.hasKey && this.checkDistanceToPlayer() && this.getDashProbability() ){
            this.mode = this.AVOID
            return this.getAvoidPos()
        }
        else{
            this.mode = this.RANDOM
            new Phaser.Point(this.scatterDestination.x, this.scatterDestination.y)
        }
    }

    /**
    *** Update speed and direction of the hackbots
    **/  
    move(direction) {
            let speed = ( this.hasKey ) ? this.hasKeySpeed : this.speed
            speed = ( this.mode == this.AVOID ) ? this.dashSpeed : speed
            speed = ( this.mode == this.HUNT && this.name == 'meanboye' && !this.hasKey ) ? this.huntSpeed : speed
            
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

            this.updateEyeAnimation(direction)
    }

    /**
    *** Check the hackbot's distance from the keys
    **/  
    checkDistanceToKeys(){
        let self = this
        let keyPositions = this.getKeyPos()
        let keyPos = null
        
        keyPositions.forEach((_keyPos)=>{
            let dist = _keyPos.distance( { x:self.x, y:self.y } )
            if(dist < self.huntDistance * self.gridsize){
               keyPos = _keyPos
            }
        })
        return keyPos
    }

    /**
    *** Check the hackbot's distance from the player
    **/  
    checkDistanceToPlayer(){
        let currState = this.game.state.callbackContext
        let playerPos = currState.player.getPosition()
        let dist = playerPos.distance( { x:this.x, y:this.y } )
        if(dist < this.dashDistance * this.gridsize){
            return true
        }

        return false
    }

    /**
    *** Calculate the liklihood of the hackbot performing 
    *** a dash escape. 
    **/  
    getDashProbability(){
        let randProb = Math.random()

        if( this.dashProbability >= randProb ){
            return true
        }
        return false
    }

    /**
    *** Return a position on the game board for the 
    *** enemy to avoid.
    **/  
    getAvoidPos(){
        let currState = this.game.state.callbackContext
        let playerPos = currState.player.getPosition()

        let avoidPosX = ( playerPos.x < this.x ) ? 500*Math.random() : -500*Math.random()
        let avoidPosY = ( playerPos.y < this.y ) ? 500*Math.random() : -500*Math.random()

        return new Phaser.Point(avoidPosX, avoidPosY)
    }

    /**
    *** Return an array of the key positions
    **/  
    getKeyPos(){
        let keyPos = [] 
        let currState = this.game.state.callbackContext

        for(let keyName in currState.keys){
            let key = currState.keys[keyName]

            if( !key.keyCaptured ){
                keyPos.push( key.getPosition() )
            }
        }
        return keyPos
    }

    updateEyeAnimation(direction){
    	if( Phaser.UP == direction ){
    		this.eye.animations.play('up', 1, true)
    	}
    	if( Phaser.LEFT == direction ){
    		this.eye.animations.play('left', 1, true)
    	}
    	if( Phaser.DOWN == direction ){
    		this.eye.animations.play('down', 1, true)
    	}
    	if( Phaser.RIGHT == direction ){
    		this.eye.animations.play('right', 1, true)
    	}    	    	    	
    }

    capturedKey(keyName){
    	this.hasKey = true
    	this.keyName = keyName
    	this.hackerSprite.animations.play('has-key', 6, true)
    	this.glow.animations.play('has-key', 6, true)
        this.game.add.tween(this.keyGlow).to( { alpha:1 }, 250, Phaser.Easing.Quadratic.Out, true)
        this.getKeySnd.play()
    }

    /**
    *** Update system when the hackbot has died
    **/  
    die( ignorePause = false ){
    	let self = this
        let particleDelay = !ignorePause ? 170 : 0
        let points = this.basePoints * ( this.hasKey ? this.keyPointsMultiplier : 1 ) * ( this.playerRef.inBoost ? this.boostPointsMultiplier : 1 )        
        let scaleTweenEasing = !ignorePause ? Phaser.Easing.Quadratic.In : Phaser.Easing.Quadratic.Out
        let shockwave = this.deathShockwave
        let shockwaveScale = 1.5
        let shakeIntensity = 0.005

        if( !this.dying ){

            // in case an enemy dies right before escaping
            if( this.isEscaping ){
                this.escapeSpawn.enemyReturning = false
                this.escapeSpawn.animations.play('close', 12, false)
                this.escapeSpawn.spawnPointBoost.animations.play('close', 12, false)
            }

            this.dying = true
            this.stopMovement()
            this.enemyDeathSnd.play()

            if( this.playerRef.inBoost ){
                shockwave = this.deathShockwaveBoost
                shockwaveScale = 3
                shakeIntensity = 0.02
            }

            if( this.hasKey ){
                let currState = this.game.state.callbackContext
                this.keyGlow.alpha = 0
                let x = this.game.math.snapToFloor(Math.floor(this.x), this.gridsize) + this.gridsize/2;
                let y = this.game.math.snapToFloor(Math.floor(this.y), this.gridsize) + this.gridsize/2;
                //let newKeyPos = new Phaser.Point(this.x, this.y)
                //console.log(this.keyName+' | x:'+x+' y:'+y)
                this.utils.setTimeout(()=>{
                    this.deathWithKeySnd.play()
                },100) 
                currState.reviveKey( this.keyName, {x:x, y:y} )
                shockwave = this.deathShockwaveKey
                shockwaveScale = 3
                shakeIntensity = 0.01
            }

            this.pointsController.animatePoints( points, ignorePause )
            this.game.scoreBonusController.addCount( points, ignorePause)

            this.hackerSprite.animations.play('death', 14, false) 
            this.glow.animations.play('death', 14, false)
            this.playerRef.animations.play('hit-enemy', 1, true)

            let shockWaveTween = self.game.add.tween(shockwave.scale).to( { x: shockwaveScale, y: shockwaveScale }, 350, scaleTweenEasing, true, 0)
            self.game.add.tween(shockwave).to( { alpha: 0.5 }, 350, Phaser.Easing.Quadratic.Out, true, 0)
            let shockWaveFadeTween = self.game.add.tween(shockwave).to( { alpha:0 }, 250, Phaser.Easing.Quadratic.Out, true, 150)
            shockWaveFadeTween.onComplete.addOnce( function(){
                self.destroy()
                self.playerRef.animations.play('idle', 1, true)
            }) 

            if( !ignorePause ){
        		setTimeout(()=>{
        			self.game.paused = true
        		},0)
        		setTimeout(()=>{
        			self.game.paused = false
        		},170)
            }

            // show death particles after 400ms pause
            setTimeout(()=>{
                self.deathExplosion.alpha = 1
                self.deathExplosion.animations.play('explode', 6, false)
                self.game.camera.shake(0.005, 100);
            },particleDelay)

    		
    		this.hitBox.body.enable = false
	    	
            this.game.scoreCounter.addPoints(points)
	    	this.game.boardWipe.updateMeter(points)
	    	
	    	this.eye.alpha = 0
    	}
    }

    // stop enemy movement
    stopAfterEscape(){
        this.dying = true
        this.body.velocity.x = this.body.velocity.y = 0
    }

    stopMovement(){
        this.body.velocity.x = this.body.velocity.y = 0
    }


    /**
    *** Start the escape process when enemy
    *** reached the spawn point with the key
    **/  
    startEscape( hackerSpawnPoint ){
        let self = this

        this.escapeSpawn = hackerSpawnPoint
        let currState = this.game.state.callbackContext 
        this.isEscaping = true   
        this.stopMovement()
        this.currPos.x = this.x
        this.currPos.y = this.y
        this.hackerSprite.animations.play('escape', 1, true)
        this.glow.animations.play('escape', 1, true)
        this.deathExplosion.scale.setTo(1.5)        
        this.deathExplosion.alpha = 1
        this.deathExplosion.play('escape', 16, true)
        let shakeInterval = setInterval(()=>{ self.shake(5) }, 30)

        let fakeAlphaTween = this.game.add.tween(this.deathExplosion).to( { alpha:1 }, 850, Phaser.Easing.Quadratic.Out, true, 0)
        fakeAlphaTween.onComplete.addOnce(()=>{
            clearInterval(shakeInterval)
            if( !self.dying ){
                self.hackerSprite.alpha = 0
                self.glow.alpha = 0
                self.keyGlow.alpha = 0
                self.ecsapeBG.alpha = 1
                let escapeBGTween = self.game.add.tween(self.ecsapeBG.scale).to( { x: 1.2, y: 0 }, 150, Phaser.Easing.Quadratic.Out, true, 0)
                escapeBGTween.onComplete.addOnce(()=>{
                    if( !self.dying ){
                        self.hitBox.body.enable = false
                        self.escapeSpawn.enemyReturning = false
                        self.escapeSpawn.animations.play('close', 12, false)
                        currState.loseGame()
                    }
                    else{
                        self.closeCallController.show()
                    }
                })
            }            
        })
    }

    shake(intensity){
        this.x = this.currPos.x + Math.random() * this.utils.randomRange(-1*intensity ,intensity)
        this.y = this.currPos.y + Math.random() * this.utils.randomRange(-1*intensity ,intensity)
    }

    render(){
        //  Un-comment this to see the debug drawing

        /*for (var t = 1; t < 5; t++)
        {
            if (this.directions[t] === null)
            {
                continue;
            }

            var color = 'rgba(0,255,0,0.6)';

            if (this.directions[t].index !== this.safetile)
            {
                color = 'rgba(0,0,0,0.6)';
            }

            if (t === this.current)
            {
                color = 'rgba(255,255,255,0.6)';
            }

            this.game.game.debug.geom(new Phaser.Rectangle(this.directions[t].worldX, this.directions[t].worldY, 32, 32), color, true);
        }

        this.game.game.debug.geom(this.turnPoint, '#ffff00');*/    	
    }	
}

export default Hacker