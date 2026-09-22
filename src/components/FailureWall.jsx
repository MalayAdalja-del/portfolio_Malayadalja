import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { failureWall } from '../content'
import { Counter, Marker, MaskedWords, useStatic } from '../lib/motion'

/**
 * What breaks — set as type, not as cards.
 *
 * The previous version floated bordered boxes whose fill matched the section
 * background, so they read as hollow outlines on black. There are no surfaces
 * here at all now: one failure class at a time, large, with the category above
 * and the assertion that catches it below. Nothing to misalign, nothing to
 * blend into the page, and it reflows instead of overflowing.
 */

const FIRST = 0.08
const STEP = 0.11

export default function FailureWall() {
  const ref = useRef(null)
  const reduce = useStatic()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [index, setIndex] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const n = Math.min(
      failureWall.cases.length - 1,
      Math.max(0, Math.floor((v - FIRST) / STEP) + 1),
    )
    setIndex((prev) => (prev === n ? prev : n))
  })

  if (reduce) return <Static />

  const item = failureWall.cases[index]

  return (
    <section id="failures" ref={ref} className="invert-section relative h-[320vh]">
      <div className="sticky top-0 flex h-screen min-h-[620px] items-center overflow-hidden pt-20 md:pt-0">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-[14vw] top-1/3 h-[46vw] w-[46vw] rounded-full bg-navy-700/35 blur-[140px]"
        />

        <div className="shell relative grid w-full items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
          <div>
            <Marker index="Ch.01">{failureWall.kicker}</Marker>
            <h2 className="display">
              <MaskedWords text={failureWall.title} />
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/80">
              {failureWall.line}
            </p>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-5 border-t border-white/15 pt-6">
              {failureWall.stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-black tabular-nums tracking-tightest sm:text-3xl">
                    <Counter to={s.value} suffix={s.suffix} />
                  </dt>
                  <dd className="mt-1.5 font-mono text-[10px] uppercase leading-tight tracking-[0.09em] text-white/60">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* the reveal — pure type, no surface */}
          <div className="relative min-h-[300px] md:min-h-[380px]">
            <div className="flex items-baseline gap-4 border-b border-white/15 pb-4">
              <span className="font-mono text-[11px] tabular-nums text-navy-300">
                {String(index + 1).padStart(2, '0')}/
                {String(failureWall.cases.length).padStart(2, '0')}
              </span>
              <span className="h-px flex-1 bg-white/15">
                <motion.span
                  style={{ scaleX: scrollYProgress }}
                  className="block h-px w-full origin-left bg-navy-300"
                />
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="pt-7"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.13em] text-navy-300">
                  {item.kind} <span className="text-white/60">· {item.area}</span>
                </p>

                <p className="mt-5 font-black leading-[1.07] tracking-tightest [font-size:clamp(1.6rem,3.4vw,2.9rem)]">
                  {item.text}
                </p>

                <p className="mt-7 flex gap-3.5 text-[14px] leading-relaxed text-white/80 md:text-[16px]">
                  <span aria-hidden className="font-bold text-navy-300">
                    ✓
                  </span>
                  <span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.11em] text-white/60">
                      caught by
                    </span>
                    <br />
                    {item.caught}
                  </span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function Static() {
  return (
    <section id="failures" className="invert-section">
      <div className="shell band">
        <Marker index="Ch.01">{failureWall.kicker}</Marker>
        <h2 className="display">{failureWall.title}</h2>
        <p className="mt-6 max-w-2xl text-white/80">{failureWall.line}</p>

        <ol className="mt-12 border-t border-white/15">
          {failureWall.cases.map((c, i) => (
            <li
              key={c.text}
              className="grid gap-3 border-b border-white/15 py-7 md:grid-cols-[3rem_1fr_1fr] md:gap-8"
            >
              <span className="font-mono text-[11px] tabular-nums text-navy-300">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-navy-300">
                  {c.kind} <span className="text-white/60">· {c.area}</span>
                </p>
                <p className="mt-2 text-xl font-bold leading-snug tracking-tight">{c.text}</p>
              </div>
              <p className="text-[14px] leading-relaxed text-white/80">
                <span className="font-mono text-[10px] uppercase tracking-[0.11em] text-white/60">
                  caught by
                </span>
                <br />
                {c.caught}
              </p>
            </li>
          ))}
        </ol>

        <dl className="mt-10 grid max-w-lg grid-cols-3 gap-5">
          {failureWall.stats.map((s) => (
            <div key={s.label}>
              <dt className="text-3xl font-black tabular-nums tracking-tightest">
                {s.value.toLocaleString()}
                {s.suffix}
              </dt>
              <dd className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.09em] text-white/60">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
