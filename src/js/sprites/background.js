/**
*** Sprite Class for grouping the background sprites
**/

import Utils from '../utils/_utils'

class Background extends Phaser.Group{
	constructor(game, parent, name, addToStage){
		super(game, parent, name, addToStage)

		this.init()
	}

	//called first (even before preload)
	init(){
		this.utils = new Utils(this.game)

        this.boostDuration = 8000
		this.frameRate = 12
		this.boostFrameRate = 12
		this.create()
	}

	//called once preload completed
	create(){

		this.normalBG = new Phaser.Group(this.game, null, 'normal-bg-group')
		this.boostBG = new Phaser.Group(this.game, null, 'boost-bg-group')

		// normal sprites
		this.bgA1 = new Phaser.Sprite(this.game, 0, 0, 'bg-A1')
		this.bgA2 = new Phaser.Sprite(this.game, 340, 0, 'bg-A2')
		this.bgA3 = new Phaser.Sprite(this.game, 680, 0, 'bg-A3')
		this.bgA4 = new Phaser.Sprite(this.game, 1020, 0, 'bg-A4')

		this.bgB1 = new Phaser.Sprite(this.game, 0, 340, 'bg-B1')
		this.bgB2 = new Phaser.Sprite(this.game, 340, 340, 'bg-B2')
		this.bgB3 = new Phaser.Sprite(this.game, 680, 340, 'bg-B3')
		this.bgB4 = new Phaser.Sprite(this.game, 1020, 340, 'bg-B4')

		this.bgC1 = new Phaser.Sprite(this.game, 0, 680, 'bg-C1')
		this.bgC2 = new Phaser.Sprite(this.game, 340, 680, 'bg-C2')
		this.bgC3 = new Phaser.Sprite(this.game, 680, 680, 'bg-C3')
		this.bgC4 = new Phaser.Sprite(this.game, 1020, 680, 'bg-C4')	

		this.bgA1.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgA2.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgA3.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgA4.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		
		this.bgB1.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgB2.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgB3.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgB4.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		
		this.bgC1.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgC2.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgC3.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgC4.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])		


		// boost sprites
		this.bgBoostA1 = new Phaser.Sprite(this.game, 0, 0, 'bg-boost-A1')
		this.bgBoostA2 = new Phaser.Sprite(this.game, 340, 0, 'bg-boost-A2')
		this.bgBoostA3 = new Phaser.Sprite(this.game, 680, 0, 'bg-boost-A3')
		this.bgBoostA4 = new Phaser.Sprite(this.game, 1020, 0, 'bg-boost-A4')

		this.bgBoostB1 = new Phaser.Sprite(this.game, 0, 340, 'bg-boost-B1')
		this.bgBoostB2 = new Phaser.Sprite(this.game, 340, 340, 'bg-boost-B2')
		this.bgBoostB3 = new Phaser.Sprite(this.game, 680, 340, 'bg-boost-B3')
		this.bgBoostB4 = new Phaser.Sprite(this.game, 1020, 340, 'bg-boost-B4')

		this.bgBoostC1 = new Phaser.Sprite(this.game, 0, 680, 'bg-boost-C1')
		this.bgBoostC2 = new Phaser.Sprite(this.game, 340, 680, 'bg-boost-C2')
		this.bgBoostC3 = new Phaser.Sprite(this.game, 680, 680, 'bg-boost-C3')
		this.bgBoostC4 = new Phaser.Sprite(this.game, 1020, 680, 'bg-boost-C4')	

		this.bgBoostA1.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgBoostA2.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgBoostA3.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgBoostA4.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		
		this.bgBoostB1.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgBoostB2.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgBoostB3.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgBoostB4.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		
		this.bgBoostC1.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgBoostC2.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgBoostC3.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])
		this.bgBoostC4.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35])		


		this.normalBG.addMultiple([this.bgA1, this.bgA2, this.bgA3, this.bgA4, this.bgB1, this.bgB2, this.bgB3, this.bgB4, this.bgC1, this.bgC2, this.bgC3, this.bgC4])
		this.boostBG.addMultiple([this.bgBoostA1, this.bgBoostA2, this.bgBoostA3, this.bgBoostA4, this.bgBoostB1, this.bgBoostB2, this.bgBoostB3, this.bgBoostB4, this.bgBoostC1, this.bgBoostC2, this.bgBoostC3, this.bgBoostC4])
		
		this.addChild(this.normalBG)
		this.addChild(this.boostBG)

		this.boostBG.alpha = 0

		this.game.add.existing(this)	
	}


	setAlpha(alpha){
		this.normalBG.children.forEach((child)=>{
			child.alpha = alpha
		})
		this.boostBG.children.forEach((child)=>{
			child.alpha = alpha
		})		
	}

	fadeIn(duration = 1500, delay = 0){
		this.normalBG.children.forEach((child)=>{
			this.game.add.tween(child).to( { alpha: 1 }, duration, Phaser.Easing.Quadratic.Out, true, delay)
		})
		this.boostBG.children.forEach((child)=>{
			this.game.add.tween(child).to( { alpha: 1 }, duration, Phaser.Easing.Quadratic.Out, true, delay)
		})
	}

	startAnimation(){
		this.bgA1.animations.play('idle', this.frameRate, true)
		this.bgA2.animations.play('idle', this.frameRate, true)
		this.bgA3.animations.play('idle', this.frameRate, true)
		this.bgA4.animations.play('idle', this.frameRate, true)
		this.bgB1.animations.play('idle', this.frameRate, true)
		this.bgB2.animations.play('idle', this.frameRate, true)
		this.bgB3.animations.play('idle', this.frameRate, true)
		this.bgB4.animations.play('idle', this.frameRate, true)
		this.bgC1.animations.play('idle', this.frameRate, true)
		this.bgC2.animations.play('idle', this.frameRate, true)
		this.bgC3.animations.play('idle', this.frameRate, true)
		this.bgC4.animations.play('idle', this.frameRate, true)	

		this.bgBoostA1.animations.play('idle', this.boostFrameRate, true)
		this.bgBoostA2.animations.play('idle', this.boostFrameRate, true)
		this.bgBoostA3.animations.play('idle', this.boostFrameRate, true)
		this.bgBoostA4.animations.play('idle', this.boostFrameRate, true)
		this.bgBoostB1.animations.play('idle', this.boostFrameRate, true)
		this.bgBoostB2.animations.play('idle', this.boostFrameRate, true)
		this.bgBoostB3.animations.play('idle', this.boostFrameRate, true)
		this.bgBoostB4.animations.play('idle', this.boostFrameRate, true)
		this.bgBoostC1.animations.play('idle', this.boostFrameRate, true)
		this.bgBoostC2.animations.play('idle', this.boostFrameRate, true)
		this.bgBoostC3.animations.play('idle', this.boostFrameRate, true)
		this.bgBoostC4.animations.play('idle', this.boostFrameRate, true)			
	}

	// returns array of all spawnpoints on stage
	getSpawnPoints(){
		let currState = this.game.state.callbackContext
		let spawnPoints = (currState.spawnPointController) ? currState.spawnPointController.spawnPointGroup.children : []
		return spawnPoints
	}

	showBoostMode(){
		let self = this

		let spawnPoints = this.getSpawnPoints()
		
		this.game.add.tween(this.boostBG).to( { alpha: 1 }, 300, Phaser.Easing.Quadratic.Out, true, 0)
		this.game.add.tween(this.normalBG).to( { alpha: 0.6 }, 300, Phaser.Easing.Quadratic.Out, true, 100)
		spawnPoints.forEach((spawnPoint)=>{
			self.game.add.tween(spawnPoint.spawnPointBoost).to( { alpha: 1 }, 300, Phaser.Easing.Quadratic.Out, true, 0)
		})

		this.utils.setTimeout(()=>{
			this.game.add.tween(this.boostBG).to( { alpha: 0 }, 1500, Phaser.Easing.Quadratic.Out, true, 0)
			this.game.add.tween(this.normalBG).to( { alpha: 1 }, 1500, Phaser.Easing.Quadratic.Out, true, 0)
			spawnPoints.forEach((spawnPoint)=>{
				self.game.add.tween(spawnPoint.spawnPointBoost).to( { alpha: 0 }, 300, Phaser.Easing.Quadratic.Out, true, 0)
			})			
		},this.boostDuration)
	}


	//called every frame
	update(){

	}
}

export default Background