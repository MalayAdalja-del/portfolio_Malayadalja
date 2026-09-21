import { useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { failureWall } from '../content'
import { Counter, Marker, MaskedWords } from '../lib/motion'

const OFFSETS = [
  { y: -6, r: -1.5 },
  { y: 4, r: 2 },
  { y: 8, r: -2.5 },
  { y: -8, r: 1 },
  { y: 2, r: 2.5 },
  { y: 10, r: -1 },
  { y: -4, r: 1.5 },
  { y: 6, r: -2 },
]

// One card holds the stage at a time, with just enough overlap that it is never empty.
const FIRST = 0.06
const STEP = 0.088
const windowFor = (i) => {
  const start = FIRST + i * STEP
  return {
    start,
    settle: start + 0.026,
    fix: start + 0.056,
    leave: start + 0.072,
    gone: start + 0.088,
  }
}

function Card({ item, index, progress }) {
  const { start, settle, fix, leave, gone } = windowFor(index)
  const pos = OFFSETS[index % OFFSETS.length]

  const opacity = useTransform(progress, [start, settle, leave, gone], [0, 1, 1, 0])
  const x = useTransform(progress, [start, settle, leave, gone], ['30%', '0%', '0%', '-10%'])
  const y = useTransform(
    progress,
    [start, settle, leave, gone],
    [pos.y - 40, pos.y, pos.y, pos.y - 34],
  )
  const rotate = useTransform(progress, [start, settle, leave, gone], [10, pos.r, pos.r, pos.r - 5])
  const scale = useTransform(progress, [start, settle, fix, leave, gone], [0.9, 1, 1.03, 1, 0.86])
  const borderColor = useTransform(
    progress,
    [fix - 0.012, fix],
    ['rgba(255,255,255,0.25)', 'rgba(122,155,245,1)'],
  )
  const openOpacity = useTransform(progress, [fix - 0.012, fix], [1, 0])
  const caughtOpacity = useTransform(progress, [fix - 0.012, fix], [0, 1])
  const strike = useTransform(progress, [fix - 0.012, fix + 0.01], ['0%', '100%'])

  return (
    <motion.article
      style={{ opacity, x, y, rotate, scale, borderColor, zIndex: index + 2 }}
      className="absolute left-1/2 top-1/2 w-[262px] -translate-x-1/2 -translate-y-1/2 border-2 bg-ink p-5 sm:w-[340px]"
    >
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
        <span className="border border-white/25 px-1.5 py-0.5 text-white">{item.kind}</span>
        <span className="text-white/60">{item.area}</span>
      </div>

      <div className="relative">
        <p className="text-[15px] font-medium leading-snug text-white">{item.text}</p>
        <motion.span
          style={{ width: strike }}
          className="absolute left-0 top-1/2 h-[2px] bg-navy-300"
          aria-hidden
        />
      </div>

      <div className="mt-4 flex justify-end font-mono text-[10px] uppercase tracking-[0.18em]">
        <span className="relative block h-3 w-24 text-right">
          <motion.span style={{ opacity: openOpacity }} className="absolute right-0 text-white/60">
            ● in the wild
          </motion.span>
          <motion.span
            style={{ opacity: caughtOpacity }}
            className="absolute right-0 font-bold text-navy-300"
          >
            ✓ caught
          </motion.span>
        </span>
      </div>
    </motion.article>
  )
}

export default function FailureWall() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [caught, setCaught] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const n = failureWall.cases.filter((_, i) => v >= windowFor(i).fix).length
    setCaught((prev) => (prev === n ? prev : n))
  })

  if (reduce) return <Static />

  return (
    <section id="failures" ref={ref} className="invert-section relative h-[300vh]">
      <div className="sticky top-0 flex h-screen min-h-[640px] items-center overflow-hidden pt-16 md:pt-0">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-[12vw] top-1/4 h-[44vw] w-[44vw] rounded-full bg-navy-700/40 blur-[130px]"
        />
        <div className="shell relative grid w-full items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <Marker index="Ch.01">{failureWall.kicker}</Marker>
            <h2 className="display">
              <MaskedWords text={failureWall.title} />
            </h2>
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-white/80 md:text-[17px]">
              {failureWall.line}
            </p>

            <div className="mt-10 flex items-end gap-4">
              <span className="font-black leading-[0.8] tabular-nums tracking-mega text-navy-300 [font-size:clamp(3.5rem,8vw,6rem)]">
                {String(caught).padStart(2, '0')}
              </span>
              <span className="eyebrow mb-2 text-white/60">failure classes</span>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-5 border-t border-white/15 pt-6">
              {failureWall.stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-3xl font-black tabular-nums tracking-tightest sm:text-4xl">
                    <Counter to={s.value} suffix={s.suffix} />
                  </dt>
                  <dd className="mt-1.5 font-mono text-[10px] uppercase leading-tight tracking-[0.16em] text-white/60">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative h-[300px] sm:h-[340px] lg:h-[430px]" aria-hidden>
            {[
              { y: 26, s: 0.94, o: 'opacity-25' },
              { y: 14, s: 0.97, o: 'opacity-50' },
            ].map((ghost) => (
              <div
                key={ghost.y}
                style={{
                  transform: `translate(-50%, -50%) translateY(${ghost.y}px) scale(${ghost.s})`,
                }}
                className={`absolute left-1/2 top-1/2 h-[128px] w-[262px] border border-white/15 bg-ink sm:w-[340px] ${ghost.o}`}
              />
            ))}
            {failureWall.cases.map((item, i) => (
              <Card key={item.text} item={item} index={i} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Static() {
  return (
    <section id="failures" className="invert-section">
      <div className="shell py-24">
        <Marker index="Ch.01">{failureWall.kicker}</Marker>
        <h2 className="display">{failureWall.title}</h2>
        <p className="mt-6 max-w-2xl text-white/80">{failureWall.line}</p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {failureWall.cases.map((item) => (
            <li key={item.text} className="border border-white/15 p-5">
              <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                <span>{item.kind}</span>
                <span>{item.area}</span>
              </div>
              <p className="font-medium text-white">{item.text}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-10 grid max-w-lg grid-cols-3 gap-5 border-t border-white/15 pt-6">
          {failureWall.stats.map((s) => (
            <div key={s.label}>
              <dt className="text-4xl font-black tabular-nums tracking-tightest">
                {s.value.toLocaleString()}
                {s.suffix}
              </dt>
              <dd className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
