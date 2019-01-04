/**
*** Sprite Class for the player
**/

import isMobile from '../utils/mobile-check'
import Utils from '../utils/_utils'
import Swipe from 'phaser-swipe'

class Player extends Phaser.Sprite {

    constructor(game, x, y, label){
        super(game, x, y, label)
        this.keyLabel = label
        
        this.init()
    }

    init(){
        this.utils = new Utils(this.game)

        this.BOOST_SPEED = 400
        this.BOOST_THRESHOLD = 10

        this.NORMAL_SPEED = 200
        this.NORMAL_THRESHOLD = (isMobile()) ? 20 : 8

        this.inBoost = false
        this.boostDuration = 8000

        this.marker = new Phaser.Point()
        this.turnPoint = new Phaser.Point()

        this.directions = [ null, null, null, null, null ]
        this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ]
        
        this.speed = this.NORMAL_SPEED
        this.threshold = this.NORMAL_THRESHOLD

        this.safetile = 4
        this.gridsize = 64

        this.current = Phaser.NONE
        this.turning = Phaser.NONE

        this.anchor.set(0.5)
        this.game.physics.arcade.enable(this)
        this.game.add.existing(this)

        this.create()
    }

    create(){
        this.glow = new Phaser.Sprite(this.game, 0, 0, 'player-glow')
        this.addChild(this.glow)
        this.glow.anchor.set(0.5)

        this.glowBoost = new Phaser.Sprite(this.game, 0, 0, 'player-glow-boost')
        this.glowBoost.alpha = 0
        this.addChild(this.glowBoost)
        this.glowBoost.anchor.set(0.5)

        this.animations.add('idle',[0])
        this.animations.add('hit-enemy',[7])
        this.animations.add('distraught',[4])
        this.animations.add('freaked-out',[9])
        this.animations.add('dead',[5])

        //create collision hitbox for player
        this.hitBox = new Phaser.Sprite(this.game, 0, 0, null)
        this.game.physics.arcade.enable(this.hitBox)
        this.hitBox.body.setSize(44, 44, -22, -22)
        this.addChild(this.hitBox)

        this.boostTriggerSnd = new Howl({src: ['audio/boost_trigger.mp3','audio/boost_trigger.ogg']})        
    }

    move(direction){
        var speed = this.speed

        if (direction === Phaser.LEFT || direction === Phaser.UP)
        {
            speed = -speed
        }

        if (direction === Phaser.LEFT || direction === Phaser.RIGHT)
        {
            this.body.velocity.x = speed
        }
        else
        {
            this.body.velocity.y = speed
        }

        this.current = direction        
    }

    turn(){
        var cx = Math.floor(this.x)
        var cy = Math.floor(this.y)

        //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
        if (!this.game.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.game.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold))
        {
            return false
        }

        this.x = this.turnPoint.x
        this.y = this.turnPoint.y

        this.body.reset(this.turnPoint.x, this.turnPoint.y)

        this.move(this.turning)

        this.turning = Phaser.NONE

        return true     
    }

    checkKeys(){
        let currState = this.game.state.callbackContext

        if ( (this.game.cursors.left.isDown && this.current !== Phaser.LEFT))
        {
            this.checkDirection(Phaser.LEFT);
        }
        else if ( (this.game.cursors.right.isDown && this.current !== Phaser.RIGHT))
        {
            this.checkDirection(Phaser.RIGHT);
        }
        else if ( (this.game.cursors.up.isDown && this.current !== Phaser.UP) )
        {
            this.checkDirection(Phaser.UP);
        }
        else if ( (this.game.cursors.down.isDown && this.current !== Phaser.DOWN))
        {
            this.checkDirection(Phaser.DOWN);
        }
        else
        {
            //  This forces them to hold the key down to turn the corner
            this.turning = Phaser.NONE;
        }       
    }

    checkDirection(turnTo){
        if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile)
        {
            //  Invalid direction if they're already set to turn that way
            //  Or there is no tile there, or the tile isn't index a floor tile
            return;
        }

        //  Check if they want to turn around and can
        if (this.current === this.opposites[turnTo])
        {
            this.move(turnTo);
        }
        else
        {
            this.turning = turnTo;

            this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
            this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
        }       
    }

    getPosition() {
        return new Phaser.Point((this.marker.x * this.gridsize) + (this.gridsize / 2), (this.marker.y * this.gridsize) + (this.gridsize / 2))
    }

    stopMovement(){
        this.body.velocity.x = this.body.velocity.y = 0
    }


    //called every frame
    update(){
        let currState = this.game.state.callbackContext
        
        if(this.body) this.game.physics.arcade.collide(this, currState.layer)

        this.marker.x = this.game.math.snapToFloor(Math.floor(this.x), this.gridsize) / this.gridsize
        this.marker.y = this.game.math.snapToFloor(Math.floor(this.y), this.gridsize) / this.gridsize

        //  Update our grid sensors
        this.directions[1] = currState.map.getTileLeft(currState.layer.index, this.marker.x, this.marker.y)
        this.directions[2] = currState.map.getTileRight(currState.layer.index, this.marker.x, this.marker.y)
        this.directions[3] = currState.map.getTileAbove(currState.layer.index, this.marker.x, this.marker.y)
        this.directions[4] = currState.map.getTileBelow(currState.layer.index, this.marker.x, this.marker.y)

        this.checkKeys()

        if (this.turning !== Phaser.NONE && this.game.gameStarted)
        {
            this.turn()
        }

        let hackersWithKeys = this.checkHackerKeyStatus()

        if( hackersWithKeys == 1) this.animations.play('distraught', 1, true)
        if( hackersWithKeys > 1) this.animations.play('freaked-out', 1, true)

    }

    checkHackerKeyStatus(){
        let numHackersWithKeys = 0
        this.game.hackers.children.forEach(( hacker )=>{
            if( hacker.hasKey ) numHackersWithKeys++
        })

        return numHackersWithKeys
    }

    activateSpeedBoost(){
        let self = this

        if( !this.inBoost ){
            this.inBoost = true
            this.boostTriggerSnd.play()
            this.game.tracking.customTrack('bitdefendir_gameplay','game_event', 'speed_boost')

            this.game.background.showBoostMode()

            this.game.add.tween( this.glowBoost ).to( { alpha: 1 }, 350, Phaser.Easing.Quadratic.Out, true, 0)

            this.speed = this.BOOST_SPEED
            this.threshold = this.BOOST_THRESHOLD
            this.move(this.current)
            
            this.utils.setTimeout(()=>{
                self.inBoost = false
                self.speed = self.NORMAL_SPEED
                self.threshold = self.NORMAL_THRESHOLD
                self.game.add.tween( self.glowBoost ).to( { alpha: 0 }, 350, Phaser.Easing.Quadratic.Out, true, 0)
            }, self.boostDuration)
        }
    }

    render() {

        //  Un-comment this to see the debug drawing

        for (var t = 1; t < 5; t++)
        {
            if (this.directions[t] === null)
            {
                continue;
            }

            var color = 'rgba(0,255,0,0.6)';

            if (this.directions[t].index !== this.safetile)
            {
                color = 'rgba(0,0,0,0.6)';
            }

            if (t === this.current)
            {
                color = 'rgba(255,255,255,0.6)';
            }

            this.game.debug.geom(new Phaser.Rectangle(this.directions[t].worldX, this.directions[t].worldY, 64, 64), color, true);
        }

        this.game.debug.geom(this.turnPoint, '#ffff00');
    }   
}

export default Player