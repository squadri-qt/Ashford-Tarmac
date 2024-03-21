import {getGsap} from './gsap'

function transform(x1, y1, x2, y2, sx, sy) {
    this.targets().forEach((t, i) => {
        t.style.setProperty('transform', `translate(${x1 + (x2 - x1) * (this.progress() * sx)}vw, ${y1 + (y2 - y1) * (this.progress() * sy)}vh)`)
    })
}

function scrolltrigger_text(container, ...targets) {
  const gsap = getGsap()
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

function service_tabs(root, alt) {
  const gsap = getGsap()
  const opt = {
      anim: alt ?? 'stagger'
  }
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
          if (opt.anim === 'stagger') {
              // fails on mobile
              gsap.to(buttons[j].h3, {position: 'relative', left: `${iw}%`, opacity: 0})
              gsap.to(buttons[i].h3, {position: 'relative', left: `${iw}%`, opacity: 1})
              gsap.to(buttons[j].line, {position: 'relative', left: `${iw}%`, delay: 0.1, opacity: 0})
              gsap.to(buttons[i].line, {position: 'relative', left: `${iw}%`,  delay: 0.1, opacity: 1})
              gsap.to(buttons[j].p, {position: 'relative', left: `${iw}%`, opacity: 0, delay: 0.2})
              gsap.to(buttons[i].p, {position: 'relative', left: `${iw}%`, opacity: 1, delay: 0.2})
              //gsap.to(buttons[j].img, {position: 'relative', left: `${iw}%`, opacity: 0, delay: 0.3})
              //gsap.to(buttons[i].img, {position: 'relative', left: `${iw}%`, opacity: 1, delay: 0.3})
              return
          }

          gsap.to(tc, {left: `${i * -100}%`})
      })
  })
}

async function process_section(selector) {
    const gsap = getGsap()
    const targets = [...document.querySelectorAll(selector)].map(root => ({
        root,
        content: [...root.querySelector('[data-at-pin-content]')?.children],
    }))
    
    const wmm = window.matchMedia('screen and (min-width: 1024px)');
    let clean_up = []
 
    const update = ({root, content}, isDesktop) => {
        const trigger = root;
        const prg = root.lastElementChild?.firstElementChild
        const prg_txt = prg.children[0]
        const prg_bar = prg.children[1].children[0]

        let tl = gsap.timeline({
            ease: 'none',
            onUpdate: function() {
                const h = `${Math.ceil(this.progress() * 100)}%`
                prg_txt.textContent = h
                prg_bar.style.height = h
            },
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
            // if ((i % 2) == 1) {
            //     tl.to(last_img.children[0], {
            //         onUpdate: transform,
            //         onUpdateParams: txt_off
            //     }, '<+=0.25')
            //     last_img = content[i+1].children[1]
            //     tl.to(last_img, {
            //         onUpdate: transform,
            //         onUpdateParams: txt_on
            //     }, '<+=0.25')
            // }
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

export {scrolltrigger_text, service_tabs, process_section}
