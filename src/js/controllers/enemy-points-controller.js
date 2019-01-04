/**
*** Controller Class for showing the points when enemy is killed
**/

import Utils from '../utils/_utils'

class EnemyPointsController {
	
	constructor( game, hacker, type ){

		this.game = game
		this.hacker = hacker
		this.type =  type

		this.currNumberText = 0
		this.color = '#ffffff'
		this.strokeColor = '#ffffff'

		this.utils = new Utils(this.game)

		this.create()
	}


	create(){
		let self = this

		switch(this.type) {
		    case 'dreg':
		        this.color = '#78f868'
				this.strokeColor = '#0e7601'
		        break;
		    case 'lardmin':
		        this.color = '#ffb11a'
				this.strokeColor = '#986400'
		        break;
		    case 'meanboye':
		        this.color = '#ff5208'
				this.strokeColor = '#782400'
		        break;
		    default:
		    	this.color = '#78f868'
				this.strokeColor = '#a13203'
		}		

		//create text
		this.pointsNumberText = []
		let style = { font: "80px DDCHardware-Regular", fill: `${this.color}`, align: "center" }

		this.pointsNumberText = new Phaser.Text(this.game, 0, 0, '000', style)
    	this.pointsNumberText.alpha = 0
		self.pointsNumberText.stroke = this.strokeColor
		self.pointsNumberText.strokeThickness = 7    	
    	this.pointsNumberText.anchor.set(0.5,0.5)
    	this.pointsNumberText.scale.setTo(0)

		let pointsBGBitmap = new Phaser.BitmapData(this.game, 'points-bg', 120, 50)
		pointsBGBitmap.rect( 0, 0, 120, 50,`${this.color}`)
		this.pointsBG = new Phaser.Sprite(this.game, 0, 0, pointsBGBitmap)
		this.pointsBG.alpha = 0  	
    	this.pointsBG.anchor.set(0.5,0.5)
	}


	animatePoints( points, isBoardWipeDeath ){
		let self = this

		let scoreHoldDelay = isBoardWipeDeath ? 400 : 200

		this.pointsNumberText.x = this.pointsBG.x = this.hacker.x
		this.pointsNumberText.y = this.hacker.y - 65
		this.pointsBG.y = this.hacker.y - 70
		this.pointsBG.width = this.pointsNumberText.width
		
		this.pointsNumberText.text = points.toString()
		this.game.add.existing(this.pointsNumberText)
		this.game.add.existing(this.pointsBG)

		let scaleTween = this.game.add.tween(this.pointsNumberText.scale).to( { x: 1, y: 1 }, 350, Phaser.Easing.Bounce.Out, true, 0)
		let textTweenIntro = this.game.add.tween(this.pointsNumberText).to( { alpha: 1 }, 350, Phaser.Easing.Quadratic.Out, true, 0)
		scaleTween.onComplete.addOnce( function(){
			self.utils.setTimeout(()=>{
				self.pointsNumberText.destroy()
				self.pointsBG.alpha = 0.6
				self.game.add.tween(self.pointsBG.scale).to( { x: 1.2, y: 0 }, 150, Phaser.Easing.Quadratic.Out, true, 0)
				let pointBGTween = self.game.add.tween(self.pointsBG).to( { alpha: 1 }, 150, Phaser.Easing.Quadratic.Out, true, 0)
				pointBGTween.onComplete.addOnce(function(){
					self.pointsBG.destroy()
				})
			},scoreHoldDelay)
		} ,this.game)
	}

}

export default EnemyPointsController