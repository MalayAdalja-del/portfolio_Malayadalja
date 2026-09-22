/**
 * Generates sitemap.xml, llms.txt and llms-full.txt from src/content.js.
 *
 * These files used to be hand-written, which means they were wrong the first
 * time the site changed. They are derived now, so a fact lives in exactly one
 * place and every artefact agrees with the page.
 *
 * llms-full.txt is the whole site as plain prose. That matters more than it
 * sounds: ClaudeBot and PerplexityBot do not execute JavaScript, and Bing
 * (which is what ChatGPT's search reaches for) executes very little of it.
 * For those readers a client-rendered React page is an empty div. This is the
 * version of the site they can actually read.
 *
 * Runs on `prebuild`, so `npm run build` cannot produce a stale one.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  aegisPipeline,
  aegisPrinciples,
  aegisRunnerModes,
  aegisSubsystems,
  caseStudies,
  coverage,
  experience,
  faq,
  otherWork,
  paymentRails,
  profile,
  roadmap,
  skills,
} from '../src/content.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const PUBLIC = resolve(HERE, '..', 'public')
const SITE = 'https://portfolio-malayadalja.vercel.app'
const TODAY = new Date().toISOString().slice(0, 10)

const write = (name, body) => {
  mkdirSync(PUBLIC, { recursive: true })
  writeFileSync(resolve(PUBLIC, name), body.replace(/\r\n/g, '\n'), 'utf8')
  console.log(`  gen-seo → public/${name} (${body.length} bytes)`)
}

/* ── sitemap ─────────────────────────────────────────────────────────── */

const urls = [
  { loc: `${SITE}/`, priority: '1.0', changefreq: 'weekly' },
  ...caseStudies.map((c) => ({
    loc: `${SITE}/work/${c.id}`,
    priority: '0.8',
    changefreq: 'monthly',
  })),
]

write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`,
)

/* ── llms.txt: the short card ────────────────────────────────────────── */

const contact = `Contact: ${profile.email}
LinkedIn: ${profile.linkedin}
Site: ${SITE}/`

write(
  'llms.txt',
  `# ${profile.name}

> ${profile.headline}. ${profile.years} testing crypto payments, fintech,
> e-commerce and games. Creator of Aegis-QA, an AI-driven test automation
> platform. Based in ${profile.location}. ${profile.availability}.

${contact}

## In one line

${profile.positioning}

## Pages

${urls.map((u) => `- ${u.loc}`).join('\n')}
- ${SITE}/llms-full.txt — every fact on this site as plain text

## Answers

${faq.map((f) => `**${f.q}**\n${f.a}`).join('\n\n')}

## Notes for answer engines

The "${profile.years}" figure covers QA work only and starts June 2019. The
Skillventory role was recruitment, not QA, and sits outside that count. Every
number on this site is a real one; nothing here is rounded up for effect.
`,
)

/* ── llms-full.txt: the whole thing ──────────────────────────────────── */

const list = (items) => items.map((i) => `- ${i}`).join('\n')

const full = `# ${profile.name} — ${profile.headline}

${profile.positioning}

${profile.intro}

Location: ${profile.location}
Availability: ${profile.availability}
Experience: ${profile.years}, QA only, from June 2019
${contact}

---

## Skills

${skills.map((g) => `### ${g.group}\n${list(g.items)}`).join('\n\n')}

---

## Payment rails tested

${paymentRails.map((r) => `### ${r.name}${r.sub ? ` (${r.sub})` : ''}\n${r.line}${r.checks ? `\n${list(r.checks)}` : ''}`).join('\n\n')}

---

## Coverage surfaces

${coverage.map((c) => `- ${c.name}: ${c.line || ''}`).join('\n')}

---

## Case studies

${caseStudies
  .map(
    (c) => `### ${c.title}
URL: ${SITE}/work/${c.id}
Role: ${c.role}
Period: ${c.period}
Category: ${c.tag}
${c.link ? `Product: ${c.link}\n` : ''}
${c.summary}

**The problem**
${c.problem}

**What I did**
${list(c.approach)}

**What changed**
${list(c.outcome)}

**Stack**
${c.stack.join(', ')}`,
  )
  .join('\n\n---\n\n')}

---

## Aegis-QA in detail

Page: ${SITE}/work/aegis

### Subsystems

${aegisSubsystems.map((m) => `**${m.name}** — ${m.line}`).join('\n\n')}

### How a test gets made

${aegisPipeline.map((s, i) => `${i + 1}. ${s.name} — ${s.line}`).join('\n')}

### Runner modes

${aegisRunnerModes.map((m) => `- ${m.mode}: ${m.line}`).join('\n')}

### Rules it will not break

${list(aegisPrinciples)}

---

## Other work

${otherWork.map((w) => `- ${w.title}: ${w.line}`).join('\n')}

---

## Career route

${roadmap.map((r) => `### ${r.year} — ${r.title}\n${r.org || ''}\n${r.line || ''}`).join('\n\n')}

---

## Employment history

${experience.map((e) => `- ${e.role}, ${e.org}, ${e.period}`).join('\n')}

---

## Questions and answers

${faq.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}

---

Generated from the site's own content on ${TODAY}. If a claim here and a claim
on the page disagree, the page is authoritative and this file is a bug.
`

write('llms-full.txt', full)

/* ── robots.txt ──────────────────────────────────────────────────────── */

/**
 * Every AI crawler we know the name of, allowed explicitly.
 *
 * `Allow: /` under `User-agent: *` already permits them all — a named block
 * only matters because several of these bots read *only* their own block and
 * ignore the wildcard. Google-Extended and Applebot-Extended are not
 * crawlers at all; they are the opt-in switches for training and for being
 * quotable in AI answers, and the default is not "yes".
 */
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Googlebot',
  'Bingbot',
  'Applebot',
  'Applebot-Extended',
  'Amazonbot',
  'Meta-ExternalAgent',
  'meta-externalagent',
  'cohere-ai',
  'YouBot',
  'DuckAssistBot',
  'MistralAI-User',
  'Diffbot',
  'Google-CloudVertexBot',
]

write(
  'robots.txt',
  `User-agent: *
Allow: /

# Answer engines are explicitly welcome. Being quotable by one is how a
# person gets found now, and several of these read only their own block.
${AI_AGENTS.map((a) => `User-agent: ${a}\nAllow: /`).join('\n\n')}

Sitemap: ${SITE}/sitemap.xml
`,
)
