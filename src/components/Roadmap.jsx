import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { profile, roadmap, roadmapIntro } from '../content'
import { Marker, MaskedWords } from '../lib/motion'

/**
 * The career as a road you drive.
 *
 * Responsiveness is the whole trick, so the road, the marker and the pins are
 * all generated from the *same* function:
 *
 *   x(t) = 50 + amp · sin(t · TURNS · 2π)   (percent of container width)
 *   y(t) = t · 100                          (percent of container height)
 *
 * Nothing is measured against the path itself, so there is nothing to drift
 * between an iPhone and a laptop. `amp` drops to 0 under 640px, which
 * straightens the road rather than overflowing it.
 *
 * Pin placement is measured from each card's real centre, because cards have
 * different heights — assuming even spacing put the pins off the road.
 */

const TURNS = 1.5
// base = where the road sits across the width; amp = how far it wanders.
// Phones get a left rail (base 6, amp 0) so the road never crosses the text.
const xAt = (t, amp, base) => base + amp * Math.sin(t * TURNS * Math.PI * 2)

function roadPath(amp, base, samples = 220) {
  const pts = []
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples
    pts.push(`${xAt(t, amp, base).toFixed(3)},${(t * 100).toFixed(3)}`)
  }
  return 'M' + pts.join(' L')
}

/** Tangent of the road, so the marker points where it is going. */
function angleAt(t, amp, aspect) {
  if (!amp) return 0
  const dx = amp * Math.cos(t * TURNS * Math.PI * 2) * TURNS * Math.PI * 2 * aspect
  return (Math.atan2(100, dx) * 180) / Math.PI - 90
}

function Car({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="15" fill="#1E3A8A" />
      <path
        d="M7.5 19.5h17M10 19.5v-2.8l2.2-4.7h7.6l2.2 4.7v2.8"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12.5" cy="21" r="1.5" fill="#fff" />
      <circle cx="19.5" cy="21" r="1.5" fill="#fff" />
    </svg>
  )
}

