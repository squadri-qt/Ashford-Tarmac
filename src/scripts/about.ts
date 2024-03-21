import {getGsap} from '../scripts/gsap'

await (async () => {
  const gsap = getGsap()
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
            end: `top ${opt.offset}`
        }
    })
    const rw = `${roller.offsetWidth}px`
    tl.to(lines.slice(1), {left: 0, stagger: 0.25, duration: opt.lines})
    tl.to(lines[0], {left: 0, duration: opt.lines})
    tl.to(roller, {left: `-${rw}`, duration: opt.lines})
    tl.to(roller, {left: `calc(100% - ${rw})`, duration: opt.tarmac})
    tl.to(tarmac, {width: '100%', duration: opt.tarmac}, '<')
  }

  const how_we_work_sections = () => {
    const root = document.querySelector('[data-at-hww1=root]')
    if (!root) return
    const headers = [...root.querySelectorAll('[data-at-hww1=header] > h3')]
    const progress = root.querySelector('[data-at-hww1=progress]')
    const progress_bar = progress.nextElementSibling
    const content = [...root.querySelectorAll('[data-at-hww1=content] > div')]
    const trigger = root

      const tl = gsap.timeline({
          scrollTrigger: {
              trigger,
              pin: true,
              start: 'top top',
              scrub: 1,
              end: () => `+=5000`
          }
      })
      const update_progress = function() {
          const percentage = `${Math.ceil(this.progress() * 100)}%`
          progress.textContent = `${Math.ceil((1 - this.progress()) * 100)}%`
      }
    const state = {
      active: 0
    }
    headers.forEach((hdr, i) => {
      const index = i
      tl.set(hdr, {color: 'var(--r)', onComplete: () => state.active = index})
      tl.to(content[i], {left: 0})
      tl.to(progress_bar, {width: '0', onUpdate: update_progress}, '<')
      tl.addLabel(`lbl${index}`)
      tl.to(progress_bar, {width: '100%', onUpdate: update_progress, duration: 5})
      if (i < content.length - 1) {
        tl.to(content[i], {left: '100%'})
        tl.set(hdr, {color: ''})
      }
          hdr.addEventListener('click', () => {
              const st = tl.scrollTrigger
              window.scrollTo({top: st.labelToScroll(`lbl${index}`), behavior: 'smooth'});
          })
    })

    root.querySelector('[data-at-hww1=next')?.addEventListener('click', () => {
      const st = tl.scrollTrigger
      state.active = (state.active + 1) % content.length
      window.scrollTo({top: st.labelToScroll(`lbl${state.active}`), behavior: 'smooth'});
    })
  }

  how_we_work_sections()
  fliptastic("[data-at-flip]", {duration: 0.125});
  how_we_work_roller({offset: '-=5000'});
})()
