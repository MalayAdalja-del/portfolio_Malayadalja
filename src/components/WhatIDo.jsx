import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { skillSpine } from '../content'
import { Marker, MaskedWords, Reveal, useStatic } from '../lib/motion'
import { SKILL_ICON } from './icons'

/**
 * The skills spine — the answer to "what does he actually do".
 * Each row opens to the tools and one line of evidence, so a claim is never
 * left standing on its own.
 */
export default function WhatIDo() {
  const reduce = useStatic()
  const [open, setOpen] = useState('manual')

  return (
    <section id="skills" className="shell bg-paper band scroll-mt-20">
      <Marker index="Ch.04">What I do</Marker>
      <h2 className="display mb-14 max-w-4xl">
        <MaskedWords text="Six things, done properly." />
      </h2>

      <div className="border-t border-ink/10">
        {skillSpine.map((skill, i) => {
          // Statically, a closed row means its tools and its evidence are not
          // in the document at all. Open them all instead.
          const isOpen = reduce || open === skill.key
          return (
            <Reveal key={skill.key} delay={Math.min(i, 4) * 0.05}>
              <div className="border-b border-ink/10">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? '' : skill.key)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-5 py-6 text-left md:gap-8"
                >
                  <span className="w-8 shrink-0 font-mono text-[11px] text-ink/60">0{i + 1}</span>
                  {(() => {
                    const Icon = SKILL_ICON[skill.key]
                    return Icon ? (
                      <Icon
                        className={`h-7 w-7 shrink-0 transition-colors duration-300 ${
                          isOpen ? 'text-navy-500' : 'text-ink/35 group-hover:text-navy-500'
                        }`}
                      />
                    ) : null
                  })()}
                  <span
                    className={`min-w-0 flex-1 font-black leading-tight tracking-tightest transition-colors duration-300 [font-size:clamp(1.4rem,3.4vw,2.6rem)] ${
                      isOpen ? 'text-navy-500' : 'text-ink group-hover:text-navy-500'
                    }`}
                  >
                    {skill.name}
                  </span>
                  <span
                    aria-hidden
                    className={`shrink-0 text-xl transition-transform duration-300 ${
                      isOpen ? 'rotate-45 text-navy-500' : 'text-ink/60 group-hover:text-ink'
                    }`}
                  >
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-7 pb-8 md:grid-cols-[1.2fr_1fr] md:gap-14 md:pl-[3.25rem]">
                        <p className="text-[16px] leading-relaxed text-ink/75 md:text-[19px]">
                          {skill.line}
                        </p>
                        <div>
                          <ul className="flex flex-wrap gap-2">
                            {skill.tools.map((t) => (
                              <li
                                key={t}
                                className="bg-bone px-3 py-1.5 font-mono text-[11px] text-ink/75"
                              >
                                {t}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-4 flex gap-3 text-[13px] leading-relaxed text-ink/75">
                            <span className="font-bold text-navy-500">✓</span>
                            <span>{skill.evidence}</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
