/**
 * Instrumentation that has to be installed before anything else renders.
 * Imported first in main.jsx. Everything here is best-effort and must never
 * throw — a broken probe would be worse than a missing metric.
 */

export const probe = {
  consoleErrors: 0,
  lcp: null, // ms
  cls: 0,
  navStart: typeof performance !== 'undefined' ? performance.now() : 0,
}

if (typeof window !== 'undefined') {
  // Count real console errors, without swallowing them.
  try {
    const original = console.error
    console.error = (...args) => {
      probe.consoleErrors += 1
      original.apply(console, args)
    }
    window.addEventListener('error', () => {
      probe.consoleErrors += 1
    })
    window.addEventListener('unhandledrejection', () => {
      probe.consoleErrors += 1
    })
  } catch {
    /* no-op */
  }

  // Largest Contentful Paint.
  //
  // The browser keeps promoting new LCP candidates until the visitor
  // interacts. On a long scrolling page that means a headline painted
  // thirty seconds in can overwrite a perfectly good 1.7s load. The spec
  // finalises on first input; we also finalise on first scroll, because
  // once the page is moving, the load experience is over and anything
  // after it is not what LCP is trying to describe.
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const last = entries[entries.length - 1]
      if (last) probe.lcp = Math.round(last.startTime)
    })
    observer.observe({ type: 'largest-contentful-paint', buffered: true })

    const finalise = () => {
      try {
        observer.takeRecords()
        observer.disconnect()
      } catch {
        /* already gone */
      }
      events.forEach((e) => window.removeEventListener(e, finalise, true))
      document.removeEventListener('visibilitychange', onHide)
    }
    const onHide = () => {
      if (document.visibilityState === 'hidden') finalise()
    }
    const events = ['pointerdown', 'keydown', 'scroll', 'wheel']
    events.forEach((e) =>
      window.addEventListener(e, finalise, { capture: true, once: true, passive: true }),
    )
    document.addEventListener('visibilitychange', onHide)
  } catch {
    /* unsupported browser */
  }

  // Cumulative Layout Shift, excluding shifts the user caused.
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) probe.cls += entry.value
      }
    }).observe({ type: 'layout-shift', buffered: true })
  } catch {
    /* unsupported browser */
  }
}
