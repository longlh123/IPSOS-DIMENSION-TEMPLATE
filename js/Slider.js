class Slider{

    constructor(){
        this.slide = document.getElementById('slider');

        this.arNext = document.querySelector('.slide-arrow-arnext');
        this.arPrevious = document.querySelector('.slide-arrow-arprevious');

        this.autoPlay = true; //Indicates that the audio/video should start playing as soon as it is loaded.
        this.duaEffect = 900; //time của Effect
        this.duaration = 5000; //timeout của một slide
        this.current = 0;
        this.prev = 0;
        this.timer;

        if(!this.slide) return;

        this.init();
    }

    init(){
        let self = this;

        window.addEventListener('load', function(){
            self.start();
        }, false);
    }

    start(){
        let s = this;

        //this.nav();
        //this.arrow();
    }
}