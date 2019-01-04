/**
*** Class for showing the tutorial state
**/

import isMobile from '../utils/mobile-check'
import Utils from '../utils/_utils'

class Tutorial extends Phaser.State {
	//called first (even before preload)
	init(){
		this.slideIndex = 0  
		this.slides = []  
		this.nextSlideTween = null
		this.previousSlideTween = null
	}

	//called to load game assets
	preload(){
	
    }

    /**
    *** Loading and positioning all the visual assets 
    *** in the tutorial scene, also audio files
    **/
	//called once preload completed
	create(){
		this.utils = new Utils(this.game)

		this.blipSnd = new Howl({src: ['audio/count_blip.mp3','audio/count_blip.ogg']})

        let tutorialBGBitmap = new Phaser.BitmapData(this.game, 'results-bg', this.game.width, this.game.height)
        tutorialBGBitmap.ctx.fillStyle = '#02000D'
        tutorialBGBitmap.ctx.beginPath()   
        tutorialBGBitmap.ctx.moveTo(0,0)
        tutorialBGBitmap.ctx.lineTo(this.game.width, 0)
        tutorialBGBitmap.ctx.lineTo(this.game.width, this.game.height)
        tutorialBGBitmap.ctx.lineTo(0, this.game.height)
        tutorialBGBitmap.ctx.closePath()
        tutorialBGBitmap.ctx.fill()
        this.tutorialBG = new Phaser.Sprite(this.game, 0, 0, tutorialBGBitmap)
        this.game.add.existing( this.tutorialBG )
        
        this.blurScreen = new Phaser.Sprite(this.game, 0, 0, 'slight-blur-screen')
        this.game.add.existing( this.blurScreen )
        this.blurScreen.alpha = 0
        this.blurScreen.x = (this.game.width / 2) - (this.blurScreen.width / 2)
        this.blurScreen.y = (this.game.height / 2) - (this.blurScreen.height / 2)


        this.tutorial_1 = new Phaser.Sprite(this.game, 0, 0, 'tutorial-1')
        this.game.add.existing( this.tutorial_1 )
        this.tutorial_1.alpha = 0
        this.tutorial_1.x = (this.game.width / 2) - (this.tutorial_1.width / 2)
        this.tutorial_1.y = (this.game.height / 2) - (this.tutorial_1.height / 2)

        this.tutorial_2 = new Phaser.Sprite(this.game, 0, 0, 'tutorial-2')
        this.game.add.existing( this.tutorial_2 )
        this.tutorial_2.alpha = 0
        this.tutorial_2.x = (this.game.width / 2) - (this.tutorial_2.width / 2)
        this.tutorial_2.y = (this.game.height / 2) - (this.tutorial_2.height / 2)

        this.tutorial_3 = new Phaser.Sprite(this.game, 0, 0, 'tutorial-3')
        this.game.add.existing( this.tutorial_3 )
        this.tutorial_3.alpha = 0
        this.tutorial_3.x = (this.game.width / 2) - (this.tutorial_3.width / 2)
        this.tutorial_3.y = (this.game.height / 2) - (this.tutorial_3.height / 2)

        this.tutorial_4 = new Phaser.Sprite(this.game, 0, 0, 'tutorial-4')
        this.game.add.existing( this.tutorial_4 )
        this.tutorial_4.alpha = 0
        this.tutorial_4.x = (this.game.width / 2) - (this.tutorial_4.width / 2)
        this.tutorial_4.y = (this.game.height / 2) - (this.tutorial_4.height / 2) 

        this.tutorial_5 = new Phaser.Sprite(this.game, 0, 0, 'tutorial-5')
        this.game.add.existing( this.tutorial_5 )
        this.tutorial_5.alpha = 0
        this.tutorial_5.x = (this.game.width / 2) - (this.tutorial_5.width / 2)
        this.tutorial_5.y = (this.game.height / 2) - (this.tutorial_5.height / 2) 


        this.slides.push(this.tutorial_1, this.tutorial_2, this.tutorial_3, this.tutorial_4, this.tutorial_5)

		this.continueBtn = new Phaser.Button(this.game, 0, 0, 'continue-to-game')
        this.continueBtn.x = this.game.width - this.continueBtn.width - 70
        this.continueBtn.y = 700
        this.continueBtn.alpha = 0
        this.game.add.existing( this.continueBtn )
        this.continueBtn.onInputOver.add(()=>{
            this.continueBtn.alpha = 0.4
            this.game.btnHoverSnd.play()
        },this.game)
        this.continueBtn.onInputOut.add(()=>{
            this.continueBtn.alpha = 1
        },this.game)        
        this.continueBtn.onInputDown.addOnce(()=>{
        	this.game.gameStartSnd.play()
            this.startGame()
        },this.game) 


        this.arrowLeftBtn = new Phaser.Button(this.game, 0, 0, 'arrow-left-btn')
        this.arrowLeftBtn.x = this.game.width / 2 - this.arrowLeftBtn.width / 2 - 70
        this.arrowLeftBtn.y = 700
        this.arrowLeftBtn.alpha = 0
        this.game.add.existing( this.arrowLeftBtn )
        this.arrowLeftBtn.onInputOver.add(()=>{
            this.arrowLeftBtn.alpha = 0.4
            this.game.btnHoverSnd.play()
        },this.game)
        this.arrowLeftBtn.onInputOut.add(()=>{
            this.arrowLeftBtn.alpha = 1
        },this.game)        
        this.arrowLeftBtn.onInputDown.add(()=>{
            if( this.arrowLeftBtn.input.enabled ) this.blipSnd.play()
            this.previousSlide()
        },this.game)

		this.arrowRightBtn = new Phaser.Button(this.game, 0, 0, 'arrow-right-btn')
        this.arrowRightBtn.x = this.game.width / 2 - this.arrowRightBtn.width / 2 + 70
        this.arrowRightBtn.y = 700
        this.arrowRightBtn.alpha = 0
        this.game.add.existing( this.arrowRightBtn )
        this.arrowRightBtn.onInputOver.add(()=>{
            this.arrowRightBtn.alpha = 0.4
            this.game.btnHoverSnd.play()
        },this.game)
        this.arrowRightBtn.onInputOut.add(()=>{
            this.arrowRightBtn.alpha = 1
        },this.game)        
        this.arrowRightBtn.onInputDown.add(()=>{
            if( this.arrowRightBtn.input.enabled ) this.blipSnd.play()
            this.nextSlide()
        },this.game)        

        this.arrowLeftBtn.input.enabled = false
        this.arrowRightBtn.input.enabled = false
        this.continueBtn.input.enabled = false

        this.animateIn()
	}

