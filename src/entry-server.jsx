import { renderToString } from 'react-dom/server'
import { MotionConfig } from 'framer-motion'
import App, { preloadRoute } from './App'
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
 *
 * It is async because the subpages live in their own chunks now. Awaiting
 * `preloadRoute` first means the page component is in hand before rendering
 * starts, so `renderToString` still works and the markup has no hole in it —
 * and the browser takes the same route, waiting on the same call before it
 * hydrates. The two passes have to agree, so they use the same mechanism.
 */
export async function render(path) {
  const route = parseRoute(path)
  await preloadRoute(path)

  const html = renderToString(
    <MotionConfig reducedMotion="always">
      <App initialRoute={route} prerender />
    </MotionConfig>,
  )

  const meta = metaFor(route)
  return { html, meta, ld: ldFor(meta), url: `${SITE}${meta.path}` }
}
