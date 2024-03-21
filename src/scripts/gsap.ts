import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

let reg:(GSAP|undefined)

function getGsap():GSAP {
  return reg ??= (gsap.registerPlugin(ScrollTrigger), gsap)
}
export {getGsap}
