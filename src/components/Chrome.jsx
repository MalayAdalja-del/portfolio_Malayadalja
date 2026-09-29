import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from 'framer-motion'
import { nav, profile } from '../content'
import { navigate, useRoute } from '../lib/router'
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

/**
 * `initialRoute` is the prerenderer's, handed down from App.
 *
 * Without it this called `useRoute()` bare, which falls back to `home` when
 * there is no `window` — so every chapter and case-study page was prerendered
 * with a nav that believed it was on the home page, and shipped `#top`,
 * `#work` and `#contact` as bare fragments. React 18 does not rewrite
 * attributes that disagree with the server HTML during hydration, so those
 * stayed wrong for the life of the page. Clicking still worked, because
 * `goTo` reads the live route, but a middle-click, an open-in-new-tab and
 * every crawler got a fragment that pointed at nothing on that page.
 */
export function Nav({ initialRoute, onResume }) {
  const route = useRoute(initialRoute)
  const onHome = route.name === 'home'

  /**
   * Every link in this bar was a bare fragment — `#top`, `#work`, `#proof`.
   * On the home page that is right. On a case study it is useless: the
   * browser appends the fragment to the current path and stays there, so
   * clicking the logo on /work/aegis went to /work/aegis#top and the
   * visitor was stuck on the subpage with no way back to the site.
   *
   * Off the home page the same links have to be real paths.
   */
  // Two kinds of nav target now: a page (/proof) and a section of the home
  // page (#work). A page link is the same everywhere. A section link only
  // works as a bare fragment while you are on the home page — anywhere else
  // the browser appends it to the current path and goes nowhere.
  const isPage = (h) => h.startsWith('/')
  const hrefFor = (h) => (isPage(h) || onHome ? h : `/${h}`)

  const goTo = (e, h) => {
    if (isPage(h)) {
      e.preventDefault()
      navigate(h)
      return
    }
    if (onHome) return
    e.preventDefault()
    navigate('/')
    if (h && h !== '#top') {
      requestAnimationFrame(() => {
        const target = document.querySelector(h)
        if (target) target.scrollIntoView({ block: 'start' })
      })
    }
  }

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
      {/* Once the page scrolls, the bar sits directly on top of body copy and
          reads as two lines of text in the same place. This is the surface
          that separates them: translucent paper, so the dark bar text below
          stays legible over a black section as well as a white one. It only
          appears once you have actually scrolled, so the hero is untouched. */}
      <div
        aria-hidden
        className={`absolute inset-0 transition-opacity duration-300 ${
          open
            ? 'bg-ink opacity-100'
            : scrolled
              ? 'bg-paper/85 backdrop-blur-md opacity-100'
              : 'opacity-0'
        }`}
      />

      {/* This bar used to be `text-white mix-blend-difference`, on the theory
          that difference blending would read correctly over the white acts
          and the black ones alike. It never blended at all. `mix-blend-mode`
          composites against the backdrop *within its own stacking context*,
          and the parent <header> is `position: fixed`, which makes one —
          so the bar blended against its own empty background and stayed
          plain white. Over the hero, which is white on every route, that
          rendered the logo, all six links, the Résumé button and the phone
          hamburger invisible: measured luminance range 0.0 across the strip
          on all nine routes, desktop and mobile. The site looked like a
          single landing page because the only way off it could not be seen.

          The cursor, the scroll bar and the chapter rail use the same blend
          and are fine — each puts it on the fixed element itself rather than
          on a child, so theirs composites against the page.

          Explicit colours instead, which cannot silently no-op: ink on the
          hero and on the translucent surface above, paper when the menu has
          turned the bar into the top of an opaque black panel. */}
      <div
        className={`shell relative flex h-[72px] items-center justify-between ${
          open ? 'text-paper' : 'text-ink'
        }`}
      >
        <a
          href={hrefFor('#top')}
          onClick={(e) => goTo(e, '#top')}
          className="font-mono text-sm font-medium tracking-tight"
        >
          malay<span className="opacity-60">.adalja</span>
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={hrefFor(item.href)}
              onClick={(e) => goTo(e, item.href)}
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
                  href={hrefFor(item.href)}
                  onClick={(e) => {
                    setOpen(false)
                    goTo(e, item.href)
                  }}
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
