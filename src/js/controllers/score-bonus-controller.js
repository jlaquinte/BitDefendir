/**
*** Controller Class for handling multiple kill bosnus
**/

import Utils from '../utils/_utils'

class ScoreBonusController{

	constructor( game ){

		this.game = game
		this.utils = new Utils(this.game)
		this.timer = null
		this.hitCount = 0
		this.interations = 0
		this.points = []
		this.elaspedTimeMax = 1 //in seconds
		this.startTime = 0

		this.create()
	}

	create(){
		let self = this

		//for testing
		/*this.utils.setTimeout(()=>{
			this.showBonusMessage([50,50,50,75],4)
		}, 6000)*/

		this.bonusSnd = new Howl({src: ['audio/score_bonus.mp3','audio/score_bonus.ogg']})
	}

	// add enemy kill count to the score bonus timer
	addCount( points, isBoardWipeDeath ){
		let self = this

		this.points.push(points)
		if( !isBoardWipeDeath ) this.hitCount++

		if( !this.timer ){
			this.timer = this.game.time.events.loop(100, ()=>{
				self.interations++
				
				if( !self.startTime ) self.startTime = self.game.time.totalElapsedSeconds()
				//console.log('timer timering')

				if(self.interations == Math.round(self.elaspedTimeMax*10) && self.hitCount < 3){
					let elapsedTime = self.game.time.totalElapsedSeconds() - self.startTime 
					//console.log('no bonus triggered')
					//console.log('time elapsed: '+elapsedTime+' elaspedTimeMax '+self.elaspedTimeMax)					
					self.points = []
					self.hitCount = 0
					self.interations = 0
					self.startTime = 0
					self.game.time.events.remove( self.timer )
					self.timer = null
					return
				}
				if( (self.game.time.totalElapsedSeconds() - self.startTime) > self.elaspedTimeMax && self.hitCount >= 3){
					let pointsForbonus = self.points
					let hitCountForbonus = self.hitCount
					self.points = []
					self.hitCount = 0
					self.interations = 0
					self.startTime = 0
					self.game.time.events.remove( self.timer )
					self.timer = null

					this.showBonusMessage( pointsForbonus, hitCountForbonus )
				}
			})
		}
	}

