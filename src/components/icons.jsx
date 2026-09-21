/**
 * A small hand-drawn icon set for the QA domain.
 *
 * Deliberately not a generic icon library — a bug, a gauge and a database are
 * in every pack, but "an assertion", "a rail" and "a recorded session" are
 * not. Thin single-weight strokes, currentColor, one visual language.
 */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

/* ── skills ───────────────────────────────────────────────────────────── */

// Manual & exploratory — a lens over a document
export const IconManual = (p) => (
  <svg {...base} {...p}>
    <path d="M5 3h9l4 4v5" />
    <path d="M14 3v4h4" />
    <path d="M5 3v18h5" />
    <circle cx="16" cy="16.5" r="3.5" />
    <path d="m19 19.5 2.2 2.2" />
  </svg>
)

// Test automation — a play head inside a repeat loop
export const IconAutomation = (p) => (
  <svg {...base} {...p}>
    <path d="M4 9a8 8 0 0 1 13.7-5.6L20 6" />
    <path d="M20 2.5V6h-3.5" />
    <path d="M20 15a8 8 0 0 1-13.7 5.6L4 18" />
    <path d="M4 21.5V18h3.5" />
    <path d="m10.5 9.2 4.2 2.6-4.2 2.6z" />
  </svg>
)

// API — a request crossing a boundary, with brackets
export const IconApi = (p) => (
  <svg {...base} {...p}>
    <path d="M7 4 3 12l4 8" />
    <path d="m17 4 4 8-4 8" />
    <path d="M9.5 12h5" />
    <path d="m12.5 9.5 2.5 2.5-2.5 2.5" />
  </svg>
)

// SQL & data — a store, verified
export const IconData = (p) => (
  <svg {...base} {...p}>
    <ellipse cx="12" cy="5.5" rx="7" ry="2.8" />
    <path d="M5 5.5v6c0 1.5 3.1 2.8 7 2.8 1.1 0 2.2-.1 3.1-.3" />
    <path d="M5 11.5v6c0 1.5 3.1 2.8 7 2.8h.4" />
    <path d="m15.5 18.3 1.9 1.9 4-4.2" />
  </svg>
)

// Performance — a gauge under load
export const IconPerf = (p) => (
  <svg {...base} {...p}>
    <path d="M3.5 18a9 9 0 1 1 17 0" />
    <path d="m12 14 4-4.5" />
    <circle cx="12" cy="14" r="1.4" />
    <path d="M3.5 18h3M17.5 18h3" />
  </svg>
)

// AI tooling — an assist spark
export const IconAi = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3.2 13.6 8 18.4 9.6 13.6 11.2 12 16 10.4 11.2 5.6 9.6 10.4 8z" />
    <path d="M18.2 15.4l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    <path d="M5.4 3.2l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4L3.5 5.1l1.4-.5z" />
  </svg>
)

export const SKILL_ICON = {
  manual: IconManual,
  automation: IconAutomation,
  api: IconApi,
  sql: IconData,
  performance: IconPerf,
  ai: IconAi,
}

/* ── rails ────────────────────────────────────────────────────────────── */

// Bitcoin — a block in a chain
export const IconBtc = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="8" width="7" height="8" rx="1.2" />
    <rect x="13.5" y="8" width="7" height="8" rx="1.2" />
    <path d="M10.5 12h3" />
    <path d="M6 5.5v2.5M8 5.5v2.5M6 16v2.5M8 16v2.5" />
  </svg>
)

// Lightning — instant
export const IconLightning = (p) => (
  <svg {...base} {...p}>
    <path d="M13.5 2.5 5 13.5h6l-.5 8L19 10.5h-6z" />
  </svg>
)

// Ethereum — the diamond
export const IconEth = (p) => (
  <svg {...base} {...p}>
    <path d="m12 2.5 6.5 10L12 16 5.5 12.5z" />
    <path d="m12 18 6.5-4L12 21.5 5.5 14z" />
  </svg>
)

// Stablecoin — a token that holds its value
export const IconToken = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M7.5 9h9" />
    <path d="M12 9v8" />
    <path d="M8.5 12.6c2.2.7 4.8.7 7 0" />
  </svg>
)

// Tokenised gold — a bar
export const IconGold = (p) => (
  <svg {...base} {...p}>
    <path d="M6.5 9h11l2 6h-15z" />
    <path d="M9 9 8 5h8l-1 4" />
    <path d="M10.5 12h3" />
  </svg>
)

// Smart contract — code under seal
export const IconContract = (p) => (
  <svg {...base} {...p}>
    <path d="M5.5 3h8l5 5v13h-13z" />
    <path d="M13.5 3v5h5" />
    <path d="m10 12.5-2 2 2 2" />
    <path d="m14 12.5 2 2-2 2" />
  </svg>
)

// Payout — money leaving
export const IconPayout = (p) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="6.5" width="14" height="11" rx="1.6" />
    <circle cx="9.5" cy="12" r="2.2" />
    <path d="M19 8.5v7" />
    <path d="m16.5 13 2.5 2.5 2.5-2.5" />
  </svg>
)

export const RAIL_ICON = {
  btc: IconBtc,
  lightning: IconLightning,
  eth: IconEth,
  usdt: IconToken,
  xaut: IconGold,
  contract: IconContract,
  payout: IconPayout,
}
