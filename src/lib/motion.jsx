import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { IS_STATIC } from './env'

/**
 * "Render this plainly, without motion."
 *
 * Three readers have to agree here.
 *
 * A visitor who asked for reduced motion gets the plain render, always.
 *
 * The build-time prerender gets it too, because every animated component in
 * this codebase already has a no-motion branch that renders its content
 * fully visible — PaymentRails lists all seven rails instead of one,
 * FailureWall lists all eight failure classes — so reusing that branch
 * produces static HTML a crawler can read rather than a frozen first frame
 * full of `opacity: 0`.
 *
 * And the browser's *first* render has to match the prerendered HTML
 * exactly, or React cannot hydrate it and throws the whole document away to
 * re-render from scratch. That repaint cost 2.8s of LCP at phone widths,
 * because the re-rendered hero was larger than the one already on screen
 * and so became a fresh, late LCP candidate. Hence the mount pass: static on
 * render one, interactive from the effect onwards.
 *
 * framer's own MotionConfig cannot do this job — its `reducedMotion` setting
 * does not reach `useReducedMotion()` during server rendering, which is how
 * the first prerender shipped 84 invisible elements.
 */
let hasMounted = false

export function useStatic() {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(hasMounted)

  useEffect(() => {
    hasMounted = true
    if (!mounted) setMounted(true)
  }, [mounted])

  return IS_STATIC || !mounted || Boolean(reduce)
}

/** Fade + rise on first scroll into view. The site's default entrance. */
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const reduce = useStatic()
  const Tag = motion[as] ?? motion.div

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  )
}

/** Counts from 0 to `to` the first time it is seen. */
export function Counter({ to, suffix = '', duration = 1.7, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduce = useStatic()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return undefined
    if (reduce) {
      setValue(to)
      return undefined
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, duration, reduce])

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

/**
 * Headline that reveals word by word from behind a mask.
 *
 * The trigger lives on the unclipped wrapper and cascades through variants.
 * Putting whileInView on the translated word itself deadlocks: it starts
 * outside its own overflow-hidden parent, so IntersectionObserver clips its
 * rect to nothing and the reveal never fires.
 */
export function MaskedWords({ text, className = '', delay = 0, stagger = 0.055 }) {
  const reduce = useStatic()
  const words = text.split(' ')

  if (reduce) return <span className={className}>{text}</span>

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '-8% 0px' }}
      variants={{
        hidden: {},
        shown: { transition: { delayChildren: delay, staggerChildren: stagger } },
      }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
        >
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: '115%' }, shown: { y: '0%' } }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

/** Numbered section marker: 01 / EXPERIENCE. */
export function Marker({ index, children, className = '' }) {
  return (
    <div className={`mb-10 flex items-baseline gap-4 ${className}`}>
      <span className="eyebrow opacity-45">{index}</span>
      <span className="h-px flex-1 bg-current opacity-15" />
      <span className="eyebrow">{children}</span>
    </div>
  )
}
