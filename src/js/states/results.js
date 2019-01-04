/**
*** Class for showing the game score and results state
**/

import isMobile from '../utils/mobile-check'
import Utils from '../utils/_utils'
import ScoreCounter from '../components/score-counter'

class Results extends Phaser.State {

	//called first (even before preload)
	init(){
    
	}

	//called to load game assets
	preload(){
	
    }


    /**
    *** Loading and positioning all the visual assets 
    *** in the results scene, also audio files
    **/
	//called once preload completed
	create(){

		// for testing
		/*this.game.scoreCounter = new ScoreCounter(this.game, undefined, 'score-counter', true)
        this.game.scoreCounter.updateCount( 4019325 )
        console.log(this.game.scoreCounter)*/

        this.utils = new Utils(this.game)
        this.game.scoreCounter.game = this.game

        let scoreColors = ['#ffffff','#ffffff','#ffffff']
        
		this.score = this.game.scoreCounter.scoreCountText.text        
        let highScoreArray = this.game.scoreCounter.calcHighScores()
        this.game.scoreCounter.updateHighScore()
        this.highScoreIndex = this.game.scoreCounter.checkNewHighScore()

        this.game.tracking.customTrack('bitdefendir_results','game_event', 'high_score_'+this.game.currHighScores[0])

        // set yellow color for new high score
        if( this.highScoreIndex != null ) {
        	scoreColors[this.highScoreIndex] = '#FFF281'
        }

		
		let finalScoreFontSize = '130px'
		if ( this.score.length <= 4 ) finalScoreFontSize = '130px'
		if ( this.score.length > 4 && this.score.length <= 6 ) finalScoreFontSize = '100px'
		if ( this.score.length > 6 ) finalScoreFontSize = '86px'

		this.game.trackOne = new Howl({src: ['audio/track1.mp3','audio/track1.ogg'], loop: true, volume: 0.4})
		this.game.btnHoverSnd = new Howl({src: ['audio/btn_hover.mp3','audio/btn_hover.ogg']})        
        this.game.gameStartSnd = new Howl({src: ['audio/game_start.mp3','audio/game_start.ogg']})
        
        this.finalScoreSnd = new Howl({src: ['audio/final_score.mp3','audio/final_score.ogg']})
        this.newHighScoreSnd = new Howl({src: ['audio/new_high_score.mp3','audio/new_high_score.ogg']})
        this.normalScoreSnd = new Howl({src: ['audio/normal_score.mp3','audio/normal_score.ogg']})

        this.game.trackOne.play()

        let resultsBGBitmap = new Phaser.BitmapData(this.game, 'results-bg', this.game.width, this.game.height)
        resultsBGBitmap.ctx.fillStyle = '#02000D'
        resultsBGBitmap.ctx.beginPath()   
        resultsBGBitmap.ctx.moveTo(0,0)
        resultsBGBitmap.ctx.lineTo(this.game.width, 0)
        resultsBGBitmap.ctx.lineTo(this.game.width, this.game.height)
        resultsBGBitmap.ctx.lineTo(0, this.game.height)
        resultsBGBitmap.ctx.closePath()
        resultsBGBitmap.ctx.fill()
        this.resultsBG = new Phaser.Sprite(this.game, 0, 0, resultsBGBitmap)
        this.game.add.existing( this.resultsBG )
        
        this.blurScreen = new Phaser.Sprite(this.game, 0, 0, 'slight-blur-screen')
        this.game.add.existing( this.blurScreen )
        this.blurScreen.alpha = 0
        this.blurScreen.x = (this.game.width / 2) - (this.blurScreen.width / 2)
        this.blurScreen.y = (this.game.height / 2) - (this.blurScreen.height / 2)

		this.resultsFrame = new Phaser.Sprite(this.game, 0, 0, 'results-bg-frame')
        this.game.add.existing( this.resultsFrame )
        this.resultsFrame.alpha = 0
        this.resultsFrame.x = (this.game.width / 2) - (this.resultsFrame.width / 2)
        this.resultsFrame.y = (this.game.height / 2) - (this.resultsFrame.height / 2) - 20

		this.newHiScoreMsg = new Phaser.Sprite(this.game, 320, 520, 'new-high-score-msg')
        this.newHiScoreMsg.alpha = 0
        this.game.add.existing( this.newHiScoreMsg )

		let style = { font: "48px DDCHardware-Compressed", fill: "#FFFFFF", align: "left" }
		this.scoreLabelText = new Phaser.Text(this.game, 470, 370, 'YOUR SCORE', style)
    	this.scoreLabelText.anchor.setTo(0.5, 0.5) 
    	this.scoreLabelText.alpha = 0
        this.game.add.existing( this.scoreLabelText )

		style = { font: `${finalScoreFontSize} DDCHardware-Regular`, fill: "#FFFFFF", align: "left" }
		this.scoreText = new Phaser.Text(this.game, 470, 460, this.score, style)
    	this.scoreText.anchor.setTo(0.5, 0.5)
    	this.scoreText.scale.setTo(0.75, 0.75)
    	this.scoreText.alpha = 0
        this.game.add.existing( this.scoreText )


		style = { font: "48px DDCHardware-Compressed", fill: scoreColors[0], align: "left" }
		this.oneText = new Phaser.Text(this.game, 770, 370, '1', style)
    	this.oneText.anchor.setTo(0.5, 0.5) 
    	this.oneText.alpha = 0
        this.game.add.existing( this.oneText )

		style = { font: "48px DDCHardware-Compressed", fill: scoreColors[1], align: "left" }
		this.twoText = new Phaser.Text(this.game, 770, 455, '2', style)
    	this.twoText.anchor.setTo(0.5, 0.5) 
    	this.twoText.alpha = 0
        this.game.add.existing( this.twoText )
		
		style = { font: "48px DDCHardware-Compressed", fill: scoreColors[2], align: "left" }		
		this.threeText = new Phaser.Text(this.game, 770, 540, '3', style)
    	this.threeText.anchor.setTo(0.5, 0.5) 
    	this.threeText.alpha = 0
        this.game.add.existing( this.threeText )

		style = { font: "48px DDCHardware-Regular", fill: scoreColors[0], align: "left" }
		this.scoreOneText = new Phaser.Text(this.game, 910, 370, highScoreArray[0], style)
    	this.scoreOneText.anchor.setTo(0.5, 0.5) 
    	this.scoreOneText.scale.setTo(0.75, 0.75)
    	this.scoreOneText.alpha = 0
        this.game.add.existing( this.scoreOneText )

		style = { font: "48px DDCHardware-Regular", fill: scoreColors[1], align: "left" }
		this.scoreTwoText = new Phaser.Text(this.game, 910, 455, highScoreArray[1], style)
    	this.scoreTwoText.anchor.setTo(0.5, 0.5)
    	this.scoreTwoText.scale.setTo(0.75, 0.75) 
    	this.scoreTwoText.alpha = 0
        this.game.add.existing( this.scoreTwoText )
		
		style = { font: "48px DDCHardware-Regular", fill: scoreColors[2], align: "left" }
		this.scoreThreeText = new Phaser.Text(this.game, 910, 540, highScoreArray[2], style)
    	this.scoreThreeText.anchor.setTo(0.5, 0.5) 
    	this.scoreThreeText.scale.setTo(0.75, 0.75)
    	this.scoreThreeText.alpha = 0
        this.game.add.existing( this.scoreThreeText )


        this.replayBtn = new Phaser.Button(this.game, 0, 0, 'replay-btn')
        this.replayBtn.x = this.game.width / 2 - this.replayBtn.width / 2
        this.replayBtn.y = 660
        this.replayBtn.alpha = 0
        this.replayBtn.animations.add('idle',[0])
        this.replayBtn.animations.add('active',[1])
        this.replayBtn.animations.play('idle', 1, false)
        this.game.add.existing( this.replayBtn )
        this.replayBtn.onInputOver.add(()=>{
            this.replayBtn.animations.play('active', 1, false)
            this.game.btnHoverSnd.play()
        },this.game)
        this.replayBtn.onInputOut.add(()=>{
            this.replayBtn.animations.play('idle', 1, false)
        },this.game)        
        this.replayBtn.onInputDown.addOnce(()=>{
            this.game.gameStartSnd.play()
            this.restartGame()
        },this.game)

        let fadeOverlayBitmap = new Phaser.BitmapData(this.game, 'results-bg', this.game.width, this.game.height)
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

        this.animateIn()
	}

