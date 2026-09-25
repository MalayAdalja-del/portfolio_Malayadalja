import { useEffect } from 'react'
import { caseStudies, chapterLinks, faq, profile } from '../content'

/**
 * Per-route <head>.
 *
 * A single-page app that never changes its title ships the same title,
 * description and canonical URL for every page it serves. Google dedupes
 * those into one result and an answer engine has no idea the case studies
 * exist as separate documents. This keeps them distinct.
 *
 * The prerenderer writes the same values into the static HTML, so a crawler
 * that runs no JavaScript still gets the right ones; this is what keeps them
 * right after a client-side navigation.
 */

export const SITE = 'https://portfolio-malayadalja.vercel.app'

const HOME = {
  title: `${profile.name} — QA Automation Engineer (SDET) | Playwright, Python`,
  description:
    'Malay Adalja, Software Engineer (QA) with 7+ years testing crypto payments, fintech and e-commerce. Builder of Aegis-QA, an AI-driven test automation platform.',
  path: '/',
  ogType: 'profile',
}

/** The title, description and canonical path for a parsed route. */
const CHAPTER_META = {
  check: {
    path: '/what-i-check',
    title: 'What I check — payment rails, assertions and coverage | Malay Adalja',
    description:
      'Seven payment rails with their own state machines and five assertions each: BTC, Lightning, ETH, USDT, XAUT, payouts and refunds, plus the coverage grid.',
    ogType: 'article',
    keywords:
      'payment testing, crypto payment QA, Lightning Network testing, ERC-20 smart contract testing, payout testing, ledger reconciliation, test coverage matrix, API and database assertions, fintech QA',
  },
  'work-how': {
    path: '/how-i-work',
    title: 'How I work — manual, automation, API, SQL and AI tooling | Malay Adalja',
    description:
      'Manual and exploratory testing, automation, API and contract testing, database verification, performance and AI tooling, each with the evidence behind it.',
    ogType: 'article',
    keywords:
      'manual testing, exploratory testing, test automation, Playwright, Pytest, Appium, API testing, Postman, Newman, SQL database verification, JMeter performance testing, AI tooling for QA, SDET skills',
  },
  route: {
    path: '/route',
    title: 'The route — recruiter to QA engineer to building the tooling | Malay Adalja',
    description:
      'Seven years in one road: technical recruiting, four years of QA at Auxano, crypto payments at Openxcell, and building Aegis-QA. What each stop taught.',
    ogType: 'article',
    keywords:
      'QA engineer career, SDET career path, QA experience, test automation career, crypto payments QA, Openxcell, Auxano Global Services, Ahmedabad QA engineer',
  },
  faq: {
    path: '/faq',
    title: 'Straight answers — the questions people ask first | Malay Adalja',
    description:
      'Who he is, what kind of QA engineer, what he can test that most cannot, which tools he uses, what Aegis-QA is, and whether he is available for work.',
    ogType: 'article',
    keywords:
      'hire QA engineer, QA automation engineer questions, SDET availability, crypto payments testing experience, Aegis-QA, remote QA engineer India',
  },
  proof: {
    path: '/proof',
    title: 'Break this page — six real defects, caught live | Malay Adalja',
    description:
      'Six real accessibility and security defects injected into this page on demand, and the live assertion suite that catches each one in your browser.',
    ogType: 'article',
    keywords:
      'accessibility testing, WCAG contrast, alt text, accessible name, positive tabindex, rel noopener, heading structure, live test suite, git bisect, defect demonstration',
  },
}

export function metaFor(route) {
  const chapter = CHAPTER_META[route?.name]
  if (chapter) return chapter
  if (route?.name === 'demo') {
    return {
      title: 'Aegis-QA portal — interactive demo | Malay Adalja',
      description:
        'A walkthrough of the Aegis-QA test automation portal: run orchestration, session recording to Playwright, failure triage and coverage. Invented data throughout.',
      path: '/aegis-demo',
      demo: true,
      ogType: 'website',
      keywords:
        'QA automation platform, test automation tool, AI QA tooling, self-healing test locators, Playwright test generation, record session to Playwright, Gherkin test compiler, UI API DB test orchestration, database reconciliation testing, automated failure triage, payments QA platform, SDET tooling, test case management, test coverage matrix',
    }
  }
  if (route?.name === 'work') {
    const study = caseStudies.find((c) => c.id === route.id)
    if (!study) return HOME
    return {
      title: `${study.title} — ${profile.name}`,
      // Search results cut around 155 characters. `metaDescription` is a
      // hand-written one that fits; slicing the summary at 180 truncated it
      // mid-word and shipped 20 characters nobody ever saw.
      description: study.metaDescription || study.summary.slice(0, 155),
      path: `/work/${study.id}`,
      study,
      ogType: study.ogType || 'article',
      keywords:
        study.id === 'aegis'
          ? 'Aegis-QA, QA automation platform, test automation tool, self-healing Playwright locators, session recorder to Playwright, Gherkin compiler, failure triage automation, database reconciliation testing, payments QA tooling, AI built QA platform'
          : `${study.tag} QA, ${study.stack.join(', ')}, test automation, Malay Adalja`,
    }
  }
  return HOME
}

