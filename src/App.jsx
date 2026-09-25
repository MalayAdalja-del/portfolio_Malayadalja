import { useEffect, useState } from 'react'
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
import CaseStudyPage from './pages/CaseStudyPage'
import AegisDemoPage from './pages/AegisDemoPage'
import { FaqPage, HowIWorkPage, ProofPage, RoutePage, WhatICheckPage } from './pages/ChapterPages'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useRoute } from './lib/router'
import { useHead } from './lib/head'
import { useStatic } from './lib/motion'
import { initSmoothScroll, scrollToTop } from './lib/smoothScroll'
import { marqueeA, marqueeB, transitions } from './content'

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
  const onWork = route.name === 'work'
  const onDemo = route.name === 'demo'
  const CHAPTER = {
    check: WhatICheckPage,
    'work-how': HowIWorkPage,
    proof: ProofPage,
    route: RoutePage,
    faq: FaqPage,
  }
  const Chapter = CHAPTER[route.name]

  useEffect(() => initSmoothScroll(), [])

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
      {!onDemo && <Nav onResume={() => setResume(true)} />}
      {route.name === 'home' && <ChapterRail />}

      {onDemo ? (
        <AegisDemoPage />
      ) : Chapter ? (
        <Chapter />
      ) : onWork ? (
        <CaseStudyPage id={route.id} />
      ) : (
        <>
          <main>
            <Hero onResume={() => setResume(true)} />

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
