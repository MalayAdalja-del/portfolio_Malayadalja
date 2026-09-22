import { useEffect } from 'react'
import { caseStudies, faq, profile } from '../content'

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
}

/** The title, description and canonical path for a parsed route. */
export function metaFor(route) {
  if (route?.name === 'work') {
    const study = caseStudies.find((c) => c.id === route.id)
    if (!study) return HOME
    return {
      title: `${study.title} — ${profile.name}`,
      // Search results cut around 155 characters, so lead with the substance.
      description: study.summary.slice(0, 180),
      path: `/work/${study.id}`,
      study,
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
  if (!meta.study) {
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
