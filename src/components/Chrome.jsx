import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from 'framer-motion'
import { nav, profile } from '../content'
import { useStatic } from '../lib/motion'

/* ── preloader ────────────────────────────────────────────────────────── */

/**
 * A short white curtain with a counter, then a wipe.
 * The page renders underneath from the first frame, so this costs nothing in
 * paint timing — the self-test would catch it if it did.
 */
export function Preloader() {
  const reduce = useStatic()
  const [count, setCount] = useState(0)
  const [gone, setGone] = useState(Boolean(reduce))

  useEffect(() => {
    if (reduce) return undefined
    let frame
    const started = performance.now()
    const DURATION = 850

    const tick = (now) => {
      const t = Math.min((now - started) / DURATION, 1)
      setCount(Math.round((1 - (1 - t) ** 3) * 100)) // ease-out: sprint, then settle
      if (t < 1) frame = requestAnimationFrame(tick)
      else setTimeout(() => setGone(true), 130)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduce])

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="preloader"
          aria-hidden
          exit={{ y: '-100%' }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[90] flex items-end justify-between bg-paper px-6 pb-8 md:px-10 md:pb-10"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/60">
            {profile.name}
          </span>
          <span className="font-black tabular-nums leading-none tracking-mega text-ink [font-size:clamp(4rem,18vw,14rem)]">
            {String(count).padStart(3, '0')}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── cursor ───────────────────────────────────────────────────────────── */

/**
 * One blended dot. mix-blend-difference means a single element reads correctly
 * on the white acts and the black ones, with no theme plumbing.
 */
export function Cursor() {
  const reduce = useStatic()
  const [on, setOn] = useState(false)
  const [mode, setMode] = useState('idle') // idle | link | view
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 900, damping: 46, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 900, damping: 46, mass: 0.35 })

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return undefined
    setOn(true)
    document.body.classList.add('cursor-none-fine')

    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = e.target instanceof Element ? e.target : null
      if (el?.closest('[data-cursor="view"]')) setMode('view')
      else if (el?.closest('a, button, [role="button"]')) setMode('link')
      else setMode('idle')
    }
    window.addEventListener('pointermove', move)
    return () => {
      window.removeEventListener('pointermove', move)
      document.body.classList.remove('cursor-none-fine')
    }
  }, [reduce, x, y])

  if (!on) return null

  const size = mode === 'view' ? 6 : mode === 'link' ? 46 : 14

  return (
    <motion.div
      aria-hidden
      style={{ left: sx, top: sy }}
      className="pointer-events-none fixed z-[95] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
    >
      <motion.div
        animate={{ width: size, height: size }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className="rounded-full bg-white"
      />
    </motion.div>
  )
}

/* ── chrome ───────────────────────────────────────────────────────────── */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-white mix-blend-difference"
    />
  )
}

export function Nav({ onResume }) {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const last = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > 240 && y > last.current)
      setScrolled(y > 24)
      last.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      animate={{ y: hidden && !open ? '-110%' : '0%' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-[85]"
    >
      {/* The bar has no colour of its own — mix-blend-difference is what
          keeps it legible over both the white and the black sections. That
          guarantees contrast but not separation: once the page scrolls, the
          bar sits directly on top of body copy and reads as two lines of
          text in the same place. This blurs whatever is behind it, which
          costs nothing on a dark section, keeps the blend maths intact
          (blur changes detail, not average colour), and only appears once
          you have actually scrolled, so the hero is untouched. */}
      <div
        aria-hidden
        className={`absolute inset-0 transition-opacity duration-300 ${
          open ? 'bg-ink opacity-100' : scrolled ? 'backdrop-blur-md opacity-100' : 'opacity-0'
        }`}
      />

      {/* With the menu open the bar is the top of an opaque black panel, so
          it drops the blend and just uses white — blending against the page
          still showing above the panel washed the Résumé button and the
          close icon out to a ghost. */}
      <div
        className={`shell relative flex h-[72px] items-center justify-between ${
          open ? 'text-paper' : 'text-white mix-blend-difference'
        }`}
      >
        <a href="#top" className="font-mono text-sm font-medium tracking-tight">
          malay<span className="opacity-60">.adalja</span>
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative font-mono text-[11px] uppercase tracking-[0.12em]"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onResume}
            className="border border-current px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.11em] transition-opacity hover:opacity-70"
          >
            Résumé
          </button>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden font-mono text-[11px] uppercase tracking-[0.12em] underline-offset-4 hover:underline sm:block"
          >
            LinkedIn ↗
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="relative h-4 w-6 md:hidden"
          >
            <span
              className={`absolute left-0 h-[2px] w-full bg-current transition-all ${
                open ? 'top-2 rotate-45' : 'top-0.5'
              }`}
            />
            <span
              className={`absolute left-0 h-[2px] w-full bg-current transition-all ${
                open ? 'top-2 -rotate-45' : 'top-3'
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            /* `relative` is load-bearing. The bar's backdrop above is
               position:absolute inset-0, and once the menu is open that
               inset covers the whole expanded header. A positioned element
               paints over a static one whatever the DOM order, so without
               this the panel rendered as a black rectangle with all six
               links underneath it, present and white and invisible. */
            className="relative overflow-hidden bg-ink text-paper md:hidden"
          >
            {/* An opaque panel, and deliberately outside the blended bar
                above it. The menu used to inherit mix-blend-difference and
                carry no background of its own, so on a phone the six links
                rendered straight through the hero — "WHAT I DO" sitting
                inside "I find what breaks payments". A navigation you can
                see the page through is not a navigation. */}
            <nav aria-label="Sections" className="shell flex flex-col pb-8 pt-2">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-t border-white/20 py-4 font-black uppercase tracking-tightest [font-size:1.75rem]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
