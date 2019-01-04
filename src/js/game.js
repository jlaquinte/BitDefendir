import isMobile, {isIOS} from './utils/mobile-check'
import Preload from './states/preload'
import Intro from './states/intro'
import Tutorial from './states/tutorial'
import Main from './states/main'
import Results from './states/results'
import browserDetector from './utils/browser-detector'
import Utils from './utils/_utils'
import Site from './site'
import Tracking from './utils/tracker'

class Game extends Phaser.Game{
	constructor() {

        const width = 1344
        const height = 832

        // decided to default to canvas for performance
        let renderEngine = ( browserDetector.isEdge() || browserDetector.isIe11() || browserDetector.isIe10() || browserDetector.isFirefox() ) ? Phaser.CANVAS : Phaser.WEBGL
        
        super(width, height, renderEngine, 'game-container', null, true)

        // reset high score
        this.currHighScores = ['00000','00000','00000']

        // add game states
        this.state.add('Preload', Preload, false)
        this.state.add('Intro', Intro, false)
        this.state.add('Tutorial', Tutorial, false)
        this.state.add('Main', Main, false)
        this.state.add('Results', Results, false)
        
        // grab DOM elements
        this.gameContainer = document.querySelector('#game-container')
        let gameWrapper = document.querySelector('.game-wrapper')
        let pauseMessage = document.querySelector('.pause-message')

        // init tracking module
        this.tracking = new Tracking()

        // add classes to hide elements on mobile
        if( isMobile() ){
            gameWrapper.classList.add('mobile')
            pauseMessage.classList.add('mobile')
        }

        // mute audio when window is out of focus
        window.addEventListener("blur", function () {
                Howler.mute(true)
        }, false);

        // unmute audio when window is in focus
        window.addEventListener("focus", function () {
                Howler.mute(false)
        }, false)

        //stop spacebar and arrows on document body
        window.addEventListener('keydown', function(e) {
          if( (e.keyCode == 32 && e.target == document.body) 
            || (e.keyCode == 37 && e.target == document.body) 
            || (e.keyCode == 38 && e.target == document.body) 
            || (e.keyCode == 39 && e.target == document.body) 
            || (e.keyCode == 40 && e.target == document.body)) {
            e.preventDefault()
          }
        }) 

        //if mobile apply mobile class to site container
        //for css orientation updates
        let siteContainer = document.querySelector('.site-container')

        if( !isMobile() ) this.state.start('Preload')
    }
}



document.addEventListener('DOMContentLoaded', event => {new Game})