import './lib/probe' // must load before anything renders
import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
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

if (prerendered) hydrateRoot(container, app)
else createRoot(container).render(app)
