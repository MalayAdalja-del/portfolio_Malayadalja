import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { runSuite, SUITE_SIZE } from '../lib/selftest'
import { useStatic } from '../lib/motion'

/**
 * The live self-test, run against this page in this browser.
 *
 * This used to be a pill fixed to the corner of every page. That was the
 * wrong place for it: a permanent test runner floating over a portfolio
 * reads as an unfinished build to anyone who did not ask for it, and it was
 * the first thing a visitor met on the live site. It now lives inside the
 * chapter that argues for it, and it runs only when someone asks — by
 * pressing the button, or by injecting a defect, which fires
 * `selftest:rerun`.
 */
export default function SelfTest() {
  const reduce = useStatic()
  const [results, setResults] = useState([])
  const [running, setRunning] = useState(false)
  const [asked, setAsked] = useState(false)
  const [total, setTotal] = useState(0)
  const timers = useRef([])

  const run = useCallback(() => {
    setAsked(true)
    setRunning(true)
    setResults([])
    const started = performance.now()

    // Reveal the results one at a time so you can watch the suite execute.
    const suite = runSuite()
    const step = reduce ? 0 : 55
    timers.current.forEach(clearTimeout)
    timers.current = suite.map((result, i) =>
      setTimeout(() => {
        setResults((prev) => [...prev, result])
        if (i === suite.length - 1) {
          setTotal(performance.now() - started)
          setRunning(false)
        }
      }, i * step),
    )
  }, [reduce])

  useEffect(() => {
    window.addEventListener('selftest:rerun', run)
    return () => {
      window.removeEventListener('selftest:rerun', run)
      timers.current.forEach(clearTimeout)
    }
  }, [run])

  const passed = results.filter((r) => r.pass).length
  const failed = results.filter((r) => !r.pass).length

  return (
    <section aria-label="Live self-test of this page" className="mt-12">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="border border-white/25 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors hover:bg-white hover:text-ink disabled:opacity-40"
        >
          {asked ? 'run the suite again' : `run the ${SUITE_SIZE} assertions now`}
        </button>

        {asked && (
          <p
            aria-live="polite"
            className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.1em]"
          >
            {running ? (
              <>
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 shrink-0 rounded-full border border-white/40 border-t-navy-300 motion-safe:animate-spin3"
                />
                <span className="text-white/60">
                  running {results.length + 1} of {SUITE_SIZE}
                </span>
              </>
            ) : (
              <>
                <span aria-hidden className="font-bold text-navy-300">
                  {failed ? '✗' : '✓'}
                </span>
                <span className={failed ? 'text-white' : 'text-navy-300'}>
                  {passed} passed · {failed} failed
                </span>
                <span className="text-white/60">{Math.round(total)}ms</span>
              </>
            )}
          </p>
        )}
      </div>

      <AnimatePresence initial={false}>
        {asked && (
          <motion.div
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="mt-8 border-t border-white/15">
              {results.map((r) => (
                <li key={r.id} className="flex items-start gap-4 border-b border-white/15 py-3">
                  <span
                    aria-hidden
                    className={`mt-[2px] shrink-0 font-mono text-[11px] font-bold ${
                      r.skipped ? 'text-white/60' : r.pass ? 'text-navy-300' : 'text-white'
                    }`}
                  >
                    {r.skipped ? '–' : r.pass ? '✓' : '✗'}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-medium leading-tight text-white">
                      {r.name}
                      <span className="sr-only">
                        {r.skipped ? ' — skipped' : r.pass ? ' — passed' : ' — failed'}
                      </span>
                    </span>
                    <span className="mt-1 block font-mono text-[10px] leading-tight text-white/60">
                      {r.detail}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-white/60">
                    {r.ms < 1 ? '<1' : Math.round(r.ms)}ms
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 max-w-2xl text-[13px] leading-relaxed text-white/60">
              Real assertions against the rendered DOM and live performance entries — executed in
              your browser just now, not recorded.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
