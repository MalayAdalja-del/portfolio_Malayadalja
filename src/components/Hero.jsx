import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { profile, quickFacts, storyPromise } from '../content'

const LINES = ['I find what', 'breaks payments']

export default function Hero({ onResume }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-paper pt-[92px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10vw] top-[2vh] h-[34vw] w-[34vw] rounded-full bg-navy-500/[0.06] blur-[90px] motion-safe:animate-drift"
      />

      <div className="shell relative">
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b border-ink/10 pb-5"
        >
          <p className="eyebrow text-ink/60">
            {profile.name} · {profile.headline}
          </p>
          <p className="eyebrow flex items-center gap-2.5 text-navy-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-navy-500" />
            {profile.availability}
          </p>
        </motion.div>
      </div>

      <motion.div style={reduce ? undefined : { y, opacity }} className="shell relative py-[3vh]">
        <h1 className="mega">
          {LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <motion.span
                className="inline-block"
                initial={reduce ? false : { y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.05, delay: 0.95 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
          <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <motion.span
              className="outline-type inline-block"
              initial={reduce ? false : { y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.05, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
            >
              before customers do.
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.35 }}
          className="mt-8 max-w-2xl text-[16px] leading-relaxed text-ink/75 md:text-[19px]"
        >
          {profile.intro}
        </motion.p>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="shell relative border-t border-ink/10 pb-24 pt-6"
      >
        {/* The four questions a recruiter asks first, answered without scrolling. */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
          {quickFacts.map((f) => (
            <div key={f.label}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">
                {f.label}
              </dt>
              <dd className="mt-1.5 text-lg font-bold tracking-tight md:text-xl">{f.value}</dd>
              <dd className="mt-0.5 text-[12px] text-ink/60">{f.note}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.2em] text-navy-500">
          ↓ {storyPromise}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="#work"
            className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper transition-transform duration-300 hover:scale-[1.04]"
          >
            See the work
          </a>
          <button
            type="button"
            onClick={onResume}
            className="rounded-full border border-ink/25 px-7 py-3.5 text-sm font-medium text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
          >
            View résumé
          </button>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full px-2 py-3.5 text-sm font-medium text-ink/75 underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            {profile.email}
          </a>
        </div>
      </motion.div>
    </section>
  )
}