	animateIn(){
		let self = this
		
		this.game.add.tween(this.blurScreen).to( { alpha: 1 }, 1500, Phaser.Easing.Quadratic.Out, true, 500)
		
		this.game.add.tween(this.scoreLabelText).to( { alpha: 1 }, 650, Phaser.Easing.Quadratic.Out, true, 1000)
		let resultsFrameTween = this.game.add.tween(this.resultsFrame).to( { alpha: 1 }, 650, Phaser.Easing.Quadratic.Out, true, 1000)
		resultsFrameTween.onComplete.addOnce( function(){
			
			// show final score
			self.finalScoreSnd.play()
			self.game.add.tween(self.scoreText).to( { alpha: 1 }, 350, Phaser.Easing.Quadratic.Out, true, 0)
			self.game.add.tween(self.scoreText.scale).to( { x: 1, y: 1 }, 350, Phaser.Easing.Bounce.Out, true, 0)

			// show 3rd best score
			self.game.add.tween(self.threeText).to( { alpha: 1 }, 350, Phaser.Easing.Quadratic.Out, true, 1000)
			self.game.add.tween(self.scoreThreeText).to( { alpha: 1 }, 350, Phaser.Easing.Quadratic.Out, true, 1000)
			self.game.add.tween(self.scoreThreeText.scale).to( { x: 1, y: 1 }, 350, Phaser.Easing.Bounce.Out, true, 1000)
			self.utils.setTimeout(()=>{ self.normalScoreSnd.play() },1000)

			// show 2nd best score
			self.game.add.tween(self.twoText).to( { alpha: 1 }, 350, Phaser.Easing.Quadratic.Out, true, 1500)
			self.game.add.tween(self.scoreTwoText).to( { alpha: 1 }, 350, Phaser.Easing.Quadratic.Out, true, 1500)
			self.game.add.tween(self.scoreTwoText.scale).to( { x: 1, y: 1 }, 350, Phaser.Easing.Bounce.Out, true, 1500)
			self.utils.setTimeout(()=>{ self.normalScoreSnd.play() },1500)

			// show best score
			self.game.add.tween(self.oneText).to( { alpha: 1 }, 350, Phaser.Easing.Quadratic.Out, true, 2000)
			self.game.add.tween(self.scoreOneText).to( { alpha: 1 }, 350, Phaser.Easing.Quadratic.Out, true, 2000)
			self.game.add.tween(self.scoreOneText.scale).to( { x: 1, y: 1 }, 350, Phaser.Easing.Bounce.Out, true, 2000)	
			self.utils.setTimeout(()=>{ self.normalScoreSnd.play() },2000)

			if( self.highScoreIndex != null ){
				self.utils.setTimeout(()=>{ self.newHighScoreSnd.play() },2850)
				self.game.add.tween(self.newHiScoreMsg).to( { alpha: 1 }, 350, Phaser.Easing.Quadratic.Out, true, 2850)
			}

			self.game.add.tween(self.replayBtn).to( { alpha: 1 }, 350, Phaser.Easing.Quadratic.Out, true, 2500)			

		}, this.game)
	}

	restartGame(){
		let self = this

		this.game.trackOne.fade(0.5, 0, 500)

        this.game.tracking.customTrack('bitdefendir_results','click','replay')

		if( this.game.background ) this.game.background.destroy()
		if( this.game.boardWipe ) this.game.boardWipe.destroy()
		if( this.game.hackers ) this.game.hackers.destroy()
		if( this.game.gameClock ) this.game.gameClock.destroy()
		if( this.game.scoreCounter ) this.game.gameClock.destroy()

        // go back to the intro state
		let fadeOverlayTween = this.game.add.tween(this.fadeOverlay).to( { alpha: 1 }, 450, Phaser.Easing.Quadratic.Out, true, 0)
		fadeOverlayTween.onComplete.addOnce(function(){
			self.game.state.start('Intro')
		})
	}

	render(){
	}


	//called every frame
	update(){

    }
}

export default Results