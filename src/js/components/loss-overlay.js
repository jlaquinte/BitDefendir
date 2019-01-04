/**
*** Component Class for showing the loss screen
**/

import Utils from '../utils/_utils'

class LossOverlay extends Phaser.Group{
	constructor(game, parent, name, addToStage){
		super(game, parent, name, addToStage)

		this.create()

		this.game.add.existing(this)
		this.utils = new Utils(this.game)
	}

	create(){

        let overlayBitmap = new Phaser.BitmapData(this.game, 'loss-overlay', this.game.width, this.game.height)
        overlayBitmap.ctx.fillStyle = '#0c1a2c'
        overlayBitmap.ctx.beginPath()   
        overlayBitmap.ctx.moveTo(0,0)
        overlayBitmap.ctx.lineTo(this.game.width, 0)
        overlayBitmap.ctx.lineTo(this.game.width, this.game.height)
        overlayBitmap.ctx.lineTo(0, this.game.height)
        overlayBitmap.ctx.closePath()
        overlayBitmap.ctx.fill()
        this.overlay = new Phaser.Sprite(this.game, 0, 0, overlayBitmap)
        this.overlay.alpha = 0
        this.game.add.existing( this.overlay )

        let fadeOverlayBitmap = new Phaser.BitmapData(this.game, 'loss-overlay', this.game.width, this.game.height)
        fadeOverlayBitmap.ctx.fillStyle = '#02000D'
        fadeOverlayBitmap.ctx.beginPath()   
        fadeOverlayBitmap.ctx.moveTo(0,0)
        fadeOverlayBitmap.ctx.lineTo(this.game.width, 0)
        fadeOverlayBitmap.ctx.lineTo(this.game.width, this.game.height)
        fadeOverlayBitmap.ctx.lineTo(0, this.game.height)
        fadeOverlayBitmap.ctx.closePath()
        fadeOverlayBitmap.ctx.fill()
        this.fadeOverlay = new Phaser.Sprite(this.game, 0, 0, fadeOverlayBitmap)
        this.fadeOverlay.alpha = 0
        this.game.add.existing( this.fadeOverlay )

        this.keyLostMessage = new Phaser.Sprite(this.game, 0, 0, 'key-stolen-message')
        this.keyLostMessage.alpha = 0
        this.keyLostMessage.x = (this.game.width / 2) - (this.keyLostMessage.width / 2);
        this.keyLostMessage.y = (this.game.height / 2) - (this.keyLostMessage.height / 2);
        this.game.add.existing( this.keyLostMessage )

		
		this.keyLostMsgShowTween = null
		this.overlayShowTween = null
		this.keyLostMsgHideTween = null
		this.overlayHideTween = null
	}


	togglePause(){
		!this.isPaused ? this.show() : this.hide()
	}

	show(){
		let self = this
		this.game.trackTwo.pause()

		if( this.keyLostMsgHideTween ) this.keyLostMsgHideTween.stop()
		if( this.overlayHideTween ) this.overlayHideTween.stop()

		this.keyLostMsgShowTween = this.game.add.tween(this.keyLostMessage).to( { alpha: 1 }, 150, Phaser.Easing.Quadratic.Out, true)
		this.overlayShowTween = this.game.add.tween(this.overlay).to( { alpha: 0.6 }, 150, Phaser.Easing.Quadratic.Out, true)
		
		this.keyLostMsgShowTween.onComplete.add(function(){
			let fadeMessageTween = self.game.add.tween(self.keyLostMessage).to( { alpha: 0 }, 3000, Phaser.Easing.Quadratic.Out, true, 1850)
			fadeMessageTween.onComplete.add(function(){
				self.game.state.start('Results')
			})
		})

		this.game.add.tween(this.fadeOverlay).to( { alpha: 1 }, 2500, Phaser.Easing.Quadratic.Out, true, 1500)
	}

	handleHide(e){
		if( e.keyCode == 80 && this.isPaused ){
			this.hide()
		}
	}

	hide(){
		let self = this
		this.isPaused = false
		this.game.paused = false

		let seek = this.game.trackTwo.seek()
		this.game.trackTwo.volume = 0.4		
		this.game.trackTwo.play()
		this.game.trackTwo.seek(seek)

		if( this.keyLostMsgShowTween ) this.keyLostMsgShowTween.stop()
		if( this.overlayShowTween ) this.overlayShowTween.stop()

		this.keyLostMsgHideTween = this.game.add.tween(this.keyLostMessage).to( { alpha: 0 }, 150, Phaser.Easing.Quadratic.Out, true)
		this.overlayHideTween = this.game.add.tween(this.overlay).to( { alpha: 0 }, 150, Phaser.Easing.Quadratic.Out, true)
	}

}

export default LossOverlay