import {ScrollTrigger} from './scroll-trigger'

ScrollTrigger.create('.at-st-htest', function(timestamp:number) {
    this.element.style.setProperty('--at-progress', this.progress)
})
