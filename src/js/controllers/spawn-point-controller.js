/**
*** Controller Class for spawn point actions
**/

import isMobile from '../utils/mobile-check'
import Utils from '../utils/_utils'
import SpawnPoint from '../sprites/spawn-point'

class SpawnPointController{

	constructor(game){

		this.game = game
		this.init()
	}

	init(){

		this.maxHackers = 5
		this.intervalSeconds = 3
		this.THREE_MIN = 180 //SECONDS IN 3 MINUTE
		this.SIX_MIN = 360 //SECONDS IN 6 MINUTE		
		this.spawnTimer = null
		this.create()
	}

	create(){	

		this.utils = new Utils(this.game)
		this.spawnPointGroup = new Phaser.Group(this.game, undefined, 'spawn-point-group')
		this.game.add.existing(this.spawnPointGroup)
	}

	startSpawnTimer(){
		let self = this
		this.spawnLoop()
	}

	spawnLoop(){
		let self = this

		this.spawnTimer = this.game.time.events.loop(Phaser.Timer.SECOND * this.intervalSeconds, ()=>{
			if( self.game.hackers.children.length < self.maxHackers ){
				self.spawnHacker()
				self.updateIntervalSeconds()
			}
		})
	}

	updateIntervalSeconds(){
		// update spawn loop to 2 seconds if the game has gone on for 3 minutes
		if( this.game.gameClock.timeInSceonds > this.THREE_MIN && this.game.gameClock.timeInSceonds < this.SIX_MIN && this.intervalSeconds != 2 ){
			this.intervalSeconds = 2
			this.game.time.events.remove( this.spawnTimer )
			this.spawnTimer = null
			this.spawnLoop()
			console.log('2 second spawn loop')
		}
		if( this.game.gameClock.timeInSceonds > this.SIX_MIN && this.intervalSeconds != 1.5 ){
			this.intervalSeconds = 1.5
			this.game.time.events.remove( this.spawnTimer )
			this.spawnTimer = null
			this.spawnLoop()
			console.log('1.5 second spawn loop')
		}
	}

	pauseSpawnTimer(){
		this.game.time.events.remove( this.spawnTimer )
	}

	addSpawnPoint(spawnPoint){
		this.spawnPointGroup.add(spawnPoint)
	}

	spawnHacker(){
		let spawnPointsSrcArray = this.spawnPointGroup.children
		let spawnPointResultArray = []
		
		spawnPointsSrcArray.forEach((spawnPoint)=>{
			if( !spawnPoint.getIsPlayerCamping() && !spawnPoint.isCloseToKey() ){
				spawnPointResultArray.push(spawnPoint)
			}
		})
		
		if( spawnPointResultArray.length ){
			let randomIndex = Math.floor(Math.random() * spawnPointResultArray.length)
			spawnPointResultArray[randomIndex].spawnHacker()			
		}
		else{
			console.log("SPAWN ARRAY 0 LENGTH")
		}
	}

	//called every frame
	update(){
	}
}

export default SpawnPointController