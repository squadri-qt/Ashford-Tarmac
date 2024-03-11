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

const service_tabs = (root, alt) => {
    const buttons = [...root.querySelectorAll('[data-at-show]')].map(b => ({
        button: b,
        target: root.querySelector(`[data-at-show-target="${b.dataset.atShow}"]`)
    }))
    const bg = buttons[0].button.parentElement.firstElementChild
    const tc = buttons[0].target.parentElement

    buttons.forEach((b, i) => {
        b.h3 = b.target.querySelector('h3')
        b.line = b.h3.nextElementSibling
        b.p = b.target.querySelector('p')
        b.img = b.target.querySelector('img')
        b.button.addEventListener('click', () => {
            const iw = i * -100
            const j = 1 - i
            const jw = i * -100
            gsap.to(bg, {left: b.button.offsetLeft})
            if (alt === 'stagger') {
                // fails on mobile
                gsap.to(buttons[j].h3, {position: 'relative', left: `${iw}%`, opacity: 0})
                gsap.to(buttons[i].h3, {position: 'relative', left: `${iw}%`, opacity: 1})
                gsap.to(buttons[j].line, {position: 'relative', left: `${iw}%`, delay: 0.1, opacity: 0})
                gsap.to(buttons[i].line, {position: 'relative', left: `${iw}%`,  delay: 0.1, opacity: 1})
                gsap.to(buttons[j].p, {position: 'relative', left: `${iw}%`, opacity: 0, delay: 0.2})
                gsap.to(buttons[i].p, {position: 'relative', left: `${iw}%`, opacity: 1, delay: 0.2})
                gsap.to(buttons[j].img, {position: 'relative', left: `${iw}%`, opacity: 0, delay: 0.3})
                gsap.to(buttons[i].img, {position: 'relative', left: `${iw}%`, opacity: 1, delay: 0.3})
                return
            }

            gsap.to(tc, {left: `${i * -100}%`})
        })
    })
}

const fliptastic = (selector) => {
    const delay = 3
    const perspective = 1200;
    const targets = [...document.querySelectorAll(selector)].map(el => ({
        root: el,
        sides: [...el.children],
        w: el.offsetWidth,
        h: el.offsetHeight
    }))
    const get_angle = {
        vert: el => {
            const offset = (el.parentElement.offsetHeight * 0.5) - (el.offsetTop + el.offsetHeight * 0.5)
            const angle = Math.atan(offset / perspective) * (180.0/Math.PI)
            return angle
        },
        horz: el => {
            const offset = el.offsetLeft + el.offsetWidth * 0.5 - el.parentElement.offsetWidth * 0.5
            const angle = Math.atan(offset / perspective) * (180.0/Math.PI)
            return angle
        }
    }
    const rot_axis = {
        'vert': (root, {deg, ...rest}) => ({rotateX: deg, ...rest}),
        'horz': (root, {deg, ...rest}) => ({rotateY: deg, ...rest})
    }
    const scale_axis = {
        'vert': ({scale, ...rest}) => ({scaleY: scale, ...rest}),
        'horz': ({scale, ...rest}) => ({scaleX: scale, ...rest})
    }

    targets.forEach(({root}) => (root.parentElement.style.perspective = `${perspective}px`))
    targets.forEach(({root, sides, w, h}, i) => {
        if (sides.length < 2) {
            return
        }
        const tl = gsap.timeline()
        root.style.transform = 'perspective-origin: center center'
        const axis = root.dataset.atFlip
        const offset = {
            vert: Math.atan((h * 0.5) / perspective) * (180.0/Math.PI),
            horz: Math.atan((w * 0.5) / perspective) * (180.0/Math.PI),
        }
        let angle = 0
        let has_click = false
        sides.forEach((s1, i) => {
            const s2 = sides[(i + 1) % sides.length]
            angle += 90
            tl.to(root, rot_axis[axis](root, {deg: angle - get_angle[axis](root), ease: 'power1.out', delay}))
            tl.set(s1, {display: 'none'})
            tl.set(s2, scale_axis[axis]({scale: ((i % 2) * 2) - 1, display: 'flex'}))
            angle += 90
            tl.to(root, rot_axis[axis](root, {deg: angle, ease: 'power1.in'}))
        });

        ([...root.querySelectorAll('[data-at-flip-play]')]).forEach(el => {
            el.addEventListener('click', e => tl.play(delay))
            has_click = true
        })

        if (!has_click)  {
            root.addEventListener('click', e => tl.play(delay))
        }

        tl.play()
    })
}

const process_section = (selector) => {
    const targets = [...document.querySelectorAll(selector)]

    targets.forEach(root => {
        const trigger = root
        const content = [...root.querySelector('[data-at-pin-content]')?.children]
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger,
                pin: true,
                start: 'top top',
                scrub: 1,
                end: () => `+=${root.offsetWidth * content.length * 2}`
            }
        })
        content.forEach((c, i) => {
            const w = c.offsetWidth
            const isLast = i == content.length - 1
            if (!isLast) {
                const items = [...c.querySelectorAll('h3,p,img'), c]
                tl.to(items, {
                    x: -w,
                    stagger: 0.1
                }, "+=1")
                tl.to(c.parentElement, {
                    onUpdate: function() {
                        c.parentElement.scrollTo({left: (i * w) + (this.progress() * w), behavior: 'smooth'})
                    }
                })
                tl.addPause("+=1")
            }
        })
    })
}

const roller_anim = (trigger_selector, dist, selector) => {
    const trigger = document.querySelector(trigger_selector)
    const svg_container = document.querySelector(selector)
    const animate = (svg) => {
        const roller = svg.getElementById('at-roller')
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger,
                start: `top top`,
                scrub: 1,
                end: () => `+=400`
            }
        })
        tl.to(roller, {x:53, y:976, duration: 3})
    }

    if (!svg_container || !trigger) {
        return
    }

    fetch("/roller-anim.svg").then(response => response.text()).then(svg => {
        svg_container.innerHTML = svg;
        animate(svg_container.firstElementChild)
    })
}

export {scrolltrigger_text, service_tabs, fliptastic, process_section, roller_anim}
