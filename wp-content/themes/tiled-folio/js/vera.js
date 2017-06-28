$(function(){
	// One piece of basic setup, which happens only once, to make it so that horizontal-resize is handled nicely.
	var totWidth = 0;
	$('.rightButtonSet').children().each(function(){
		totWidth += $(this).width();
	});
	$('.leftButtonSet').css({
		'margin-right': totWidth
	});

	/* Project hovering */
	$(".projectCover").hover(function(){
		$(this).addClass('projectHover');
		/* look for 'proj-***' classes on self, and hover corresponding menu items */
		var classList = $(this).attr('class').split(/\s+/);
		$(classList).each(function(index){
			$("."+classList[index].replace("proj-", "menu-")).addClass('hover');
		});
	},function(){
		$(this).removeClass('projectHover');
		/* un-hover menu items that have been set to hover state */
		var classList = $(this).attr('class').split(/\s+/);
		$(classList).each(function(index){
			$("."+classList[index].replace("proj-", "menu-")).removeClass('hover');
		});
	});
	
	/* Menu-item hovering */
	$("#menuBar a").hover(function(){
		$(this).addClass('hover');	
		var classList = $(this).attr('class').split(/\s+/);
		$(classList).each(function(index){
			$("."+classList[index].replace("menu-", "proj-")).addClass('projectHover');
		});
	},function(){
		$(this).removeClass('hover');
		var classList = $(this).attr('class').split(/\s+/);
		$(classList).each(function(index){
			$("."+classList[index].replace("menu-", "proj-")).removeClass('projectHover');
		});
	});

	// some variables to use while calculating the final position for each project tile
	var height = parseInt($(".projectCover").first().height())+parseInt($(".projectCover").first().css('margin-left'))+parseInt($(".projectCover").first().css('margin-right'));
	var width = parseInt($(".projectCover").first().width())+parseInt($(".projectCover").first().css('margin-top'))+parseInt($(".projectCover").first().css('margin-bottom'));
	var projectsPerRow = Math.floor(Math.min($(window).width(),1098) / width);

	/* Menu-item clicking. Complicated, because we have to hide, show, and animate to absolute positions */
	$("#menuBar a").click(function(){
		var $that = $(this)	;
	
		function arrange() {
			// this function arranges the requested project squares in order
			var classList = $that.attr('class').split(/\s+/);
			$(classList).each(function(index){
				if (classList[index].indexOf("menu-") != -1) { // ignore other added classes, like hover states and things
					// show the projects corresponding to this category, or all for the "home" category
					var $visibleProjects;
					if (classList[index] == "menu-home") {$visibleProjects = $("#projectBucket a");}
					else {$visibleProjects = $("."+classList[index].replace("menu-", "proj-")).parent('a');}
				
					$visibleProjects.each(function(index){
						if ($(this).is(":visible")) {
							// if visible, animate position
							$(this).animate({
								top: Math.floor(index / projectsPerRow) * height,
								left: (index % projectsPerRow) * width
							});
						} else {
							// if invisible, set position and animate opacity
							$(this).css({
								top: Math.floor(index / projectsPerRow) * height,
								left: (index % projectsPerRow) * width
							}).fadeIn();
						}
					});
					$("#projectBucket a").not($visibleProjects).fadeOut();
				}
			});
		}
		
		arrange();
	});
	
	/* Resize browser width. Since we basically have to calculate absolute positions for all the projects regardless,
	*  There's essentially no overhead to go ahead and animate all of the row-reflows that might occur when someone
	*  resizes their browser window. */
	var doResizeArrangement = function(){
			$("#projectBucket a").filter(function(index) {
  				return $(this).css("opacity")==1;
				}).stop().each(function(index){
				var left = (index % projectsPerRow) * width;
				if ($(this).css('opacity') > 0.5) {
					// if visible, animate position
					$(this).animate({
						top: Math.floor(index / projectsPerRow) * height,
						left: left
					});
				}
			});
			
			$("#projectBucket").stop().animate({
				width: width * projectsPerRow
			}).css({
				height: Math.ceil($("#projectBucket a").size() / projectsPerRow) * height,
			});
			
			$('.centeredButtons').stop().animate({
				width: width * projectsPerRow
			});
	};
	
	doResizeArrangement();
	
	$(window).resize(function(){
		var maxWidth = Math.min($(window).width(),1098);
		var newProjectsPerRow = Math.floor(maxWidth / width);
		if (newProjectsPerRow != projectsPerRow) {
			projectsPerRow = newProjectsPerRow;
			doResizeArrangement();
		}
	});
})