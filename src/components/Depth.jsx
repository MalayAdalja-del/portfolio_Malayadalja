import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion'
import { coverage, coverageLayers, depthIntro, latencySteps } from '../content'
import { Marker, MaskedWords, Reveal } from '../lib/motion'

/**
 * Breadth then depth, in one chapter.
 *
 * Top — a coverage matrix. Surfaces down, layers across. One scroll value
 * inks in all 50 cells:  opacity = clamp((p − i/n) · 6), so there is no
 * per-cell state and it is a plain CSS grid, which makes it responsive for
 * free.
 *
 * Bottom — a latency dial. The same checkout, at five network conditions.
 * Drag it up and it fails differently at each threshold, with the assertion
 * that catches that specific failure. The point is that quality is a function
 * of conditions, not a screenshot of the happy path.
 */

const SEV = {
  ok: { text: 'text-navy-500', chip: 'bg-navy-500 text-paper', label: 'Healthy' },
  p1: { text: 'text-ink', chip: 'bg-ink text-paper', label: 'P1' },
  p0: { text: 'text-ink', chip: 'bg-ink text-paper', label: 'P0' },
}

function Matrix() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 70%'] })

  // One subscription, one number. Calling useTransform per cell would put a
  // hook inside a loop — legal only by accident while the list length is fixed.
  const [p, setP] = useState(reduce ? 1 : 0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduce) return
    const next = Math.round(Math.min(Math.max(v, 0), 1) * 100) / 100
    setP((prev) => (prev === next ? prev : next))
  })

  const total = coverage.length
  const covered = coverage.reduce((n, r) => n + r.done.length, 0)

  return (
    <div ref={ref}>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <h3 className="text-xl font-black tracking-tightest sm:text-2xl">
          What I have taken through which layer
        </h3>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
          {covered} of {total * coverageLayers.length} cells
        </p>
      </div>

      {/* header row */}
      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_repeat(5,minmax(1.75rem,1fr))] gap-x-1.5 gap-y-2 sm:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(3rem,0.5fr))] sm:gap-x-2">
        <span />
        {coverageLayers.map((l) => (
          <span
            key={l}
            className="pb-1 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-ink/60 sm:text-[10px]"
          >
            {l}
          </span>
        ))}

        {coverage.map((row, i) => (
          <div key={row.surface} className="contents">
            <span className="flex items-center py-1 pr-2 text-[12.5px] leading-tight text-ink/85 sm:text-[14px]">
              {row.surface}
            </span>
            {coverageLayers.map((layer) => {
              const done = row.done.includes(layer)
              const fill = reduce ? 1 : Math.min(Math.max((p - i / total) * 6, 0), 1)
              return (
                <div
                  key={layer}
                  className="relative h-8 border border-ink/10 sm:h-9"
                  title={`${row.surface} · ${layer}${done ? '' : ' — not claimed'}`}
                >
                  {done && (
                    <span
                      aria-hidden
                      style={{ opacity: fill }}
                      className="absolute inset-0 bg-navy-500 transition-opacity duration-500"
                    />
                  )}
                  <span className="sr-only">
                    {row.surface} {layer} {done ? 'covered' : 'not claimed'}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/60">
        Blank means not claimed — a coverage grid that is all filled in is a lie
      </p>
    </div>
  )
}

function Dial() {
  const [i, setI] = useState(0)
  const step = latencySteps[i]
  const sev = SEV[step.severity]

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <h3 className="text-xl font-black tracking-tightest sm:text-2xl">
          The same checkout, five network conditions
        </h3>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
          drag the dial
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="font-black leading-none tracking-mega text-navy-500 [font-size:clamp(2.4rem,7vw,3.6rem)]">
              {step.ms < 1000 ? `${step.ms}ms` : `${step.ms / 1000}s`}
            </span>
            <span
              className={`px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] ${sev.chip}`}
            >
              {step.severity === 'ok' ? 'healthy' : step.severity}
            </span>
          </div>

          <label className="mt-7 block">
            <span className="sr-only">Network latency</span>
            <input
              type="range"
              min={0}
              max={latencySteps.length - 1}
              step={1}
              value={i}
              onChange={(e) => setI(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink/15 accent-navy-500 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-navy-500"
            />
          </label>

          <ol className="mt-4 flex justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-ink/60">
            {latencySteps.map((s, n) => (
              <li key={s.ms}>
                <button
                  type="button"
                  onClick={() => setI(n)}
                  className={`transition-colors ${n === i ? 'text-navy-500' : 'hover:text-ink'}`}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.ms}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60">
              {step.state}
            </p>
            <p className="mt-4 text-[17px] font-semibold leading-snug tracking-tight md:text-[21px]">
              {step.failure}
            </p>
            <p className="mt-6 flex gap-3.5 border-t border-ink/15 pt-5 text-[14px] leading-relaxed text-ink/85 md:text-[15.5px]">
              <span aria-hidden className={`font-bold ${sev.text}`}>
                ✓
              </span>
              <span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/60">
                  the assertion
                </span>
                <br />
                {step.assert}
              </span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function Depth() {
  return (
    <section id="depth" className="bg-paper band scroll-mt-20">
      <div className="shell">
        <Marker index="Ch.03">{depthIntro.kicker}</Marker>
        <h2 className="display max-w-3xl">
          <MaskedWords text={depthIntro.title} />
        </h2>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/75 md:text-[17px]">
          {depthIntro.line}
        </p>

        <div className="mt-16">
          <Reveal>
            <Matrix />
          </Reveal>
        </div>

        <div className="mt-24">
          <Reveal>
            <Dial />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
