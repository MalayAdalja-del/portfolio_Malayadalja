import { useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { caseStudies, otherWork } from '../content'
import { navigate } from '../lib/router'
import { Marker, MaskedWords, Reveal } from '../lib/motion'

/** The panel that rides the cursor while you scan the list. */
function Preview({ study, index, x, y }) {
  return (
    <motion.div
      aria-hidden
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed z-[75] hidden w-[340px] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-ink text-paper shadow-[0_40px_80px_-30px_rgba(10,11,13,0.7)] lg:block"
    >
      <div className="flex items-center justify-between border-b border-white/15 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-white/60">
        <span>0{index + 1}</span>
        <span className="text-navy-300">{study.tag}</span>
      </div>
      <div className="px-5 py-6">
        <p className="text-2xl font-black leading-[1.04] tracking-tightest">{study.title}</p>
        <p className="mt-3 text-[12.5px] leading-relaxed text-white/75">{study.summary}</p>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.11em] text-navy-300">
          Open the case study →
        </p>
      </div>
    </motion.div>
  )
}

export default function CaseStudies() {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 320, damping: 34, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 320, damping: 34, mass: 0.6 })

  const track = (e) => {
    x.set(e.clientX + 190)
    y.set(e.clientY)
  }

  return (
    <section
      id="work"
      className="bg-paper band scroll-mt-20"
      onPointerMove={reduce ? undefined : track}
    >
      <div className="shell">
        <Marker index="Ch.05">Selected work</Marker>
        <h2 className="display mb-5 max-w-3xl">
          <MaskedWords text="Three that show the range." />
        </h2>
        <p className="mb-16 max-w-xl text-[15px] text-ink/75">
          Each one opens as its own page — the problem, what I actually did, and what changed.
        </p>

        <div className="border-t border-ink/10">
          {caseStudies.map((c, i) => (
            <div key={c.id} className="border-b border-ink/10">
              <div
                data-cursor="view"
                onPointerEnter={() => !reduce && setHovered(i)}
                onPointerLeave={() => setHovered(null)}
                className="group relative"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left scale-x-0 bg-navy-500 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:hidden"
                />
                <a
                  href={`#/work/${c.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(`/work/${c.id}`)
                  }}
                  className="relative flex w-full items-center gap-5 py-8 text-left md:gap-8 md:py-10"
                >
                  <span className="w-8 shrink-0 font-mono text-[11px] text-ink/60 transition-colors duration-500 group-hover:text-paper/70">
                    0{i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-black leading-[1.05] tracking-tightest text-ink transition-colors duration-500 group-hover:text-paper [font-size:clamp(1.45rem,4vw,3.1rem)]">
                      {c.title}
                    </span>
                    <span className="mt-2.5 block max-w-xl text-[13.5px] leading-snug text-ink/60 transition-colors duration-500 group-hover:text-paper/70">
                      {c.summary}
                    </span>
                  </span>
                  <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.11em] text-navy-500 transition-colors duration-500 group-hover:text-paper/70 sm:block">
                    {c.tag}
                  </span>
                  <span className="shrink-0 text-2xl text-ink transition-all duration-500 group-hover:translate-x-1 group-hover:text-paper">
                    →
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* everything else, at a glance */}
        <div className="mt-20">
          <h3 className="mb-7 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60">
            Also shipped
          </h3>
          <div className="grid gap-x-14 gap-y-0 md:grid-cols-2">
            {otherWork.map((w, i) => (
              <Reveal key={w.title} delay={(i % 2) * 0.06}>
                <div className="border-t border-ink/10 py-6">
                  <p className="text-[17px] font-bold tracking-tight">{w.title}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink/75">{w.line}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {hovered !== null && (
          <Preview key={hovered} study={caseStudies[hovered]} index={hovered} x={sx} y={sy} />
        )}
      </AnimatePresence>
    </section>
  )
}
