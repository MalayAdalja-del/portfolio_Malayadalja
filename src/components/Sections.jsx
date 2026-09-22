import { profile, skills } from '../content'
import { Marker, MaskedWords, Reveal } from '../lib/motion'

export function Toolkit() {
  return (
    <section className="invert-section">
      <div className="shell band">
        <Marker index="—">Toolkit</Marker>
        <div className="grid gap-x-14 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal key={group.group} delay={(i % 3) * 0.06}>
              <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.24em] text-navy-300">
                {group.group}
              </h3>
              <ul>
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border-t border-white/10 py-2.5 text-[15px] text-white/90 transition-colors duration-300 hover:text-white"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  const rows = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'LinkedIn', value: 'malayy-j-adalja', href: profile.linkedin, ext: true },
    profile.github && { label: 'GitHub', value: 'View profile', href: profile.github, ext: true },
    profile.resume && { label: 'Résumé', value: 'Download PDF', href: profile.resume },
  ].filter(Boolean)

  return (
    <section id="contact" className="invert-section relative overflow-hidden scroll-mt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-full h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy-600/35 blur-[150px]"
      />
      <div className="shell relative py-32 md:py-52">
        <Marker index="Ch.08">Contact</Marker>

        <h2 className="mega max-w-[14ch]">
          <MaskedWords text="Got something that needs breaking?" />
        </h2>

        <p className="mt-10 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-[17px]">
          {profile.availability}. Open to QA engineering and test-automation roles — especially
          anything with payments in it.
        </p>

        <div className="mt-12 flex flex-col divide-y divide-white/15 border-y border-white/15">
          {rows.map((row) => (
            <a
              key={row.label}
              href={row.href}
              {...(row.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex items-center justify-between gap-6 py-6"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/60">
                {row.label}
              </span>
              <span className="flex items-center gap-4 text-right text-xl font-semibold tracking-tight transition-transform duration-500 group-hover:-translate-x-1 sm:text-3xl">
                {row.value}
                <span className="text-navy-300 transition-transform duration-500 group-hover:translate-x-2">
                  ↗
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="invert-section border-t border-white/15">
      <div className="shell flex flex-col items-start justify-between gap-3 py-10 pb-28 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 sm:flex-row sm:items-center sm:pb-10">
        <span>
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </span>
        <span>Built with React · Framer Motion · Tailwind</span>
      </div>
    </footer>
  )
}
