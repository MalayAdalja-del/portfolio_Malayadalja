import Lenis from 'lenis'

/**
 * Smooth scrolling, wired to the real window scroll.
 *
 * Lenis animates `window.scrollTo` rather than transforming a wrapper, so
 * `position: sticky`, Framer's `useScroll` and IntersectionObserver all keep
 * working untouched. Two rules that matter:
 *
 *  - CSS `scroll-behavior: smooth` must be off, or the browser and Lenis
 *    fight over the same scroll and it stutters.
 *  - Anyone asking for reduced motion gets the native scroll, no library.
 */
let lenis = null

export function initSmoothScroll() {
  if (typeof window === 'undefined') return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  document.documentElement.style.scrollBehavior = 'auto'

  lenis = new Lenis({
    duration: 1.05,
    // A gentle exponential ease-out: quick to respond, soft to settle.
    easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    smoothWheel: true,
    // Touch devices already have good native inertia; don't fight it.
    syncTouch: false,
    wheelMultiplier: 1,
  })

  let frame
  const raf = (time) => {
    lenis.raf(time)
    frame = requestAnimationFrame(raf)
  }
  frame = requestAnimationFrame(raf)

  // In-page anchors should glide too, not teleport.
  const onClick = (e) => {
    const link = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null
    if (!link) return
    const href = link.getAttribute('href')
    if (!href || href === '#' || href.startsWith('#/')) return // #/ is a route
    const target = document.querySelector(href)
    if (!target) return
    e.preventDefault()
    lenis.scrollTo(target, { offset: -72 })
    history.replaceState(null, '', href)
  }
  document.addEventListener('click', onClick)

  return () => {
    document.removeEventListener('click', onClick)
    cancelAnimationFrame(frame)
    lenis?.destroy()
    lenis = null
    document.documentElement.style.scrollBehavior = ''
  }
}

/** Jump to the top instantly — used on route changes. */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true })
  else window.scrollTo({ top: 0, behavior: 'auto' })
}
