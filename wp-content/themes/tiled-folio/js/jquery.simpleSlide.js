//
//
//	simpleSlide 1.6
//
//	website:http://www.simplesli.de/
//	author: David Drew
//	email:  david@ddrewdesign.com
//	
//
//	simpleSlide is a jQuery plugin that addresses the problem of lack of designer control over
//  their slideshow plugin. The philosophy was to create a plugin that would take care of the
//	mundane issues of instantiating a slideshow plugin, but make it easy for a designer to
//	manipulate the parts of the process that they would want control over, such as visual
//	treatment, integration and additional functionality.
//
//	Parameters
//	----------
//
//	simpleSlide is instantiated, at minimum, like this:
//	
//	simpleSlide();
//
//	Upon activating this function, simpleSlide goes into your DOM and finds several key
//	elements. The simpleSlide HTML structure (and key elements) will look like this:
//
//	<div class="simpleSlide-window" rel="group_name">
//		<div class="simpleSlide-tray" rel="group_name">
//			<div class="simpleSlide-slide" rel="group_name">
//				/* Individual slide content. If content is merely an image, simpleSlide will
//				 * automatically configure each slide to accommodate the slide. If you have
//				 * opted to create content that doesn't have an apparent width or height, it
//				 * it may be in your best interest to give this content a defined width and
//				 * height. You do not, however, need to define the "simpleSlide-slide" class'
//				 * width and height. The function will take care of that for you.
//				 */
//			</div>
//		</div>
//	</div>
//
//	The user may also instantiate a graphical representative element vis-a-vis the simpleSlide
//	status element. This element is entirely optional, and will or will not be placed based on the
//	user's desire to place the following elements into their HTML:
//
//	<div class="simpleSlideStatus-tray" rel="group_name">
//		<div class="simpleSlideStatus-window" rel="group_name"></div>
//	</div>
//	
//	Please visit http://www.simplesli.de and click on "features" for more configuration information.
//
//	It should be noted, however, that after simpleSlide() has processed this structure, each slide
//  will house an "alt" attribute with an integer as its value. This integer (counting up from '1')
//	represents that slide's "page" placement among the slides in the window. This is to help the
//	designer set up functionality that allows page jumping.
//
//	The buttons that control the slideshow may be used in whatever manner you wish, and anywhere
//	in the site's structure that you wish to place them. They only must have the same "rel" as
//	the window (and accompanying elements) you wish for them to control. simpleSlide() automatically
//	treats them as clickable regions. "jump-to" is special in that you also have to pass the
//	desired "jump-to" page through the "alt" attribute.
//	
//	<div class="left-button" rel="group_name"></div>
//	<div class="right-button" rel="group_name"></div>
//  <div class="jump-to" rel="group_name" alt="1"></div>
//
//	The user is also allowed several options that they may customize. They are instantiated like this:
//	
//	simpleSlide({
//		'status_width': 20,				// Integer. Sets the width of the status slideshow's window element.
//		'status_color_inside': '#000', 	// String. Sets color of status window element.
//		'status_color_outside': '#FFF', // String. Sets color of status tray element.
//		'set_speed': 500, 				// Integer. Sets speed of all animations. Represented in milliseconds.
//		'fullscreen' : 'false',			// String. 'true' sets slide window for full screen. For obvious reasons, cannot
//										   work with more than one simpleSlide window per page.
//		'swipe' : 'false', 				// String. 'true' turns on swipe functionality for touch devices.
//		'callback': 'function()'		// String. Sets callback to actuate after simpleSlide initial config.
//	});
//
//	If you have any further questions on the usage of simpleSlide, or suggestions on making it better,
//	please e-mail me at david@ddrewdesign.com, or visit http://www.ddrewdesign.com/contact/ to email me.
//	Thank you for using this plugin, and I hope you enjoy it. I had a blast making it.
//
//

