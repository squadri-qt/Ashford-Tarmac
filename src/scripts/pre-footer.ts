import {ScrollTrigger} from './scroll-trigger'
import {atFormSend} from './form'

await (async function roller_anim(selector) {
  const svg = document.querySelector(selector)
  ScrollTrigger.create(svg, function() {
    const roller = this.data.roller ??= this.element.getSVGDocument()?.querySelector('g')
    if (roller) {
      const pp = Math.min(this.progress2 + 0.5, 1)
      const sp = Math.sin((pp * Math.PI) / 2)
      const x = sp * 69
      const y = sp * 39.75
      roller.setAttribute('transform', `translate(${x}, ${y})`)
    }
  })
})('#at-roller-container > object');

await (async (selector) => {
  const form = document.querySelector(selector)
  const btn = form?.querySelector('[data-btn]')
  const btn_text = form?.querySelector('[data-btn-text=""]')
  const msg = form?.querySelector('[data-message]')
  const pages = [...form.querySelectorAll(':scope > div:first-child > div')]
  let page = 0
  if (!form || !btn || !btn_text) return
  btn.addEventListener('click', () => {
    const invalid = [...pages[page].querySelectorAll(':invalid')]
    const this_page = pages[page]
    const next_page = pages[page = ((page + 1) % pages.length)]
    const next_btn_text = next_page.dataset.btnText ?? 'Next Step'
    if (invalid.length !== 0) {
      return
    }
    this_page.style.display = 'none'
    next_page.style.display = ''
    btn_text.textContent = next_btn_text

    if (page == pages.length - 1) {
      btn.setAttribute('disabled', 'disabled')
      atFormSend(form).then(x => {
        btn.removeAttribute('disabled')
        msg.textContent = x.message
      })
      return
    }
  })
  })('form[name="call-back"]')