export default function Roadmap() {
  const road = useRef(null)
  const cards = useRef([])
  const reduce = useReducedMotion()

  const [amp, setAmp] = useState(0)
  const [base, setBase] = useState(6)
  const [aspect, setAspect] = useState(1)
  // Fraction down the road for each stop, measured from its card's centre.
  const [fracs, setFracs] = useState(() => roadmap.map((_, i) => (i + 0.5) / roadmap.length))
  const [reached, setReached] = useState(0)

  const { scrollYProgress } = useScroll({ target: road, offset: ['start 78%', 'end 62%'] })

  const measure = useCallback(() => {
    const w = window.innerWidth
    const phone = w < 768
    setBase(phone ? 6 : 50)
    setAmp(phone ? 0 : w < 1280 ? 6 : 9)

    const box = road.current
    if (!box) return
    const h = box.offsetHeight || 1
    setAspect((box.offsetWidth || 1) / h)
    setFracs(
      cards.current.map((el, i) =>
        el ? (el.offsetTop + el.offsetHeight / 2) / h : (i + 0.5) / roadmap.length,
      ),
    )
  }, [])

  useLayoutEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    // Fonts and reveals change card heights after first paint.
    const t = setTimeout(measure, 600)
    return () => {
      window.removeEventListener('resize', measure)
      clearTimeout(t)
    }
  }, [measure])

  useEffect(() => {
    if (!('ResizeObserver' in window) || !road.current) return undefined
    const ro = new ResizeObserver(measure)
    ro.observe(road.current)
    return () => ro.disconnect()
  }, [measure])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const n = fracs.filter((t) => v >= t).length
    setReached((prev) => (prev === n ? prev : n))
  })

  const clamp = (v) => Math.min(Math.max(v, 0), 1)
  const carTop = useTransform(scrollYProgress, (v) => `${clamp(v) * 100}%`)
  const carLeft = useTransform(scrollYProgress, (v) => `${xAt(clamp(v), amp, base)}%`)
  const carRot = useTransform(scrollYProgress, (v) => angleAt(clamp(v), amp, aspect))
  const reveal = useTransform(scrollYProgress, (v) => (reduce ? 1 : clamp(v)))

  return (
    <section id="experience" className="bg-paper band scroll-mt-20">
      <div className="shell">
        <Marker index="Ch.06">{roadmapIntro.kicker}</Marker>
        <h2 className="display max-w-3xl">
          <MaskedWords text={roadmapIntro.title} />
        </h2>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/75 md:text-[17px]">
          {roadmapIntro.line}
        </p>

        <div className="mt-7 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.11em] text-ink/60">
          <span className="text-navy-500">{String(Math.max(reached, 1)).padStart(2, '0')}</span>
          <span className="block h-px w-20 bg-ink/20">
            <motion.span
              style={{ scaleX: reduce ? 1 : scrollYProgress }}
              className="block h-px w-full origin-left bg-navy-500"
            />
          </span>
          <span>of {String(roadmap.length).padStart(2, '0')} stops</span>
        </div>

        <div ref={road} className="relative mt-14">
          {/* the road — one path drawn twice, faint then progressively navy */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d={roadPath(amp, base)}
              fill="none"
              stroke="#0A0B0D"
              strokeOpacity="0.12"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            {/* Reveal by clipping, not dashing.
                `vectorEffect="non-scaling-stroke"` measures dashes in screen
                space while `pathLength` normalises in user space, and
                `preserveAspectRatio="none"` makes the two disagree — the line
                drew in broken segments. A clip rect has no length maths at all. */}
            <defs>
              <clipPath id="road-reveal" clipPathUnits="objectBoundingBox">
                <motion.rect x="0" y="0" width="1" style={{ height: reveal }} />
              </clipPath>
            </defs>
            <path
              d={roadPath(amp, base)}
              fill="none"
              stroke="#1E3A8A"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              clipPath="url(#road-reveal)"
            />
          </svg>

          {/* pins, placed from each card's measured centre so they land on the road */}
          {fracs.map((t, i) => (
            <span
              key={`pin-${i}`}
              aria-hidden
              style={{ top: `${t * 100}%`, left: `${xAt(t, amp, base)}%` }}
              className="pointer-events-none absolute -ml-[8px] -mt-[8px]"
            >
              <span
                className={`block h-4 w-4 rounded-full border-2 transition-colors duration-500 ${
                  reached > i ? 'border-navy-500 bg-navy-500' : 'border-ink/30 bg-paper'
                }`}
              />
            </span>
          ))}

          {!reduce && (
            <motion.div
              aria-hidden
              style={{ top: carTop, left: carLeft, rotate: carRot }}
              className="pointer-events-none absolute z-10 -ml-[18px] -mt-[18px]"
            >
              <Car className="h-9 w-9 drop-shadow-[0_6px_16px_rgba(10,11,13,0.35)]" />
            </motion.div>
          )}

          <ol className="relative">
            {roadmap.map((stop, i) => {
              const active = reached > i
              const right = base >= 20 && i % 2 === 1
              return (
                <li
                  key={stop.year + stop.title}
                  ref={(el) => {
                    cards.current[i] = el
                  }}
                  className="relative py-10 first:pt-0 last:pb-0"
                >
                  <motion.article
                    initial={reduce ? false : { opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-12% 0px' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={
                      base < 20
                        ? 'pl-10'
                        : `w-[min(40%,420px)] ${right ? 'ml-auto pl-2' : 'pr-2'}`
                    }
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span
                        className={`font-black leading-none tracking-mega transition-colors duration-500 [font-size:clamp(2rem,6.5vw,3.1rem)] ${
                          active ? 'text-navy-500' : 'text-ink/50'
                        }`}
                      >
                        {stop.year}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.11em] text-ink/60">
                        {stop.kind}
                      </span>
                    </div>

                    <h3 className="mt-2.5 text-2xl font-black leading-tight tracking-tightest sm:text-3xl">
                      {stop.title}
                    </h3>
                    <p className="mt-1.5 font-mono text-[10.5px] leading-relaxed text-ink/60">
                      {stop.org}
                    </p>
                    <p className="mt-4 text-[14.5px] leading-relaxed text-ink/85 md:text-[16px]">
                      {stop.note}
                    </p>

                    <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.12em] text-navy-500">
                      QA work
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {stop.qa.map((q) => (
                        <li key={q} className="bg-bone px-2.5 py-1 text-[12px] text-ink/80">
                          {q}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/60">
                      Languages &amp; tools
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {stop.tech.map((tech) => (
                        <li
                          key={tech}
                          className="border border-ink/15 px-2.5 py-1 font-mono text-[11px] text-ink/75"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>

                    {stop.cta && (
                      <div className="mt-6 flex flex-wrap gap-3">
                        <a
                          href="#contact"
                          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-transform duration-300 hover:scale-[1.04]"
                        >
                          Let’s talk
                        </a>
                        <a
                          href={`mailto:${profile.email}`}
                          className="rounded-full border border-ink/25 px-6 py-3 text-sm font-medium transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
                        >
                          {profile.email}
                        </a>
                      </div>
                    )}
                  </motion.article>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
