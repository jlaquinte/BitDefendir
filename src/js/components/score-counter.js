/**
*** Component Class for showing the score during gameplay
**/

class ScoreCounter extends Phaser.Group{
	
	constructor(game, parent, name, addToStage){
		super(game, parent, name, addToStage)

		this.game = game
		this.width = this.game.width
		this.sixCharScore = false
		this.sevenCharScore = false


		this.totalPoints = 0
		this.init()
	}

	init(){

		let style = { font: "30px DDCHardware-Compressed", fill: "#f200ff", align: "left" }

		this.highScoreLabelText = new Phaser.Text(this.game, (this.game.width / 2) - 80, 25, 'HI SCORE:', style)
		this.highScoreCountText = new Phaser.Text(this.game, (this.game.width / 2) + 16, 25, '00000', style)
		
		style.font = '55px DDCHardware-Regular'
		this.scoreCountText = new Phaser.Text(this.game, 0, 60, '0000', style)		
		this.addChild( this.highScoreLabelText )
		this.addChild( this.highScoreCountText )
		this.addChild( this.scoreCountText )

		this.scoreCountText.x = (this.game.width / 2) - (this.scoreCountText.width / 2)

		this.game.add.existing(this)
	}

	addPoints(_amount){

		let amount = parseInt(_amount)
		this.totalPoints = this.totalPoints + amount

		this.updateCount( this.totalPoints )
	}

	resetScore(){
		this.scoreCountText.text = '0000'
		this.scoreCountText.x = (this.game.width / 2) - (this.scoreCountText.width / 2)
	}

	updateHighScore(){
		let currHighest = this.game.currHighScores[0]
		let padding = 7
		
		if(currHighest.length == 4) currHighest = '0'+currHighest

		// dynamically center high score
		this.highScoreLabelText.x = (this.game.width / 2) - (this.highScoreLabelText.width / 2) - (this.highScoreCountText.width / 2) - padding
		this.highScoreCountText.x = this.highScoreLabelText.x + this.highScoreLabelText.width + padding
		
		this.highScoreCountText.text = currHighest
	}

	calcHighScores(){
		let currHighScoresIntArray = []
		
		this.game.currHighScores.forEach((score)=>{
			currHighScoresIntArray.push( parseInt(score) )
		})

		currHighScoresIntArray.push( parseInt(this.scoreCountText.text) )
		currHighScoresIntArray.sort(function(a, b){return b - a})
		currHighScoresIntArray.pop()

		this.game.currHighScores = []

		currHighScoresIntArray.forEach((intScore)=>{
			let scoreString = intScore.toString()

			if(scoreString.length == 1)
			scoreString = '000'+scoreString
			if(scoreString.length == 2)
			scoreString = '00'+scoreString
			if(scoreString.length == 3)
			scoreString = '0'+scoreString
			this.game.currHighScores.push( scoreString )
		})

		return( this.game.currHighScores )
	}

	checkNewHighScore(){
		let newHighScoreIndex = null
		this.game.currHighScores.forEach((score,index)=>{
			if( parseInt(this.scoreCountText.text) == parseInt(score) && parseInt(this.scoreCountText.text) != 0){
				newHighScoreIndex = index
			}
		})
		return newHighScoreIndex
	}

	updateCount( totalPoints ){


		let amountString = totalPoints.toString()
		if(amountString.length == 2)
			amountString = '00'+amountString
		if(amountString.length == 3)
			amountString = '0'+amountString	
		if(amountString.length == 6 && !this.sixCharScore){
			this.scoreCountText.fontSize = this.scoreCountText.fontSize - 8
			this.scoreCountText.y = 65
			this.sixCharScore = true
		}
		if(amountString.length == 7 && !this.sevenCharScore){
			this.scoreCountText.fontSize = this.scoreCountText.fontSize - 8
			this.scoreCountText.y = 70
			this.sevenCharScore = true
		}	
		this.scoreCountText.text = amountString
		
		// center score
		this.scoreCountText.x = (this.game.width / 2) - (this.scoreCountText.width / 2)
	}


}

export default ScoreCounter