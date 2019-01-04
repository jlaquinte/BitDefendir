/**
*** Component Class for showing the board wipe animations
**/

import Utils from '../utils/_utils'

class BoardWipe extends Phaser.Group{
	constructor(game, parent, name, addToStage){
		super(game, parent, name, addToStage)

		this.init()
		this.totalPoints = 0
		this.stepCount = 1
		this.totalMeterSteps = 17
		this.pointsMax = 2380
		this.ratio = this.pointsMax / this.totalMeterSteps
		this.wipeActive = false
		this.game.add.existing(this)

		this.utils = new Utils(this.game)
	}

	init(){

		this.create()
	}

	create(){

		this.boardWipeSprite = new Phaser.Sprite(this.game, 0, 0, 'powerup-meter')
		this.boardWipeGlow = new Phaser.Sprite(this.game, 0, 0, 'powerup-meter-glow')

		this.boardWipeSprite.animations.add('step_1', [0])
		this.boardWipeSprite.animations.add('step_2', [1])
		this.boardWipeSprite.animations.add('step_3', [2])
		this.boardWipeSprite.animations.add('step_4', [3])
		this.boardWipeSprite.animations.add('step_5', [4])
		this.boardWipeSprite.animations.add('step_6', [5])
		this.boardWipeSprite.animations.add('step_7', [6])
		this.boardWipeSprite.animations.add('step_8', [7])
		this.boardWipeSprite.animations.add('step_9', [8])
		this.boardWipeSprite.animations.add('step_10', [9])
		this.boardWipeSprite.animations.add('step_11', [10])
		this.boardWipeSprite.animations.add('step_12', [11])
		this.boardWipeSprite.animations.add('step_13', [12])
		this.boardWipeSprite.animations.add('step_14', [13])
		this.boardWipeSprite.animations.add('step_15', [14])
		this.boardWipeSprite.animations.add('step_16', [15])
		this.boardWipeSprite.animations.add('step_17', [16])
		this.boardWipeSprite.animations.add('step_18', [17])
		this.boardWipeSprite.animations.add('ready', [18,19,19,19,20,20,20,21,21,21,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23])
		this.boardWipeSprite.animations.add('explode', [24, 25, 0])

		this.addChild(this.boardWipeGlow)
		this.addChild(this.boardWipeSprite)

		this.boardWipeSprite.x = (this.game.width / 2) - (this.boardWipeSprite.width / 2)
		this.boardWipeGlow.x = (this.game.width / 2) - (this.boardWipeGlow.width / 2)

		this.boardWipeSprite.y = this.game.height - 125
		this.boardWipeGlow.y = this.game.height - 188

		//wipe overlay
		let wipeOverlayBitmap = new Phaser.BitmapData(this.game, 'wipe-overlay', 1000, 1000)
		wipeOverlayBitmap.circle(500, 500, 500, '#f200ff');
		this.wipeOverlay = new Phaser.Sprite(this.game, 20, 0, wipeOverlayBitmap)
		this.wipeOverlay.alpha = 0
		this.wipeOverlay.anchor.setTo(0.5, 0.5) 
		this.wipeOverlay.scale.setTo(0, 0)
		this.wipeOverlay.x = (this.game.width / 2) - (this.wipeOverlay.width / 2) + 32
		this.wipeOverlay.y = (this.game.height / 2) - (this.wipeOverlay.height / 2) + 32
		this.addChild( this.wipeOverlay )

        this.boardWipeSnd = new Howl({src: ['audio/board_wipe2.mp3','audio/board_wipe2.ogg']})		

	}

	updateMeter( points ){
		this.totalPoints += points


		if(this.totalPoints >= this.ratio && this.stepCount < 18){
			this.stepCount++
			this.boardWipeSprite.animations.play('step_'+this.stepCount, 1, true)
			this.totalPoints = 0
		}

		if( this.stepCount == 18 ){
			this.boardWipeSprite.animations.play('ready', 10, true)
			this.stepCount++
			this.wipeActive = true
		}		
	}

	killAllEnemies(){
		this.game.hackers.children.forEach(( hacker )=>{
			hacker.die(true)
		})
	}

	update(){
		let self = this
		if( this.wipeActive && this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ){
			this.wipeActive = false
			this.boardWipeSnd.play()
			this.boardWipeSprite.animations.play('explode', 12, true)
			this.totalPoints = 0

			this.game.tracking.customTrack('bitdefendir_gameplay','game_event', 'board_wipe')

			// show wipe overlap animation
			let wipeOverlayTween = this.game.add.tween(this.wipeOverlay.scale).to( { x: 2, y: 2 }, 450, Phaser.Easing.Quadratic.In, true, 0)
			this.game.add.tween(this.wipeOverlay).to( { alpha: 0.7 }, 450, Phaser.Easing.Quadratic.Out, true, 0)
			wipeOverlayTween.onComplete.addOnce( function(){
				self.killAllEnemies()
				self.game.add.tween(self.wipeOverlay).to( { alpha:0 }, 350, Phaser.Easing.Quadratic.Out, true, 0)
			})

			this.utils.setTimeout(()=>{
				self.boardWipeSprite.animations.play('step_1', 1, true)
				self.stepCount = 1
				self.wipeOverlay.scale.setTo(0, 0)
			}, 1500)
		}
	}
}

export default BoardWipe