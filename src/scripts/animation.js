import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

const scrolltrigger_text = (container, ...targets) => {
    targets.forEach(target => {
        gsap.to(target.firstElementChild, {
            marginLeft: target.dataset.atScrollPos ?? 0,
            scrollTrigger: {
                trigger: container,
                start: 'clamp(top bottom)',
                scrub: 2
            }
        })
    })
}

export {scrolltrigger_text}
