import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { chapters } from '../content'

/**
 * A fixed spine showing which chapter you are in, out of how many.
 *
 * This is the "should I stay or close" control. A visitor who can see the
 * story is six chapters long, and that they are on three, keeps scrolling.
 * One who cannot see the end assumes there isn't one.
 */
export default function ChapterRail() {
  const [active, setActive] = useState(-1)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const nodes = chapters
      .map((c) => ({ c, el: document.getElementById(c.id) }))
      .filter((x) => x.el)

    const onScroll = () => {
      const line = window.innerHeight * 0.4
      let current = -1
      nodes.forEach(({ el }, i) => {
        if (el.getBoundingClientRect().top <= line) current = i
      })
      setActive(current)
      setVisible(window.scrollY > window.innerHeight * 0.6)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Chapters"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-5 top-1/2 z-[76] hidden -translate-y-1/2 text-white mix-blend-difference lg:block"
        >
          <ol className="flex flex-col items-end gap-3.5">
            {chapters.map((c, i) => {
              const on = i === active
              const seen = i < active
              return (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className="group flex items-center justify-end gap-3"
                    aria-current={on ? 'true' : undefined}
                  >
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-300 ${
                        on
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-70 group-focus-visible:opacity-70'
                      }`}
                    >
                      {c.n} {c.name}
                    </span>
                    {/* scaleX, not width: animating width relayouts the page
                        and every scroll then accumulates CLS */}
                    <span className="block h-px w-9 overflow-hidden">
                      <span
                        className={`block h-px w-full origin-right bg-current transition-transform duration-300 group-hover:scale-x-100 ${
                          on ? 'scale-x-100' : seen ? 'scale-x-[0.55]' : 'scale-x-[0.38] opacity-45'
                        }`}
                      />
                    </span>
                  </a>
                </li>
              )
            })}
          </ol>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
