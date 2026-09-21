# Portfolio — Malay Adalja

A QA engineer's portfolio that runs a real test suite against itself while you read it.

## The one rule

**It sells the person, not the tool.** An earlier draft made Aegis-QA the subject — three
of seven sections were a product pitch for internal tooling that nobody can buy. Every
portfolio worth copying (Guglieri, Jack Elder, Rybin) leads with who the person is and uses
projects as *evidence*. This one does the same. Aegis is one case study out of three.

**Nothing goes in `content.js` that isn't true.** There are no invented metrics anywhere on
this site. Outcomes are stated qualitatively until real numbers exist — see the checklist.

## The story

The page is an **argument in six chapters**, not a list of sections. A visitor decides in
about two minutes whether to stay; the job of every chapter is to earn the next one.

    stakes → what breaks → what I check → how I keep up →
    where it ran → track record → talk to me

| # | Chapter | Theme | Why it comes here |
|---|---|---|---|
| — | Hero | white | The hook, four quick facts (years / role / domains / location), and an explicit contract: *"Six chapters, about two minutes. By the end you will know whether to email me."* Telling someone how long it takes is what stops them bouncing. |
| 01 | What breaks | black | Opens with stakes, not credentials. Scroll-driven wall of failure *classes* — idempotency, boundary, config drift. |
| 02 | What I check | black | **The proof, and it comes early.** Seven real payment state machines (BTC, Lightning, ETH, USDT, XAUT, ERC-20 contract, crypto payout). Click one, watch it run, read the assertion that holds at each state. This is the section that converts. |
| 03 | How I keep up | white | Seven rails × five assertions × every release does not scale by hand — so here is the method, and the AI tooling (Claude, Claude Code, ChatGPT, Cursor, Copilot, Kimi 2.5, Emergent) used daily to keep up. Aegis-QA is what those tools were used to build. |
| 04 | Where it ran | white | Three case studies, each opening a full side drawer: problem → what I did → outcome → stack. |
| 05 | The journey | white | **The human arc**, told as a story rather than listed as employment history: recruiter → manual tester → automation engineer → tool builder. **Scrolling down drags the years sideways** — a pinned horizontal track, so time is a direction you travel rather than a list you read. A stakes line climbs across the whole track behind the cards; the active card is navy-bordered and its neighbours dim. Ghost years sit behind each card. Falls back to a vertical stack below 1024px and under `prefers-reduced-motion`, where hijacking the scroll would be hostile. Each era carries **Learned / Tested / Built** — which is what a career actually is, those three repeating at higher stakes. Closes on "What I am looking for" with the CTA. |
| 06 | Why it matters | black | **The closing argument, made by breaking this page.** A switch injects six *real* defects into the live DOM — 1.9:1 contrast, a missing alt, an unnamed button, `tabindex="5"`, a `target="_blank"` with no `rel`, a skipped heading level. The corner panel is the same suite that runs on every load and has no idea this section exists, so it genuinely drops from 15/15 to 9/15. Fix them one at a time or all at once and it climbs back. "QA is necessary" is an opinion; a live failing assertion is not. |
| 07 | Talk to me | black | The ask, after the argument has been made. |
| — | Case study subpages | white | Each study is a real page at `#/work/speed` — shareable URL, back button, own `<title>`, next-study link. `src/lib/router.js` is a 30-line hash router; routes need a leading `/` so in-page anchors like `#work` still work. |
| — | Résumé | overlay | Full graphic CV generated from the same `content.js`, so it can never drift. Print → Save as PDF works today. |

**The connective tissue is `<Transition>`** — a full-height page-turn between chapters that
scrubs into focus as you scroll it. Copy lives in `transitions` in `content.js`. Read end to
end they form their own short argument; that is the test for whether a new one belongs.

**`<ChapterRail>`** is the "stay or close" control: a fixed spine on the right showing which
chapter you are in, out of six. Someone who can see the story is finite keeps scrolling.

Themes alternate white → black deliberately so the eye never settles into a scroll coma.

## The live self-test

Bottom-left of every page, a panel runs a **real** suite against the rendered page in the
visitor's browser. Fifteen assertions: landmarks, heading order, image alt text, accessible
names, positive tabindex, `rel="noopener"`, WCAG AA contrast computed over every text node,
horizontal overflow, JSON-LD validity, reduced-motion support, console errors, and LCP/CLS
from real `PerformanceObserver` entries.

Nothing is stubbed. If the page regresses, the panel goes red in front of whoever is
looking at it. It proves the skill instead of listing it.

- `src/lib/probe.js` — instrumentation installed before React mounts
- `src/lib/selftest.js` — the assertions
- `src/components/SelfTest.jsx` — the panel

**If you change the design, run the suite.** Last verified: 15/15 green — cold, after a
full scroll, at 1440px and 390px, and under `prefers-reduced-motion`. LCP 0.42s desktop,
CLS 0, no horizontal overflow, zero console errors.

The LCP assertion reports but does **not** fail on a dev build: `npm run dev` serves
hundreds of unbundled modules and measured 4.30s against 0.42s for the production build.
Failing there would be crying wolf, so it shows the number and marks itself skipped.

The contrast check skips `mix-blend-difference` elements (nav, cursor, progress bar) and
reports how many — a blended colour can't be computed statically, and guessing would be
worse than saying so.

