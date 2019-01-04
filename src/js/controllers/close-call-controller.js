/**
*** Controller Class for showing the close call messages when you almost lose
**/

import Utils from '../utils/_utils'

class ScoreBonusController{

	constructor( game ){

		this.game = game
		this.utils = new Utils(this.game)
		this.messages = [ 'Close One!', 'Nice!',' Close Call!'] 

		this.create()
	}

	create(){
		let self = this

		this.bonusSnd = new Howl({src: ['audio/score_bonus.mp3','audio/score_bonus.ogg']})
	}

	// show close call message
	show(){
		let self = this

		let style = { font: "130px DDCHardware-Compressed", fill: "#fada6d", align: "left" }
		let tweenHoldDelay = 800

		this.game.tracking.customTrack('bitdefendir_gameplay','game_event', 'close_call')

		let message = this.messages[ Math.floor(this.messages.length * Math.random()) ]
		let messageText = new Phaser.Text(this.game, 0, 0, message, style)
    	messageText.alpha = 0
    	messageText.anchor.set(0.5,0.5)
		messageText.x = this.game.width / 2 
		messageText.y = this.game.height / 2 - 200   	
    	this.game.add.existing( messageText )

		let messageBGBitmap = new Phaser.BitmapData(this.game, 'message-bg', messageText.width - 100, messageText.height-70 )
		messageBGBitmap.rect( 0, 0, messageText.width - 100, messageText.height-70, "#fada6d")
		let messageBG = new Phaser.Sprite(this.game, 0, 0, messageBGBitmap)
		messageBG.alpha = 0  
		messageBG.x = this.game.width / 2 
		messageBG.y = this.game.height / 2 - 210 			
    	messageBG.anchor.set(0.5,0.5)	
    	this.game.add.existing( messageBG )

    	messageText.scale.setTo(0.5)

    	this.bonusSnd.play()

		let scaleTween = this.game.add.tween(messageText.scale).to( { x: 1, y: 1 }, 250, Phaser.Easing.Bounce.Out, true, 0)
		let textTweenIntro = this.game.add.tween(messageText).to( { alpha: 1 }, 250, Phaser.Easing.Quadratic.Out, true, 0)
		textTweenIntro.onComplete.addOnce(()=>{
			self.utils.setTimeout(()=>{
				messageText.destroy()
				messageBG.alpha = 0.6
				self.game.add.tween(messageBG.scale).to( { x: 1.2, y: 0 }, 150, Phaser.Easing.Quadratic.Out, true, 0)
				let messageBGTween = self.game.add.tween(messageBG).to( { alpha: 1 }, 150, Phaser.Easing.Quadratic.Out, true, 0)
				messageBGTween.onComplete.addOnce(()=>{
					messageBG.destroy()
				})
			},tweenHoldDelay)
		} ,this.game)
	}
}

export default ScoreBonusController