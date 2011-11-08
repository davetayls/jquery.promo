// transition to fade between slides
var fadeTransition = function(linkToActivate, slideIndexToActivate){
    this.allSlides.css({'z-index': 1, left: 0});
    this.currentSlide.css({'z-index': 2});
    if (this.currentSlide[0] !== this.nextSlide[0]){
        this.nextSlide.css({
            'z-index': 3,
            opacity: 0
        })
        .animate({
            opacity: 1
        },(this.transitionSpeed * 1000),'swing');
    }
};
