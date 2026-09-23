import { chapterLinks } from '../content'
import { navigate } from '../lib/router'
import { Marker, MaskedWords, Reveal } from '../lib/motion'

/**
 * The way in to the three chapters that are now pages of their own.
 *
 * A split only works if the split-off pages are reachable. This is the
 * home page's index of them, built the same way as the case-study list so
 * the two read as one pattern rather than two. Real hrefs, so a crawler
 * follows them and passes authority down.
 */
export default function Chapters() {
  return (
    <section id="chapters" className="bg-paper band scroll-mt-20">
      <div className="shell">
        <Marker index="Ch.08">Go deeper</Marker>
        <h2 className="display mb-5 max-w-3xl">
          <MaskedWords text="Three chapters, in full." />
        </h2>
        <p className="mb-16 max-w-xl text-[15px] text-ink/75">
          The detail lives on its own page rather than nine screens down this one.
        </p>

        <div className="border-t border-ink/10">
          {chapterLinks.map((c, i) => (
            <Reveal key={c.href} delay={Math.min(i, 3) * 0.05}>
              <div className="border-b border-ink/10">
                <div data-cursor="view" className="group relative">
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-navy-500 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:hidden"
                  />
                  <a
                    href={c.href}
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(c.href)
                    }}
                    className="relative flex w-full items-center gap-5 py-8 text-left md:gap-8 md:py-10"
                  >
                    <span className="w-8 shrink-0 font-mono text-[11px] text-ink/60 transition-colors duration-500 group-hover:text-paper/70">
                      {c.n}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-black leading-[1.05] tracking-tightest text-ink transition-colors duration-500 group-hover:text-paper [font-size:clamp(1.45rem,4vw,3.1rem)]">
                        {c.title}
                      </span>
                      <span className="mt-2.5 block max-w-xl text-[13.5px] leading-snug text-ink/60 transition-colors duration-500 group-hover:text-paper/70">
                        {c.line}
                      </span>
                    </span>
                    <span className="shrink-0 text-2xl text-ink transition-all duration-500 group-hover:translate-x-1 group-hover:text-paper">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
