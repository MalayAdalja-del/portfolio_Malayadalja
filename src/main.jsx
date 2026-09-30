import './lib/probe' // must load before anything renders
import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App, { preloadRoute } from './App'
import './index.css'

const container = document.getElementById('root')

/**
 * Hydrate the prerendered markup; create a root only when there is none.
 *
 * `createRoot().render()` on a container that already holds server HTML does
 * not reuse it — it clears it and renders again from nothing. That threw
 * away a 135 KB document the browser had already parsed and painted, and the
 * second paint became a new Largest Contentful Paint candidate: 2.8s at
 * phone widths against 0.7s on a desktop, purely because the re-rendered
 * hero was the larger element. Hydrating keeps the first paint.
 *
 * `vite dev` serves an empty root, so that path still needs createRoot.
 */
const prerendered = container.hasChildNodes()

// `prerender` has to be the same value the server rendered with, or the
// first client render differs from the HTML and hydration is abandoned.
const app = (
  <React.StrictMode>
    <App prerender={prerendered} />
  </React.StrictMode>
)

/**
 * Subpages are lazy chunks, and hydration has to start with the right one
 * already loaded.
 *
 * If the boundary suspends *during* hydration, the page's first render
 * happens after lib/motion.jsx has flipped its module-level mount flag, so
 * it renders the animated branch against static HTML — a mismatch, and the
 * same abandoned hydration and 2.8s LCP described above. Waiting costs one
 * cached request on a page that is already painted, and only on subpages;
 * home resolves immediately. A chunk that fails to load still hydrates,
 * with Suspense left to retry it.
 */
if (prerendered) {
  preloadRoute(window.location.pathname)
    .catch(() => {})
    .then(() => hydrateRoot(container, app))
} else {
  createRoot(container).render(app)
}
