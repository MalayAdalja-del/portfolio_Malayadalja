import { startTransition, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Cursor, Nav, Preloader, ScrollProgress } from './components/Chrome'
import ChapterRail from './components/ChapterRail'
import Marquee from './components/Marquee'
import Transition from './components/Transition'
import Resume from './components/Resume'
import Hero from './components/Hero'
import FailureWall from './components/FailureWall'
import CaseStudies from './components/CaseStudies'
import Chapters from './components/Chapters'
import Art from './components/Art'
import { Contact, Footer } from './components/Sections'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { parseRoute, useRoute } from './lib/router'
import { useHead } from './lib/head'
import { useStatic } from './lib/motion'
import { initSmoothScroll, scrollToTop } from './lib/smoothScroll'
import { marqueeA, marqueeB, transitions } from './content'

/**
 * The subpages load as their own chunks.
 *
 * Every visit starts on one route, but a static import of all seven pages
 * put all seven in the one bundle every visit downloads, parses and
 * executes. That parse is main-thread work on a phone, which is where the
 * field score was losing ground — the lab score was already fine.
 *
 * It resolves the component itself rather than using `React.lazy`, and that
 * is not a style preference — it is the only version that hydrates. `lazy`
 * suspends on its first render even when the module is already in the
 * registry, so the boundary commits one tick *after* App's mount effect has
 * flipped the module-level `hasMounted` in lib/motion.jsx. The page then
 * renders its animated branch against static HTML: a mismatch, and the
 * abandoned hydration and full repaint that cost 2.8s of LCP once already.
 * Measured, with the chunk preloaded and `lazy` still in place: 7 of 10
 * routes threw React #418. Resolving first and rendering synchronously
 * keeps the page in App's own first render pass, where `hasMounted` is
 * still false and the markup matches.
 */
const LOADERS = {
  demo: () => import('./pages/AegisDemoPage').then((m) => m.default),
  work: () => import('./pages/CaseStudyPage').then((m) => m.default),
  check: () => import('./pages/ChapterPages').then((m) => m.WhatICheckPage),
  'work-how': () => import('./pages/ChapterPages').then((m) => m.HowIWorkPage),
  proof: () => import('./pages/ChapterPages').then((m) => m.ProofPage),
  route: () => import('./pages/ChapterPages').then((m) => m.RoutePage),
  faq: () => import('./pages/ChapterPages').then((m) => m.FaqPage),
}

/** Route name → its page component, once its chunk has arrived. */
const pages = new Map()

/**
 * Fetch the component a route needs. Home needs none and resolves at once.
 * Accepts a pathname (the browser and the prerenderer both have one).
 */
function loadPage(name) {
  if (!LOADERS[name] || pages.has(name)) return Promise.resolve()
  return LOADERS[name]().then((Page) => {
    pages.set(name, Page)
  })
}

export function preloadRoute(path) {
  return loadPage(parseRoute(path).name)
}

/** Warm the remaining route chunks once the page is idle, never before. */
function prefetchPages() {
  const run = () => {
    for (const [name, load] of Object.entries(LOADERS)) {
      if (!pages.has(name)) load().then((Page) => pages.set(name, Page))
    }
  }
  if (typeof requestIdleCallback === 'function') {
    const id = requestIdleCallback(run, { timeout: 4000 })
    return () => cancelIdleCallback(id)
  }
  const id = setTimeout(run, 2000)
  return () => clearTimeout(id)
}

/**
 * Home is an argument in six chapters, not a list of sections.
 *
 *   stakes → what breaks → what I check → how I keep up →
 *   where it ran → the journey → talk to me
 *
 * Each <Transition> is the page-turn that makes the next chapter feel earned.
 * Case studies get real URLs (`/work/speed`) rather than an accordion —
 * depth nobody can link to never gets shared.
 */
/**
 * `initialRoute` is for the build-time prerenderer, which has no `window` to
 * read a route from.
 *
 * `prerender` is true on the server *and* in the browser whenever the
 * browser is hydrating prerendered HTML — main.jsx passes the same value
 * back. It has to match or the first client render differs from the
 * document and React throws the whole thing away. It drops the loading
 * curtain, which a page whose content is already painted does not need.
 *
 * The cursor, the scroll bar and the analytics beacon are held back by
 * `staticPass` instead: absent on the first render, so it matches the HTML,
 * mounted immediately after.
 */
export default function App({ initialRoute, prerender = false }) {
  const route = useRoute(initialRoute)
  const staticPass = useStatic()
  useHead(route)
  const [resume, setResume] = useState(false)
  const [, pageArrived] = useState(0)
  const onDemo = route.name === 'demo'
  const onSubpage = Boolean(LOADERS[route.name])
  const Page = pages.get(route.name)

  /**
   * Opening the résumé is a transition, for the reason the route change is.
   *
   * The overlay is the whole CV, built from content.js and animated as one
   * full-screen layer. Mounting and painting it in the same frame as the click
   * made it the slowest interaction on the site once the router was fixed:
   * 328ms, of which 270ms was the browser painting -- not JS. Deferring the
   * mount lets the click paint first and costs the modal a frame nobody sees
   * behind its own 0.4s fade.
   */
  const openResume = () => startTransition(() => setResume(true))

  useEffect(() => initSmoothScroll(), [])
  useEffect(prefetchPages, [])

  // Only reachable by clicking through to a route the idle prefetch has not
  // reached yet; the route the visitor landed on is already in `pages`.
  useEffect(() => {
    if (!onSubpage || pages.has(route.name)) return undefined
    let live = true
    loadPage(route.name).then(() => live && pageArrived((n) => n + 1))
    return () => {
      live = false
    }
  }, [route.name, onSubpage])

  // A route change is a page change; close anything modal over the top of it.
  useEffect(() => {
    setResume(false)
    scrollToTop()
  }, [route.name, route.id])

  return (
    <>
      {!prerender && <Preloader />}
      {!staticPass && !onDemo && (
        <>
          <ScrollProgress />
          <Cursor />
        </>
      )}
      {/* The walkthrough is a product, and it brings its own chrome. The
          site header is fixed and blended, so on that page it ghosted
          straight through the demo's own sticky banner. */}
      {!onDemo && <Nav initialRoute={initialRoute} onResume={openResume} />}
      {route.name === 'home' && <ChapterRail />}

      {onSubpage ? (
        Page ? <Page id={route.id} /> : null
      ) : (
        <>
          <main>
            <Hero onResume={openResume} />

            <Marquee items={marqueeA} dark />
            <FailureWall />

            <div className="shell">
              <Art
                src="/art/home-hero.webp"
                alt="A coverage grid: eight payment surfaces down the side, five test layers across the top, filled cells where that surface has been taken through that layer, and blanks where it has not."
                caption="Thirty-three of fifty cells. The blanks are the point — a coverage grid with none in it is a lie."
              />
            </div>

            {/* The rails, the skills and the proof are pages of their own
                now. Home carries the argument and the way in to each. */}
            <Transition {...transitions.toWork} dark />
            <CaseStudies />

            <Marquee items={marqueeB} dark slow />
            <Chapters />
            <Contact />
          </main>
        </>
      )}

      {/* every route gets the footer landmark, subpages included */}
      <Footer />

      <AnimatePresence>{resume && <Resume onClose={() => setResume(false)} />}</AnimatePresence>

      {/* Vercel Speed Insights — the React entry point, not the Next.js one.
          No-ops locally; only reports from the Vercel deployment. */}
      {!staticPass && <SpeedInsights />}
    </>
  )
}
