$(function(){
	// By default, wordpress loads each slide statically into a child block of #SLIDELIST
	// After the page loads, each of these slides needs to be given CSS and nested DOM attributes
	// so that they can act as proper slides in the slideshow.
	$('#projectDescriptionContent').fadeOut(0);
	
	$('body.single-format-standard').add('body.page').css({overflow: "hidden",height: "100%"});
	
	// Make a new container to re-organize the slideshow
	var width = Math.min($('body').width(),1068);
	var height = $('body').height()-$('#menuBar').height()-30;
	
	var unprocessedSlides = $('#SLIDELIST').children();
	$('#positionIndicator span.denominator').html(unprocessedSlides.size());
	
	// organize dom for all the other slides
	unprocessedSlides.each(function(index){
		var slideHTML = $("<div class='structuredSlide'><div class='structuredSlideContents'></div></div>");
		var contentWidth = parseInt($(this).width());
		var contentHeight = parseInt($(this).height());
		slideHTML.find(".structuredSlideContents").css({
			width: contentWidth,
			height: contentHeight
		});
		slideHTML.find(".structuredSlideContents").append($(this));
		
		// add caption box if caption present
		var captionText = $(this).attr('caption');
		
		if ( captionText != "" && captionText != undefined ){
			var captionHTML = $("<div class='captionBox'>"+captionText+"</div>");
			console.log("appending" + captionHTML);
			slideHTML.find(".structuredSlideContents").append(captionHTML);
		}
		
		// Add slide to tray
		$('#structuredSlideTray').append(slideHTML)
	});
	
var setupSlides = function(){
	width = Math.min($('body').width(),1068);
	height = $('body').height()-$('#menuBar').height()-30;
	
	// put the project description in the first slide
	/*$('#projectDescriptionContent').css({
		width: width,
		height: height,
	});*/
	
	$('.structuredSlide').css({width: width, height: height});
	$(".structuredSlideContents").each(function(){
		$(this).css({
			width: width,
			height: height
		});
		
		var captionWidth = 0;
		if ($(this).find('.captionBox').size() != 0) {captionWidth = 255;}
		
		$(this).find('img').css({
			'max-width': width-captionWidth,
			'max-height': height
		}).removeAttr('width').removeAttr('height');
		/*$(this).css({
			"margin-top": parseInt(height - $(this).height())/2
		});*/
	});
	
	$('#projectDescriptionContent').css({width: width, height: height});
	$('#structuredSlideTray').css({width: parseInt(width*$('#structuredSlideTray').children().size()),height: height});
}
	

	
	// Swipe and slide events for the slide tray
	var previousX;
	var currentIndex = 0;
	var nextSlide = function(){
		if (!(currentIndex > $('#structuredSlideTray').children().size()-2) ) {
  			currentIndex++;
  		} else {
  			currentIndex = 0;
  		}
  		$('#positionIndicator span.numerator').html(currentIndex+1);
  		animateToSlide(currentIndex);
	};
	var prevSlide = function(){
		if (currentIndex != 0) {
  			currentIndex--;
  		} else {
  			currentIndex = $('#structuredSlideTray').children().size()-1;
  		}
		$('#positionIndicator span.numerator').html(currentIndex+1);
	  	animateToSlide(currentIndex);
	};
	
	$('#structuredSlideBox').on('swipeleft', function(e) {
  		nextSlide();
	}).on('swiperight', function(e) {
  		prevSlide();
	}).on('movestart', function(e) {
		$('#structuredSlideTray').addClass("noTransition");
		previousX =	$('#structuredSlideTray').position().left;
	}).on('move', function(e) {
		// keeps slidetray aligned with finger during swipes
		var left = e.distX;
		var newX = previousX+left;
		$('#structuredSlideTray').stop().css({left: newX});
	}).on('moveend', function(e) {
		// finger picked up. Scroll back to original slide or new slide if swipe gesture takes over
		animateToSlide(currentIndex);
	});
	
	// for videos
	$('iframe').mouseover(function(){
		$('#structuredSlideBox').trigger('mouseup');
	});
	
	// handle button clicks
	$('#btn_nextSlide').on('click',function(){
		nextSlide();
	});
	$('#btn_prevSlide').on('click',function(){
		prevSlide();
	});
	
	var animateToSlide = function(slideIndex) {
		$('#structuredSlideTray').removeClass("noTransition");
		previousX = -slideIndex*width;
		$('#structuredSlideTray').css({left: previousX});
	}
	
	
	// Having reorganized, it's time to show the slideshow box
	setupSlides();
	
	$(window).resize(function() {
  		setupSlides();
  		animateToSlide(currentIndex);
	});
	
	
	
	
	
	var toggleButtons = function(){
		return $('#btn_prevSlide').add('#btn_nextSlide').add('#positionIndicator')
	}
	
	// Handle clicking "about this project"
	$('#btn_aboutProject').on("click",function(){
		$('#projectDescriptionContent').fadeToggle();
		var title = "About This Project";
		if ($(this).html() == title) title = "Back To Project Images";
		$(this).html(title);
		toggleButtons().fadeToggle();;
	});
	
	// For permanent pages, take the navbar into a different non-slideshow mode:
	if ($('body').hasClass("page")) {
		toggleButtons().hide(0);
		$('#btn_aboutProject').hide(0);
		$('#projectDescriptionContent').fadeToggle();
	}
	
	
	
});