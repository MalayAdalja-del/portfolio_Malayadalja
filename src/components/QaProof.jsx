import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Marker, MaskedWords } from '../lib/motion'
import Bisect from './Bisect'

/**
 * The argument for QA, made by breaking this page on purpose.
 *
 * Every defect below is a *real* defect injected into the real DOM — not a
 * picture of one. The panel in the corner is the same suite that runs on every
 * load, so flipping the switch genuinely turns 15/15 green into red, and
 * fixing a defect genuinely turns it back. Nothing here is special-cased:
 * the suite has no idea this section exists.
 *
 * That is the whole pitch. "QA is necessary" is an opinion; a live failing
 * assertion is not.
 */

const DEFECTS = [
  {
    id: 'contrast',
    title: 'Unreadable body text',
    real: 'Copy set at 1.9:1 contrast. Passes a designer’s eye on a bright monitor, fails WCAG AA and fails anyone reading outdoors.',
    caught: 'text contrast meets WCAG AA',
  },
  {
    id: 'alt',
    title: 'Image with no alt text',
    real: 'A screen reader announces “image”. The content is simply gone for that visitor.',
    caught: 'every image has alt text',
  },
  {
    id: 'name',
    title: 'Button with no accessible name',
    real: 'An icon-only control with no label. Keyboard and screen-reader users get “button”, and nothing else.',
    caught: 'controls have accessible names',
  },
  {
    id: 'tabindex',
    title: 'Positive tabindex',
    real: 'tabindex="5" yanks this element to the front of the tab order, so keyboard focus jumps out of reading order.',
    caught: 'no positive tabindex',
  },
  {
    id: 'noopener',
    title: 'target="_blank" without rel="noopener"',
    real: 'The opened page gets a handle on this one via window.opener. A real phishing vector, and a performance cost.',
    caught: 'external links are rel="noopener"',
  },
  {
    id: 'heading',
    title: 'Skipped heading level',
    real: 'An h5 directly under an h2. Anyone navigating by headings loses the document outline.',
    caught: 'exactly one h1, no skipped levels',
  },
]

// A 1×1 transparent pixel, so the broken image costs no network request.
const PIXEL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%231E3A8A"/></svg>'

export default function QaProof() {
  const [broken, setBroken] = useState(() => new Set())

  // The suite inspects the live DOM, so it just needs a nudge after a change.
  const rerun = useCallback(() => {
    window.dispatchEvent(new CustomEvent('selftest:rerun'))
  }, [])

  // Only re-run once the visitor has actually changed something. Firing on
  // mount would pop the panel open unprompted on every page load.
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return undefined
    }
    // Long enough for exit animations to unmount before the suite measures.
    const t = setTimeout(rerun, 460)
    return () => clearTimeout(t)
  }, [broken, rerun])

  const shipBroken = () => setBroken(new Set(DEFECTS.map((d) => d.id)))
  const fixAll = () => setBroken(new Set())
  const fix = (id) =>
    setBroken((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })

  const has = (id) => broken.has(id)
  const count = broken.size

  return (
    <section id="proof" className="invert-section band scroll-mt-20">
      <div className="shell">
        <Marker index="Ch.07">Why this matters</Marker>

        <h2 className="display max-w-4xl">
          <MaskedWords text="Break this page." />
        </h2>

        <p className="mt-7 max-w-2xl text-[15px] leading-relaxed text-white/80 md:text-[18px]">
          Every defect below is real and gets injected into this actual page. The test panel in the
          corner is the same suite that runs on every load — it has no idea this section exists.
          Flip the switch and watch it go red.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={count ? fixAll : shipBroken}
            className={`px-8 py-4 text-sm font-semibold transition-colors duration-300 ${
              count ? 'bg-navy-300 text-ink hover:bg-white' : 'bg-white text-ink hover:bg-navy-300'
            }`}
          >
            {count ? '↺ Ship it with QA' : '⚠ Ship it without QA'}
          </button>

          {/* fixed box: a status line that resizes would shift the page */}
          <p
            aria-live="polite"
            className="flex h-6 w-full max-w-[22rem] items-center font-mono text-[11px] uppercase tracking-[0.11em] text-white/60"
          >
            {count
              ? `${count} defect${count > 1 ? 's' : ''} live on this page`
              : 'page is clean — 15 assertions holding'}
          </p>
        </div>

        {/* the defect ledger */}
        <ol className="mt-14 border-t border-white/15">
          {DEFECTS.map((d, i) => {
            const on = has(d.id)
            return (
              <li key={d.id} className="border-b border-white/15">
                <div className="flex flex-wrap items-start gap-x-6 gap-y-4 py-6">
                  <span className="w-8 shrink-0 pt-1 font-mono text-[11px] text-white/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3
                        className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                          on ? 'text-navy-300' : 'text-white/70'
                        }`}
                      >
                        {d.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] transition-colors duration-300 ${
                          on ? 'bg-navy-300 text-ink' : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {on ? 'open' : 'fixed'}
                      </span>
                    </div>

                    <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-white/75">
                      {d.real}
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.09em] text-white/60">
                      caught by → {d.caught}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => fix(d.id)}
                    disabled={!on}
                    className="shrink-0 border border-white/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors hover:bg-white hover:text-ink disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
                  >
                    {on ? 'Fix it' : 'Fixed'}
                  </button>
                </div>

                {/* ── the actual defect lives here ── */}
                {/* height is reserved whether or not the defect is live, so
                    toggling one never shifts the page (CLS stays at 0) */}
                <div className="min-h-[104px] pb-6">
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="ml-14 border-l border-navy-300/50 pl-5">
                          {d.id === 'contrast' && (
                            <p className="max-w-xl text-[14px] leading-relaxed text-white/[0.14]">
                              This paragraph is live on the page at roughly 1.9:1 contrast. You can
                              barely read it — and the suite has already failed it.
                            </p>
                          )}

                          {d.id === 'alt' && <img src={PIXEL} width="40" height="40" />}

                          {d.id === 'name' && (
                            <button
                              type="button"
                              className="flex h-10 w-10 items-center justify-center border border-white/25"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                aria-hidden
                              >
                                <path d="M5 12h14M13 6l6 6-6 6" />
                              </svg>
                            </button>
                          )}

                          {d.id === 'tabindex' && (
                            <span
                              tabIndex={5}
                              className="inline-block border border-white/25 px-3 py-1.5 font-mono text-[11px] text-white/75"
                            >
                              tabindex=&quot;5&quot; — focus me and see where you land next
                            </span>
                          )}

                          {d.id === 'noopener' && (
                            // eslint-disable-next-line react/jsx-no-target-blank
                            <a
                              href="https://example.com"
                              target="_blank"
                              className="font-mono text-[12px] text-navy-300 underline underline-offset-4"
                            >
                              An external link with no rel=&quot;noopener&quot; ↗
                            </a>
                          )}

                          {d.id === 'heading' && (
                            <h5 className="text-[15px] font-bold text-white/75">
                              An h5 sitting directly under an h2
                            </h5>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            )
          })}
        </ol>

        <p className="mt-10 max-w-2xl text-[15px] leading-relaxed text-white/80 md:text-[17px]">
          Six defects, none of them exotic, all of them shipped by someone this week. That is the
          job: not opinions about quality, but the assertion that catches it before a customer does.
        </p>

        <Bisect />
      </div>
    </section>
  )
}
