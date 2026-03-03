import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (import.meta.client) {
  gsap.registerPlugin(ScrollTrigger)
}

export function useGsapReveal() {
  function revealSection(el: HTMLElement | string, opts?: { y?: number; duration?: number; stagger?: number }) {
    if (import.meta.server) return
    const target = typeof el === 'string' ? document.querySelector(el) : el
    if (!target) return
    const y = opts?.y ?? 40
    const duration = opts?.duration ?? 0.6
    const stagger = opts?.stagger ?? 0.1
    gsap.fromTo(
      target,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger: target.children.length > 1 ? stagger : undefined,
        scrollTrigger: {
          trigger: target,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    )
  }

  return { revealSection, gsap, ScrollTrigger }
}
