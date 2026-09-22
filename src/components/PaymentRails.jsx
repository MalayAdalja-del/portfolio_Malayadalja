import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { paymentRails, railsIntro } from '../content'
import { Marker, MaskedWords, useStatic } from '../lib/motion'
import { RAIL_ICON } from './icons'
import MoneyFlow from './MoneyFlow'

const STEP_MS = 850

/**
 * Pick a rail, watch it settle.
 *
 * Each rail is the real state machine for that asset, and each state carries
 * the assertion that has to hold there. It is the most honest thing this site
 * can show: not "I tested payments" but "here is exactly what I check, per
 * asset, and here is why those five differ".
 */
export default function PaymentRails() {
  const reduce = useStatic()
  const [railId, setRailId] = useState('btc')
  const [step, setStep] = useState(-1)
  const [running, setRunning] = useState(false)
  const timers = useRef([])

  const rail = paymentRails.find((r) => r.id === railId)

  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const run = useCallback(
    (id) => {
      clear()
      const target = paymentRails.find((r) => r.id === id)
      if (!target) return

      if (reduce) {
        setStep(target.steps.length - 1)
        setRunning(false)
        return
      }

      setStep(-1)
      setRunning(true)
      timers.current = target.steps.map((_, i) =>
        setTimeout(
          () => {
            setStep(i)
            if (i === target.steps.length - 1) setRunning(false)
          },
          (i + 1) * STEP_MS,
        ),
      )
    },
    [reduce],
  )

  // Start the default rail once the section is actually looked at.
  //
  // Two things were wrong here and both left the panel permanently empty,
  // showing "0 / 5 passed" under a blank box.
  //
  // `threshold: 0.35` cannot fire for a section taller than about three
  // viewports — on a 390px phone this section is 2783px against an 844px
  // screen, so the highest ratio reachable is 0.30 and the observer waits
  // forever. A margin-based trigger asks the right question instead: is
  // this section across the middle of the screen?
  //
  // And the effect has to depend on `reduce`. The first render is the
  // static one, which has no ref to observe, so an effect that ran once on
  // mount attached to nothing and never looked again.
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run(railId)
          io.disconnect()
        }
      },
      { threshold: 0, rootMargin: '-30% 0px -30% 0px' },
    )
    io.observe(node)
    return () => {
      io.disconnect()
      clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce])

  const select = (id) => {
    setRailId(id)
    run(id)
  }

  const settled = step === rail.steps.length - 1

  // Interactively this shows one rail at a time. Statically that would mean
  // six of the seven rails, and every assertion on them, simply not existing
  // — and those assertions are the most specific thing on this site. So the
  // no-motion render lists all of them.
  //
  // This branch has to sit below every hook above it. Put it any higher and
  // the mount pass, which flips `reduce` from true to false, runs a
  // different number of hooks than the render before it — React error #310,
  // and a blank page.
  if (reduce) return <Static />

  return (
    <section id="rails" ref={ref} className="invert-section scroll-mt-20">
      <div className="shell band">
        <Marker index="Ch.02">{railsIntro.kicker}</Marker>
        <h2 className="display max-w-4xl">
          <MaskedWords text={railsIntro.title} />
        </h2>
        <p className="mt-7 max-w-2xl text-[15px] leading-relaxed text-white/80 md:text-[17px]">
          {railsIntro.line}
        </p>

        {/* rail selector */}
        <div className="mt-12 flex flex-wrap gap-2.5">
          {paymentRails.map((r) => {
            const active = r.id === railId
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => select(r.id)}
                aria-pressed={active}
                className={`group border-2 px-4 py-2.5 text-left transition-colors duration-300 ${
                  active
                    ? 'border-navy-300 bg-navy-300 text-ink'
                    : 'border-white/25 text-white hover:border-white'
                }`}
              >
                {(() => {
                  const Icon = RAIL_ICON[r.id]
                  return Icon ? <Icon className="mb-2.5 h-7 w-7" /> : null
                })()}
                <span className="block font-mono text-[10px] uppercase tracking-[0.1em] opacity-70">
                  {r.symbol}
                </span>
                <span className="mt-0.5 block text-[14px] font-bold tracking-tight">{r.name}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
          {/* the machine */}
          <div>
            <div className="mb-5 flex items-baseline justify-between border-b border-white/15 pb-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-navy-300">
                {rail.name}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
                {rail.note}
              </p>
            </div>

            <ol className="relative border-l-2 border-white/15 pl-8">
              {rail.steps.map((s, i) => {
                const done = step >= i
                return (
                  <li key={s.state} className="relative pb-7 last:pb-0">
                    <motion.span
                      animate={{
                        backgroundColor: done ? '#7A9BF5' : 'rgba(10,11,13,1)',
                        borderColor: done ? '#7A9BF5' : 'rgba(255,255,255,0.3)',
                        scale: step === i ? [1, 1.45, 1] : 1,
                      }}
                      transition={{ duration: 0.4 }}
                      className="absolute -left-[2.4rem] top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2"
                    >
                      {done && <span className="text-[9px] font-bold text-ink">✓</span>}
                    </motion.span>

                    <motion.p
                      animate={{ opacity: done ? 1 : 0.42 }}
                      className="font-mono text-[12px] uppercase tracking-[0.09em]"
                    >
                      {s.state}
                    </motion.p>
                  </li>
                )
              })}
            </ol>

            <div className="mt-7 flex items-center gap-4">
              <button
                type="button"
                onClick={() => select(railId)}
                className="border-2 border-white px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors hover:bg-white hover:text-ink"
              >
                {running ? 'running…' : 'run again'}
              </button>
              <AnimatePresence>
                {settled && !running && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-[11px] uppercase tracking-[0.1em] text-navy-300"
                  >
                    ✓ {rail.steps.length} assertions held
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* the assertions */}
          <div className="border-2 border-white/15">
            <div className="flex items-center gap-2.5 border-b border-white/15 px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
              <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.11em] text-white/60">
                assertions · {rail.symbol}
              </span>
            </div>

            <ul className="min-h-[260px] px-5 py-4 sm:min-h-[286px]">
              {rail.steps.map((s, i) => (
                <motion.li
                  key={`${rail.id}-${s.state}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: step >= i ? 1 : 0, x: step >= i ? 0 : -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-3.5 py-2.5"
                >
                  <span className="mt-[3px] shrink-0 font-mono text-[11px] font-bold text-navy-300">
                    ✓
                  </span>
                  <span className="text-[13.5px] leading-snug text-white">{s.assert}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              animate={{ opacity: settled ? 1 : 0.25 }}
              className="flex items-center justify-between border-t border-white/15 bg-navy-700/50 px-5 py-3.5 font-mono text-[11px]"
            >
              <span className="font-bold text-navy-300">
                {Math.max(step + 1, 0)} / {rail.steps.length} passed · 0 failed
              </span>
              <span className="text-white/60">{rail.symbol} settled</span>
            </motion.div>
          </div>
        </div>

        <MoneyFlow />
      </div>
    </section>
  )
}

/**
 * Every rail, every assertion, no interaction.
 *
 * This is what a reduced-motion visitor sees, and what the prerender bakes
 * into the HTML that crawlers and answer engines read.
 */
function Static() {
  return (
    <section id="rails" className="invert-section scroll-mt-20">
      <div className="shell band">
        <Marker index="Ch.02">{railsIntro.kicker}</Marker>
        <h2 className="display max-w-4xl">{railsIntro.title}</h2>
        <p className="mt-7 max-w-2xl text-[15px] leading-relaxed text-white/80 md:text-[17px]">
          {railsIntro.line}
        </p>

        <div className="mt-14 grid gap-x-14 gap-y-12 md:grid-cols-2">
          {paymentRails.map((rail) => (
            <article key={rail.id}>
              <header className="flex items-baseline gap-3 border-b border-white/15 pb-3">
                <h3 className="text-xl font-black tracking-tightest">{rail.name}</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-navy-300">
                  {rail.symbol}
                </span>
              </header>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
                Known risk — {rail.note}
              </p>
              <ol className="mt-5">
                {rail.steps.map((step) => (
                  <li key={step.state} className="border-b border-white/10 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-navy-300">
                      {step.state}
                    </p>
                    <p className="mt-1.5 text-[13.5px] leading-snug text-white">{step.assert}</p>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>

        <MoneyFlow />
      </div>
    </section>
  )
}
