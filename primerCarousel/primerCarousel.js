//--------------------------------
// Primer Carousel - jQuery Plug-in
// Jason Lunsford
// v1.0
// primerCarousel.js
//--------------------------------
// Usage:
// $("#carouselRoot").primerCarousel();
//
// Feature Enhancement and Improvement List:
// 1) Add cool animation options to advanceFilmStrip(), expose them via
//    the defaults object for public consumption (ex: "roller" sliding, fades, etc)
// 2) Add rotation feature to allow reverse carouseling
// 3) Clean up parameters passed from user (and from default) better, timer is vulnerable
//	  vulnerable to borking if user passes crazy numbers - will set default speed to 4000ms
//    if user tries passing a value that is not a number (not perfect)
// 4) KNOWN IE & SAFARI DEFECT: Not handling my timing counter (maybe?), anyway when thumbnail clicked and cycle
//    resumed the carousel does not advance to the next slide as it should (tested in IE 7-9)


(function ( $ ) {
	$.fn.primerCarousel = function( options ) {
		
		// Default and user passed options - passing an empty object as parameter 1 to prevent
		// accidental overwriting of the default object
		var globlalOps 				= $.extend( {}, $.fn.natCarousel.defaults, options );
		
		var filmStripWidth 			= 0;
		var thumbNailCount 			= 1;
		
		var $filmStrip 				= $(".filmStrip");
		var $focusArrow				= $("#focusArrow");
		var $filmStripCollection 	= $(".filmStrip").find("div");
		var $smallImageCollection 	= $(".smallPictureRow").find("img");
		
		var widthOfLargeImage 		= $filmStripCollection.width();
		var widthOfSmallImages 		= $smallImageCollection.width();
		var thumbNailArraySize 		= $smallImageCollection.length;
		
		// Initialize timer variable
		var rotateTimer;
				
		// Prepare film strip element that contains the large image slides
		$filmStripCollection.each(function() {
			var $this = $( this );
			filmStripWidth += $(this).width();
		});
		$filmStrip.width(filmStripWidth);
		
		// Carousel Control - Manual
		$smallImageCollection.on("click", advanceFilmStrip);
		
		// Carousel Control - Automatic
		rotateTimerStart();
		
		// If user rolls over the carousel pause cycling, resume once they leave area
		this.on("mouseover", function() {
			rotateTimerClear();
		}).on("mouseleave", function() {
			rotateTimerStart();
		});
		
		// Initialize, Set, and Clear Interval
		function rotateTimerInit() {
			advanceFilmStrip(thumbNailCount);
			( thumbNailCount < 3 ) ? thumbNailCount++ : thumbNailCount = 0; // basic position counter
		}
		function rotateTimerStart() {
			if ( typeof globlalOps.speed !== "number" ) { globlalOps.speed = 4000; }
			rotateTimer = setInterval(rotateTimerInit, globlalOps.speed);
		}
		function rotateTimerClear() { clearInterval(rotateTimer); }
		
		// Carousel Behavior
		function advanceFilmStrip(thumbIndex) {
			// Handle two use cases: the thumbnail clicked or function fired automatically
			if ( typeof thumbIndex === "object" ) {
				var $this = $( this );
				var thumbPosition = $smallImageCollection.index(this);
				var smallImageLeftMargin = $this.css("marginLeft");
			} else {
				var thumbPosition = thumbIndex;
				var smallImageLeftMargin = $smallImageCollection.eq(thumbIndex).css("marginLeft");
			}
			// Convert px measurement to an integer
			smallImageLeftMargin = (smallImageLeftMargin.replace("px","")) * 1; // quick hack to convert string -> integer
			// Calculate current position
			var filmStripPosition = widthOfLargeImage * thumbPosition * -1;
			var focusArrowPosition = (widthOfSmallImages + smallImageLeftMargin) * thumbPosition;
			// move the images
			$filmStrip.css("left",filmStripPosition+"px");
			$focusArrow.css("left",focusArrowPosition+"px");
		}

	};
	
	// Full list of configurable behavior here - for usability sake plugin documentation only
	// need include the basic options. We merge the two config behavior objects above.
	$.fn.natCarousel.defaults = {
		speed:4000
	};
}( jQuery ));
