/* CURRENTLY UNSED */
/**
*** Controller Class for the light trail
**/

class TrailController{
	constructor(game, parentSprite, key, duration){
		this.game = game
		this.parent = parentSprite
		this.gridsize = parentSprite.gridsize
		this.key = key
		this.duration = duration

		this.prevTileX = 0
		this.prevTileY = 0
		this.marker = new Phaser.Point()
	}

	init(){

	}

	update(){
		let currState = this.game.state.callbackContext
		
		this.marker.x = this.game.math.snapToFloor(Math.floor(this.parent.x), this.gridsize) / this.gridsize
		this.marker.y = this.game.math.snapToFloor(Math.floor(this.parent.y), this.gridsize) / this.gridsize

		let currTile = currState.map.getTile(this.marker.x, this.marker.y, currState.layer.index)

		if( !(currTile.x == this.prevTileX && currTile.y == this.prevTileY) ){
			this.prevTileX = currTile.x
			this.prevTileY = currTile.y			
			console.log('currTile.x: '+currTile.x+' currTile.y '+currTile.y)

			let horzMoveOffset = 30
			let vertMoveOffset = 0

			if( this.parent.current == Phaser.UP || this.parent.current == Phaser.DOWN ){
				horzMoveOffset = -10
				vertMoveOffset = 20
			}

			if( this.parent.current == Phaser.LEFT )
				horzMoveOffset = (horzMoveOffset) * -1

			if( this.parent.current == Phaser.UP )
				vertMoveOffset = vertMoveOffset * -1

			let trailX = (currTile.x * this.gridsize) + (this.parent.width/2 - 32) - horzMoveOffset
			let trailY = (currTile.y * this.gridsize) + (this.parent.height/2 - 22) - vertMoveOffset
			let trailDirection = ''

			if( this.parent.current == Phaser.LEFT || this.parent.current == Phaser.RIGHT){
				trailDirection = 'player-trail-horz'
			}
			else{
				trailDirection = 'player-trail-vert'
			}

			let trail = new Phaser.Image(this.game, trailX, trailY, trailDirection)
			this.game.add.existing( trail )

			this.game.add.tween(trail).to( { alpha: 0, onComplete:()=>{ trail.destroy() } }, 2500, Phaser.Easing.Quadratic.Out, true, 0)
		}
	}
}

export default TrailController
