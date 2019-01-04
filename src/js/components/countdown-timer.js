/**
*** Component Class for showing the countdown 
*** that starts the game
**/

import Utils from '../utils/_utils'

class CountdownTimer{
	constructor(game, countMax, callback){

		this.game = game
		this.callback = callback

		this.count = countMax

		let style = { font: "350px DDCHardware-Condensed", fill: "#f200ff", align: "center" }
		this.countText = new Phaser.Text(this.game, 15, 6, '0', style)
    	//this.countText.anchor.setTo(0.5, 0.5) 
    	this.countText.alpha = 0
    	this.game.add.existing( this.countText )

    	this.goString = 'GO!'

    	this.utils = new Utils(this.game)

        this.countBlipSnd = new Howl({src: ['audio/count_blip.mp3','audio/count_blip.ogg']})
        this.roundStartSnd = new Howl({src: ['audio/round_start.mp3','audio/round_start.ogg']})    	
	}

	start(){
		let self = this

		console.log('timer start')
		this.coundownInterval = this.game.time.events.loop(Phaser.Timer.SECOND, function(){
			
			self.showNum( self.count )
			self.count--
		})
	}
	showNum( num ){
		let self = this
		this.countText.alpha = 1

		if(this.count > 0){
			this.countBlipSnd.play()
			num = num.toString()
		}
		else{
			num = this.goString
			
			this.roundStartSnd.play()
			this.game.time.events.remove( this.coundownInterval )
			this.callback() // startGame from main.js
			this.utils.setTimeout(()=>{
				self.countText.destroy()
			}, 1200)
		}
		
		this.countText.text = num
		this.countText.x = (this.game.width / 2) - (this.countText.width / 2) 
		this.countText.y = (this.game.height / 2) - (this.countText.height / 2) 	
	}
}

export default CountdownTimer