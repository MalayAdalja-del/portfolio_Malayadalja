import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/**
 * The page-turn between two chapters.
 *
 * Its only job is to make the next chapter feel earned — a short statement
 * that closes the argument just made and opens the one coming. The line
 * scrubs into focus as you scroll through it, so scrolling past feels like
 * turning a page rather than hitting another section header.
 */
export default function Transition({ lead, emph, sub, dark = false }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const y = useTransform(scrollYProgress, [0, 1], ['16%', '-16%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.72, 1], [0, 1, 1, 0])

  return (
    <section
      ref={ref}
      className={`relative flex min-h-[72svh] items-center overflow-hidden ${
        dark ? 'invert-section' : 'bg-paper'
      }`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[46vw] w-[46vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px] ${
          dark ? 'bg-navy-600/30' : 'bg-navy-500/[0.05]'
        }`}
      />

      <motion.div
        style={reduce ? undefined : { y, opacity }}
        className="shell relative max-w-[1100px]"
      >
        {/* Lead solid, punchline navy — the same two-voice headline as the
            hero. It was a 55%-opacity grey lead, which on white read as
            silver rather than as a de-emphasis, and put the weakest colour
            on the longest half of the sentence. */}
        <p className="display">
          <span>{lead}</span> <span className="accent-line">{emph}</span>
        </p>
        <p
          className={`mt-8 max-w-xl text-[15px] leading-relaxed md:text-[18px] ${
            dark ? 'text-white/80' : 'text-ink/75'
          }`}
        >
          {sub}
        </p>
      </motion.div>
    </section>
  )
}
