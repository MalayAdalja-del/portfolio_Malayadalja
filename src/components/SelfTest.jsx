import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { runSuite, SUITE_SIZE } from '../lib/selftest'

/**
 * The live self-test panel.
 *
 * It runs the real suite from lib/selftest.js against this page, in this
 * browser, and shows what came back. A recruiter can open it and watch a QA
 * engineer's site hold itself to the standard it claims.
 */
export default function SelfTest() {
  const reduce = useReducedMotion()
  const [results, setResults] = useState([])
  const [running, setRunning] = useState(true)
  const [open, setOpen] = useState(false)
  const [total, setTotal] = useState(0)
  const timers = useRef([])

  const run = useCallback(() => {
    setRunning(true)
    setResults([])
    const started = performance.now()

    // Reveal the results one at a time so you can see the suite execute.
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
    // Wait for the curtain, paint, and LCP/CLS to settle before the first run.
    const t = setTimeout(run, 2000)
    // QaProof injects real defects into the page and asks for a re-run.
    const onRerun = () => {
      setOpen(true)
      run()
    }
    window.addEventListener('selftest:rerun', onRerun)
    return () => {
      clearTimeout(t)
      window.removeEventListener('selftest:rerun', onRerun)
      timers.current.forEach(clearTimeout)
    }
  }, [run])

  const passed = results.filter((r) => r.pass).length
  const failed = results.filter((r) => !r.pass).length

  return (
    <section
      aria-label="Live self-test of this page"
      className="fixed bottom-4 left-4 z-[78] flex w-[min(370px,calc(100vw-2rem))] flex-col items-start sm:bottom-6 sm:left-6"
    >
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 14, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mb-2.5 w-full overflow-hidden border border-ink/20 bg-paper shadow-[0_30px_70px_-30px_rgba(10,11,13,0.6)]"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60">
                self-test · this page
              </p>
              <button
                type="button"
                onClick={run}
                disabled={running}
                className="border border-ink/25 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:opacity-40"
              >
                run again
              </button>
            </div>

            <ul className="max-h-[52vh] overflow-y-auto px-4 py-1">
              {results.map((r) => (
                <li
                  key={r.id}
                  className="flex items-start gap-3 border-b border-ink/10 py-2.5 last:border-0"
                >
                  <span
                    aria-hidden
                    className={`mt-[1px] shrink-0 font-mono text-[11px] font-bold ${
                      r.skipped ? 'text-ink/60' : r.pass ? 'text-navy-500' : 'text-ink'
                    }`}
                  >
                    {r.skipped ? '–' : r.pass ? '✓' : '✗'}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-medium leading-tight text-ink">
                      {r.name}
                      <span className="sr-only">
                        {r.skipped ? ' — skipped' : r.pass ? ' — passed' : ' — failed'}
                      </span>
                    </span>
                    <span className="mt-1 block font-mono text-[9.5px] leading-tight text-ink/60">
                      {r.detail}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[9.5px] text-ink/60">
                    {r.ms < 1 ? '<1' : Math.round(r.ms)}ms
                  </span>
                </li>
              ))}
              {running && (
                <li className="flex items-center gap-3 py-2.5 font-mono text-[10px] text-ink/60">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-full border border-ink/25 border-t-navy-500 motion-safe:animate-spin3"
                  />
                  running {results.length + 1} of {SUITE_SIZE}
                </li>
              )}
            </ul>

            <p className="border-t border-ink/10 px-4 py-3 text-[10px] leading-relaxed text-ink/60">
              Real assertions against the rendered DOM and live performance entries — executed in
              your browser just now, not recorded.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex w-auto items-center gap-3 border-2 px-4 py-2.5 transition-colors ${
          failed && !running
            ? 'border-ink bg-ink text-paper'
            : 'border-ink bg-paper text-ink hover:bg-ink hover:text-paper'
        }`}
      >
        <span className="flex items-center gap-2.5 font-mono text-[11px]">
          {running ? (
            <>
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-full border border-current/40 border-t-current motion-safe:animate-spin3"
              />
              <span>self-test running…</span>
            </>
          ) : (
            <>
              <span aria-hidden className="font-bold">
                {failed ? '✗' : '✓'}
              </span>
              <span className="font-medium">
                {passed} passed · {failed} failed
              </span>
              <span className="opacity-60">{Math.round(total)}ms</span>
            </>
          )}
        </span>
        <span aria-hidden className="font-mono text-[10px] opacity-60">
          {open ? '▾' : '▴'}
        </span>
      </button>
    </section>
  )
}
