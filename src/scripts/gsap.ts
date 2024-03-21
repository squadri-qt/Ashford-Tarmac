import { gsap } from 'gsap/src/index';
import ScrollTrigger from 'gsap/src/ScrollTrigger';

let reg:(GSAP|undefined)

function getGsap():GSAP {
  return reg ??= (gsap.registerPlugin(ScrollTrigger), gsap)
}
export {getGsap}
