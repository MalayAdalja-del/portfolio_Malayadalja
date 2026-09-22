import { useState } from 'react'
import { bisect } from '../content'

/**
 * A working git-bisect, as a demo.
 *
 * Clicking a commit tests it: anything at or after `breakAt` is bad. The
 * range narrows on every answer, and the counter compares your clicks to the
 * optimal four. The commits are invented — the label says so — but the method
 * is the one that actually finds a regression in a long branch.
 */
export default function Bisect() {
  const total = bisect.commits.length
  const [lo, setLo] = useState(0)
  const [hi, setHi] = useState(total - 1)
  const [clicks, setClicks] = useState(0)
  const [found, setFound] = useState(null)
  const [tested, setTested] = useState({}) // index -> 'good' | 'bad'

  const optimal = Math.ceil(Math.log2(total))

  const test = (i) => {
    if (found !== null || i < lo || i > hi) return
    const bad = i >= bisect.breakAt
    const nextClicks = clicks + 1
    setClicks(nextClicks)
    setTested((prev) => ({ ...prev, [i]: bad ? 'bad' : 'good' }))

    const nextLo = bad ? lo : i + 1
    const nextHi = bad ? i : hi
    setLo(nextLo)
    setHi(nextHi)
    if (nextLo === nextHi) setFound(nextLo)
  }

  const reset = () => {
    setLo(0)
    setHi(total - 1)
    setClicks(0)
    setFound(null)
    setTested({})
  }

  return (
    <div className="mt-24 border-t border-white/15 pt-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-black tracking-tightest sm:text-2xl">{bisect.title}</h3>
          <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-white/80">{bisect.line}</p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="border border-white/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors hover:bg-white hover:text-ink"
        >
          Reset
        </button>
      </div>

      <p aria-live="polite" className="mt-8 font-mono text-[11px] uppercase tracking-[0.11em]">
        {found === null ? (
          <>
            <span className="text-navy-300">{clicks} tested</span>
            <span className="text-white/60"> · {hi - lo + 1} commits still suspect</span>
          </>
        ) : (
          <span className="text-navy-300">
            found in {clicks} — optimal is {optimal}
          </span>
        )}
      </p>

      {/* grid-cols-1 matters: an implicit track sizes to min-content and
          refuses to shrink, so the longest commit message widened the page */}
      <ol data-testid="bisect-commits" className="mt-6 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {bisect.commits.map((msg, i) => {
          const inRange = i >= lo && i <= hi
          const mark = tested[i]
          const isCulprit = found === i
          return (
            <li key={msg} className="min-w-0">
              <button
                type="button"
                onClick={() => test(i)}
                disabled={!inRange || found !== null}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left font-mono text-[11.5px] transition-colors duration-200 ${
                  isCulprit
                    ? 'bg-navy-300 text-ink'
                    : mark === 'bad'
                      ? 'bg-white/[0.07] text-white'
                      : mark === 'good'
                        ? 'text-white/50'
                        : inRange
                          ? 'text-white/85 hover:bg-white/[0.09]'
                          : 'text-white/30'
                }`}
              >
                <span className="w-6 shrink-0 tabular-nums opacity-70">
                  {String(i).padStart(2, '0')}
                </span>
                <span className="w-4 shrink-0 font-bold">
                  {isCulprit ? '●' : mark === 'bad' ? '✗' : mark === 'good' ? '✓' : ''}
                </span>
                {/* min-w-0 or the longest word forces the button past 100% */}
                <span className="min-w-0 truncate">{msg}</span>
              </button>
            </li>
          )
        })}
      </ol>

      {found !== null && (
        <p className="mt-7 max-w-2xl border-l-2 border-navy-300 pl-5 text-[15px] leading-relaxed text-white md:text-[17px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.11em] text-navy-300">
            the culprit
          </span>
          <br />
          <span className="font-semibold">{bisect.commits[found]}</span> — sharing one retry helper
          made two payouts reuse a single idempotency key. Sixteen commits, four tests. That is the
          whole reason to bisect instead of reading the diff.
        </p>
      )}
    </div>
  )
}
