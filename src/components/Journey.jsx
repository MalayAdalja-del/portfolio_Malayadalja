import { journeyIntro, profile, releases, unreleased } from '../content'
import { Marker, MaskedWords, Reveal } from '../lib/motion'

/**
 * The career as a CHANGELOG.
 *
 * Not a timeline — a versioned history in the one format every engineer reads
 * fluently. MAJOR bumps mark where the work itself changed, BREAKING notes say
 * what stopped being true, and the last entry is `[Unreleased]`, which is
 * exactly what looking for your next role is.
 *
 * Deliberately not a horizontal-scroll roadmap: that is a web-design trend
 * borrowed from other portfolios. This comes from the subject matter instead.
 */

const KIND = {
  add: { sign: '+', label: 'Added', tone: 'text-navy-500' },
  chg: { sign: '~', label: 'Changed', tone: 'text-ink' },
  fix: { sign: '!', label: 'Fixed', tone: 'text-ink' },
  rm: { sign: '−', label: 'Removed', tone: 'text-ink/60' },
}

const ORDER = ['add', 'chg', 'fix', 'rm']

function Changes({ changes }) {
  return (
    <div className="mt-6 space-y-5">
      {ORDER.map((kind) => {
        const items = changes.filter((c) => c.t === kind)
        if (!items.length) return null
        const meta = KIND[kind]
        return (
          <div key={kind}>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60">
              ### {meta.label}
            </p>
            <ul>
              {items.map((c) => (
                <li
                  key={c.text}
                  className="group flex gap-3.5 border-l-2 border-transparent py-1 pl-3 transition-colors duration-200 hover:border-navy-500 hover:bg-bone"
                >
                  <span
                    aria-hidden
                    className={`w-3 shrink-0 select-none font-mono text-[13px] font-bold ${meta.tone}`}
                  >
                    {meta.sign}
                  </span>
                  <span className="text-[14.5px] leading-snug text-ink/85">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default function Journey() {
  return (
    <section id="experience" className="bg-paper band scroll-mt-20">
      <div className="shell">
        <Marker index="Ch.05">{journeyIntro.kicker}</Marker>

        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display max-w-3xl">
            <MaskedWords text={journeyIntro.title} />
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
            CHANGELOG.md
          </p>
        </div>

        <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-ink/75 md:text-[17px]">
          {journeyIntro.line}
        </p>

        {/* newest first, the way a changelog is actually read */}
        <ol className="mt-16 space-y-0">
          {[...releases].reverse().map((r, i) => (
            <Reveal as="li" key={r.version} delay={Math.min(i, 3) * 0.05}>
              <article className="grid gap-6 border-t border-ink/10 py-10 md:grid-cols-[minmax(0,260px)_1fr] md:gap-14">
                <header className="md:sticky md:top-28 md:self-start">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
                    ## [{r.version}]
                  </p>
                  <h3 className="mt-2 text-3xl font-black leading-[0.95] tracking-tightest md:text-4xl">
                    {r.codename}
                  </h3>
                  <p className="mt-3 font-mono text-[11px] text-navy-500">{r.date}</p>
                  <p className="mt-1.5 font-mono text-[10.5px] leading-relaxed text-ink/60">
                    {r.org}
                  </p>
                  {r.breaking && (
                    <p className="mt-4 inline-block bg-ink px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-paper">
                      Breaking change
                    </p>
                  )}
                </header>

                <div>
                  {r.breaking && (
                    <p className="mb-5 border-l-2 border-ink pl-4 text-[15px] font-semibold leading-snug text-ink">
                      {r.breaking}
                    </p>
                  )}
                  <p className="max-w-2xl text-[15px] leading-relaxed text-ink/85 md:text-[17px]">
                    {r.note}
                  </p>
                  <Changes changes={r.changes} />
                </div>
              </article>
            </Reveal>
          ))}

          {/* the next version has not shipped — which is the whole point */}
          <Reveal as="li">
            <article className="grid gap-6 border-y border-dashed border-navy-500/50 py-10 md:grid-cols-[minmax(0,260px)_1fr] md:gap-14">
              <header className="md:sticky md:top-28 md:self-start">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy-500">
                  ## [{unreleased.version}]
                </p>
                <h3 className="mt-2 text-3xl font-black leading-[0.95] tracking-tightest text-navy-500 md:text-4xl">
                  {unreleased.codename}
                </h3>
                <p className="mt-3 font-mono text-[11px] text-ink/60">no ship date yet</p>
              </header>

              <div>
                <p className="max-w-2xl text-[16px] leading-relaxed text-ink md:text-[19px]">
                  {unreleased.note}
                </p>

                <p className="mb-2 mt-7 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60">
                  ### Planned
                </p>
                <ul>
                  {unreleased.planned.map((item) => (
                    <li key={item} className="flex gap-3.5 py-1 pl-3">
                      <span
                        aria-hidden
                        className="w-3 shrink-0 select-none font-mono text-[13px] font-bold text-navy-500"
                      >
                        +
                      </span>
                      <span className="text-[14.5px] leading-snug text-ink/85">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#contact"
                    className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper transition-transform duration-300 hover:scale-[1.04]"
                  >
                    Help me ship it
                  </a>
                  <a
                    href={`mailto:${profile.email}`}
                    className="rounded-full border border-ink/25 px-7 py-3.5 text-sm font-medium transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        </ol>
      </div>
    </section>
  )
}
