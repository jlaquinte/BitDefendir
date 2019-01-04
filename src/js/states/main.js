/**
*** Class for showing the main gameplay state
**/

import isMobile from '../utils/mobile-check'
import Utils from '../utils/_utils'
import Background from '../sprites/background'
import GameClock from '../components/game-clock'
import BoardWipe from '../components/board-wipe'
import ScoreCounter from '../components/score-counter'
import CountdownTimer from '../components/countdown-timer'
import PauseOverlay from '../components/pause-overlay'
import LossOverlay from '../components/loss-overlay'
import Player from '../sprites/player'
import KeyMat from '../sprites/key-mat'
import Key from '../sprites/key'
import ScoreBonusController from '../controllers/score-bonus-controller'
import SpawnPointController from '../controllers/spawn-point-controller'
import SpawnPoint from '../sprites/spawn-point'
import SpeedBoost from '../sprites/speed-boost'

class Main extends Phaser.State {

	//called first (even before preload)
	init(){
        this.game.gameStarted = false
        this.map = null
        this.layer = null
        this.player = null

        this.safetile = 4
        this.gridsize = 64

        this.isPaused = false

        this.topSpawn = null
        this.bottomSpawn = null

        this.topKey = null
        this.bottomKey = null
        this.topKeyMat = null
        this.bottomKeyMat = null        
        this.spawnPointController = null

        this.keys = {}
        this.ORIGINAL_OVERFLOW_ERROR_ON = true

        this.KEY_COOLING_DOWN_TIME = 250
        this.lastKeyPressed = 0

        this.game.physics.startSystem(Phaser.Physics.ARCADE)

        console.log('Phaser.LEFT', Phaser.LEFT)
        console.log('Phaser.RIGHT', Phaser.RIGHT)
        console.log('Phaser.UP', Phaser.UP)
        console.log('Phaser.DOWN', Phaser.DOWN)        
	}

	//called to load game assets
	preload(){
	}

    /**
    *** Loading and positioning all the visual assets 
    *** in the main scene, also audio files
    **/
	//called once preload completed
	create(){
		console.log('running main')

        this.utils = new Utils(this.game)

        this.game.trackTwo = new Howl({src: ['audio/track2.mp3','audio/track2.ogg'], loop: true, volume: 0})
        this.lossSnd = new Howl({src: ['audio/loss.mp3','audio/loss.ogg']})

        this.map = this.add.tilemap('map')
        this.map.addTilesetImage('lenovo_temp_tiles_64', 'tiles')
        this.layer = this.map.createLayer('collision')
        this.map.setCollision(3, true, this.layer)

        this.game.background = new Background(this.game, undefined, 'background-group', true)
        this.game.background.startAnimation()

        this.game.scoreCounter = new ScoreCounter(this.game, undefined, 'score-counter', true)
        this.game.scoreCounter.updateHighScore()
        this.game.scoreCounter.resetScore()

        this.speedBoost = new SpeedBoost(this.game, 672, 416, 'speed-boost-timer', 'speed-boost-sprite')

        this.game.cursors = this.input.keyboard.createCursorKeys()

        this.game.boardWipe = new BoardWipe(this.game, undefined, 'board-wipe', true)

        this.spawnPointController = new SpawnPointController(this.game)

        this.game.hackers = new Phaser.Group(this.game, undefined, 'hackers-group')

        this.topKeyMat = new KeyMat(this.game, 1248, 96, 'key-mat', 'top-key-mat')
        this.bottomKeyMat = new KeyMat(this.game, 96, 736, 'key-mat', 'bottom-key-mat')

        this.topKey = new Key(this.game, 1248, 96, 'key', 'top-key', this.topKeyMat)
        this.bottomKey = new Key(this.game, 96, 736, 'key', 'bottom-key', this.bottomKeyMat)

        this.player = new Player(this.game, 672, 416, 'player')

        console.log('this.player.width: '+this.player.width+' this.player.height: '+this.player.height)
        console.log('this.topKey.width: '+this.topKey.width+' this.topKey.height: '+this.topKey.height)

        this.keys = {
        	'top-key': this.topKey,
        	'bottom-key': this.bottomKey
        }
        this.keyPosResets = {
            'top-key': false,
            'bottom-key': false
        }


        this.topSpawn = new SpawnPoint(this.game, 96, 96)
        this.bottomSpawn = new SpawnPoint(this.game, 1248, 736)	

        this.spawnPointController.addSpawnPoint(this.topSpawn)
        this.spawnPointController.addSpawnPoint(this.bottomSpawn)


        this.countdownTimer = new CountdownTimer(this.game, 3, this.startGame.bind(this))
        this.countdownTimer.start()

        this.game.trackTwo.play()
        this.game.trackTwo.fade(0.1, 0.4, 4000)

        this.game.gameClock = new GameClock(this.game, undefined, 'game-clock', true)

        this.lossOverlay = new LossOverlay(this.game, undefined, 'loss-overlay', true)

        this.pauseOverlay = new PauseOverlay(this.game, undefined, 'pause-overlay', true)
        this.pauseKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P)
        this.pauseKey.onUp.add(this.pauseGameplay.bind(this), this.game)

        this.game.scoreBonusController = new ScoreBonusController( this.game )

