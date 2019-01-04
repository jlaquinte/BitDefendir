/**
 * Misc shared utility functions
 */
class Utils {

	constructor(game) {
		let self = this
		this.game = game
		this.interval = null

	}


	typeWriter(textObj, text, delay, index, scope, callback, callbackDelay) {
		let self = this
		let _delay = delay

		self.textBleep = new Phaser.Sound(scope.game, 'text-bleep', 0.4, false)
		self.textBloop = new Phaser.Sound(scope.game, 'text-bloop', 0.4, false)

		if (index < (text.length)) {

			textObj.setText( text.substring(0, index+1) )

			//add extra delay after punctuation
			if( text.substring( index, index+1 ) == '.' || text.substring( index, index+1 ) == '!' || text.substring( index, index+1 ) == '?' )
				delay = 800

			index++

			//play text typing sounds
			if( index%2 == 0 ) self.textBleep.play()
			else self.textBloop.play()

			setTimeout(function() {
				delay = _delay
				self.typeWriter(textObj, text, delay, index, scope, callback, callbackDelay)
			}, delay)
		}
		else{
			setTimeout(function() {
				if( typeof(callback) === 'function' ) callback(scope)
			}, callbackDelay)
		}
	}

	// Tweening the tint of an object
	tweenTint(obj, startColor, endColor, time = 250, delay = 0, callback = null) {
		// check if is valid object
        if (obj) {
			// create a step object
            let colorBlend = { step: 0 }
			// create a tween to increment that step from 0 to 100.
            let colorTween = obj.game.add.tween(colorBlend).to({ step: 100 }, time, Phaser.Easing.Linear.None, delay)
			// add an anonomous function with lexical scope to change the tint, calling Phaser.Colour.interpolateColor
            colorTween.onUpdateCallback(() => {
                obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step)
            });
			// set object to the starting colour
            obj.tint = startColor
			// if you passed a callback, add it to the tween on complete
            if (callback) {
                colorTween.onComplete.add(callback, this)
            }
			// finally, start the tween
            colorTween.start()
        }
    }

    // Scroll to the bottom of a DOM elm
	scrollToBottom(id){
		let elm = document.querySelector(id)
		elm.scrollIntoView()
	}

	// Scroll to the bottom of a DOM elm *smoothly()
	smoothScroll(eID) {
		let self = this

	    var startY = self.currentYPosition();
	    var stopY = self.elmYPosition(eID);
	    var distance = stopY > startY ? stopY - startY : startY - stopY;
	    if (distance < 100) {
	        scrollTo(0, stopY); return;
	    }
	    var speed = Math.round(distance / 100);
	    if (speed >= 20) speed = 20;
	    var step = Math.round(distance / 25);
	    var leapY = stopY > startY ? startY + step : startY - step;
	    var timer = 0;
	    if (stopY > startY) {
	        for ( var i=startY; i<stopY; i+=step ) {
	            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
	            leapY += step; if (leapY > stopY) leapY = stopY; timer++;
	        } return;
	    }
	    for ( var i=startY; i>stopY; i-=step ) {
	        setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
	        leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
	    }
	}


	currentYPosition() {
		let self = this

	    // Firefox, Chrome, Opera, Safari
	    if (self.pageYOffset) return self.pageYOffset;
	    // Internet Explorer 6 - standards mode
	    if (document.documentElement && document.documentElement.scrollTop)
	        return document.documentElement.scrollTop;
	    // Internet Explorer 6, 7 and 8
	    if (document.body.scrollTop) return document.body.scrollTop;
	    return 0;
	}

	// get vertical position of element
	elmYPosition(eID) {
		let self = this
		console.log(eID)
	    var elm = document.querySelector(eID);
	    console.log(elm)
	    var y = elm.offsetTop;
	    var node = elm;
	    while (node.offsetParent && node.offsetParent != document.body) {
	        node = node.offsetParent;
	        y += node.offsetTop;
	    } return y;
	}

	// random range between two numbers
	randomRange(r1, r2){
	    r1 = Math.ceil(r1);
	    r2 = Math.floor(r2);
	    return Math.floor(Math.random() * (r2 - r1 + 1)) + r1;
	}

	// phaser wrapper for a setTimeout fixed to the game clock
	setTimeout(callback, delay){
		this.game.time.events.add(delay, (function(){callback()}), this.game)
	}

	// phaser wrapper for a setInterval fixed to the game clock
	setInterval(callback, interval){
		let returnInterval = this.game.time.events.loop(interval, (function(){callback()}), this.game)
		return returnInterval
	}	

}

export default Utils