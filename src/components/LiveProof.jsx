import { Marker, MaskedWords, Reveal } from '../lib/motion'
import { navigate } from '../lib/router'
import { liveProof } from '../content'
import SelfTest from './SelfTest'

/**
 * The home page's one piece of evidence, and the reason it is here.
 *
 * FailureWall ends on "here is what breaks". For a long time the next thing
 * home said was a marquee, and the actual answer — a real suite, run against
 * this document — sat on /proof as Ch.07, behind a click most visitors never
 * made. They met the atmosphere and left before the argument, which is the
 * exact opposite of what a hiring page is for.
 *
 * So the hook moves up and the depth stays put: the suite runs here, the
 * defect injection and the bisect remain on /proof for anyone it convinced.
 *
 * Dark on purpose. FailureWall is an invert-section too, so this reads as the
 * second half of one act rather than a new one — what breaks, then what
 * catches it.
 */
export default function LiveProof() {
  return (
    <section id="live-proof" className="invert-section scroll-mt-20">
      <div className="shell band">
        <Marker index="—">{liveProof.kicker}</Marker>

        <h2 className="display max-w-[16ch]">
          <MaskedWords text={liveProof.title} />
        </h2>

        <Reveal>
          <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-[17px]">
            {liveProof.line}
          </p>
        </Reveal>

        {/* Runs only when asked — see SelfTest. Nothing executes on load. */}
        <SelfTest />

        <Reveal>
          <div className="mt-14 border-t border-white/15 pt-8">
            <p className="max-w-xl text-[14px] leading-relaxed text-white/70">
              {liveProof.ctaLine}
            </p>
            <a
              href={liveProof.ctaHref}
              onClick={(e) => {
                e.preventDefault()
                navigate(liveProof.ctaHref)
              }}
              data-cursor="view"
              className="group mt-6 inline-flex items-center gap-4 text-xl font-semibold tracking-tight transition-colors hover:text-navy-300 sm:text-2xl"
            >
              {liveProof.ctaLabel}
              <span
                aria-hidden
                className="text-2xl transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
