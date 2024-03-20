class Target {
  onFrame: FrameRequestCallback
  callback: Function
  element: HTMLDataElement
  progress: number
  progress2: number
  rect: DOMRect
  timestamp: number
  timestamp_layout: number = -9999
  visible: boolean
  data: any = {}

  /**
   * @this {Target}
   * @param timestamp 
   */
  static handle_frame(this: Target, timestamp: DOMHighResTimeStamp) {
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
    if (!this.visible) return
    window.requestAnimationFrame(this.onFrame)
  }
}

class ScrollTrigger {
  static instance_list = {}
  static roots = new Map()
  static observer = new window.IntersectionObserver(ScrollTrigger.handle_callback, { root: null, rootMargin: '0px', threshold: 0 })
  static targets = new WeakMap()

  static handle_entry(entry: IntersectionObserverEntry) {
    const target = ScrollTrigger.targets.get(entry.target)

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
    entries.forEach(ScrollTrigger.handle_entry)
  }

  static create(selector: Element | string | null, callback: Function): Target | null {
    if (typeof selector === "string") {
      selector = document.querySelector(selector)
    }
    if (!selector) return null

    const target = new Target()
    target.element = selector as HTMLDataElement
    target.callback = callback
    target.onFrame = Target.handle_frame.bind(target)
    this.targets.set(selector, target)
    this.observer.observe(target.element)
    return target
  }
}

export { ScrollTrigger }
