import { useEffect, useState } from 'react'

/**
 * A path router, in about fifty lines. No dependency.
 *
 * It used to be a *hash* router (`#/work/speed`), which was the wrong choice
 * and the single biggest SEO defect on the site: a fragment is never a URL to
 * any crawler, so all three case studies — the richest content here — were
 * invisible to Google and could not appear in a search result or be cited by
 * an answer engine. They are real paths now (`/work/speed`), which needs the
 * rewrite in vercel.json so a deep link served cold still reaches index.html.
 *
 * Contract: `#section` anchors are untouched, so the scroll nav keeps working.
 */

/** Every route the site serves, in the order the sitemap lists them. */
export const ROUTES = [
  '/',
  '/what-i-check',
  '/how-i-work',
  '/proof',
  '/route',
  '/faq',
  '/work/speed',
  '/work/aegis',
  '/work/kyb',
  '/aegis-demo',
]

/** Chapter pages split out of the home page, by first path segment. */
const CHAPTERS = {
  'what-i-check': 'check',
  'how-i-work': 'work-how',
  proof: 'proof',
  route: 'route',
  faq: 'faq',
}

export function parseRoute(pathname) {
  const parts = (pathname || '/').split('/').filter(Boolean)
  if (parts[0] === 'work' && parts[1]) return { name: 'work', id: parts[1] }
  if (parts[0] === 'aegis-demo') return { name: 'demo' }
  if (CHAPTERS[parts[0]]) return { name: CHAPTERS[parts[0]] }
  return { name: 'home' }
}

/**
 * `initial` lets the prerenderer state the route instead of reading a
 * `window` that does not exist in Node.
 */
export function useRoute(initial) {
  const [route, setRoute] = useState(
    () =>
      initial ??
      (typeof window === 'undefined' ? { name: 'home' } : parseRoute(window.location.pathname)),
  )

  useEffect(() => {
    const sync = () => setRoute(parseRoute(window.location.pathname))
    window.addEventListener('popstate', sync)
    // pushState fires no event of its own, so navigate() raises this one.
    window.addEventListener('routechange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('routechange', sync)
    }
  }, [])

  return route
}

function go(url) {
  window.history.pushState(null, '', url)
  window.dispatchEvent(new Event('routechange'))
}

/** Go to a route and start at the top, the way a real page navigation does. */
export function navigate(to) {
  go(to.startsWith('/') ? to : `/${to}`)
  window.scrollTo({ top: 0, behavior: 'auto' })
}

/** Back to the home page, landing on the section you came from. */
export function goHome(anchor = '') {
  go(`/${anchor}`)
  if (anchor) {
    const target = document.querySelector(anchor)
    if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' })
  }
}