## Two bugs this section found in the site itself

Building the break-this-page proof surfaced two real defects, which is the best
possible argument for the feature:

1. **CLS 0.27.** `ChapterRail` animated its tick marks with `width`. Width is a
   layout-affecting property, so *every scroll* accumulated layout shift. Switched to
   `transform: scaleX` — CLS went 0.2713 → **0.0003**.
2. **The panel popped open unprompted** on every page load, because `QaProof` dispatched
   its re-run on mount. Now it only fires after the visitor actually changes something.

Neither was visible to the eye. Both were caught by an assertion.

## Design system

**White, navy, black.** `navy-500` (`#1E3A8A`) is the accent on white at 10.4:1;
`navy-300` (`#7A9BF5`) on black at 7.1:1. State is expressed with weight and opacity, never
a fourth hue. Sections alternate white → black → white → black; add `invert-section` to
flip one and children inherit.

| Piece | Where | Note |
|---|---|---|
| Preloader | `Chrome.jsx` | 850ms counter + curtain. Page renders underneath, so it costs nothing in paint timing. |
| Custom cursor | `Chrome.jsx` | One `mix-blend-difference` dot — correct on white *and* black, no theme plumbing. Pointer devices only. |
| Nav | `Chrome.jsx` | Also blended; hides on scroll down, returns on scroll up. |
| Poster type | `.mega` / `.display` | `clamp()` sized to the **longest line** so nothing wraps below the fold. |
| Outlined type | `.outline-type` | Stroke colour must be **explicit** — `currentColor` resolves to the transparent fill and the text vanishes. |
| Case drawer | `CaseStudies.jsx` | Esc to close, scroll lock, `role="dialog"`, labelled close button. |
| Hover preview | `CaseStudies.jsx` | Black card rides the cursor over the work list. |

**Contrast floors, learned the hard way.** WCAG AA needs 4.5:1 for normal text and 3:1 for
large (≥24px, or ≥18.66px bold). On white: `text-ink/40` is 2.70:1 — fails everywhere.
`text-ink/55` is 4.37:1 — fine for display type, **fails a 10px label**. Small text needs
`text-ink/60` (5.19:1). On black the floor is `text-white/55`. The self-test caught every
one of these before a screenshot did; trust it over your eye.

## Discoverability

The old site was an empty SPA shell to every crawler — that's why nobody found it.

- JSON-LD `Person` + `Occupation` + `knowsAbout` in static HTML — what Google, ChatGPT,
  Perplexity and Claude read to answer "find me a QA automation engineer"
- `<noscript>` block with the real content
- `public/robots.txt` — AI crawlers explicitly allowed
- `public/sitemap.xml`, `public/llms.txt`, `public/og.png`

**If the domain changes**, update the absolute URLs in `index.html`, `public/sitemap.xml`
and `public/llms.txt`.

## Performance

Fonts are **self-hosted** (`public/fonts/`, 80 KB both latin variable subsets) and
preloaded. Google Fonts cost two cross-origin round trips and a late headline repaint,
pushing LCP to 2.88s; serving them from our origin took it to 0.42s. Don't put the
`fonts.googleapis.com` link back.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
```

PowerShell: `cd D:\portfolio-v2; npm run dev` — 5.1 has no `&&`.

## Editing content

**All copy lives in `src/content.js`.** Keep the `<noscript>` block in `index.html` and
`public/llms.txt` roughly in step — those are what non-JS crawlers and answer engines read.

## Decisions already made

- **No photo.** Deliberate — the type, the rails simulator and the self-test carry the
  personality instead. Don't reintroduce it as a "gap".
- **No invented metrics.** Outcomes stay qualitative until real figures exist.

## Before you ship

- [ ] **Real outcome numbers.** This is the biggest remaining gap and the one thing that
      separates this from every other QA CV. Every case study's `outcome` is currently
      qualitative. If you can stand behind figures — regression runtime before/after, bugs
      caught pre-release, suite size, release-cycle length — send them and they go in.
      Nothing gets invented to fill the space.
- [ ] `profile.resume` is empty, so the résumé overlay offers **Print / Save PDF** only —
      which already produces a clean CV. Drop your own PDF in `public/` and point `resume`
      at it to add a direct Download button. `profile.github` is the same deal.
- [ ] The rails in `paymentRails` describe real state machines and real assertion classes.
      Check each one matches how Speed actually behaves before this goes live — it is the
      most technically specific thing on the site and therefore the easiest to be caught out on.
- [ ] `failureWall.cases` are illustrative failure *classes*, not real tickets — no customer
      data, no endpoints, no credentials. Keep it that way.
- [ ] Sanity-check `failureWall.stats`: 15+ projects, 7 yrs 4 mo, 2,300+ test cases.

## Deploying to Vercel

Framework preset **Vite**, build `npm run build`, output `dist`. To keep the existing
`portfolio-malayadalja.vercel.app` URL, push into the same repo the current site deploys
from. After the first deploy, submit the sitemap in Google Search Console.

## Accessibility & motion

Every scroll-driven section has a static fallback. Under `prefers-reduced-motion` the site
drops all choreography, skips the preloader and cursor, and renders the same information as
plain sections. The self-test asserts this on every load.