	showBonusMessage( pointsArray, hitCount ){
		let self = this

		// only get the difference since the base points have already been added to the score
		let totalBonusPoints = (hitCount * ( pointsArray.reduce(this.getBonusSum) ) ) - ( pointsArray.reduce(this.getBonusSum) )
		console.log('hit count: '+hitCount+' bonus for: '+pointsArray+' total points: '+totalBonusPoints)
		this.game.tracking.customTrack('bitdefendir_gameplay','game_event', 'hit_count_bonus_x_'+hitCount+'_points_'+totalBonusPoints)

		let style = { font: "130px DDCHardware-Regular", fill: "#f66bfe", stroke: "#8b0193", align: "left" }
		let tweenHoldDelay = 1000
		let padding = 15

		let xText = new Phaser.Text(this.game, 0, 0, 'x', style)
    	xText.alpha = 0
		xText.strokeThickness = 13
    	xText.anchor.set(0.5,0.5)
		xText.y = this.game.height / 2 - 190 
		xText.fontSize = 90    	
    	this.game.add.existing( xText )

		let multiplierNumText = new Phaser.Text(this.game, 0, 0, hitCount.toString(), style)
    	multiplierNumText.alpha = 0
		multiplierNumText.strokeThickness = 13
    	multiplierNumText.anchor.set(0.5,0.5)
		multiplierNumText.y = this.game.height / 2 - 210 
		multiplierNumText.fontSize = 170     	
    	this.game.add.existing( multiplierNumText )
		
		let comboBonusText = new Phaser.Text(this.game, 0, 0, 'Combo!', style)
    	comboBonusText.alpha = 0
		comboBonusText.strokeThickness = 13
    	comboBonusText.anchor.set(0.5,0.5)
		comboBonusText.y = this.game.height / 2 - 200     	
    	this.game.add.existing( comboBonusText )
		
		let bonusPointsText = new Phaser.Text(this.game, 0, 0, '+'+totalBonusPoints, style)
    	bonusPointsText.alpha = 0
		bonusPointsText.strokeThickness = 13
    	bonusPointsText.anchor.set(0.5,0.5)
		bonusPointsText.x = this.game.width / 2
		bonusPointsText.y = this.game.height / 2 - 100 
		bonusPointsText.fontSize = 80    	     	
    	this.game.add.existing( bonusPointsText ) 


		xText.x = (this.game.width / 2) - (multiplierNumText.width/2) - (comboBonusText.width/2)
		multiplierNumText.x = xText.x + (xText.width/2) + (multiplierNumText.width/2)	
		comboBonusText.x = multiplierNumText.x + (multiplierNumText.width/2) + (comboBonusText.width/2)	+ padding    	


		let widthSum = xText.width + multiplierNumText.width + comboBonusText.width

		let bonusBGBitmap = new Phaser.BitmapData(this.game, 'bonus-bg', widthSum - 100, comboBonusText.height - 20)
		bonusBGBitmap.rect( 0, 0, widthSum - 100, comboBonusText.height - 20, "#f66bfe")
		let bonusBG = new Phaser.Sprite(this.game, 0, 0, bonusBGBitmap)
		bonusBG.alpha = 0  
		bonusBG.x = this.game.width / 2 
		bonusBG.y = this.game.height / 2 - 180 			
    	bonusBG.anchor.set(0.5,0.5)	
    	this.game.add.existing( bonusBG )

    	
    	xText.scale.setTo(0.5)
    	multiplierNumText.scale.setTo(0.5)
    	comboBonusText.scale.setTo(0.7)
    	bonusPointsText.scale.setTo(0.5)

    	this.bonusSnd.play()

		this.game.add.tween(xText.scale).to( { x: 1, y: 1 }, 450, Phaser.Easing.Bounce.Out, true, 0)
		this.game.add.tween(multiplierNumText.scale).to( { x: 1, y: 1 }, 450, Phaser.Easing.Bounce.Out, true, 0)
		this.game.add.tween(comboBonusText.scale).to( { x: 1, y: 1 }, 450, Phaser.Easing.Bounce.Out, true, 0)
		let scaleTween = this.game.add.tween(bonusPointsText.scale).to( { x: 1, y: 1 }, 450, Phaser.Easing.Bounce.Out, true, 0)

		this.game.add.tween(xText).to( { alpha: 1 }, 450, Phaser.Easing.Quadratic.Out, true, 0)
		this.game.add.tween(multiplierNumText).to( { alpha: 1 }, 450, Phaser.Easing.Quadratic.Out, true, 0)
		this.game.add.tween(comboBonusText).to( { alpha: 1 }, 450, Phaser.Easing.Quadratic.Out, true, 0)
		let textTweenIntro = this.game.add.tween(bonusPointsText).to( { alpha: 1 }, 450, Phaser.Easing.Quadratic.Out, true, 0)
		textTweenIntro.onComplete.addOnce(()=>{
			self.utils.setTimeout(()=>{
				xText.destroy()
				multiplierNumText.destroy()
				comboBonusText.destroy()
				bonusPointsText.destroy()
				bonusBG.alpha = 0.6
				self.game.add.tween(bonusBG.scale).to( { x: 1.2, y: 0 }, 150, Phaser.Easing.Quadratic.Out, true, 0)
				let pointBGTween = self.game.add.tween(bonusBG).to( { alpha: 1 }, 150, Phaser.Easing.Quadratic.Out, true, 0)
				pointBGTween.onComplete.addOnce(()=>{
					self.game.scoreCounter.addPoints(totalBonusPoints)
					bonusBG.destroy()
				})
			},tweenHoldDelay)
		} ,this.game)

	}

	getBonusSum(total, num){
		return total + num
	}
}

export default ScoreBonusController