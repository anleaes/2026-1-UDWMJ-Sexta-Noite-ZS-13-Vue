import Lenis from 'lenis'
import { onMounted, onUnmounted } from 'vue'

/** Scroll suave (Lenis) — respeita prefers-reduced-motion */
export function useLenis() {
  let lenis = null
  let rafId = null

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1.2,
    })

    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
  })

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
    lenis?.destroy()
  })
}