function simpleSlide(incoming_options) {
	jQuery(function($) {
		var options = {
			'status_width': 20,
			'status_color_inside': '#000',
			'status_color_outside': '#aaa',
			'set_speed': 500,
			'fullscreen' : 'false',
			'swipe': 'false',
			'callback': 'function()'
		};
		
		$.extend(options, incoming_options);
			
		$.ss_options = options;
	
		$('.simpleSlide-slide').css('opacity', '0');
		
		$('.simpleSlide-tray').css('margin', '0');
		
		$('.simpleSlide-window').prepend('<span id="ssLoading" style="color: #808080;font-family:Helvetica, Arial, sans-serif;font-size: 12px; margin: 10px 0 0 10px;display: block">Loading slides...</span>');
		
		var no_of_images = $('.simpleSlide-slide img').size();

		if(no_of_images > 0) {
			
			var images = new Array();
			var i = 0;
			$('.simpleSlide-slide img').each( function() {
				images[i] = $(this).attr('src');
				i++;
				// added to fix preloading function:
				//var imageObj = new Image();
				//imageObj.src = images[i];
				//imageObj.onLoad=imagesLoaded();
			});
			i = 0;
/*			var k=0;
			function imagesLoaded() {
				k = k + 1;
				alert(k + 'loaded');
				if (k == no_of_images) { 
					alert("initializing");
					ssInit();
				}
			}
			*/
			
			
			// The below simpleslide function doesn't actually appear to preload images... Phil's replaced it with above
			$(images).each( function(){
				var imageObj = new Image();
				imageObj.src = images[i];
                                
				if(imageObj.complete){
					no_of_images--;
					i++;
					if(no_of_images == 0) {
						ssInit();
					};
				} else { 
				    $(imageObj).load( function() {
				  	    no_of_images--;
					    i++;
					    if(no_of_images == 0){
					 	    ssInit();
					    };
				    });
				};
			});
		} else {
			ssInit();
		};	
	});
};

