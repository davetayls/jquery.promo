/*
    jquery.promo v2
    jQuery Carousel Core Plugin
    Copyright 2010, Dave Taylor (@davetayls, the-taylors.org)
    Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function($){
	
	// default transition function, sliding carousel
	var carouselTransition = function(slideIndexToActivate){
		var slidePosLeft = slideIndexToActivate * this.imageWidth;
		
		//Slider Animation
		this.carouselWrapper.animate({ 
			left: -slidePosLeft
		}, (this.transitionSpeed * 1000));
	};
	
	$.fn.promo = function(customOpt){
        var options = jQuery.extend({
			auto: true,
            switchSpeed: 7,
            transitionSpeed: 0.5,
            transition: carouselTransition
        }, customOpt);
        
		this.each(function(){
            var settings = jQuery.extend({}, options);
			settings.nextSlideLink = null;
			settings.userPaused = false;
			
			var container = $(this),
				controller = container.find('.cp-promo-controller'),
				carousel = container.find('.cp-promo-carousel'),
				carouselWrapper = settings.carouselWrapper = carousel.children(':first'),
				carouselItems = settings.allSlides = carouselWrapper.children(),
				switchTimerID,
				rotate,
				start,
				stop,
				updateSlideLinks;

			container.addClass('cp-promo-active');
			
			//Set Default State of each portfolio piece
			controller.find('li:first').addClass("nav-selected");
				
			//Get size of images, how many there are, then determin the size of the image reel.
			settings.imageWidth = carousel.width();
			settings.imageSum = carouselItems.size();
			settings.imageReelWidth = settings.imageWidth * settings.imageSum;
			
			//Adjust the image reel to its new size
			carousel.css({
				overflow: 'hidden'
			});
			carouselWrapper.css({
				position: 'relative',
				'width' : settings.imageReelWidth
			});
			
			// position each item within the carousel
			carouselItems.each(function(i){
				var item = $(this);
				item.css({
					position: 'absolute',
					top:'0px',
					left: (i*settings.imageWidth) + 'px'
				});
			});
			
			//Paging + Slider Function
			rotate = function(){
				//var linkToActivate = $(settings.nextSlideLink.find('a').attr("href"));
				var slideIndexToActivate = settings.nextSlide.length > 0 ? carouselItems.index(settings.nextSlide): 0; //Get number of times to slide
				
				if (typeof options.transition === 'function'){
				    if (options.transition.call(settings, slideIndexToActivate) !== false){
				        controller.find('li').removeClass('nav-selected'); //Remove all active class
				        settings.nextSlideLink.addClass('nav-selected'); //Add active class
                        
                        // update current and next links
                        updateSlideLinks();
				    }
				}else{
				    throw 'jquery.promo needs a transition function on options.transition';
				}
			}; 
			
			// get current and next slide links
			updateSlideLinks = function(setNext){
                settings.currentSlideLink = controller.find('li.nav-selected');
			    if ( settings.currentSlideLink.length === 0) { //If paging reaches the end...
				    settings.currentSlideLink = controller.find('li:first'); //go back to first
			    }
                settings.nextSlideLink = setNext ? setNext.parent() : settings.currentSlideLink.next();
			    if ( settings.nextSlideLink.length === 0) { //If paging reaches the end...
				    settings.nextSlideLink = controller.find('li:first'); //go back to first
			    }
                settings.currentSlide = carouselWrapper.find(settings.currentSlideLink.find('a').attr('href'));
                settings.nextSlide = carouselWrapper.find(settings.nextSlideLink.find('a').attr('href'));
			};
			//Rotation + Timing Event
			start = function(){
                updateSlideLinks();
				switchTimerID = setInterval(rotate, (options.switchSpeed * 1000));
			};
			stop = function(){
				clearInterval(switchTimerID); //Stop the rotation
			};
					
			//On Hover 
			carouselWrapper.hover(function() {
				stop();
			}, function() {
				if (!settings.userPaused){ start(); }
			});
			
			//On Click
			var linkAction = function() {	
				var this$ = $(this);
				updateSlideLinks(this$); //Activate the clicked paging
				stop();
				settings.userPaused = true; // Prevents auto start from hover
				rotate(); //Trigger rotation immediately
				return false; //Prevent browser jump to link anchor
			};
			controller.find('a')
				.click(linkAction);
				//.focus(linkAction);	

			//Run function on launch
			if (settings.auto){
				start();
			}
		});
	}
	
	
	
})(jQuery);
