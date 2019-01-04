/* Javascript for the website */
(()=>{

	let startBtn = document.querySelector('.start-btn')
	
	// scroll to game view on button click
	if( startBtn ){
		startBtn.addEventListener('click',()=>{
			$('html, body').animate({
				scrollTop: $('.game').offset().top
			}, 650, function(){});
		})
	}

	// set up slick.js carousel
	$(document).ready(function(){
	  $('.tutorial-carousel').slick({
	  	centerMode: true,
	  	variableWidth: true,
	  	mobileFirst: true,
		prevArrow:"<img class='a-left control-c prev slick-prev' src='/images/site/carousel_arrow_left.png'>",
      	nextArrow:"<img class='a-right control-c next slick-next' src='/images/site/carousel_arrow_right.png'>"	  	
	  });
	});

})()