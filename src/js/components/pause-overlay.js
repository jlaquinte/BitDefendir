/**
*** Component Class for showing the pause screen 
*** when game is paused
**/

import Utils from '../utils/_utils'

class PauseOverlay extends Phaser.Group{
	constructor(game, parent, name, addToStage){
		super(game, parent, name, addToStage)

		this.create()

		this.game.add.existing(this)
		this.utils = new Utils(this.game)
		this.isPaused = false
		this.isDisabled = false
	}

	create(){

        this.pauseInSnd = new Howl({src: ['audio/game_start.mp3','audio/game_start.ogg']})
        this.pauseOutSnd = new Howl({src: ['audio/pause_out.mp3','audio/pause_out.ogg']})		

        let overlayBitmap = new Phaser.BitmapData(this.game, 'pause-overlay', this.game.width, this.game.height)
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

        this.pauseMessage = new Phaser.Sprite(this.game, 0, 0, 'pause-message')
        this.pauseMessage.alpha = 0
        this.pauseMessage.x = (this.game.width / 2) - (this.pauseMessage.width / 2);
        this.pauseMessage.y = (this.game.height / 2) - (this.pauseMessage.height / 2);
        this.game.add.existing( this.pauseMessage )


        this.domBody = document.querySelector('body')
		this.domBody.addEventListener('keyup', this.handleHide.bind(this))
		this.pauseMessagePauseTween = null
		this.overlayPauseTween = null
		this.pauseMessageUnpauseTween = null
		this.overlayUnpauseTween = null

	}

	togglePause(){
			!this.isPaused ? this.show() : this.hide()
	}

	show(){
		let self = this

		if( !this.isDisabled ){
			this.isPaused = true
			this.game.trackTwo.pause()
			this.pauseInSnd.play()

			this.game.tracking.customTrack('bitdefendir_gameplay','click','pause')

			if( this.pauseMessageUnpauseTween ) this.pauseMessageUnpauseTween.stop()
			if( this.overlayUnpauseTween ) this.overlayUnpauseTween.stop()

			this.pauseMessagePauseTween = this.game.add.tween(this.pauseMessage).to( { alpha: 1 }, 150, Phaser.Easing.Quadratic.Out, true)
			this.overlayPauseTween = this.game.add.tween(this.overlay).to( { alpha: 0.6 }, 150, Phaser.Easing.Quadratic.Out, true)
			this.overlayPauseTween.onComplete.add(function(){
				self.game.paused = true
			})
		}
	}

	handleHide(e){
		if( e.keyCode == 80 && this.isPaused ){
			this.hide()
		}
	}

	disable(){
		this.isDisabled = true
	}

	enable(){
		this.isDisabled = false
	}

	hide(){
		let self = this

		//if( !this.isDisabled ){
			this.isPaused = false
			this.game.paused = false
			//this.domBody.removeEventListener('keyup', this.handleHide.bind(this))
			this.pauseOutSnd.play()
			let seek = this.game.trackTwo.seek()
			this.game.trackTwo.volume = 0.4		
			this.game.trackTwo.play()
			this.game.trackTwo.seek(seek)

			this.game.tracking.customTrack('bitdefendir_gameplay','click','unpause')

			if( this.pauseMessagePauseTween ) this.pauseMessagePauseTween.stop()
			if( this.overlayPauseTween ) this.overlayPauseTween.stop()

			this.pauseMessageUnpauseTween = this.game.add.tween(this.pauseMessage).to( { alpha: 0 }, 150, Phaser.Easing.Quadratic.Out, true)
			this.overlayUnpauseTween = this.game.add.tween(this.overlay).to( { alpha: 0 }, 150, Phaser.Easing.Quadratic.Out, true)
		//}
	}

}

export default PauseOverlay