function ssInit(){
	/* Set the dimensions of each simpleSlide window and tray
	 * based on the size of the first 'slide' inside that window.
	 * Every slide within a given tray/window should be uniform in dimensions.
	 * Also, set Status Window size, if it's being used. Fire callback when finished.
	 */
	 
	jQuery(function($) {
				
		// control hover for slideshow buttons:
		$(".slide-button").hover( function () {
				$(this).css('opacity','1.0');
			},
			function () {
				$(this).css({'opacity':'0.6'});
		});
		
		// for each actual caption, set x position based on window size
//		$('.captiontext').each(function(index) {
//			if ( $(this).html() == '' ) { $(this).css('display','none'); } // hide empty captions
//			$(this).css('left',$(window).width()*index); // position captions on the left side of each slide
//		});	
		
		$('.simpleSlide-window').each( function() {	
			if($.ss_options.fullscreen == 'true'){
				$('body').css('overflow', 'hidden');				
			}
			var window_contents = $(this).html();	
			var cleaned_contents = removeWhiteSpace(window_contents);
			$(this).html(cleaned_contents);
														
			var slide_count = $(this).find('.simpleSlide-slide').size();		
			$(this).find('.simpleSlide-slide').css('display','block');
			var window_height = $(this).find('.simpleSlide-slide').first().outerHeight();

			if($.ss_options.fullscreen == 'true'){
				fullScreen(this);
			};			

			// make sure all the slides are displayed inline, float left, to make the margin-animation properties work:
			$(this).find('.simpleSlide-slide').css({
				'display':'inline',
				'float':'left'
			})
			// hide all but the first image to speed transitions in webkit browsers:
			$(this).find('.simpleSlide-slide').not(":first").find('img').css({
				'display':'none'
			})			

			var window_width = $(this).find('.simpleSlide-slide').first().outerWidth();		
			
			var window_rel = $(this).attr('rel');

			if($.ss_options.fullscreen == 'false'){
				$(this).css({
					'height': window_height,
					'width': window_width,
					'position': 'relative'
				});
			};			
						
			$(this).css('overflow','hidden');

			setTraySize(this, slide_count, window_width);
			
			setSimpleSlideStatus(window_rel, window_height, window_width, slide_count);
			
			setPaging(this);
	
			$(this).find('#ssLoading').remove();
						
			if($.ss_options.swipe == 'true' && !$.browser.msie){
				simpleSwipe(this);
			};
					
			$(this).find('.simpleSlide-slide').animate({
				'opacity': '1'
			}, 300, "swing");
		
		});
		
		/* Fire callback after completion of image load and simpleSlide initialization */
		if(typeof($.ss_options.callback) == 'function'){
			$.ss_options.callback.call(this);

		};
		
		/* Gives each slide an 'alt' with the slide number */
		function setPaging(this_window) {
			var page_count = 1;
			
			$(this_window).find('.simpleSlide-slide').each( function() {
				$(this).attr('alt', page_count);
				page_count++;
			});
		};
		
		function fullScreen(this_s_window){
			var base_img = new Image();
			base_img.src = $(this_s_window).find('img').first().attr('src');
			/*var rendered_img = $(this_s_window).find('img').first();*/
			var window_prop = $(window).width() / $(window).height();
			var image_prop = base_img.width / base_img.height;
			var wh = $(window).height();
			var ww = $(window).width();
			
			// the modified hacked-together version of simpleslide treats the slide window as full-screen, and then
			// allows letterboxed or fullscreen images to appear inside that slide window, rather than having "fullscreen"
			// be limited to the actual full screen:
			var slideH = $(this_s_window).height();
			var slideW = $(this_s_window).width();
			
			// the above variables need to be recalculated with this in mind:
			window_prop = slideW / slideH;
			wh = slideH;
			ww = slideW;
			
			// move caption objects to their position at the bottom of the screen:
			//var captionPosition = parseInt(Math.round(wh-25)); // aligns caption to nearly the bottom edge
			//var captionPosition = 60; // aligns caption to near the top
			//$('.caption-tray').css({
			//	'top': captionPosition
			//});
			// adjust heights of the control elements:
			$('.simpleSlideStatus-tray,.slideControlUnderlay,.right-button,.left-button').css({
				'top': wh/2-65
			});	
						
			// for each actual caption, set x position based on window size
			$('.captiontext').each(function(index) {
				if ( $(this).html() == '' || $(this).html() == '<h1></h1>' ) { $(this).css('display','none'); } // hide empty captions
				$(this).css('left',ww*index); // position captions on the left side of each slide
				$(this).css('marginLeft',0); // position captions on the left side of each slide
			});	
				
			// set slide size first:
			$(this_s_window).find('.simpleSlide-slide').css({
				'width': ww,
				'height': wh,
				'overflow': 'hidden'
			});				

			// Make fullscreen images for NON-LETTERBOXED slides:
			$(this_s_window).find('.simpleSlide-slide').not('.letterbox').each( function () {
				if(window_prop > image_prop){ // for windows wider than images
					var new_height = (ww / base_img.width) * base_img.height;
					var height_offset = (new_height - wh) / 2;
					$(this).find('img').attr('width', ww).attr('height', new_height).css({'marginLeft': 0,'marginTop':'-' + height_offset + 'px'});
	// THIS CODE REMOVED AND REPLACED WITH IMAGE REPOSITIONING IN LINE ABOVE BECAUSE margin-top MESSES UP LETTERBOXING				
	//				$(this_s_window).css({
	//					'marginLeft': 0, 							/* Reset to beginning */ 
	//					'marginTop':'-' + height_offset + 'px',
	//					'height': wh + height_offset
	//				});
				} else {
	
					var new_width = (wh / base_img.height) * base_img.width;
					var width_offset = (new_width - ww) / 2;
					$(this).find('img').attr('height', wh).attr('width', new_width);
					$(this).find('img').css({
						'marginLeft': '-' + width_offset + 'px',
						'marginTop': 0				
					});
					
					/* Reset from other orientation */
					$(this).css({
						'marginTop': 0,
						'height': wh
					});
				};
			});
			
			
			
			// ADDED BY PHIL SEATON -- IN FULLSCREEN MODE, I'M ADDING A LETTERBOXING FUNCTION TO MAKE LETTERBOXING
			// POSSIBLE. THIS IS ENABLED BY ADDING THE CLASS 'LETTERBOX' TO A PARTICULAR SLIDE.
			var letterboxImg = new Image();
			 $(this_s_window).find('.letterbox').each( function () {  // shrink the image to fit inside the slide
			// $(this_s_window).find('.simpleSlide-slide').not('.fullscreen-splash').each( function () {  // shrink the image to fit inside the slide
				// calculate the scaling factor for the image
				letterboxImg = null;
				letterboxImg = new Image();
				letterboxImg.width = $(this).find('img').first().attr('width');
				letterboxImg.height = $(this).find('img').first().attr('height');
				letterboxImg.src = $(this).find('img').first().attr('src');
				//var imgScale = ww / letterboxImg.width ;
				//var heightScale = wh / letterboxImg.height;
				// the letterboxing code should depend on the DOM width/height specs, not the actual IMAGE which may still be loading:
				var imgScale = ww / $(this).find('img').first().attr('width'); ;
				var heightScale = wh / $(this).find('img').first().attr('height');
				if ( imgScale > heightScale ) {
					imgScale = heightScale;
				}
				
				var newH,newW,offsetH,offsetW;
				newH = $(this).find('img').first().attr('height') * imgScale;
				newW = $(this).find('img').first().attr('width') * imgScale;
				//newH = letterboxImg.height * imgScale;
				//newW = letterboxImg.width * imgScale;				
				offsetH = (wh - newH) / 2;
				offsetW = (ww - newW) / 2;
				$(this).find('img').first().attr('width', newW ).attr('height', newH ).css({'marginLeft': offsetW,'marginTop':offsetH});
			});
			
						
			$(this_s_window).find('.simpleSlide-tray').css('marginLeft', 0);
			
		
		};
		
		/* Sets size of the "tray" that holds the "slides" */
		function setTraySize(slideWindow, count, viewer_width) {
			
			var slider_width = count * viewer_width;
			
			$(slideWindow).find('.simpleSlide-tray').css({
				'width': slider_width + 'px'
			});
			
		};	
		
		/* If user chooses to establish Status Window, this function will set
		 * the dimensions of the window based on the desired width.
		 * The window (and its inherent slide's) dimensions are a relative factor
		 * of the main window's size, so the status window will be proportionally
		 * the same as the main window and its tray.
		 */
		function setSimpleSlideStatus(this_rel, height, width, image_count) {
				
			var ratio = $.ss_options.status_width/width;
			//var status_height = ratio*height;
			var status_height = 12;
			
			$('.simpleSlideStatus-tray[rel="' + this_rel + '"]')
				.css({
					 'width': $.ss_options.status_width,
					 'height': status_height,
					 'background-color': $.ss_options.status_color_outside
				});
			
			$('.simpleSlideStatus-window[rel="' + this_rel + '"]')
				.css({
					 'width': $.ss_options.status_width / image_count,
					 'height': status_height,
					 'background-color': $.ss_options.status_color_inside
				});
			
			if(jQuery.support.opacity){
				$('.simpleSlideStatus-window .simpleSlideStatus-tray[rel="' + this_rel + '"]')
				   .css({
					   'opacity': '.5',
					   'background-color': $.ss_options.status_color_inside
				});
			};
			   
			if(!jQuery.support.opacity){
				$('.simpleSlideStatus-window .simpleSlideStatus-tray[rel="' + this_rel + '"]').css({
					'filter': 'alpha(opacity=50)',
					'background-color': $.ss_options.status_color_inside
				});
			};
		};
						
		/* Actuates upon the clicking of a left- or right-button classed element */
		$('.left-button, .right-button, .jump-to').live('click', function() {
			
			var rel = $(this).attr('rel');
			
			if (!$('div.simpleSlide-tray[rel="' + rel + '"]').is(':animated')) {
				simpleSlideAction(this, rel);
			};
		});
	});
};

