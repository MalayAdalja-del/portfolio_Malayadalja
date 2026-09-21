import { useEffect, useState } from 'react'

/**
 * A 30-line hash router. No dependency, no server rewrites, and it works
 * identically on Vercel, a static host, or a file:// preview.
 *
 * Contract: a *route* hash starts with `#/`. Anything else (`#work`,
 * `#contact`) is an in-page anchor and is deliberately ignored, so the
 * existing scroll navigation keeps working untouched.
 */
export function parseRoute(hash) {
  const h = (hash || '').replace(/^#/, '')
  if (!h.startsWith('/')) return { name: 'home' }

  const parts = h.split('/').filter(Boolean)
  if (parts[0] === 'work' && parts[1]) return { name: 'work', id: parts[1] }
  if (parts[0] === 'resume') return { name: 'resume' }
  return { name: 'home' }
}

export function useRoute() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash))

  useEffect(() => {
    const sync = () => setRoute(parseRoute(window.location.hash))
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  return route
}

/** Go to a route and start at the top, the way a real page navigation does. */
export function navigate(to) {
  window.location.hash = to
  window.scrollTo({ top: 0, behavior: 'auto' })
}

/** Back to the home page, landing on the section you came from. */
export function goHome(anchor = '') {
  window.location.hash = anchor
  if (!anchor) {
    // Clearing the hash entirely would reload-jump; blank it without a jump.
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}
