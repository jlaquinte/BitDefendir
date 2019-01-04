/**
*** Class for showing the loader and preloading all the assets 
**/

import isMobile from '../utils/mobile-check'

class Preload extends Phaser.State {

	//called first (even before preload)
	init(){
		let self = this

		//loader overlay
		let overlayBitmap = new Phaser.BitmapData(self.game, 'loader-overlay', self.game.width, self.game.height)
		overlayBitmap.ctx.fillStyle = '#02000D'
		overlayBitmap.ctx.beginPath()	
		overlayBitmap.ctx.moveTo(0,0)
		overlayBitmap.ctx.lineTo(self.game.width, 0)
		overlayBitmap.ctx.lineTo(self.game.width, self.game.height)
		overlayBitmap.ctx.lineTo(0, self.game.height)
		overlayBitmap.ctx.closePath()
		overlayBitmap.ctx.fill()
		self.loaderOverlay = new Phaser.Sprite(self.game, 0, 0, overlayBitmap)
		self.loaderOverlay.alpha = 1
		self.game.add.existing( self.loaderOverlay )

		//progress bar bg-outline
		let progressBarBgOutlineBitmap = new Phaser.BitmapData(self.game, 'loss-overlay', 1000, 1000)
		progressBarBgOutlineBitmap.rect( 0, 0, 310, 20,'#222222')
		self.progressBarBgOutline = new Phaser.Sprite(self.game, (self.game.width/2 - 310/2), (self.game.height/2 - 20/2), progressBarBgOutlineBitmap)
		self.progressBarBgOutline.alpha = 1
		self.game.add.existing( self.progressBarBgOutline )

		//progress bar bg
		let progressBarBgBitmap = new Phaser.BitmapData(self.game, 'loss-overlay', 1000, 1000)
		progressBarBgBitmap.rect( 0, 0, 300, 10,'#313131')
		self.progressBarBg = new Phaser.Sprite(self.game, (self.game.width/2 - 300/2), (self.game.height/2 - 10/2), progressBarBgBitmap)
		self.progressBarBg.alpha = 1
		self.game.add.existing( self.progressBarBg )


		//progress bar 
		let progressBarBitmap = new Phaser.BitmapData(self.game, 'loss-overlay', 1000, 1000)
		progressBarBitmap.rect( 0, 0, 300, 10,'#c4231b')
		self.progressBar = new Phaser.Sprite(self.game, (self.game.width/2 - 300/2), (self.game.height/2 - 10/2), progressBarBitmap)
		self.progressBar.alpha = 1
		self.progressBar.scale.setTo(0,1)
		self.game.add.existing( self.progressBar )

		let progressBarHighlightBitmap = new Phaser.BitmapData(self.game, 'loss-overlay', 1000, 1000)
		progressBarHighlightBitmap.rect( 0, 0, 300, 3,'#970b04')
		self.progressBarHighlight = new Phaser.Sprite(self.game, (self.game.width/2 - 300/2), (self.game.height/2 - 10/2)+7, progressBarHighlightBitmap)
		self.progressBarHighlight.alpha = 1
		self.progressBarHighlight.scale.setTo(0,1)
		self.game.add.existing( self.progressBarHighlight )
	}

	preload(){
		this.game.load.image('8bit-logo', 'images/ui/8bit_logo_noglow.png')

	}

	//called once preload completed
	create(){
		let self = this

		// 8bit think logo
		self.eightBitLogo = new Phaser.Sprite(self.game, 0,0, '8bit-logo')
		self.game.add.existing( self.eightBitLogo )
		self.eightBitLogo.x = self.game.width/2 - self.eightBitLogo.width/2
		self.eightBitLogo.y = 295

		self.preloadRemaining()
	}