/**
 * Structured data for a route. The home page's Person/WebSite/FAQ graph is
 * static in index.html; this adds the per-case-study Article and its
 * breadcrumb, which only exist once you are on that page.
 */
export function ldFor(meta) {
  // The FAQ has its own page now, so the FAQPage graph moves with it.
  // Structured data has to sit on the page that shows the text.
  if (meta.path === '/faq') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'FAQPage',
          mainEntity: faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    }
  }
  if (!meta.study) {
    // WebSite and ProfilePage describe the site and the person, so they
    // belong on the home page and nowhere else. They were falling through
    // to every chapter page, which then claimed url '/' while being served
    // at '/route' — two pages asserting they are the same document.
    if (meta.path !== '/') return null

    // The home page. Person lives in index.html because it never changes;
    // these two are derived from content.js so they cannot drift from the
    // page. FAQPage is the one that matters for an answer engine: it is the
    // only part of this site that states a fact in a shape a machine can
    // lift verbatim.
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: profile.name,
          alternateName: `${profile.name} — ${profile.headline}`,
          url: `${SITE}/`,
          inLanguage: 'en',
          author: { '@type': 'Person', name: profile.name },
        },
        {
          '@type': 'ProfilePage',
          url: `${SITE}/`,
          dateModified: new Date().toISOString().slice(0, 10),
          mainEntity: { '@type': 'Person', name: profile.name },
        },
      ],
    }
  }
  const s = meta.study
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: s.title,
        description: s.summary,
        url: `${SITE}${meta.path}`,
        author: { '@type': 'Person', name: profile.name, url: `${SITE}/` },
        about: s.stack,
        articleSection: s.tag,
        inLanguage: 'en',
      },
      // Aegis is the one case study that is also a thing, so it gets
      // described as software as well as an article. This is the shape an
      // answer engine reads when someone asks what tools exist for a job,
      // and featureList is where the capability language actually lives.
      ...(s.id === 'aegis'
        ? [
            {
              '@type': 'SoftwareApplication',
              name: 'Aegis-QA',
              applicationCategory: 'DeveloperApplication',
              applicationSubCategory: 'Test automation platform',
              operatingSystem: 'Web, Linux, Docker',
              url: `${SITE}/work/aegis`,
              author: { '@type': 'Person', name: profile.name, url: `${SITE}/` },
              isAccessibleForFree: false,
              featureList: [
                'Record a browser session and compile it to Gherkin and a runnable Playwright spec',
                'Run UI, API, flow and security test layers from one place',
                'Five runner modes: single, suite, flow, full and all',
                'Self-healing Playwright locators, proposed and sandbox-verified, never auto-applied',
                'Automatic failure classification, diagnosis and fix planning',
                'Database and ledger reconciliation alongside UI assertions',
                'API contract testing with Postman and Newman collections',
                'Android mobile test recording over Appium',
                'Distributed trace lookup for a failed request',
                'Test case management tied to the automation that covers it',
                'A knowledge graph of the application built from observed runs',
              ],
              keywords:
                'QA automation platform, test automation tool, AI QA tooling, self-healing test locators, Playwright test generation, session recorder to Playwright, Gherkin compiler, API and UI test orchestration, database reconciliation testing, failure triage automation, payments QA tooling, SDET platform',
            },
          ]
        : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: profile.name, item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE}/#work` },
          { '@type': 'ListItem', position: 3, name: s.title, item: `${SITE}${meta.path}` },
        ],
      },
    ],
  }
}

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

export function useHead(route) {
  useEffect(() => {
    const meta = metaFor(route)
    const url = `${SITE}${meta.path}`

    document.title = meta.title
    setMeta('meta[name="description"]', 'content', meta.description)
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:title"]', 'content', meta.title)
    setMeta('meta[property="og:description"]', 'content', meta.description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[name="twitter:title"]', 'content', meta.title)
    setMeta('meta[name="twitter:description"]', 'content', meta.description)
    setMeta('meta[property="og:type"]', 'content', meta.ogType || 'profile')
    if (meta.keywords) setMeta('meta[name="keywords"]', 'content', meta.keywords)

    const ld = ldFor(meta)
    const id = 'route-ld'
    document.getElementById(id)?.remove()
    if (ld) {
      const tag = document.createElement('script')
      tag.type = 'application/ld+json'
      tag.id = id
      tag.textContent = JSON.stringify(ld)
      document.head.appendChild(tag)
    }
  }, [route])
}
