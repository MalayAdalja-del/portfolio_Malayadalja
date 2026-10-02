import { useState } from 'react'
import { MaskedWords, Reveal } from '../lib/motion'
import { navigate } from '../lib/router'
import { hire, profile } from '../content'

/**
 * The one screen that does not ask to be read.
 *
 * Everything else here is an argument that rewards scrolling. This page is
 * the opposite: a buyer who gives it eight seconds has to leave with what I
 * fix, who for, the proof, and the address — without a gesture. So the whole
 * answer sits above the fold and the depth is a link, not a scroll.
 *
 * `mailto:` rather than a form, and that is a decision rather than a
 * shortcut. A form on a static site needs a third party holding other
 * people's contact details, and it converts worse than a draft that is
 * already written: the reader's own client opens with the subject and the
 * first three lines filled in, so the cost of replying is one sentence.
 * Nothing is collected, which also means nothing can leak.
 */

/** A mail draft, already written. Subject and body come from content.js. */
function draft(subject, body) {
  return `mailto:${profile.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`
}

export default function HirePage() {
  // Defaults to the first audience on both render passes, so the static HTML
  // and the first client render agree — see the hydration note in App.jsx.
  const [active, setActive] = useState(hire.audiences[0].id)

  return (
    <main className="bg-paper pt-[92px]">
      <section className="shell pb-16 pt-10 md:pb-24 md:pt-16">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
          className="eyebrow inline-block text-ink/60 transition-colors hover:text-ink"
        >
          ← Back
        </a>

        <p className="eyebrow mt-8 text-navy-500">{hire.eyebrow}</p>

        <h1 className="display mt-4 max-w-[20ch]">
          <MaskedWords text={hire.title} />
        </h1>

        <Reveal>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink/75 md:text-[18px]">
            {hire.intro}
          </p>
        </Reveal>

        {/* Scanned, not read. A skimmer is looking for one of these words. */}
        <Reveal delay={0.05}>
          <ul className="mt-8 flex max-w-3xl flex-wrap gap-2" aria-label="Areas covered">
            {hire.keywords.map((k) => (
              <li
                key={k}
                className="border border-ink/15 bg-bone px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink/80"
              >
                {k}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ── the audience switch ── */}
        <Reveal delay={0.1}>
          <div className="mt-14 border-t border-ink/15 pt-8">
            <p className="eyebrow text-ink/50">Which one are you?</p>

            <div role="tablist" aria-label="Audience" className="mt-4 flex flex-wrap gap-2">
              {hire.audiences.map((a) => {
                const on = a.id === active
                return (
                  <button
                    key={a.id}
                    type="button"
                    role="tab"
                    id={`tab-${a.id}`}
                    aria-selected={on}
                    aria-controls={`panel-${a.id}`}
                    onClick={() => setActive(a.id)}
                    className={`border px-4 py-2.5 text-[14px] font-semibold tracking-tight transition-colors ${
                      on
                        ? 'border-ink bg-ink text-paper'
                        : 'border-ink/20 text-ink/70 hover:border-ink/50 hover:text-ink'
                    }`}
                  >
                    {a.label}
                  </button>
                )
              })}
            </div>

            {/* Every panel is rendered and the inactive ones are hidden,
                rather than rendering only the active one. Two reasons: it is
                the correct tab pattern, and it is the difference between a
                crawler seeing one vocabulary and seeing all three. The words
                an investor searches with are not the words a VP uses, and
                both have to be in the document. */}
            {hire.audiences.map((a) => (
              <div
                key={a.id}
                id={`panel-${a.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${a.id}`}
                hidden={a.id !== active}
                /* The `hidden` attribute alone does not hide this. Its UA rule
                   is `[hidden] { display: none }`, which a `grid` utility of
                   equal specificity overrides — all three panels rendered
                   stacked, which the interaction test caught. The attribute
                   stays for semantics; the display class does the hiding. */
                className={`mt-8 gap-10 md:grid-cols-[1fr_auto] md:items-end ${
                  a.id === active ? 'grid' : 'hidden'
                }`}
              >
                <div>
                  <p className="max-w-xl text-xl font-semibold tracking-tight text-ink md:text-2xl">
                    {a.line}
                  </p>

                  <ul className="mt-6 max-w-xl space-y-2.5">
                    {a.points.map((p) => (
                      <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-ink/75">
                        <span aria-hidden className="mt-[7px] h-px w-4 shrink-0 bg-navy-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:text-right">
                  <p className="font-mono text-[11px] uppercase tracking-[0.11em] text-ink/45">
                    Reads this in {a.secs}
                  </p>
                  <a
                    href={draft(a.subject, a.body)}
                    data-cursor="view"
                    className="group mt-3 inline-flex items-center gap-3 bg-navy-500 px-6 py-4 text-[15px] font-semibold tracking-tight text-paper transition-colors hover:bg-navy-600"
                  >
                    Write to me
                    <span
                      aria-hidden
                      className="transition-transform duration-500 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                  <p className="mt-3 font-mono text-[11px] text-ink/45">
                    Draft opens already written
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── proof, in four numbers ── */}
        <Reveal delay={0.15}>
          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-ink/15 pt-10 sm:grid-cols-4">
            {hire.figures.map((f) => (
              <div key={f.c}>
                <dt className="sr-only">{f.c}</dt>
                <dd className="font-mono text-3xl font-semibold tracking-tightest text-ink md:text-4xl">
                  {f.n}
                </dd>
                <p className="mt-2 font-mono text-[11px] uppercase leading-snug tracking-[0.09em] text-ink/55">
                  {f.c}
                </p>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* ── give the finding away first ── */}
      <section className="invert-section">
        <div className="shell py-20 md:py-28">
          <p className="eyebrow text-white/55">No charge</p>
          <h2 className="display mt-4 max-w-[18ch]">
            <MaskedWords text={hire.offer.title} />
          </h2>
          <Reveal>
            <p className="mt-7 max-w-2xl text-[15px] leading-relaxed text-white/80 md:text-[17px]">
              {hire.offer.line}
            </p>
            <a
              href={draft(hire.offer.subject, hire.offer.body)}
              data-cursor="view"
              className="group mt-9 inline-flex items-center gap-4 text-xl font-semibold tracking-tight transition-colors hover:text-navy-300 sm:text-2xl"
            >
              {hire.offer.cta}
              <span
                aria-hidden
                className="text-2xl transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </Reveal>

          {/* The address in plain text too: a reader on a machine with no mail
              client configured hits a dead `mailto:` and has nothing to copy. */}
          <div className="mt-12 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-white/15 pt-8 font-mono text-[13px] text-white/70">
            <span className="select-all text-white">{profile.email}</span>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
            <a href={profile.resume}>Résumé (PDF)</a>
            <span>
              {profile.location} · {profile.availability}
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}
