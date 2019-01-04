/**
*** Sprite Class for the key mats that holds the key
**/

import isMobile from '../utils/mobile-check'

class KeyMat extends Phaser.Sprite {

	constructor(game, x, y, label, name){
		super(game, x, y, label)

        this.name = name

	    this.hitBox = null

		this.init()
	}

	init(){
		this.anchor.set(0.5)
		this.game.physics.arcade.enable(this)
        this.body.setSize(12, 12, 26, 26)
        this.alpha = 0
		
		this.create()
	}

	create(){
		
		this.game.add.existing(this)
	}

	getPosition() {
        return new Phaser.Point(this.x, this.y)
    }

	update(){

	}
}

export default KeyMat