        this.game.add.existing( this.game.scoreCounter )

    }

	render(){
		//this.showCollisionBodies()
        //this.player.render()
	}

    /**
    *** Shows the collision boundaries for sprites on the stage
    **/
	showCollisionBodies(){
		let self = this

        if( this.player.hitBox.body ) this.game.debug.body(this.player.hitBox)
		//if( this.player.body ) this.game.debug.body(this.player)

		this.game.hackers.children.forEach(( hacker )=>{
			this.game.debug.body(hacker.hitBox)
		})

        this.spawnPointController.spawnPointGroup.children.forEach(( spawnPoint )=>{
            this.game.debug.body(spawnPoint)
        })

        this.game.debug.body(this.speedBoost)

        this.game.debug.body(this.keys['top-key'].hitBox)
		this.game.debug.body(this.keys['bottom-key'].hitBox)
	
        this.game.debug.body(this.topKeyMat)
        this.game.debug.body(this.bottomKeyMat)
    }

    startGame(){
        this.game.gameStarted = true
        this.game.gameClock.startClock()
        this.spawnPointController.startSpawnTimer()
    }


    loseGame(){
        let self = this
        this.lossSnd.play()
        this.game.hackers.children.forEach(( hacker )=>{
            hacker.stopAfterEscape()
        })
        this.game.gameStarted = false
        this.player.stopMovement()
        this.player.animations.play('dead', 1, true)
        this.game.gameClock.pause()
        this.spawnPointController.pauseSpawnTimer()
        this.speedBoost.disable()
        this.pauseOverlay.disable()

        this.game.tracking.customTrack('bitdefendir_gameplay','game_event','key_lost')

        // faking a setTimeout due to setTimeout bug
        let fakeTimeout = this.game.add.tween(this.player).to( { alpha:1 }, 850, Phaser.Easing.Quadratic.Out, true, 0)
        fakeTimeout.onComplete.addOnce(()=>{
            this.lossOverlay.show()
        })
    }

	//called every frame
	update(){
		let self = this

        if( this.game.gameStarted ){

            this.spawnPointController.spawnPointGroup.children.forEach(( spawnPoint )=>{
                spawnPoint.setIsPlayerCamping( false )
                self.game.physics.arcade.overlap(self.player.hitBox, spawnPoint, self.checkPlayerSpawnOverlap, null, self)
            })

            this.game.hackers.children.forEach(( hacker )=>{
                self.game.physics.arcade.overlap(self.player.hitBox, hacker.hitBox, self.checkPlayerHackerOverlap, null, self)
                self.game.physics.arcade.overlap(hacker.mySpawnPoint, hacker.hitBox, self.checkHackerSpawnOverlap, null, self)
            })

            self.game.physics.arcade.overlap(self.player.hitBox, self.speedBoost, self.checkPlayerSpeedBoostOverlap, null, self)

            this.game.hackers.children.forEach(( hacker )=>{
                self.game.physics.arcade.overlap(this.topKey.hitBox, hacker.hitBox, self.checkHackerKeyOverlap, null, self)
                self.game.physics.arcade.overlap(this.bottomKey.hitBox, hacker.hitBox, self.checkHackerKeyOverlap, null, self)
            })

            // check for key / keymat collision if key in return mode
            if( this.topKey.mode == this.topKey.RETURN && this.keyPosResets['top-key'] ) 
                this.game.physics.arcade.overlap(this.topKey.hitBox, this.topKeyMat, this.checkKeyKeyMatOverlap, null, this)
            if( this.bottomKey.mode == this.bottomKey.RETURN && this.keyPosResets['bottom-key'] ) 
                this.game.physics.arcade.overlap(this.bottomKey.hitBox, this.bottomKeyMat, this.checkKeyKeyMatOverlap, null, this)
        }
	}

    pauseGameplay(){
        this.pauseOverlay.togglePause() 
    }

    // called from hacker class on hacker death
	reviveKey( name, newKeyPos ){
        let self = this

		let keySprite = this.keys[name]
        keySprite.setKeyPos(newKeyPos.x, newKeyPos.y)
        keySprite.enableKey() 

        this.utils.setTimeout(()=>{ 
            keySprite.mode = keySprite.RETURN
            self.keyPosResets[name] = true 
        }, 100)        
	}

    // check is player is on top of spawn point
    checkPlayerSpawnOverlap(playerHitBox, spawnPoint){
        spawnPoint.setIsPlayerCamping( true )
    }

    // check is player has hit a hackbot
	checkPlayerHackerOverlap(playerHitBox, hackerHitBox){
		hackerHitBox.parent.die()
	}

    // check is player has touched the speed boost
    checkPlayerSpeedBoostOverlap(playerHitBox, speedBoost){
        let player = playerHitBox.parent
        player.activateSpeedBoost()
    }

    // check is hacker has hit a key
	checkHackerKeyOverlap(keyHitBox, hackerHitBox){
        let key = keyHitBox.parent
		if( !hackerHitBox.parent.hasKey ){
			hackerHitBox.parent.capturedKey( key.name )
			key.disableKey()
		}
	}

    // check is key is back on the keymat
    checkKeyKeyMatOverlap(keyHitBox, keyMat){
        let key = keyHitBox.parent
        key.setKeyPos(keyMat.x, keyMat.y)
        this.keyPosResets[key.name] = false
        key.mode = key.STAY
    }

    // check is hacker is on a spawn point
    checkHackerSpawnOverlap(hackerSpawnPoint, hackerHitBox){
        let hacker = hackerHitBox.parent
        if(hacker.hasKey && !hackerSpawnPoint.enemyReturning){
            hackerSpawnPoint.enemyReturning = true
            hackerSpawnPoint.animations.play('open', 12, false)
            hackerSpawnPoint.spawnPointBoost.animations.play('open', 12, false)
            hacker.startEscape( hackerSpawnPoint )
        }
    }    

}

export default Main