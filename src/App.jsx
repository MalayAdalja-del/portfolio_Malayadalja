import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Cursor, Nav, Preloader, ScrollProgress } from './components/Chrome'
import ChapterRail from './components/ChapterRail'
import Marquee from './components/Marquee'
import Transition from './components/Transition'
import SelfTest from './components/SelfTest'
import Resume from './components/Resume'
import Hero from './components/Hero'
import WhatIDo from './components/WhatIDo'
import FailureWall from './components/FailureWall'
import CaseStudies from './components/CaseStudies'
import Roadmap from './components/Roadmap'
import QaProof from './components/QaProof'
import PaymentRails from './components/PaymentRails'
import Depth from './components/Depth'
import { Contact, Footer, Toolkit } from './components/Sections'
import CaseStudyPage from './pages/CaseStudyPage'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useRoute } from './lib/router'
import { initSmoothScroll, scrollToTop } from './lib/smoothScroll'
import { marqueeA, marqueeB, transitions } from './content'

/**
 * Home is an argument in six chapters, not a list of sections.
 *
 *   stakes → what breaks → what I check → how I keep up →
 *   where it ran → the journey → talk to me
 *
 * Each <Transition> is the page-turn that makes the next chapter feel earned.
 * Case studies get real URLs (`#/work/speed`) rather than an accordion —
 * depth nobody can link to never gets shared.
 */
export default function App() {
  const route = useRoute()
  const [resume, setResume] = useState(false)
  const onWork = route.name === 'work'

  useEffect(() => initSmoothScroll(), [])

  // A route change is a page change; close anything modal over the top of it.
  useEffect(() => {
    setResume(false)
    scrollToTop()
  }, [route.name, route.id])

  return (
    <>
      <Preloader />
      <ScrollProgress />
      <Cursor />
      <Nav onResume={() => setResume(true)} />
      {!onWork && <ChapterRail />}

      {onWork ? (
        <CaseStudyPage id={route.id} />
      ) : (
        <>
          <main>
            <Hero onResume={() => setResume(true)} />

            <Marquee items={marqueeA} dark />
            <FailureWall />

            <Transition {...transitions.toRails} />
            <PaymentRails />
            {/* breadth then depth: coverage matrix + latency dial */}
            <Depth />

            <Transition {...transitions.toSkills} />
            <WhatIDo />

            <Transition {...transitions.toWork} dark />
            <CaseStudies />
            <Roadmap />

            <Marquee items={marqueeB} dark slow />
            {/* the argument for QA, made by actually breaking this page */}
            <QaProof />
            <Toolkit />

            <Transition {...transitions.toContact} dark />
            <Contact />
          </main>
        </>
      )}

      {/* every route gets the footer landmark, subpages included */}
      <Footer />

      <SelfTest />

      <AnimatePresence>{resume && <Resume onClose={() => setResume(false)} />}</AnimatePresence>

      {/* Vercel Speed Insights — the React entry point, not the Next.js one.
          No-ops locally; only reports from the Vercel deployment. */}
      <SpeedInsights />
    </>
  )
}
