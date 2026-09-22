import { motion } from 'framer-motion'
import {
  aegisCompare,
  aegisLimits,
  aegisPipeline,
  aegisPrinciples,
  aegisRunnerModes,
  aegisSubsystems,
  caseStudies,
  profile,
} from '../content'
import { goHome, navigate } from '../lib/router'
import { Reveal, useStatic } from '../lib/motion'
import AegisDemo from '../components/AegisDemo'

/**
 * A real subpage per case study, with its own URL (`/work/speed`).
 *
 * Apple gives every product a page rather than an accordion, because depth
 * that cannot be linked to does not get shared. This one is the same content
 * the list teases, given room to breathe.
 */
function Block({ label, children }) {
  return (
    <section className="border-t border-ink/10 py-14 md:py-20">
      <div className="grid gap-8 md:grid-cols-[minmax(0,220px)_1fr] md:gap-16">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-navy-500 md:sticky md:top-28 md:self-start">
          {label}
        </h2>
        <div className="max-w-3xl">{children}</div>
      </div>
    </section>
  )
}

export default function CaseStudyPage({ id }) {
  const reduce = useStatic()
  const index = caseStudies.findIndex((c) => c.id === id)
  const study = caseStudies[index]
  const next = caseStudies[(index + 1) % caseStudies.length]

  if (!study) {
    return (
      <main className="shell band">
        <h1 className="display">Not found.</h1>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
          className="mt-8 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper"
        >
          Back to the site
        </a>
      </main>
    )
  }

  const isAegis = study.id === 'aegis'

  return (
    <main className="bg-paper pt-[92px]">
      {/* hero */}
      <header className="shell pb-16 pt-14 md:pb-24 md:pt-20">
        {/* A real href, not a button. These were all buttons, which meant
            the three case studies had no crawlable path back into the site:
            an audit of the live page found nine links on /work/aegis and
            zero of them internal. A crawler that cannot leave a page cannot
            pass any authority through it either. */}
        <a
          href="/#work"
          onClick={(e) => {
            e.preventDefault()
            goHome('#work')
          }}
          className="mb-12 font-mono text-[11px] uppercase tracking-[0.11em] text-ink/60 transition-colors hover:text-ink"
        >
          ← All work
        </a>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="eyebrow text-navy-500"
        >
          {study.tag} · {study.period}
        </motion.p>

        <h1 className="mega mt-6 max-w-[16ch]">
          <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <motion.span
              className="inline-block"
              initial={reduce ? false : { y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {study.title}
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 max-w-2xl text-[17px] leading-relaxed text-ink/75 md:text-[21px]"
        >
          {study.summary}
        </motion.p>

        <motion.dl
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 grid max-w-3xl grid-cols-2 gap-8 border-t border-ink/10 pt-7 md:grid-cols-3"
        >
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.11em] text-ink/60">Role</dt>
            <dd className="mt-1.5 text-[16px] font-semibold">{study.role}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.11em] text-ink/60">When</dt>
            <dd className="mt-1.5 text-[16px] font-semibold">{study.period}</dd>
          </div>
          {study.link && (
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.11em] text-ink/60">
                Live
              </dt>
              <dd className="mt-1.5">
                <a
                  href={study.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] font-semibold text-navy-500 underline-offset-4 hover:underline"
                >
                  Visit the product ↗
                </a>
              </dd>
            </div>
          )}
        </motion.dl>
      </header>

      <div className="shell pb-8">
        <Block label="The problem">
          <p className="text-[18px] leading-relaxed text-ink md:text-[22px]">{study.problem}</p>
        </Block>

        <Block label="What I did">
          <ul className="space-y-5">
            {study.approach.map((a) => (
              <Reveal as="li" key={a}>
                <div className="flex gap-5 border-b border-ink/10 pb-5">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-navy-500" />
                  <span className="text-[16px] leading-relaxed text-ink/85 md:text-[18px]">
                    {a}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </Block>

        {isAegis && (
          <>
            <Block label="Why it exists">
              <p className="max-w-3xl font-black leading-[1.18] tracking-tight [font-size:clamp(1.25rem,2.6vw,1.9rem)]">
                {profile.curiosity}
              </p>
              <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink/75">
                That is the short version of how a QA engineer ends up maintaining a platform. The
                QA judgement is mine. AI is how one person shipped something that would normally
                need a team, and learning enough of it to do that is the part I would do again.
              </p>
            </Block>

            <Block label="Try it">
              <AegisDemo />
            </Block>

            <Block label="What it replaced">
              <p className="mb-10 max-w-2xl text-[15px] leading-relaxed text-ink/75 md:text-[17px]">
                Before this, the job was five windows. The comparison worth making is not against a
                product with a pricing page. It is against the stack a QA team actually runs when
                nobody has built them one.
              </p>

              {/* Two columns on a wide screen, stacked and labelled on a phone.
                  A table would have needed a scroller at 320px, and a
                  comparison you have to swipe sideways does not get read. */}
              <ol className="border-t border-ink/10">
                {aegisCompare.map((row, i) => (
                  <Reveal as="li" key={row.need} delay={Math.min(i, 4) * 0.04}>
                    <div className="border-b border-ink/10 py-7">
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-[11px] text-ink/60">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-[17px] font-bold tracking-tight md:text-[20px]">
                          {row.need}
                        </h3>
                      </div>

                      <div className="mt-5 grid gap-5 md:grid-cols-2 md:gap-10">
                        <div className="border-l-2 border-ink/15 pl-5">
                          <p className="font-mono text-[10px] uppercase tracking-[0.11em] text-ink/60">
                            Before
                          </p>
                          <p className="mt-2 text-[14.5px] leading-relaxed text-ink/60">
                            {row.before}
                          </p>
                        </div>
                        <div className="border-l-2 border-navy-500 pl-5">
                          <p className="font-mono text-[10px] uppercase tracking-[0.11em] text-navy-500">
                            With Aegis
                          </p>
                          <p className="mt-2 text-[14.5px] leading-relaxed text-ink/85">
                            {row.after}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </Block>

            <Block label="What is in it">
              <div className="grid gap-x-12 gap-y-0 sm:grid-cols-2">
                {aegisSubsystems.map((m) => (
                  <Reveal key={m.name}>
                    <div className="border-t border-ink/10 py-6">
                      <p className="text-[16px] font-bold tracking-tight">{m.name}</p>
                      <p className="mt-2 text-[14px] leading-relaxed text-ink/75">{m.line}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Block>

            <Block label="Runner modes">
              <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-ink/75">
                Five, and they are a frozen contract. Every module has to keep working in all five,
                because the cost of a runner mode quietly breaking is a suite that looks green while
                running almost nothing.
              </p>
              <dl className="border-t border-ink/10">
                {aegisRunnerModes.map((m) => (
                  <Reveal key={m.mode}>
                    <div className="flex flex-wrap gap-x-8 gap-y-1.5 border-b border-ink/10 py-4">
                      <dt className="w-24 shrink-0 font-mono text-[12px] text-navy-500">
                        {m.mode}
                      </dt>
                      <dd className="min-w-0 flex-1 text-[14.5px] leading-relaxed text-ink/75">
                        {m.line}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </Block>

            <Block label="Rules it will not break">
              <ul className="space-y-5">
                {aegisPrinciples.map((line) => (
                  <Reveal as="li" key={line}>
                    <div className="flex gap-5 border-l-2 border-navy-500 pl-5">
                      <p className="text-[15px] leading-relaxed text-ink/85 md:text-[17px]">
                        {line}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </Block>

            <Block label="What it is not">
              <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-ink/75">
                A product page without this section is a brochure.
              </p>
              <ul className="space-y-5">
                {aegisLimits.map((line) => (
                  <Reveal as="li" key={line}>
                    <div className="flex gap-4">
                      <span aria-hidden className="shrink-0 font-mono text-[13px] text-ink/60">
                        —
                      </span>
                      <p className="text-[15px] leading-relaxed text-ink/75 md:text-[16px]">
                        {line}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </Block>

            <Block label="How a test gets made">
              <ol className="relative border-l border-ink/15 pl-8">
                {aegisPipeline.map((stage, i) => (
                  <Reveal as="li" key={stage.name} delay={i * 0.05}>
                    <div className="relative pb-9 last:pb-0">
                      <span className="absolute -left-[2.45rem] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-navy-500 font-mono text-[10px] font-bold text-paper">
                        {i + 1}
                      </span>
                      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-navy-500">
                        {stage.name}
                      </p>
                      <p className="mt-2 text-[16px] leading-relaxed text-ink/85 md:text-[18px]">
                        {stage.line}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </Block>
          </>
        )}

        <Block label="Outcome">
          <ul className="space-y-6">
            {study.outcome.map((o) => (
              <Reveal as="li" key={o}>
                <div className="flex gap-5">
                  <span className="shrink-0 text-[18px] font-bold text-navy-500">✓</span>
                  <span className="text-[18px] leading-relaxed text-ink md:text-[21px]">{o}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </Block>

        <Block label="Stack">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {study.stack.map((t) => (
              <li key={t} className="font-mono text-[14px] text-ink/75">
                {t}
              </li>
            ))}
          </ul>
        </Block>
      </div>

      {/* next */}
      <section className="invert-section">
        <div className="shell py-20 md:py-28">
          <p className="eyebrow text-white/60">Next case study</p>
          <a
            href={`/work/${next.id}`}
            onClick={(e) => {
              e.preventDefault()
              navigate(`/work/${next.id}`)
            }}
            className="group mt-5 block w-full text-left"
          >
            <span className="display block transition-opacity duration-300 group-hover:opacity-70">
              {next.title} <span className="text-navy-300">→</span>
            </span>
          </a>

          <div className="mt-14 flex flex-wrap gap-3 border-t border-white/15 pt-10">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-full bg-paper px-7 py-3.5 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.04]"
            >
              {profile.email}
            </a>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                navigate('/')
              }}
              className="rounded-full border border-white/25 px-7 py-3.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-white hover:text-ink"
            >
              Back to the site
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
