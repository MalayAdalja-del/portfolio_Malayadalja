import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  caseStudies,
  experience,
  paymentRails,
  profile,
  quickFacts,
  skillSpine,
  skills,
} from '../content'
import { useStatic } from '../lib/motion'

/**
 * The résumé, rendered from the same content.js the site uses.
 *
 * Two reasons it is generated rather than a PDF upload: it can never drift out
 * of step with the site, and Print → Save as PDF produces a clean one-file CV
 * today, without waiting on a design tool. A real PDF can still be dropped in
 * `public/` and pointed at by `profile.resume`; the download button prefers it.
 */
export default function Resume({ onClose }) {
  const reduce = useStatic()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Résumé"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="resume-overlay fixed inset-0 z-[92] overflow-y-auto bg-bone"
    >
      {/* toolbar — hidden when printing */}
      <div className="no-print sticky top-0 z-10 border-b border-ink/10 bg-bone/95 backdrop-blur">
        <div className="mx-auto flex max-w-[900px] items-center justify-between gap-4 px-6 py-3.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.13em] text-ink/60">
            Résumé · {profile.name}
          </span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="border border-ink bg-ink px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-paper transition-opacity hover:opacity-80"
            >
              Print / Save PDF
            </button>
            {profile.resume && (
              <a
                href={profile.resume}
                download
                className="border border-ink/25 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors hover:border-ink"
              >
                Download PDF
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close résumé"
              className="border border-ink/25 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              Close ✕
            </button>
          </div>
        </div>
      </div>

      {/* the sheet */}
      <article className="resume-sheet mx-auto my-8 max-w-[900px] bg-paper px-8 py-10 shadow-[0_30px_80px_-40px_rgba(10,11,13,0.45)] md:px-14 md:py-16">
        <header className="border-b-2 border-ink pb-7">
          <h1 className="text-[clamp(2.2rem,6vw,3.6rem)] font-black leading-[1.04] tracking-tightest">
            {profile.name}
          </h1>
          <p className="mt-3 text-lg font-semibold text-navy-500 md:text-xl">{profile.headline}</p>
          <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-ink/75">{profile.intro}</p>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-1.5 font-mono text-[11px] text-ink/75">
            <li>{profile.location}</li>
            <li>
              <a href={`mailto:${profile.email}`} className="underline-offset-2 hover:underline">
                {profile.email}
              </a>
            </li>
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                linkedin.com/in/malayy-j-adalja
              </a>
            </li>
            <li className="text-navy-500">{profile.availability}</li>
          </ul>
        </header>

        {/* at a glance */}
        <section className="grid grid-cols-2 gap-5 border-b border-ink/10 py-6 md:grid-cols-4">
          {quickFacts.map((f) => (
            <div key={f.label}>
              <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-ink/60">
                {f.label}
              </p>
              <p className="mt-1 text-[15px] font-bold tracking-tight">{f.value}</p>
              <p className="text-[11px] text-ink/60">{f.note}</p>
            </div>
          ))}
        </section>

        <Block title="Core skills">
          <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {skillSpine.map((s) => (
              <div key={s.key} className="break-inside-avoid">
                <p className="text-[14px] font-bold tracking-tight">{s.name}</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-ink/75">{s.evidence}</p>
                <p className="mt-1 font-mono text-[10px] text-ink/60">{s.tools.join(' · ')}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Crypto payment coverage">
          <div className="flex flex-wrap gap-2">
            {paymentRails.map((r) => (
              <span
                key={r.id}
                className="border border-ink/25 px-2.5 py-1 font-mono text-[11px]"
                title={r.name}
              >
                {r.name}
              </span>
            ))}
          </div>
        </Block>

        <Block title="Experience">
          <div className="space-y-7">
            {experience.map((job) => (
              <div key={job.company} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-[16px] font-bold tracking-tight">
                    {job.role} <span className="font-normal text-navy-500">· {job.company}</span>
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-ink/60">
                    {job.period}
                    {job.note ? ` · ${job.note}` : ''}
                  </p>
                </div>
                <ul className="mt-2.5 space-y-1.5">
                  {job.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5 text-[12.5px] leading-relaxed text-ink/80">
                      <span className="text-navy-500">—</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Selected projects">
          <div className="space-y-5">
            {caseStudies.map((c) => (
              <div key={c.id} className="break-inside-avoid">
                <p className="text-[14.5px] font-bold tracking-tight">
                  {c.title} <span className="font-normal text-ink/60">· {c.period}</span>
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink/80">{c.summary}</p>
                <p className="mt-1.5 font-mono text-[10px] text-ink/60">{c.stack.join(' · ')}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Toolkit">
          <div className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {skills.map((g) => (
              <div key={g.group} className="break-inside-avoid">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-navy-500">
                  {g.group}
                </p>
                <p className="mt-0.5 text-[12.5px] text-ink/80">{g.items.join(' · ')}</p>
              </div>
            ))}
          </div>
        </Block>

        <footer className="mt-8 border-t border-ink/10 pt-5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink/60">
          Generated from the live site · portfolio-malayadalja.vercel.app
        </footer>
      </article>
    </motion.div>
  )
}

function Block({ title, children }) {
  return (
    <section className="break-inside-avoid border-b border-ink/10 py-6 last-of-type:border-0">
      <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.13em] text-navy-500">
        {title}
      </h2>
      {children}
    </section>
  )
}
