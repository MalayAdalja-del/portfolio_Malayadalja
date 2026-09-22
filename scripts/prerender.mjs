/**
 * Writes a real static HTML file for every route.
 *
 * The reason this exists, measured rather than assumed: ClaudeBot and
 * PerplexityBot do not execute JavaScript, and Bing — which is what
 * ChatGPT's search reaches for — executes very little. For all of them a
 * client-rendered React site is `<div id="root"></div>` and nothing else.
 * Google does render JS, but it renders it slowly and on its own schedule.
 *
 * So each route gets its content baked into the HTML it ships, along with
 * its own title, description, canonical URL and structured data. React
 * hydrates over it for real visitors; crawlers keep the static version.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ROUTES } from '../src/lib/router.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const DIST = resolve(ROOT, 'dist')
const SSR = resolve(ROOT, 'dist-ssr', 'entry-server.js')

if (!existsSync(SSR)) {
  console.error(`prerender: no SSR bundle at ${SSR} — run the ssr build first`)
  process.exit(1)
}

const { render } = await import(`file://${SSR}`)
const template = readFileSync(resolve(DIST, 'index.html'), 'utf8')

/** Replace the content of a single tag/attribute in the template. */
const swap = (html, pattern, replacement) => {
  if (!pattern.test(html)) throw new Error(`prerender: no match for ${pattern}`)
  return html.replace(pattern, replacement)
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

for (const path of ROUTES) {
  const { html, meta, ld, url } = render(path)

  let page = template
  page = swap(page, /<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`)
  page = swap(
    page,
    /(<meta\s+name="description"[\s\S]*?content=")[\s\S]*?(")/,
    `$1${esc(meta.description)}$2`,
  )
  page = swap(page, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
  page = swap(page, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
  page = swap(page, /(<meta property="og:title" content=")[^"]*(")/, `$1${esc(meta.title)}$2`)
  page = swap(page, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(meta.title)}$2`)

  // The rendered markup, and the per-route graph next to it.
  const extra = ld
    ? `\n    <script type="application/ld+json" id="route-ld">${JSON.stringify(ld)}</script>`
    : ''
  if (extra) page = page.replace('</head>', `${extra}\n  </head>`)

  page = swap(page, /<div id="root"><\/div>/, `<div id="root">${html}</div>`)

  const out =
    path === '/' ? resolve(DIST, 'index.html') : resolve(DIST, path.slice(1), 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, page, 'utf8')

  const kb = (Buffer.byteLength(page) / 1024).toFixed(0)
  console.log(`  prerender → ${path === '/' ? '/index.html' : `${path}/index.html`} (${kb} KB)`)
}
