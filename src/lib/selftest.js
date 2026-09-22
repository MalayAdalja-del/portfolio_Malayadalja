/**
 * The self-test suite this site runs against itself, in the visitor's browser.
 *
 * Every check below inspects the real, rendered DOM or a real performance
 * measurement. Nothing is stubbed and nothing is scripted to pass — if the page
 * regresses, the panel goes red in front of whoever is looking at it. That is
 * the point.
 */
import { probe } from './probe'

/** True while running under `npm run dev`. Vite replaces this at build time. */
const DEV_BUILD = Boolean(import.meta.env && import.meta.env.DEV)

/* ── colour maths (WCAG 2.1) ──────────────────────────────────────────── */

function parseRGB(value) {
  const m = String(value).match(/rgba?\(([^)]+)\)/)
  if (!m) return null
  const parts = m[1]
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number)
  const [r, g, b] = parts
  const a = parts.length > 3 ? parts[3] : 1
  if ([r, g, b].some(Number.isNaN)) return null
  return { r, g, b, a }
}

function over(fg, bg) {
  // Composite a translucent colour onto an opaque one.
  const a = fg.a
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1,
  }
}

function luminance({ r, g, b }) {
  const channel = (c) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrastRatio(fg, bg) {
  const a = luminance(fg)
  const b = luminance(bg)
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}

/** Walk up the tree compositing backgrounds until we hit something opaque. */
function effectiveBackground(el) {
  let node = el
  let acc = null
  while (node && node !== document.documentElement.parentNode) {
    const bg = parseRGB(getComputedStyle(node).backgroundColor)
    if (bg && bg.a > 0) {
      acc = acc ? over(acc, bg.a === 1 ? bg : { ...bg, a: 1 }) : bg
      if (bg.a === 1) return acc.a === 1 ? acc : over(acc, bg)
    }
    node = node.parentElement
  }
  return acc && acc.a === 1 ? acc : { r: 5, g: 7, b: 12, a: 1 } // page black
}

function isVisible(el) {
  const style = getComputedStyle(el)
  if (style.display === 'none' || style.visibility === 'hidden') return false
  const rect = el.getBoundingClientRect()
  return rect.width > 1 && rect.height > 1
}

/** mix-blend-difference renders a colour we cannot compute statically. */
function inBlendContext(el) {
  let node = el
  while (node && node !== document.body) {
    if (getComputedStyle(node).mixBlendMode !== 'normal') return true
    node = node.parentElement
  }
  return false
}

function hasOwnText(el) {
  return Array.from(el.childNodes).some(
    (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 1,
  )
}

/* ── the checks ───────────────────────────────────────────────────────── */

const checks = [
  {
    id: 'lang',
    name: 'document language declared',
    run: () => {
      const lang = document.documentElement.lang
      return { pass: Boolean(lang), detail: lang ? `lang="${lang}"` : 'missing lang attribute' }
    },
  },
  {
    id: 'title',
    name: 'title and meta description',
    run: () => {
      const title = document.title || ''
      const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
      const ok = title.length >= 10 && title.length <= 70 && desc.length >= 50 && desc.length <= 165
      return { pass: ok, detail: `title ${title.length} chars · description ${desc.length} chars` }
    },
  },
  {
    id: 'landmarks',
    name: 'landmark regions present',
    run: () => {
      const found = ['header', 'nav', 'main', 'footer'].filter((t) => document.querySelector(t))
      return {
        pass: found.length === 4,
        detail: found.length === 4 ? 'header · nav · main · footer' : `only ${found.join(', ')}`,
      }
    },
  },
  {
    id: 'headings',
    name: 'exactly one h1, no skipped levels',
    run: () => {
      const h1s = document.querySelectorAll('h1')
      const levels = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) =>
        Number(h.tagName[1]),
      )
      let skipped = 0
      for (let i = 1; i < levels.length; i += 1) {
        if (levels[i] - levels[i - 1] > 1) skipped += 1
      }
      return {
        pass: h1s.length === 1 && skipped === 0,
        detail: `${h1s.length} h1 · ${levels.length} headings · ${skipped} skipped`,
      }
    },
  },
  {
    id: 'alt',
    name: 'every image has alt text',
    run: () => {
      const imgs = Array.from(document.images)
      const missing = imgs.filter((i) => !i.hasAttribute('alt'))
      return {
        pass: missing.length === 0,
        detail: `${imgs.length} images · ${missing.length} missing`,
      }
    },
  },
  {
    id: 'names',
    name: 'controls have accessible names',
    run: () => {
      const els = Array.from(document.querySelectorAll('a[href], button')).filter(isVisible)
      const unnamed = els.filter((el) => {
        const text = (el.textContent || '').trim()
        return !text && !el.getAttribute('aria-label') && !el.getAttribute('title')
      })
      return {
        pass: unnamed.length === 0,
        detail: `${els.length} controls · ${unnamed.length} unnamed`,
      }
    },
  },
  {
    id: 'tabindex',
    name: 'no positive tabindex',
    run: () => {
      const bad = Array.from(document.querySelectorAll('[tabindex]')).filter(
        (el) => Number(el.getAttribute('tabindex')) > 0,
      )
      return { pass: bad.length === 0, detail: `${bad.length} found` }
    },
  },
  {
    id: 'noopener',
    name: 'external links are rel="noopener"',
    run: () => {
      const ext = Array.from(document.querySelectorAll('a[target="_blank"]'))
      const unsafe = ext.filter((a) => !(a.rel || '').includes('noopener'))
      return {
        pass: unsafe.length === 0,
        detail: `${ext.length} external · ${unsafe.length} unsafe`,
      }
    },
  },
  {
    id: 'contrast',
    name: 'text contrast meets WCAG AA',
    run: () => {
      const nodes = Array.from(document.querySelectorAll('body *'))
        .filter((el) => !el.closest('[aria-hidden="true"]'))
        .filter(hasOwnText)
        .filter(isVisible)
        .slice(0, 400)

      let checked = 0
      let blended = 0
      let worst = Infinity
      const failures = []

      for (const el of nodes) {
        const style = getComputedStyle(el)
        const fg = parseRGB(style.color)
        if (!fg || fg.a === 0) continue // transparent text (the outlined headline)
        if (inBlendContext(el)) {
          blended += 1
          continue
        }
        const bg = effectiveBackground(el)
        const ratio = contrastRatio(fg.a < 1 ? over(fg, bg) : fg, bg)

        const size = parseFloat(style.fontSize)
        const weight = Number(style.fontWeight) || 400
        const isLarge = size >= 24 || (size >= 18.66 && weight >= 700)
        const required = isLarge ? 3 : 4.5

        checked += 1
        if (ratio < worst) worst = ratio
        if (ratio < required) {
          failures.push(`${el.tagName.toLowerCase()} ${ratio.toFixed(2)}:1`)
        }
      }

      return {
        pass: failures.length === 0,
        detail:
          failures.length === 0
            ? `${checked} nodes · lowest ${Number.isFinite(worst) ? worst.toFixed(2) : '—'}:1${
                blended ? ` · ${blended} blended skipped` : ''
              }`
            : `${failures.length} of ${checked} below AA · ${failures.slice(0, 2).join(', ')}`,
      }
    },
  },
  {
    id: 'surfaces',
    name: 'panels separate from their background',
    run: () => {
      // The bug this exists for: a bordered card filled with exactly its
      // parent's background colour. Text contrast passed, but the panel was
      // invisible and read as a hollow outline floating on the page.
      // Only elements dressed as a surface (border, shadow or radius) are
      // judged — a plain wrapper sharing the page colour is fine.
      const els = Array.from(document.querySelectorAll('body *')).filter(isVisible)
      const flat = []
      let judged = 0

      for (const el of els) {
        const style = getComputedStyle(el)
        const own = parseRGB(style.backgroundColor)
        if (!own || own.a < 0.02) continue

        const dressed =
          parseFloat(style.borderTopWidth) > 0 ||
          parseFloat(style.borderLeftWidth) > 0 ||
          style.boxShadow !== 'none' ||
          parseFloat(style.borderTopLeftRadius) > 0
        if (!dressed) continue

        // Only real panels. A small bordered circle whose fill matches the
        // page is a ring — correct design, not an invisible surface. The bug
        // this catches was a large card *containing text* with no separation.
        const rect = el.getBoundingClientRect()
        if (rect.width * rect.height < 8000) continue
        if (!(el.textContent || '').trim()) continue
        if (inBlendContext(el)) continue

        // A fill that matches the page is fine when a strong border draws the
        // edge — that is a panel, not an invisible one. The bug this exists
        // for had a 10%-opacity border, which delineated nothing.
        const behindForBorder = effectiveBackground(el.parentElement || el)
        const bc = parseRGB(style.borderTopColor)
        if (bc && bc.a > 0.02 && parseFloat(style.borderTopWidth) > 0) {
          const edge = bc.a < 1 ? over(bc, behindForBorder) : bc
          if (contrastRatio(edge, behindForBorder) >= 3) continue
        }

        const parent = el.parentElement
        if (!parent) continue
        const behind = effectiveBackground(parent)
        const front = own.a < 1 ? over(own, behind) : own

        judged += 1
        if (contrastRatio(front, behind) < 1.04) {
          flat.push(el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''))
        }
      }

      return {
        pass: flat.length === 0,
        detail:
          flat.length === 0
            ? `${judged} panels checked`
            : `${flat.length} of ${judged} invisible · ${flat.slice(0, 2).join(', ')}`,
      }
    },
  },
  {
    id: 'overflow',
    name: 'no horizontal overflow',
    run: () => {
      const doc = document.documentElement
      const spill = doc.scrollWidth - doc.clientWidth
      return {
        pass: spill <= 1,
        detail: spill <= 1 ? `${doc.clientWidth}px viewport` : `${spill}px spill`,
      }
    },
  },
  {
    id: 'jsonld',
    name: 'structured data parses',
    run: () => {
      const blocks = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      if (!blocks.length) return { pass: false, detail: 'no JSON-LD found' }
      try {
        const types = blocks.map((b) => JSON.parse(b.textContent)['@type']).filter(Boolean)
        return { pass: types.includes('Person'), detail: types.join(', ') || 'no @type' }
      } catch {
        return { pass: false, detail: 'invalid JSON' }
      }
    },
  },
  {
    id: 'motion',
    name: 'reduced-motion is honoured',
    run: () => {
      // Confirm a prefers-reduced-motion rule actually shipped in the CSS.
      let found = false
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            if (rule.conditionText?.includes('prefers-reduced-motion')) found = true
          }
        } catch {
          /* cross-origin sheet (Google Fonts) — skip */
        }
      }
      return { pass: found, detail: found ? 'media query present' : 'no rule found' }
    },
  },
  {
    id: 'console',
    name: 'no console errors',
    run: () => ({
      pass: probe.consoleErrors === 0,
      detail: `${probe.consoleErrors} since load`,
    }),
  },
  {
    id: 'lcp',
    name: 'LCP within 2.5s budget',
    run: () => {
      if (probe.lcp == null) {
        return { pass: true, detail: 'not reported by this browser', skipped: true }
      }
      // A Vite dev server ships hundreds of unbundled modules, so its LCP says
      // nothing about the built site — 4.30s on `npm run dev` against 0.42s on
      // the production build. Report the number, but don't fail on it.
      if (DEV_BUILD) {
        return {
          pass: true,
          skipped: true,
          detail: `${(probe.lcp / 1000).toFixed(2)}s · dev build, not representative`,
        }
      }
      return { pass: probe.lcp < 2500, detail: `${(probe.lcp / 1000).toFixed(2)}s` }
    },
  },
  {
    id: 'cls',
    name: 'layout shift under 0.1',
    run: () => {
      if (DEV_BUILD) {
        return {
          pass: true,
          skipped: true,
          detail: `${probe.cls.toFixed(4)} · dev build, reflows as modules arrive`,
        }
      }
      return { pass: probe.cls < 0.1, detail: probe.cls.toFixed(4) }
    },
  },
]

/** Runs the whole suite, timing each check. Never throws. */
export function runSuite() {
  return checks.map((check) => {
    const started = performance.now()
    let result
    try {
      result = check.run()
    } catch (err) {
      result = { pass: false, detail: `threw: ${err.message}` }
    }
    return {
      id: check.id,
      name: check.name,
      pass: Boolean(result.pass),
      skipped: Boolean(result.skipped),
      detail: result.detail || '',
      ms: Math.max(performance.now() - started, 0),
    }
  })
}

export const SUITE_SIZE = checks.length
