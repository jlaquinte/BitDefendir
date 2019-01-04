/**
*** Component Class for showing the game clock
**/

class GameClock extends Phaser.Group{
	constructor(game, parent, name, addToStage){
		super(game, parent, name, addToStage)

		this.game = game
		this.x = this.game.width / 2 - 15
		this.y = this.game.height - 45		
		this.timeInSceonds = 0
		this.timeText = ""
		this.gameStarted = false
		this.paused = false
		this.mainGameActive = false
		this.game.add.existing(this)

		this.init()
	}

	init(){
		let self = this

		//061124
		let clockBGBitmap = new Phaser.BitmapData(this.game, 'clock-bg', 1000, 1000)
		clockBGBitmap.rect( 0, 0, 75, 34,'#061124')
		this.clockBG = new Phaser.Sprite(this.game, -22, -20, clockBGBitmap)
		this.clockBG.alpha = 1
		//this.addChild( this.clockBG )


		let style = { font: "30px DDCHardware-Compressed", fill: "#f200ff", align: "left" }
		this.timeText = new Phaser.Text(this.game, 16, 6, '00:00', style)
		//self.timeText.stroke = "#303543"
    	//self.timeText.strokeThickness = 11
    	this.timeText.anchor.setTo(0.5, 0.5) 
    	//self.timeText.y = self.timeText.y + self.timeText.height / 2
    	this.timeText.alpha = 0
		this.addChild( this.timeText )

	}

	startClock(){
		let self = this

		self.gameStarted = true
		self.fadeIn()
	}


	fadeIn(){
		let self = this

		let timeTween = self.game.add.tween( self.timeText ).to( { alpha: 1 }, 350, Phaser.Easing.Quadratic.Out, true, 0)
		timeTween.onComplete.addOnce( function(){
			self.runTimeLoopUpdates()
		}, self.game)
	}

	runTimeLoopUpdates(){
		let self = this

		self.timeLoopUpdatesInterval = self.game.time.events.loop(Phaser.Timer.SECOND, function(){
			if( !self.paused && self.gameStarted ){
				
				self.timeInSceonds++				
				self.timeText.text = self.toMMSS( self.timeInSceonds )
			}
		}, self.game)		
	}


	pause(){
		let self = this

		self.paused = true
	}

	unpause(){
		let self = this

		self.paused = false
	}

	toMMSS(secs) {
	    let sec_num = parseInt(secs, 10)
	    let hours   = Math.floor(sec_num / 3600);
	    let minutes = Math.floor((sec_num - (hours * 3600)) / 60)
	    let seconds = sec_num - (hours * 3600) - (minutes * 60)

	    //if (hours   < 10) {hours   = "0"+hours;}
	    if (minutes < 10) {minutes = "0"+minutes;}
	    if (seconds < 10) {seconds = "0"+seconds;}
	    return minutes+':'+seconds;
	}

	update(){
		let self = this

	}
}


export default GameClock