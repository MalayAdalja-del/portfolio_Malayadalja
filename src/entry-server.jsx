import { renderToString } from 'react-dom/server'
import { MotionConfig } from 'framer-motion'
import App from './App'
import { ldFor, metaFor, SITE } from './lib/head'
import { parseRoute } from './lib/router'

/**
 * Build-time render of a route to static HTML.
 *
 * `reducedMotion="always"` is doing more work here than it looks. Every
 * animated component in this codebase already has a reduced-motion branch
 * that renders its content plainly and fully visible — FailureWall even
 * renders all eight failure classes as a list instead of one at a time. So
 * turning that branch on for the prerender gives a static file with no
 * `opacity: 0`, no half-finished transforms and *more* text than the
 * animated version, rather than a snapshot of a frozen first frame.
 *
 * React then hydrates over it and the animation comes back for real
 * visitors. A crawler that runs no JavaScript keeps the static version,
 * which is the whole point.
 */
export function render(path) {
  const route = parseRoute(path)
  const html = renderToString(
    <MotionConfig reducedMotion="always">
      <App initialRoute={route} prerender />
    </MotionConfig>,
  )

  const meta = metaFor(route)
  return { html, meta, ld: ldFor(meta), url: `${SITE}${meta.path}` }
}