function simpleSwipe(this_window) {
	// Default thresholds & swipe functions
	var defaults = {
		threshold: {
			x: $(this_window).width() * .15,
			y: $(this_window).height() * .1
		},
		swipeLeft: function() {
			simpleSlideAction('.right-button', $(this_window).attr('rel'));
		},
		swipeRight: function() {
			simpleSlideAction('.left-button', $(this_window).attr('rel'));
		},
		preventDefaultEvents: true
	};

	var options = $.extend(defaults, options);

	if (!this_window) return false;

	return $(this_window).each(function() {

		var me = $(this_window);

		// Private variables for each element
		var originalCoord = { x: 0, y: 0 };
		var finalCoord = { x: 0, y: 0 };

		// Screen touched, store the original coordinate
		function touchStart(event) {
			originalCoord.x = event.targetTouches[0].pageX;
			originalCoord.y = event.targetTouches[0].pageY;
		};

		// Store coordinates as finger is swiping
		function touchMove(event) {
			if (defaults.preventDefaultEvents){
				event.preventDefault();
			};
			finalCoord.x = event.targetTouches[0].pageX; // Updated X,Y coordinates
			finalCoord.y = event.targetTouches[0].pageY;
		};

		// Done Swiping
		// Swipe should only be on X axis, ignore if swipe on Y axis
		// Calculate if the swipe was left or right
		function touchEnd(event) {
			var changeY = originalCoord.y - finalCoord.y;
			if(changeY < defaults.threshold.y && changeY > (defaults.threshold.y*-1)) {
				changeX = originalCoord.x - finalCoord.x;

				if(changeX > defaults.threshold.x) {					
					defaults.swipeLeft();
				};
				if(changeX < (defaults.threshold.x*-1)) {					
					defaults.swipeRight();
				};
			};
		};

		// Swipe was canceled
		function touchCancel(event) { 
			console.log('Canceling swipe gesture...');
		};

		// Add gestures to all swipable areas
		this_window.addEventListener("touchstart", touchStart, false);
		this_window.addEventListener("touchmove", touchMove, false);
		this_window.addEventListener("touchend", touchEnd, false);
		this_window.addEventListener("touchcancel", touchCancel, false);

	});
};

