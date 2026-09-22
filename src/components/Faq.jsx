import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { faq } from '../content'
import { Marker, MaskedWords, useStatic } from '../lib/motion'

/**
 * The questions people actually ask, answered in plain text.
 *
 * This exists for two readers at once. A recruiter skimming for "can he do
 * X" gets a direct answer instead of having to infer one from a case study.
 * And an answer engine — ChatGPT, Claude, Gemini, Perplexity — gets prose it
 * can quote, which is the only way a person shows up in an AI reply: not by
 * ranking, by being the clearest available statement of a fact.
 *
 * The first answer is open on load, so the page is never a wall of closed
 * rows, and every answer is in the DOM whether or not its row is expanded —
 * collapsed only means visually collapsed. Structured data that describes
 * text a crawler cannot find is worthless, and structured data that
 * describes text a *visitor* cannot find is a policy violation.
 */
export default function Faq() {
  const reduce = useStatic()
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="bg-paper band scroll-mt-20">
      <div className="shell">
        <Marker index="Q&amp;A">Straight answers</Marker>
        <h2 className="display mb-5 max-w-3xl">
          <MaskedWords text="What people ask first." />
        </h2>
        <p className="mb-14 max-w-xl text-[15px] text-ink/75">
          Short, checkable answers — the same ones I would give in a first message.
        </p>

        <dl className="border-t border-ink/10">
          {faq.map((item, i) => {
            const isOpen = reduce || open === i
            return (
              <div key={item.q} className="border-b border-ink/10">
                <dt>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-start gap-5 py-6 text-left md:gap-8"
                  >
                    <span className="w-8 shrink-0 pt-1 font-mono text-[11px] text-ink/60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1 text-[17px] font-bold leading-snug tracking-tight md:text-[21px]">
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className={`shrink-0 pt-1 font-mono text-lg text-navy-500 transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </span>
                  </button>
                </dt>

                {/* The answer is always rendered. AnimatePresence would remove
                    it from the DOM when collapsed, and a crawler reads the
                    DOM, not the interaction. */}
                <dd className="overflow-hidden">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={isOpen ? 'open' : 'shut'}
                      initial={false}
                      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-3xl pb-7 pl-[3.25rem] text-[14.5px] leading-relaxed text-ink/75 md:pl-16 md:text-[16px]">
                        {item.a}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
