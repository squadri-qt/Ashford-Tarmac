import { getGsap } from './gsap';
await (async () => {
  const gsap = getGsap()
  gsap.to(".btext", {
      x: 600,
      scrollTrigger: {
          trigger: '.container',
          start: "clamp(top bottom)",
          scrub: 2,
          pinSpacing: false,
          markers:false,
      },
  });
  gsap.to(".btext2", {
      x: -600,
      scrollTrigger: {
          trigger: '.container',
          start: "clamp(top bottom)",
          scrub: 2,
          pinSpacing: false,
          markers:false,
      },
  });

  // animation for the red background
  const targetDiv = document.getElementById("target-div");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        gsap.to(targetDiv, {
          duration: 1, // Adjust duration as needed
          css: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
          ease: "power3.inOut" // Adjust easing if needed
        });
      }
    });
  });
  observer.observe(targetDiv);

  const serviceSection2 = (selector, scroll_distance_factor) => {
      const trigger = document.querySelector('[data-at-snap=services]')
      const progress = trigger?.querySelector('[data-progress]')

      if (!trigger || !progress) {
          return
      }
      const headers = [...trigger?.querySelectorAll('[data-at-service-id]')]
      const tl = gsap.timeline({
          scrollTrigger: {
              trigger,
              pin: true,
              start: 'top top',
              scrub: 1,
              end: () => `+=3000`
          }
      })
      const st = tl.scrollTrigger
      const update_progress = function() {
          const percentage = `${Math.ceil(this.progress() * 100)}%`
          progress.dataset.progress = percentage
          progress.nextElementSibling.style.marginRight = `${Math.ceil((1 - this.progress()) * 100)}%`
      }
      const state = {
          last_img: null,
          last_txt: null,
          pos: 0,
          tt_dur: []
      }

      headers.forEach((h, i) => {
          const service_id = h.dataset.atServiceId
          const images = [...trigger.querySelectorAll(`[data-at-service-img="${service_id}"]`)]
          const txt = trigger.querySelector(`[data-at-service-txt="${service_id}"]`)
          const tt = gsap.timeline({onUpdate: update_progress})

          h.addEventListener('click', () => {
              const st = tl.scrollTrigger
              window.scrollTo({top: st.labelToScroll(`hdr${h.dataset.atServiceId}`), behavior: 'smooth'});
          })

          tt.to(h, {color: 'red', duration: 0.01}, '<')
          if (i > 0) {
              tt.add(gsap.to(headers[i-1], {color: null, duration: 0}), '<')
              tt.to(images[0], {display: 'inline-block', left: '0'}, '<')
              tt.to(txt, {display: 'inline-block', left: '0', delay: 0.1}, '<')
              tt.to(state.last_img, {display: 'none', duration: 0}, '<')
              tt.to(state.last_txt, {display: 'none', duration: 0}, '<')
          }
          tt.addLabel(`hdr${service_id}`)
          for (let k = 1; k < images.length; ++k) {
              tt.to(images[k-1], {display: 'none', duration: 0}),
              tt.to(images[k], {display: 'inline-block'}, '<')
              state.last_img = images[k]
          }
          if (i < (headers.length - 1)) {
              state.last_txt = txt
              tt.to(state.last_img, {position: 'relative', left: '100%'}, '<')
              tt.to(state.last_txt, {position: 'relative', left: '130%', delay: 0.15})
          }
          tl.add(tt)
      })
      
      tl.getChildren(false, false, true).forEach(x => {
          const tk = Object.keys(x.labels)[0]
          const tv = x.labels[tk] + x.startTime()
          tl.addLabel(tk, tv)
      })

      trigger.querySelector('[data-at-services-next]')?.addEventListener('click', () => {
          state.pos = (state.pos + 1) % headers.length
          window.scrollTo({top: st.labelToScroll(`hdr${state.pos + 1}`), behavior: 'smooth'});
      })
  }
  serviceSection2('[data-at-snap=services]', 0.1)

  const at_sliding_tabs = () => {
      const opt = {
          delay: 5000,
          hilite: 'red'
      }
      const selectors = [...document.querySelectorAll('[data-at-sliding-tabs]')].map(root => ({
          root,
          progressElement: root.nextElementSibling?.children,
          tabs: [...root.children].map(el => ({
              tab: el,
              header: el.querySelector('h1')
          }))
      }))

      const progress = function(progressElement, bar) {
          progressElement.innerText = `${Math.round(this.progress() * 100)}%`
      }
      const goto_tab = (tabs, prg, index, bk) => {
          tabs.forEach((tab, i) => {
              const active = i === index
              const flexGrow = active ? 1 : 0
              const backgroundColor = active ? opt.hilite : ''
              gsap.to(tab.tab, {flexGrow})
              if (bk) {
                  gsap.to(prg[i+1], {backgroundColor})
              }
          })
      }
      selectors.forEach(({root, progressElement, tabs}) => {
          let active = 0
          let tl = gsap.timeline()
          const kill_tl = () => {
              if (typeof tl !== 'undefined') {
                  tl.kill()
                  tl = undefined
                  return true
              }
              return false
          }
          tabs.forEach(({tab}, i) => {
              tl.to(progressElement[i + 1], {borderTop: '4rem solid red', duration: opt.delay / 1000, onUpdate: progress, onUpdateParams: [progressElement[0]]})
              tl.set(progressElement[i + 1], {borderTop: '', onComplete: () => {
                  active = (i + 1) % tabs.length
                  goto_tab(tabs, progressElement, active, false)
              }})
          })
          tabs.forEach(({tab, header}, t) => {
              if (!header) return
              header.addEventListener('click', () => {
                  kill_tl()
                  goto_tab(tabs, progressElement,  t, true)
              })
          })

          root.addEventListener('click', () => {
              gsap.set(progressElement[active + 1], {borderTop: '', duration:0})
              gsap.to(progressElement[0], {opacity: 0})
              if (kill_tl()) {
                  goto_tab(tabs, progressElement, active, true)
              }
          }, {once: true})

          tl.repeat(-1)
      })
  }

  at_sliding_tabs()
})()
