import { moneyFlow } from '../content'
import { Reveal } from '../lib/motion'

/**
 * Four hops from payer to payout, with what is verified at each.
 *
 * The travelling dots are pure CSS — a keyframe translating along the track
 * with staggered delays — so nothing runs per frame in JS and it costs
 * nothing. The track is a flex row on desktop and a column on mobile, which
 * means the same markup works both ways with no measurement.
 */
export default function MoneyFlow() {
  const n = moneyFlow.stages.length

  return (
    <div className="mt-24 border-t border-white/15 pt-14">
      <h3 className="text-xl font-black tracking-tightest sm:text-2xl">{moneyFlow.title}</h3>
      <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-white/80">{moneyFlow.line}</p>

      <ol className="mt-12 grid gap-y-10 md:grid-cols-4 md:gap-x-6">
        {moneyFlow.stages.map((stage, i) => (
          <Reveal as="li" key={stage.name} delay={i * 0.08}>
            <div className="relative">
              {/* the track between this node and the next */}
              {i < n - 1 && (
                <span
                  aria-hidden
                  className="absolute left-4 top-8 hidden h-px w-full bg-white/20 md:block"
                >
                  <span className="relative block h-px w-full overflow-hidden">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        style={{ animationDelay: `${i * 0.4 + d * 1.1}s` }}
                        className="absolute -top-[2px] left-0 h-[5px] w-[5px] rounded-full bg-navy-300 motion-safe:animate-flow motion-reduce:hidden"
                      />
                    ))}
                  </span>
                </span>
              )}

              <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-navy-500 font-mono text-[11px] font-bold text-paper">
                {i + 1}
              </span>

              <p className="mt-5 text-lg font-bold tracking-tight">{stage.name}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                {stage.sub}
              </p>
              <p className="mt-4 flex gap-2.5 text-[13.5px] leading-relaxed text-white/80">
                <span aria-hidden className="font-bold text-navy-300">
                  ✓
                </span>
                <span>{stage.verify}</span>
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}
