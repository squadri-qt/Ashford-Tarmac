import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

const transform = function(x1, y1, x2, y2, sx, sy) {
    this.targets().forEach((t, i) => {
        t.style.setProperty('transform', `translate(${x1 + (x2 - x1) * (this.progress() * sx)}vw, ${y1 + (y2 - y1) * (this.progress() * sy)}vh)`)
    })
}

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

const fliptastic = (selector, options) => {
    const opt = {duration: 0.25, easeIn: 'sine.in', easeOut: 'sine.out', ...(options ?? {})}
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

    const flip_final = (root, state) => {
        state.angle += 90
        state.flipping = false
    }
    const flip_next = (root, state) => {
        state.angle += 90
        state.scale = -state.scale
        gsap.set(state.s1, {display: 'none'})
        gsap.set(state.s2, scale_axis[state.axis]({scale: state.scale, display: ''}))
        state.s1 = state.s2
        gsap.to(root, rot_axis[state.axis](root, {
            deg: state.angle + 90,
            duration: opt.duration,
            onComplete: flip_final,
            onCompleteParams: [root, state],
            overwrite: true,
            ease: opt.easeOut
        }))
    }
    const flip_start = (root, state) => {
        gsap.to(root, rot_axis[state.axis](root, {
            deg: (state.angle + 90) - get_angle[state.axis](root),
            duration: opt.duration,
            onComplete: flip_next,
            onCompleteParams: [root, state],
            overwrite: true,
            ease: opt.easeIn
        }))
    }
    let clicked = false
    let reminder = window.setInterval(() => {
        if (!clicked) {
            const n = Math.floor(Math.random() * targets.length)
            gsap.to(targets[n].root, rot_axis[targets[n].root.dataset.atFlip](targets[n].root, {deg: 15, ease: 'elastic.in(1, 0.3)', onComplete: () => {
                gsap.to(targets[n].root, rot_axis[targets[n].root.dataset.atFlip](targets[n].root, {deg: 0, ease: 'elastic.out(1, 0.3)'}))
            }}))
        }
    }, 5000)

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
        const state = {
            side: 0,
            axis,
            s1: sides[0],
            s2: undefined,
            angle: 0,
            scale: 1
        }
        root.addEventListener('click', e => {
            if (!clicked) {
                clicked = true
                window.clearInterval(reminder)
                reminder = undefined
            }
            if (state.flipping) return
            state.flipping = true
            state.side = (state.side + 1) % sides.length
            state.s2 = sides[state.side]
            flip_start(root, state)
        })
    })
}

const process_section = (selector) => {
    const targets = [...document.querySelectorAll(selector)].map(root => ({
        root,
        content: [...root.querySelector('[data-at-pin-content]')?.children]
    }))
    
    const wmm = window.matchMedia('screen and (min-width: 1024px)');
    let clean_up = []
 
    const update = ({root, content}, isDesktop) => {
        const trigger = root;

        let tl = gsap.timeline({
            ease: 'none',
            scrollTrigger: {
                trigger,
                pin: true,
                start: 'top top',
                scrub: 1,
                end: () => `+=4000`
            }
        })

        let last_img = content[0].children[1]
        const txt_on = isDesktop ? [0, 100, 0, 0, 0, 1] : [100, 0, 0, 0, 1, 0]
        const txt_off = isDesktop ? [0, 0, 0, -100, 0, 1] : [0, 0, -100, 0, 1, 0]
        const img_on = isDesktop ?  [100, 0, 0, 0, 1, 0] : [0, 100, 0, 0, 0, 1]
        const img_off = isDesktop ? [0, 0, 0, -100, 0, 1] : [0, 0, -100, 0, 1, 0]

        content.forEach((c, i) => {
            const last = i == (content.length - 1)
            const text = c.children[0]
            if (last) return
            tl.to(text.children, {
                delay: 1,
                stagger: 0.1,
                onUpdate: transform,
                onUpdateParams: txt_off
            })
            tl.to(content[i+1].children[0], {
                onUpdate: transform,
                onUpdateParams: txt_on
            }, '<+=0.2')
            if ((i % 2) == 1) {
                tl.to(last_img.children[0], {
                    onUpdate: transform,
                    onUpdateParams: img_off
                }, '<+=0.25')
                last_img = content[i+1].children[1]
                tl.to(last_img, {
                    onUpdate: transform,
                    onUpdateParams: img_on
                }, '<+=0.25')
            }
         })

         tl.addPause('>+=1')
         
         return () => {
            tl.scrollTrigger.kill()
            tl.kill()
            trigger.removeAttribute('style');
            ([...trigger.querySelectorAll('[data-at-pin-content],[data-at-pin-content] [style]')]).forEach(x => x.removeAttribute('style'))
         }
    }

    const on_media = (isDesktop) => {
        clean_up.forEach(f => f())
        clean_up = targets.map(x => update(x, isDesktop))
    }

    wmm.addEventListener('change', e => on_media(e.matches))
    on_media(wmm.matches)
}

const roller_anim = (trigger_selector, dist, selector) => {
    const trigger = document.querySelector(trigger_selector)
    const svg_container = document.querySelector(selector)
    const animate = (svg) => {
        const roller = svg.getElementById('at-roller')
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger,
                start: 'bottom bottom',
                scrub: 1,
                end: 'bottom 50%'
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

const how_we_work_roller = (options) => {
    const opt = {
        lines: 4,
        tarmac: 10,
        offset: '',
        ...(options || {})
    }
    const roller = document.getElementById('at-hww-roller')
    const tarmac = roller?.nextElementSibling.querySelector('span')
    const lines = [...roller?.nextElementSibling.querySelectorAll(':scope > div > div')]
    if (!roller || !tarmac || !lines) return
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: roller,
            start: `top 80%${opt.offset}`,
            scrub: 1,
            end: `top 20%${opt.offset}`
        }
    })
    const rw = `${roller.offsetWidth}px`
    tl.to(lines.slice(1), {left: 0, stagger: 0.25, duration: opt.lines})
    tl.to(lines[0], {left: 0, duration: opt.lines})
    tl.to(roller, {left: `-${rw}`, duration: opt.lines})
    tl.to(roller, {left: `calc(100% - ${rw})`, duration: opt.tarmac})
    tl.to(tarmac, {width: '100%', duration: opt.tarmac}, '<')
}

export {gsap, scrolltrigger_text, service_tabs, fliptastic, process_section, roller_anim, how_we_work_roller}
