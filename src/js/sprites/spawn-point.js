/**
*** Sprite Class for the hacker spawn points
**/

import isMobile from '../utils/mobile-check'
import Utils from '../utils/_utils'
import Hacker from './hacker'


class SpawnPoint extends Phaser.Sprite {

	constructor(game, x, y, label){
		super(game, x, y, 'spawn-point')

		this.init()
	}

	init(){
		this.utils = new Utils(this.game)
        this.safetile = 4;
        this.gridsize = 64;

        this.enemyReturning = false
        this.isPlayerCamping = false
        this.keyProximityMode = true

        this.anchor.set(0.5)
        this.game.physics.arcade.enable(this)
        this.body.setSize(10, 10, 27, 27)
        this.doorOpenSnd = new Howl({src: ['audio/enemy_open_door.mp3','audio/enemy_open_door.ogg']})
        this.create()	
	}

	create(){
		this.animations.add('open-close', [0,1,2,3,4,5,5,5,5,5,5,5,4,3,2,1,0])
		this.animations.add('open', [0,1,2,3,4,5])
		this.animations.add('close', [5,4,3,2,1,0])
		this.game.add.existing(this)

		this.spawnPointBoost = new Phaser.Sprite(this.game, 0,0, 'spawn-point-boost')
		this.spawnPointBoost.anchor.set(0.5)
		this.spawnPointBoost.alpha = 0
		this.spawnPointBoost.animations.add('open-close', [0,1,2,3,4,5,5,5,5,5,5,5,4,3,2,1,0])
		this.spawnPointBoost.animations.add('open', [0,1,2,3,4,5])
		this.spawnPointBoost.animations.add('close', [5,4,3,2,1,0])
		this.addChild(this.spawnPointBoost)

	}

	spawnHacker(){
		let self = this

		if( !this.enemyReturning ){
			this.animations.play('open-close', 12, false)
			this.spawnPointBoost.animations.play('open-close', 12, false)
			this.doorOpenSnd.play()
			
			// timeout to line up hacker spawn with door open animation
			this.utils.setTimeout(()=>{
				let enemyType = self.getEnemyType()
				let direction = self.pickDirection()
		        let hacker = new Hacker(self.game, self.x, self.y, 'hacker-'+enemyType, enemyType, direction, self)
		        self.game.hackers.add(hacker)
			},800)
		}
	}

	pickDirection(){
		let probability = this.game.rnd.frac()
		let direction = (probability >= 0.50) ? Phaser.RIGHT : Phaser.LEFT
		return direction
	}

	getEnemyType(){
		let enemyType = 'dreg'
	    let probability = this.game.rnd.frac()

		if( this.game.gameClock.timeInSceonds < 30 ){
			return enemyType
	    }

	    else if( this.game.gameClock.timeInSceonds >= 30 && this.game.gameClock.timeInSceonds < 60){

	    	if( probability > 0.3){ enemyType = 'dreg' } // 70%
	    	if( probability <= 0.3){ enemyType = 'lardmin' } // 30%
	    }
		else if( this.game.gameClock.timeInSceonds >= 60 && this.game.gameClock.timeInSceonds < 90){

	    	if( probability > 0.5){ enemyType = 'dreg' } // 50%
	    	if( probability <= 0.5){ enemyType = 'lardmin' } // 50%
	    }
		else if( this.game.gameClock.timeInSceonds >= 90 && this.game.gameClock.timeInSceonds < 120){

	    	if( probability > 0.40){ enemyType = 'lardmin' } // 60%
	    	if( probability <= 0.40){ enemyType = 'dreg' } // 40%
	    }
		else if( this.game.gameClock.timeInSceonds >= 120 && this.game.gameClock.timeInSceonds < 150){

	    	if( probability > 0.10 && probability < 0.60){ enemyType = 'lardmin' } 
	    	if( probability <= 0.10){ enemyType = 'dreg' } 
	    	if( probability >= 0.60){ enemyType = 'meanboye' } 
	    }
		else if( this.game.gameClock.timeInSceonds >= 150){

	    	if( probability > 0.15 && probability < 0.40){ enemyType = 'lardmin' } 
	    	if( probability <= 0.15){ enemyType = 'dreg' } 
	    	if( probability >= 0.40){ enemyType = 'meanboye' } 
	    }

		return enemyType
	}

	setIsPlayerCamping( val ){
		this.isPlayerCamping = val
	}

	getIsPlayerCamping(){
		return this.isPlayerCamping
	}

	isCloseToKey(){
		let self = this
		let isClose = false

		if( !this.keyProximityMode ) return false
		
		let keys = this.game.state.callbackContext.keys
		
		for(let key in keys){
			let keyPos = keys[key].getPosition()
			let currPos = self.getPosition()
			let distance = currPos.distance( keyPos )
			isClose = distance <= 220 ? true : false

			if( isClose ) return true
		}
		return false
	}

	disableKeyProximityMode(){
		this.keyProximityMode = false
	}

	enableKeyProximityMode(){
		this.keyProximityMode = true
	}

    getPosition() {
        return new Phaser.Point(this.x, this.y)
    }

	//called every frame
	update(){


	}
}

export default SpawnPoint