	preloadRemaining(){
		let devicePrefix = ''

		this.secondLoader = new Phaser.Loader(this.game)
		this.secondLoader.onLoadStart.add(this.loadStart, this)
		this.secondLoader.onFileComplete.add(this.fileComplete, this)
		this.secondLoader.onLoadComplete.add(this.loadComplete, this)

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL     
        this.scale.refresh()

		if( isMobile() )
			devicePrefix = '_mobile'

		// audio
		this.secondLoader.audio('track1', ['audio/track1.mp3','audio/track1.ogg'])
		this.secondLoader.audio('track2', ['audio/track2.mp3','audio/track2.ogg'])
		this.secondLoader.audio('btn-hover', ['audio/btn_hover.mp3','audio/btn_hover.ogg'])
		this.secondLoader.audio('game-start', ['audio/game_start.mp3','audio/game_start.ogg'])
		this.secondLoader.audio('count-blip', ['audio/count_blip.mp3','audio/count_blip.ogg'])
		this.secondLoader.audio('round-start', ['audio/round_start.mp3','audio/round_start.ogg'])
		//this.secondLoader.audio('get-key', ['audio/get_key.mp3','audio/get_key.ogg'])
		this.secondLoader.audio('get-key', ['audio/get_key2.mp3','audio/get_key2.ogg'])
		this.secondLoader.audio('enemy-death', ['audio/enemy_death.mp3','audio/enemy_death.ogg'])
		this.secondLoader.audio('death-with-key', ['audio/death_with_key.mp3','audio/death_with_key.ogg'])
		this.secondLoader.audio('board-wipe', ['audio/board_wipe2.mp3','audio/board_wipe2.ogg'])
		this.secondLoader.audio('boost-appear', ['audio/boost_appear.mp3','audio/boost_appear.ogg'])
		this.secondLoader.audio('boost-disappear', ['audio/boost_disappear.mp3','audio/boost_disappear.ogg'])
		this.secondLoader.audio('boost-trigger', ['audio/boost_trigger.mp3','audio/boost_trigger.ogg'])
		this.secondLoader.audio('enemy-open-door', ['audio/enemy_open_door.mp3','audio/enemy_open_door.ogg'])
		this.secondLoader.audio('final-score', ['audio/final_score.mp3','audio/final_score.ogg'])
		this.secondLoader.audio('new-high-score', ['audio/new_high_score.mp3','audio/new_high_score.ogg'])
		this.secondLoader.audio('normal-score', ['audio/normal_score.mp3','audio/normal_score.ogg'])
		this.secondLoader.audio('score-bonus', ['audio/score_bonus.mp3','audio/score_bonus.ogg'])

		// load howler

    	//this.game.load.script('BlurX', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurX.js')
    	//this.game.load.script('BlurY', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurY.js')

		// intro screen
		this.secondLoader.image('title', 'images/ui/title.png')
		this.secondLoader.image('title-glow', 'images/ui/title_glow.png')
		this.secondLoader.image('blur-screen', 'images/screens/blur_screen.png')
		this.secondLoader.image('score-screen', 'images/screens/highscore_screen.png')

		// tutorial
		this.secondLoader.image('tutorial-1', 'images/site/tutorial1.png')
		this.secondLoader.image('tutorial-2', 'images/site/tutorial2.png')
		this.secondLoader.image('tutorial-3', 'images/site/tutorial3.png')
		this.secondLoader.image('tutorial-4', 'images/site/tutorial4.png')
		this.secondLoader.image('tutorial-5', 'images/site/tutorial5.png')
		this.secondLoader.image('arrow-left-btn', 'images/site/carousel_arrow_left.png')
		this.secondLoader.image('arrow-right-btn', 'images/site/carousel_arrow_right.png')
		this.secondLoader.image('continue-to-game', 'images/ui/continue_to_game.png')


		// map
        this.secondLoader.tilemap('map', 'images/tilesheets/lenovo_game_map.json', null, Phaser.Tilemap.TILED_JSON)
        this.secondLoader.image('tiles', 'images/tilesheets/lenovo_temp_tiles_64.png')

        // background
        this.secondLoader.spritesheet('bg-A1', 'images/spritesheets/background/bg_A1.jpg', 340, 340)
        this.secondLoader.spritesheet('bg-A2', 'images/spritesheets/background/bg_A2.jpg', 340, 340)
        this.secondLoader.spritesheet('bg-A3', 'images/spritesheets/background/bg_A3.jpg', 340, 340)
        this.secondLoader.spritesheet('bg-A4', 'images/spritesheets/background/bg_A4.jpg', 324, 340)
        
        this.secondLoader.spritesheet('bg-B1', 'images/spritesheets/background/bg_B1.jpg', 340, 340)
        this.secondLoader.spritesheet('bg-B2', 'images/spritesheets/background/bg_B2.jpg', 340, 340)
        this.secondLoader.spritesheet('bg-B3', 'images/spritesheets/background/bg_B3.jpg', 340, 340)
        this.secondLoader.spritesheet('bg-B4', 'images/spritesheets/background/bg_B4.jpg', 324, 340)
        
        this.secondLoader.spritesheet('bg-C1', 'images/spritesheets/background/bg_C1.jpg', 340, 152)
        this.secondLoader.spritesheet('bg-C2', 'images/spritesheets/background/bg_C2.jpg', 340, 152)
        this.secondLoader.spritesheet('bg-C3', 'images/spritesheets/background/bg_C3.jpg', 340, 152)
        this.secondLoader.spritesheet('bg-C4', 'images/spritesheets/background/bg_C4.jpg', 324, 152)

        // boost background
        this.secondLoader.spritesheet('bg-boost-A1', 'images/spritesheets/boost_background/bg_A1.png', 340, 340)
        this.secondLoader.spritesheet('bg-boost-A2', 'images/spritesheets/boost_background/bg_A2.png', 340, 340)
        this.secondLoader.spritesheet('bg-boost-A3', 'images/spritesheets/boost_background/bg_A3.png', 340, 340)
        this.secondLoader.spritesheet('bg-boost-A4', 'images/spritesheets/boost_background/bg_A4.png', 324, 340)
        
        this.secondLoader.spritesheet('bg-boost-B1', 'images/spritesheets/boost_background/bg_B1.png', 340, 340)
        this.secondLoader.spritesheet('bg-boost-B2', 'images/spritesheets/boost_background/bg_B2.png', 340, 340)
        this.secondLoader.spritesheet('bg-boost-B3', 'images/spritesheets/boost_background/bg_B3.png', 340, 340)
        this.secondLoader.spritesheet('bg-boost-B4', 'images/spritesheets/boost_background/bg_B4.png', 324, 340)
        
        this.secondLoader.spritesheet('bg-boost-C1', 'images/spritesheets/boost_background/bg_C1.png', 340, 152)
        this.secondLoader.spritesheet('bg-boost-C2', 'images/spritesheets/boost_background/bg_C2.png', 340, 152)
        this.secondLoader.spritesheet('bg-boost-C3', 'images/spritesheets/boost_background/bg_C3.png', 340, 152)
        this.secondLoader.spritesheet('bg-boost-C4', 'images/spritesheets/boost_background/bg_C4.png', 324, 152)
        
        // player
        this.secondLoader.image('player-glow', 'images/spritesheets/chip_glow.png')
        this.secondLoader.image('player-glow-boost', 'images/spritesheets/chip_glow_boost.png')
        this.secondLoader.spritesheet('player', 'images/spritesheets/player.png', 64, 64)
        
        // spawn point
        this.secondLoader.spritesheet('spawn-point', 'images/spritesheets/spawn_point.png',64,64)
        this.secondLoader.spritesheet('spawn-point-boost', 'images/spritesheets/spawn_point_boost.png',64,64)

        // enemies
        this.secondLoader.spritesheet('hacker-death-explosion', 'images/spritesheets/hacker_death_explosion.png', 144, 145)
        this.secondLoader.spritesheet('hacker-dreg', 'images/spritesheets/dreg.png', 64, 64)
        this.secondLoader.spritesheet('hacker-dreg-glow', 'images/spritesheets/dreg_glow.png', 112, 112)
        this.secondLoader.spritesheet('hacker-dreg-glow-key', 'images/spritesheets/dreg_keyglow.png', 320, 320)
        this.secondLoader.spritesheet('hacker-meanboye', 'images/spritesheets/meanboye.png', 64, 64)
        this.secondLoader.spritesheet('hacker-meanboye-glow', 'images/spritesheets/meanboye_glow.png', 112, 112)
        this.secondLoader.spritesheet('hacker-meanboye-glow-key', 'images/spritesheets/meanboye_keyglow.png', 320, 320)
        this.secondLoader.spritesheet('hacker-lardmin', 'images/spritesheets/lardmin.png', 64, 64)
        this.secondLoader.spritesheet('hacker-lardmin-glow', 'images/spritesheets/lardmin_glow.png', 112, 112)
        this.secondLoader.spritesheet('hacker-lardmin-glow-key', 'images/spritesheets/lardmin_keyglow.png', 320, 320)
        this.secondLoader.spritesheet('hacker-eye', 'images/spritesheets/hacker_eye.png', 64, 64)

        // key
        this.secondLoader.image('key', 'images/spritesheets/key.png')
        this.secondLoader.image('key-glow', 'images/spritesheets/key_glow.png')

        // key mat
        this.secondLoader.image('key-mat', 'images/spritesheets/key_mat.png')

        // speed boost
        this.secondLoader.spritesheet('speed-boost-timer', 'images/spritesheets/timer_speedboost.png', 64, 64)
        this.secondLoader.image('speedboost-glow', 'images/spritesheets/speedboost_glow.png')

        // board wipe
        this.secondLoader.spritesheet('powerup-meter', 'images/spritesheets/powerup-meter'+devicePrefix+'.png', 192, 128)
        this.secondLoader.image('powerup-meter-glow', 'images/spritesheets/powerup-meter-glow.png')

		// UI
		this.secondLoader.spritesheet('newgame-btn', 'images/ui/newgame_btn.png', 180, 58)
		this.secondLoader.spritesheet('quickplay-btn', 'images/ui/quickplay_btn.png', 180, 58)
		this.secondLoader.spritesheet('replay-btn', 'images/ui/replay_btn.png', 180, 58)
		this.secondLoader.image('pause-message', 'images/ui/pause_message.png')
		this.secondLoader.image('key-stolen-message', 'images/ui/key_stolen_msg.png')

		// particles
		this.secondLoader.image('player-trail-vert', 'images/particles/player_streak_64_vert.jpg')
		this.secondLoader.image('player-trail-horz', 'images/particles/player_streak_64_horz.jpg')

		// results screen
		this.secondLoader.image('slight-blur-screen', 'images/screens/slight_blur_screen.png')
		this.secondLoader.image('results-bg-frame', 'images/ui/results_bg_frame.png')
		this.secondLoader.image('new-high-score-msg', 'images/ui/new_high_score_msg.png')

		this.secondLoader.start()
	}


	loadStart(){
		let self = this
		console.log('Loading....')
	}
	fileComplete(progress, cacheKey, success, totalLoaded, totalFiles){
		let self = this
		//console.log("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles)
		self.progressBar.scale.setTo( (totalLoaded/totalFiles), 1)
		self.progressBarHighlight.scale.setTo( (totalLoaded/totalFiles), 1)
	}
	loadComplete(){
		let self = this
		console.log('Load Complete')
		self.game.state.start('Intro')
	}


	//called every frame
	update(){
	}
}

export default Preload