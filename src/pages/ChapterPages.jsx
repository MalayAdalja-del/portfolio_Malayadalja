import SubPage from '../components/SubPage'
import Art from '../components/Art'
import PaymentRails from '../components/PaymentRails'
import Depth from '../components/Depth'
import WhatIDo from '../components/WhatIDo'
import QaProof from '../components/QaProof'
import { Toolkit } from '../components/Sections'
import Roadmap from '../components/Roadmap'
import Faq from '../components/Faq'

/**
 * The three chapters that used to live on the home page.
 *
 * Splitting them out was a length problem first — the home page ran to
 * 21,000 pixels — but it fixes an indexing one too. One page carrying every
 * topic competes with itself: a search for "payment rail testing" and a
 * search for "self-healing test locators" both landed on the same URL, with
 * the same title, and Google had to pick which of the two it was about.
 * Three pages with three titles can each answer their own question.
 */

export function WhatICheckPage() {
  return (
    <SubPage
      eyebrow="Ch.02 · What I check"
      title="Seven rails. Five assertions each."
      intro="Every asset settles differently, so every asset gets its own state machine and its own assertions. Pick a rail and watch it run, then see which surfaces have been taken through which layers — and what each one does when the network stops behaving."
      next={{
        href: '/how-i-work',
        title: 'How I keep up',
        line: 'That does not scale by hand. The second half of this job is tooling, and knowing which tool to reach for.',
      }}
    >
      <div className="shell">
        <Art
          src="/art/rails-hero.webp"
          alt="Five states of a Bitcoin payment — invoice created, broadcast, one confirmation, three confirmations, settled — each with the assertion that has to hold there."
          caption="One rail, five states, an assertion at each. Six more rails behind it, each settling differently."
        />
      </div>
      <PaymentRails />
      <Depth />
    </SubPage>
  )
}

export function HowIWorkPage() {
  return (
    <SubPage
      eyebrow="Ch.04 · How I keep up"
      title="Six things, done properly."
      intro="Manual and automation, API and database, performance and AI tooling. Each one opens to the tools behind it and one line of evidence, because a claim with nothing under it is just a word in a list."
      next={{
        href: '/proof',
        title: 'Why any of it matters',
        line: 'Six real defects, injected into a real page, caught by a real suite. Quality is an opinion until an assertion fails.',
      }}
    >
      <WhatIDo />
      <Toolkit />
    </SubPage>
  )
}

export function ProofPage() {
  return (
    <SubPage
      eyebrow="Ch.07 · Why it matters"
      title="Break this page."
      intro="Every defect below is real and gets injected into this actual page. The suite underneath runs against the rendered DOM and has no idea the switch exists. Flip it and watch it go red — then fix them one at a time and watch it come back."
      next={{
        href: '/what-i-check',
        title: 'What I check',
        line: 'Seven payment rails, five assertions each, and the coverage grid with the blanks left in.',
      }}
    >
      <QaProof />
    </SubPage>
  )
}

export function RoutePage() {
  return (
    <SubPage
      eyebrow="Ch.06 · The route"
      title="Seven years, one road."
      intro="Recruiter, then QA engineer, then the person building the tooling. Each stop is here with what the work actually was, the QA it involved and the tools it ran on."
      next={{
        href: '/work/speed',
        title: 'Where it ran',
        line: 'The crypto payment platform this route ends at, opened in full.',
      }}
    >
      <Roadmap />
    </SubPage>
  )
}

export function FaqPage() {
  return (
    <SubPage
      eyebrow="Q&A · Straight answers"
      title="What people ask first."
      intro="Short, checkable answers — the same ones I would give in a first message, and the same ones an answer engine can quote."
      next={{
        href: '/proof',
        title: 'Break this page',
        line: 'Six real defects, injected live, caught by a real suite.',
      }}
    >
      <Faq />
    </SubPage>
  )
}
