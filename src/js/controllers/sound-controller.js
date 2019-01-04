/**
*** Controller Class for handling audio
**/

import isMobile from '../utils/mobile-check'
import browserDetector from '../utils/browser-detector'
//not used yet for this project

class SoundController{

	constructor(game){
		this.game = game

		this.init()
	}

	init(){

	}

	play(snd, loop, delay){
		this.game.utils.setTimeout(()=>{ 
			if( browserDetector.isIe11() ){
				snd.play()
				if( loop ) snd.onStop.add(()=>{ snd.play() },this.game)
			}
			else{
				if( loop ) snd.loop = true				
				snd.play()
			}		
		}, delay)
	}

	stop(snd, delay){
		this.game.utils.setTimeout(()=>{ 
			if( browserDetector.isIe11() ){
				snd.onStop.removeAll()
				snd.stop()
			}
			else{
				if( snd.loop ) snd.loop = false				
				snd.stop()
			}	
		}, delay)
	}

	fadeIn(snd, loop, delay){
		this.game.utils.setTimeout(()=>{
			if( isMobile() ){
				if( loop ) snd.loop = true
				snd.play()
			}
			else if( browserDetector.isIe11() ){
				snd.play()
				if( loop ) snd.onStop.add(()=>{ snd.play() },this.game)
			}
			else{
				snd.fadeIn(1000, loop)
			}
		}, delay)
	}

	fadeOut(snd, delay){
		this.game.utils.setTimeout(()=>{
			if( isMobile() ){
				snd.loop =  false
				snd.stop()
			}
			else if( browserDetector.isIe11() ){
				snd.loop = false
				snd.onStop.removeAll()
				snd.stop()
			}
			else
				snd.fadeOut(1000)
		}, delay)
	}

	update(){

	}
}

export default SoundController