/**
*** Sprite Class for the speed-boost sprite
**/


import isMobile from '../utils/mobile-check'
import Utils from '../utils/_utils'

class SpeedBoost extends Phaser.Sprite {

	constructor(game, x, y, label, name){
		super(game, x, y, null)

		this.keyLabel = label
		this.name = name		
		this.init()
	}

	init(){
		this.utils = new Utils(this.game)

        this.boostDuration = 6000
        this.isDisabled = false

		this.countdownFramerate = 1
        this.anchor.set(0.5)
        this.game.physics.arcade.enable(this)
        this.body.enable = false
        this.body.setSize(64, 64, -32, -32)	

		this.create()
	}

	create(){
		let self = this 

		this.glow = new Phaser.Sprite(this.game, 0, 0, 'speedboost-glow')
		this.addChild(this.glow)
		this.glow.anchor.set(0.5)
		this.glowTween = this.game.add.tween(this.glow).to( { alpha: 0 }, 300, Phaser.Easing.Quadratic.Out, false, 0, -1, true)

		this.speedBoostTimer = new Phaser.Sprite(this.game, 0, 0, this.keyLabel)
		this.addChild(this.speedBoostTimer)
		this.speedBoostTimer.anchor.set(0.5)

		this.countdownAnim = this.speedBoostTimer.animations.add('countdown', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30])
		this.showBoostAnim = this.speedBoostTimer.animations.add('show', [31,32,33,34,35,36,37])
		this.hideBoostAnim = this.speedBoostTimer.animations.add('hide', [37, 36, 35, 34, 33, 32, 31])
		
		this.speedBoostTimer.animations.play('countdown', this.countdownFramerate, false)

		this.countdownAnim.onComplete.add(function(){
			self.glowTween.isPaused ? self.glowTween.resume() : self.glowTween.start()
			self.body.enable = true
			self.showBoost()
		})

		this.showBoostAnim.onComplete.add(function(){
			self.utils.setTimeout(()=>{ 
				self.body.enable = false
				self.hideBoost() 
			}, self.boostDuration)
		})

		this.hideBoostAnim.onComplete.add(function(){
			self.glowTween.pause()
			self.game.add.tween(self).to( { alpha: 0 }, 150, Phaser.Easing.Quadratic.Out, true)
			self.utils.setTimeout(()=>{ 
				self.game.add.tween(self).to( { alpha: 1 }, 150, Phaser.Easing.Quadratic.Out, true)
				self.speedBoostTimer.animations.play('countdown', self.countdownFramerate, false)
			}, 2000)
		})		

        this.boostAppearSnd = new Howl({src: ['audio/boost_appear.mp3','audio/boost_appear.ogg']})
        this.boostDisappearSnd = new Howl({src: ['audio/boost_disappear.mp3','audio/boost_disappear.ogg']})

		this.game.add.existing(this)

	}

	disable(){
		this.isDisabled = true
	}

	enable(){
		this.isDisabled = false
	}

	showBoost(){
		if( !this.isDisabled ){
			this.boostAppearSnd.play()
			this.speedBoostTimer.animations.play('show', 16, false)			
		}
	}

	hideBoost(){
		if( !this.isDisabled ){
			this.boostDisappearSnd.play()
			this.speedBoostTimer.animations.play('hide', 16, false)
		}
	}


	//called every frame
	update(){


	}
}

export default SpeedBoost