	render(){
	}

	nextSlide(){
		//if( this.slideIndex == this.slides.length-1 )
		let self = this

		this.arrowRightBtn.input.enabled = false	
		
		let nextSlideTween = this.game.add.tween(this.slides[this.slideIndex]).to( { alpha: 0 }, 150, Phaser.Easing.Quadratic.Out, true)
		nextSlideTween.onComplete.addOnce(function(){
			self.slideIndex++
			let fadeInSlideTween = self.game.add.tween(self.slides[self.slideIndex]).to( { alpha: 1 }, 250, Phaser.Easing.Quadratic.Out, true)
			fadeInSlideTween.onComplete.addOnce(function(){
				self.updateButton(self.arrowRightBtn, self.arrowLeftBtn)
			})
		})


	}

	previousSlide(){
		let self = this
		
		this.arrowLeftBtn.input.enabled = false

		let nextSlideTween = this.game.add.tween(this.slides[this.slideIndex]).to( { alpha: 0 }, 150, Phaser.Easing.Quadratic.Out, true)
		nextSlideTween.onComplete.addOnce(function(){
			self.slideIndex--
			let fadeInSlideTween = self.game.add.tween(self.slides[self.slideIndex]).to( { alpha: 1 }, 250, Phaser.Easing.Quadratic.Out, true)
			fadeInSlideTween.onComplete.addOnce(function(){
				self.updateButton(self.arrowLeftBtn, self.arrowRightBtn)
			})
		})
	}

	updateButton( clickedBtn, otherBtn ){
		if( this.slideIndex == this.slides.length-1 || this.slideIndex == 0 ){
			clickedBtn.input.enabled = false
			clickedBtn.alpha = 0.4

			otherBtn.input.enabled = true
			otherBtn.alpha = 1
		}
		else{
			clickedBtn.input.enabled = true
			clickedBtn.alpha = 1

			otherBtn.input.enabled = true
			otherBtn.alpha = 1			
		}
	}

	animateIn(){
		let self = this

		this.game.add.tween(this.blurScreen).to( { alpha: 1 }, 1500, Phaser.Easing.Quadratic.Out, true, 500)
		this.game.add.tween(this.tutorial_1).to( { alpha: 1 }, 350, Phaser.Easing.Quadratic.Out, true, 2000)

		this.game.add.tween(this.arrowLeftBtn).to( { alpha: 0.4 }, 350, Phaser.Easing.Quadratic.Out, true, 2350)
		let buttonTween = this.game.add.tween(this.arrowRightBtn).to( { alpha: 1 }, 350, Phaser.Easing.Quadratic.Out, true, 2350)
		buttonTween.onComplete.addOnce(function(){
        	self.arrowRightBtn.input.enabled = true
        	self.continueBtn.input.enabled = true
		})
		this.game.add.tween(this.continueBtn).to( { alpha: 1 }, 350, Phaser.Easing.Quadratic.Out, true, 2700)
	}


    /**
    *** Disabling buttons and active tweens when game is started 
    *** Starting new tweens to transition to the game
    **/
    startGame(){
        let self = this

        this.arrowLeftBtn.input.enabled = false
        this.arrowRightBtn.input.enabled = false 
        this.continueBtn.input.enabled = false 

        this.game.trackOne.fade(0.5, 0, 1500)

        this.game.tracking.customTrack('bitdefendir_tutorial','click','startgame')

        this.game.add.tween(this.slides[this.slideIndex]).to( { alpha: 0 }, 350, Phaser.Easing.Quadratic.Out, true, 0)
        this.game.add.tween(this.continueBtn).to( { alpha: 0 }, 350, Phaser.Easing.Quadratic.Out, true, 0)
        this.game.add.tween(this.arrowLeftBtn).to( { alpha: 0 }, 350, Phaser.Easing.Quadratic.Out, true, 150)
        this.game.add.tween(this.arrowRightBtn).to( { alpha: 0 }, 350, Phaser.Easing.Quadratic.Out, true, 150)

        let blurScreenTween = this.game.add.tween(this.blurScreen).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true, 450) 
        blurScreenTween.onComplete.addOnce(function(){
            self.game.state.start('Main')
        })
    }
	//called every frame
	update(){
    }	

}

export default Tutorial