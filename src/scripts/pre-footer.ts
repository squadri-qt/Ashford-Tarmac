import {ScrollTrigger} from './scroll-trigger'

function animate_roller() {
  const roller = this.data.roller ??= this.element.getSVGDocument()?.querySelector('g')
  if (roller) {
    const pp = Math.min(this.progress2 + 0.5, 1)
    const sp = Math.sin((pp * Math.PI) / 2)
    const x = sp * 69
    const y = sp * 39.75
    roller.setAttribute('transform', `translate(${x}, ${y})`)
  }
}

function roller_anim(selector) {
  const svg = document.querySelector(selector)
  ScrollTrigger.create(svg, animate_roller)
}

// const roller_anim = (trigger_selector, dist, selector) => {
//   const trigger = document.querySelector(trigger_selector)
//   const svg_container = document.querySelector(`${selector} > object`)
//   const svg = svg_container.getSVGDocument()
//   if (svg) {
//       const roller = svg.getElementById('at-roller')
//       const tl = gsap.timeline({
//           scrollTrigger: {
//               trigger,
//               start: 'bottom bottom',
//               scrub: 1,
//               end: 'bottom 50%'
//           }
//       })
//       tl.to(roller, {x:69, y:39.75, duration: 3})
//   }
// }

export {roller_anim}
