let scrollbar

class ScrollBar {
  scrollY:number = 0
  scrollMaxY:number = 0
  has_handler = false

  scroll_handler() {
    this.scrollY = window.scrollY
  }
}

function get_scrollbar() {
  return (scrollbar ??= new ScrollBar)
}

class Target {
  onFrame: FrameRequestCallback
  callback: Function
  element: HTMLDataElement
  progress: number
  progress2: number
  rect: DOMRect
  scrollY: number = 0
  timestamp: number
  timestamp_layout: number = -9999
  visible: boolean
  data: any = {}

  /**
   * @this {Target}
   * @param timestamp 
   */
  static handle_frame(this: Target, timestamp: DOMHighResTimeStamp) {
    const sb = get_scrollbar()
    if (sb.scrollY !== this.scrollY) {
      this.scrollY = sb.scrollY
      this.timestamp = timestamp
      //if (timestamp - this.timestamp_layout > 50) {
      this.rect = this.element.getBoundingClientRect()
      this.timestamp_layout = timestamp
      //}
      const new_progress = this.rect.top / -this.rect.height
      if (new_progress !== this.progress) {
        this.progress = new_progress
        this.progress2 = (this.rect.bottom - document.scrollingElement.clientHeight) / -this.rect.height
        this.callback(timestamp)
      }
    }
    if (!this.visible) return
    window.requestAnimationFrame(this.onFrame)
  }
}

let scrolltrigger
class ScrollTrigger {
  instance_list = {}
  roots = new Map()
  observer = new window.IntersectionObserver(ScrollTrigger.handle_callback, { root: null, rootMargin: '0px', threshold: 0 })
  targets = new WeakMap()
  scroll_id = null

  static get_instance() {
    return (scrolltrigger ??= new ScrollTrigger)
  }

  static handle_entry(entry: IntersectionObserverEntry, target: Target) {
    if (!target) {
      console.error('Could not find target', entry.target)
      return
    }

    if (entry.intersectionRatio > 0) {
      target.visible = true
      target.element.classList.add('at-st-visible')
      window.requestAnimationFrame(target.onFrame)
    }
    else {
      target.visible = false
      entry.target.classList.remove('at-st-visible')
    }
  }

  static handle_callback(entries: IntersectionObserverEntry[]) {
    const st = ScrollTrigger.get_instance()
    for (let i = 0; i < entries.length; ++i) {
      ScrollTrigger.handle_entry(entries[i], st.targets.get(entries[i].target))
    }
  }

  static create(selector: Element | string | null, callback: Function): Target | null {
    const st = ScrollTrigger.get_instance()
    const sb = get_scrollbar()
    if (typeof selector === "string") {
      selector = document.querySelector(selector)
    }
    if (!selector) return null

    const target = new Target()
    target.element = selector as HTMLDataElement
    target.callback = callback
    target.onFrame = Target.handle_frame.bind(target)
    st.targets.set(selector, target)
    st.observer.observe(target.element)
    if (!sb.has_handler) {
      sb.has_handler = true
      window.addEventListener('scroll', sb.scroll_handler.bind(sb))
    }
    return target
  }
}

export {ScrollBar, Target, ScrollTrigger}