function simpleSlideAction(action, rel_no) {
	jQuery(function($) {	
		var move_speed = $.ss_options.set_speed;
		var image_count = $('.simpleSlide-window[rel="' + rel_no + '"]').find('.simpleSlide-slide').size();
		var window_width = $('.simpleSlide-window[rel="' + rel_no + '"]').innerWidth();
		var status_window_width = $('.simpleSlideStatus-window[rel="' + rel_no + '"]').innerWidth();
		var status_tray_width = status_window_width * image_count;
		var current_tray_margin = parseInt($('.simpleSlide-tray[rel="' + rel_no + '"]').css('marginLeft'), 10);
		var current_status_window_margin = parseInt($('.simpleSlideStatus-tray .simpleSlideStatus-window[rel="' + rel_no + '"]').css('marginLeft'), 10);
		var current_status_tray_margin = parseInt($('.simpleSlideStatus-window .simpleSlideStatus-tray[rel="' + rel_no + '"]').css('marginLeft'), 10);
		
		if($(action).is('.jump-to')) {
			var to_page = $(action).attr('alt');
			var j_margin = (to_page - 1) * (window_width * (-1));
			var st_margin = (to_page - 1) * (status_window_width * (-1));
			var sw_margin = (to_page - 1) * (status_window_width);
			
			move(j_margin, sw_margin, st_margin);
		};
		
		if($(action).is('.left-button')) {		
			if(current_tray_margin == 0) {
				// wrap to the end of slide show if "back" is clicked on the first slide
				var j_margin = current_tray_margin - ((image_count - 1) * window_width);
				var st_margin = current_status_tray_margin - ((image_count - 1) * status_window_width);
				var sw_margin = current_status_window_margin + ((image_count - 1) * status_window_width);			
			} else {
				var j_margin = current_tray_margin + window_width;
				var st_margin = current_status_tray_margin + status_window_width;
				var sw_margin = current_status_window_margin - status_window_width;			
			};
			
			move(j_margin, sw_margin, st_margin);
		};
		
		if($(action).is('.right-button')) {
			if(current_tray_margin == (image_count - 1) * (window_width * -1)) {
				// wrap to beginning of slide show if "next" is clicked on the last slide
				var j_margin = 0;
				var st_margin = 0;
				var sw_margin = 0;					
			} else {
				var j_margin = current_tray_margin - window_width;
				var st_margin = current_status_tray_margin - status_window_width;
				var sw_margin = current_status_window_margin + status_window_width;			
			};
			
			move(j_margin, sw_margin, st_margin);
		};		
	
		function move(new_margin, new_swindow_margin, new_stray_margin) {
			// calculate which two images should be showing, make sure the rest are hidden to speed transitions
			// in webkit browsers. To do this, we'll just compare the new_margin to the current_tray_margin on 
			// the slide tray to arrive at an index
			var current_index = - current_tray_margin / window_width;
			var future_index = - new_margin / window_width ;
			
			// show the images we need for this motion:
			var $future = $('.simpleSlide-window').find('.simpleSlide-slide').eq(future_index);
			var $current = $('.simpleSlide-window').find('.simpleSlide-slide').eq(current_index);
			
			$future.find('img').css({'display':'inline'});
			$current.find('img').css({'display':'inline'});
			
			// hide the slides that don't appear in this animation:
			$('.simpleSlide-window').find('.simpleSlide-slide').not($future).not($current).find('img').css({
				'display':'none',
			});
			
			$('.captiontext').animate({
				'marginLeft': new_margin
			}, move_speed, "swing");
			
			$('.simpleSlide-tray[rel="' + rel_no + '"]').animate({
				'marginLeft': new_margin
			}, move_speed, "swing");
			
			$('.simpleSlideStatus-window .simpleSlideStatus-tray[rel="' + rel_no + '"]')
				.animate({
					'marginLeft': new_stray_margin				 
			}, move_speed, "swing");
			
			$('.simpleSlideStatus-tray .simpleSlideStatus-window[rel="' + rel_no + '"]').animate({
					'marginLeft': new_swindow_margin		 
			}, move_speed, "swing");		
		};
	});
};

function removeWhiteSpace(raw) {
	var cleaned_string = raw.replace(/[\r+\n+\t+]\s\s+/g, "");
	return cleaned_string;
};