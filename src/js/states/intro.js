/**
*** Class for showing the intro state
**/

import isMobile from '../utils/mobile-check'
import Background from '../sprites/background'

class Intro extends Phaser.State {

	//called first (even before preload)
	init(){
        this.firstSpacePressed = false
	}

	//called to load game assets
	preload(){
	
    }

    /**
    *** Loading and positioning all the visual assets 
    *** in the intro scene, also audio files
    **/
	//called once preload completed
	create(){
        let self = this

        // load audio
        this.game.trackOne = new Howl({src: ['audio/track1.mp3','audio/track1.ogg'], loop: true, volume: 0.4})
        this.game.trackOne.play()
        this.game.btnHoverSnd = new Howl({src: ['audio/btn_hover.mp3','audio/btn_hover.ogg']})
        this.game.gameStartSnd = new Howl({src: ['audio/game_start.mp3','audio/game_start.ogg']})

        //intro background
        let bgBitmap = new Phaser.BitmapData(this.game, 'intro-bg', this.game.width, this.game.height)
        bgBitmap.ctx.fillStyle = '#02000D'
        bgBitmap.ctx.beginPath()   
        bgBitmap.ctx.moveTo(0,0)
        bgBitmap.ctx.lineTo(this.game.width, 0)
        bgBitmap.ctx.lineTo(this.game.width, this.game.height)
        bgBitmap.ctx.lineTo(0, this.game.height)
        bgBitmap.ctx.closePath()
        bgBitmap.ctx.fill()
        this.introBG = new Phaser.Sprite(this.game, 0, 0, bgBitmap)
        this.introBG.alpha = 0.9
        this.game.add.existing( this.introBG )

        //intro overlay
        let overlayBitmap = new Phaser.BitmapData(this.game, 'intro-overlay', this.game.width, this.game.height)
        overlayBitmap.ctx.fillStyle = '#02000D'
        overlayBitmap.ctx.beginPath()   
        overlayBitmap.ctx.moveTo(0,0)
        overlayBitmap.ctx.lineTo(this.game.width, 0)
        overlayBitmap.ctx.lineTo(this.game.width, this.game.height)
        overlayBitmap.ctx.lineTo(0, this.game.height)
        overlayBitmap.ctx.closePath()
        overlayBitmap.ctx.fill()
        this.loaderOverlay = new Phaser.Sprite(this.game, 0, 0, overlayBitmap)
        this.loaderOverlay.alpha = 0.7
        this.game.add.existing( this.loaderOverlay )

        this.blurScreen = new Phaser.Sprite(this.game, 0, 0, 'blur-screen')
        this.game.add.existing( this.blurScreen )
        this.blurScreen.alpha = 0
        this.blurScreen.x = (this.game.width / 2) - (this.blurScreen.width / 2)
        this.blurScreen.y = (this.game.height / 2) - (this.blurScreen.height / 2)

        this.title = new Phaser.Sprite(this.game, 0, 0, 'title')
        this.title.alpha = 0
        this.game.add.existing( this.title )

        this.titleGlow = new Phaser.Sprite(this.game, 0, 0, 'title-glow')
        this.titleGlow.alpha = 0
        this.game.add.existing( this.titleGlow )

        this.title.x = this.game.width / 2 - this.title.width / 2
        this.titleGlow.x = this.game.width / 2 - this.titleGlow.width / 2

        this.title.y = 0
        this.titleGlow.y = 0
        
        this.newgameBtn = new Phaser.Button(this.game, 0, 0, 'newgame-btn')
        this.newgameBtn.x = this.game.width / 2 - this.newgameBtn.width / 2 - 110
        this.newgameBtn.y = 620
        this.newgameBtn.alpha = 0
        this.newgameBtn.animations.add('idle',[0])
        this.newgameBtn.animations.add('active',[1])
        this.newgameBtn.animations.play('idle', 1, false)
        this.game.add.existing( this.newgameBtn )
        this.newgameBtn.onInputOver.add(()=>{
            this.newgameBtn.animations.play('active', 1, false)
            this.game.btnHoverSnd.play()
        },this.game)
        this.newgameBtn.onInputOut.add(()=>{
            this.newgameBtn.animations.play('idle', 1, false)
        },this.game)        
        this.newgameBtn.onInputDown.addOnce(()=>{
            this.game.gameStartSnd.play()
            this.showTutorial()
        },this.game)

        
        this.quickplayBtn = new Phaser.Button(this.game, 0, 0, 'quickplay-btn')
        this.quickplayBtn.x = this.game.width / 2 - this.quickplayBtn.width / 2 + 110
        this.quickplayBtn.y = 620
        this.quickplayBtn.alpha = 0
        this.quickplayBtn.animations.add('idle',[0])
        this.quickplayBtn.animations.add('active',[1])
        this.quickplayBtn.animations.play('idle', 1, false)
        this.game.add.existing( this.quickplayBtn )
        this.quickplayBtn.onInputOver.add(()=>{
            this.quickplayBtn.animations.play('active', 1, false)
            this.game.btnHoverSnd.play()
        },this.game)
        this.quickplayBtn.onInputOut.add(()=>{
            this.quickplayBtn.animations.play('idle', 1, false)
        },this.game)        
        this.quickplayBtn.onInputDown.addOnce(()=>{
            this.game.gameStartSnd.play()
            this.startGame()
        },this.game)

        this.quickplayBtn.input.enabled = false
        this.newgameBtn.input.enabled = false 
        
        this.glowTween = null

        this.game.add.tween(this.blurScreen).to( { alpha: 1 }, 3000, Phaser.Easing.Quadratic.Out, true, 2000)
        let titleTween = this.game.add.tween(this.title).to( { alpha: 1 }, 3000, Phaser.Easing.Quadratic.Out, true, 2000)
        titleTween.onComplete.addOnce(function(){
            self.quickplayBtn.input.enabled = true
            self.newgameBtn.input.enabled = true 
            self.glowTween = self.game.add.tween(self.titleGlow).to( { alpha: 1 }, 1500, Phaser.Easing.Quadratic.Out, true, 0, -1, true)
            self.newgameBtnTween = self.game.add.tween(self.newgameBtn).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.Out, true, 0)
            self.quickplayBtnTween = self.game.add.tween(self.quickplayBtn).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.Out, true, 450)
        })

	}

	render(){
	}

    /**
    *** Disabling buttons and active tweens when game is started 
    *** Starting new tweens to transition to the game
    **/
    startGame(){
        let self = this

        this.quickplayBtn.input.enabled = false
        this.newgameBtn.input.enabled = false 

        this.newgameBtnTween.stop()
        this.quickplayBtnTween.stop()

        this.glowTween.stop()

        this.game.tracking.customTrack('bitdefendir_intro','click','quickplay')

        this.game.trackOne.fade(0.5, 0, 1500)

        this.game.add.tween(this.quickplayBtn).to( { alpha: 0 }, 350, Phaser.Easing.Quadratic.Out, true, 0)
        this.game.add.tween(this.newgameBtn).to( { alpha: 0 }, 350, Phaser.Easing.Quadratic.Out, true, 150)

        this.game.add.tween(this.blurScreen).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true, 450)
        this.game.add.tween(this.titleGlow).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true, 450)
        let titleTween = this.game.add.tween(this.title).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true, 450) 
        titleTween.onComplete.addOnce(function(){
            self.game.state.start('Main')
        })
    }

    /**
    *** Disabling buttons and active tweens when tutorial is started 
    *** Starting new tweens to transition to the tutorial
    **/
    showTutorial(){
        let self = this

        this.quickplayBtn.input.enabled = false
        this.newgameBtn.input.enabled = false 

        this.newgameBtnTween.stop()
        this.quickplayBtnTween.stop()

        this.glowTween.stop() 

        this.game.tracking.customTrack('bitdefendir_intro','click','newgame')
        
        this.game.add.tween(this.quickplayBtn).to( { alpha: 0 }, 350, Phaser.Easing.Quadratic.Out, true, 150)
        this.game.add.tween(this.newgameBtn).to( { alpha: 0 }, 350, Phaser.Easing.Quadratic.Out, true, 0)  
        
        this.game.add.tween(this.blurScreen).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true, 450)
        this.game.add.tween(this.titleGlow).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true, 450)
        let titleTween = this.game.add.tween(this.title).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true, 450) 
        titleTween.onComplete.addOnce(function(){
            self.game.state.start('Tutorial')
        })             
    }

	//called every frame
	update(){

    }
}

export default Intro