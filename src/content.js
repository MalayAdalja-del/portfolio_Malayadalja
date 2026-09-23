// Every word on the site lives here. Edit this file, not the components.
//
// Rule for this file: nothing goes in that isn't true. No invented metrics.
// A recruiter should be able to answer "what does he do, how long, with what,
// and can I hire him" inside ten seconds of landing.

export const profile = {
  name: 'Malay Adalja',
  headline: 'Software Engineer — QA',
  years: '7 yrs 4 mo',
  location: 'Ahmedabad, India',
  availability: 'Open to work · remote or hybrid',

  // The positioning line. About him, not about a product.
  positioning:
    'I find what breaks payment systems before customers do, then automate it so it stays found.',

  intro:
    'Seven years on crypto payments. BTC, ETH, USDT, XAUT, Lightning, ERC-20 contracts, payouts. Manual and automated. API and database. Web and mobile. When the tooling ran out, I built my own.',

  // QA is the job. AI is the thing he went and learned. Both are true and
  // the second one is why Aegis exists at all, so it gets said out loud
  // rather than left to be inferred from a tools list.
  curiosity:
    'QA is my profession. AI is my curiosity. Aegis-QA is what happened when the two met: I did not wait for a vendor to sell me a tool, I learned enough AI to build my own.',

  email: 'malayadalja123@gmail.com',
  linkedin: 'https://www.linkedin.com/in/malayy-j-adalja-261578132/',
  github: 'https://github.com/MalayAdalja-del',
  resume: '', // e.g. '/Malay-Adalja-QA.pdf' dropped into /public
}

/** Answers the recruiter's first four questions without any scrolling. */
export const quickFacts = [
  { label: 'Experience', value: '7 yrs 4 mo', note: 'QA only, from Jun 2019' },
  { label: 'Now', value: 'Openxcell', note: 'Software Engineer — QA' },
  { label: 'Domains', value: 'Crypto payments', note: 'BTC · ETH · USDT · XAUT · LN' },
  { label: 'Based in', value: 'Ahmedabad, IN', note: 'open to remote' },
]

/* ── what I do: the skills spine ──────────────────────────────────────── */

export const skillSpine = [
  {
    key: 'manual',
    name: 'Manual & exploratory',
    line: 'The part automation cannot do. Reading a spec, finding the case nobody wrote down, and reproducing it reliably.',
    tools: ['Test design', 'Exploratory charters', 'Regression strategy', 'UAT', 'Defect triage'],
    evidence: 'Designed and ran the test suites for 15+ delivered projects.',
  },
  {
    key: 'automation',
    name: 'Test automation',
    line: 'End-to-end suites that survive a redesign, on web and Android, wired into CI so they run without being asked.',
    tools: ['Playwright', 'Selenium', 'Appium', 'Pytest', 'CI pipelines'],
    evidence: 'Automated payout and instant-send workflows end to end; Appium suites for Android.',
  },
  {
    key: 'api',
    name: 'API testing',
    line: 'Contract and behaviour checks against the endpoints behind the UI, including the auth and idempotency edges the UI never shows you.',
    tools: ['Postman', 'Newman', 'REST', 'Auth flows', 'Contract validation'],
    evidence: 'Collection-driven API suites run in CI alongside the UI layer.',
  },
  {
    key: 'sql',
    name: 'SQL & data verification',
    line: 'A green UI means nothing if the row is wrong. I check the database directly and reconcile it against what the API claimed.',
    tools: ['SQL', 'DB verification', 'Reconciliation', 'Audit trails'],
    evidence: 'Post-transaction DB checks on payment, payout and cashback flows.',
  },
  {
    key: 'performance',
    name: 'Performance',
    line: 'Load and throughput on the flows that actually cost money: withdrawals, transactions, checkout under concurrency.',
    tools: ['JMeter', 'Load profiling', 'Throughput analysis'],
    evidence: 'JMeter scripts for withdrawal and high-volume transaction flows.',
  },
  {
    key: 'ai',
    name: 'AI tooling',
    line: 'I use these every day for test design, failure triage, scripting, and reading a codebase I did not write. Then I used them to build Aegis-QA, the internal tool that holds all of this together.',
    tools: [
      'Claude',
      'Claude Code (CLI)',
      'ChatGPT',
      'Cursor',
      'GitHub Copilot',
      'Kimi 2.5',
      'Emergent',
      'Datadog AI',
    ],
    evidence:
      'Used them to build Aegis-QA. Runs, API tests, SQL, Datadog and recorded scripts in one place.',
  },
]

/* ── the story ────────────────────────────────────────────────────────── */
//
// The site is an argument, not a list. Each chapter earns the next one, and
// the transitions below are the connective tissue that makes a visitor keep
// scrolling. Read top to bottom, they should still make sense on their own.

export const storyPromise =
  'Six chapters, about two minutes. By the end you will know whether to email me.'

// Only the sections still on the home page. Three chapters are pages of
// their own now, and a rail that points at anchors which no longer exist
// scrolls nowhere.
export const chapters = [
  { id: 'failures', n: '01', name: 'What breaks' },
  { id: 'work', n: '02', name: 'Where I did it' },
  { id: 'chapters', n: '03', name: 'Go deeper' },
  { id: 'contact', n: '04', name: 'Talk to me' },
]

export const transitions = {
  toRails: {
    lead: 'Knowing the failure exists',
    emph: 'is the easy half.',
    sub: 'Anyone can list bug categories. The job is knowing exactly which assertion catches which one, on which rail, at which state.',
  },
  toSkills: {
    lead: 'Seven rails. Five assertions each.',
    emph: 'Every release.',
    sub: 'That does not scale by hand. So the second half of this job is tooling, and knowing which tool to reach for.',
  },
  toWork: {
    lead: 'That is the method.',
    emph: 'Here is where it ran.',
    sub: 'Three projects, opened in full. The problem, what I actually did, and what changed because of it.',
  },
  toContact: {
    lead: 'Still here?',
    emph: 'Then we should talk.',
    sub: 'You have seen how I think, what I check and what I have shipped. The rest is a conversation.',
  },
}

/* ── payment rails: the interactive centrepiece ───────────────────────── */
//
// Each rail is a real state machine with the assertions that have to hold at
// each step. This is the actual shape of the work — pick a rail, watch it run.

export const railsIntro = {
  kicker: 'Pick a rail',
  title: 'Every asset fails differently.',
  line: 'Three rails. Three state machines. Three ways to lose money. Pick one and watch what I assert at each step.',
}

export const paymentRails = [
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin · on-chain',
    note: 'Slow finality, reorg risk',
    steps: [
      {
        state: 'Invoice created',
        assert: 'Amount and address match the order; invoice has an expiry',
      },
      { state: 'Broadcast', assert: 'Transaction accepted to mempool; fee rate above the floor' },
      {
        state: '1 confirmation',
        assert: 'Order stays pending. One confirmation is not settlement',
      },
      {
        state: '3 confirmations',
        assert: 'Status flips to paid exactly once, even on a replayed webhook',
      },
      {
        state: 'Settled',
        assert: 'Ledger row and API response agree on amount, asset and timestamp',
      },
    ],
  },
  {
    id: 'lightning',
    symbol: 'LN',
    name: 'Lightning Network',
    note: 'Instant, but invoices expire',
    steps: [
      {
        state: 'Invoice created',
        assert: 'Payment hash unique; expiry short enough to price-protect',
      },
      {
        state: 'Route found',
        assert: 'Insufficient liquidity surfaces as a retry, not a failed order',
      },
      {
        state: 'In flight',
        assert: 'Checkout holds state, with no double-submit while the HTLC is pending',
      },
      {
        state: 'Preimage received',
        assert: 'Preimage verifies against the payment hash before crediting',
      },
      {
        state: 'Settled',
        assert: 'Expired-mid-checkout path issues a fresh invoice, not a silent fail',
      },
    ],
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum · native',
    note: 'Gas, nonces, reverts',
    steps: [
      {
        state: 'Quote locked',
        assert: 'Rate held for the quoted window; drift past tolerance rejects',
      },
      {
        state: 'Tx submitted',
        assert: 'Nonce sequencing correct; gas estimate survives a busy block',
      },
      { state: 'Mined', assert: 'Receipt status is 1. A mined revert is not a payment' },
      {
        state: 'Confirmed',
        assert: 'Reorg below the confirmation depth does not credit the account',
      },
      { state: 'Settled', assert: 'Amount credited net of gas, matching the ledger to the wei' },
    ],
  },
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether · ERC-20',
    note: 'Token transfer, not native',
    steps: [
      {
        state: 'Deposit address issued',
        assert: 'Address derived for this account only; never reused across users',
      },
      {
        state: 'Transfer event',
        assert: 'Transfer log parsed from the right contract, not a lookalike token',
      },
      {
        state: 'Decimals applied',
        assert: 'Six decimals, not eighteen. The classic off-by-10¹² bug',
      },
      { state: 'Confirmed', assert: 'Zero-value and self-transfer events are ignored' },
      { state: 'Settled', assert: 'Credited balance reconciles against the on-chain balance' },
    ],
  },
  {
    id: 'xaut',
    symbol: 'XAUT',
    name: 'Tether Gold',
    note: 'Tokenised commodity',
    steps: [
      { state: 'Quote locked', assert: 'Gold price feed fresh; a stale feed blocks the quote' },
      {
        state: 'Transfer event',
        assert: 'Fractional units handled, because gold trades in fractions of an ounce',
      },
      { state: 'Confirmed', assert: 'Rounding never favours the house or the customer silently' },
      {
        state: 'Converted',
        assert: 'Swap to fiat or stablecoin matches the locked quote, fees itemised',
      },
      {
        state: 'Settled',
        assert: 'Ledger, statement and API all report the same unit and precision',
      },
    ],
  },
  {
    id: 'contract',
    symbol: 'ABI',
    name: 'Smart contract',
    note: 'Contract calls and events',
    steps: [
      {
        state: 'Call encoded',
        assert: 'ABI encoding matches the deployed contract, not a stale artefact',
      },
      {
        state: 'Simulated',
        assert: 'Dry run catches the revert before a real transaction pays gas',
      },
      { state: 'Executed', assert: 'Emitted events carry the values the UI is about to display' },
      {
        state: 'Access checked',
        assert: 'A non-owner calling a privileged method reverts, every time',
      },
      {
        state: 'Settled',
        assert: 'Contract state, event log and our database tell the same story',
      },
    ],
  },
  {
    id: 'payout',
    symbol: 'OUT',
    name: 'Crypto payout',
    note: 'Money leaving. The scary one',
    steps: [
      {
        state: 'Payout requested',
        assert: 'Destination address checksum-valid for the chosen chain',
      },
      {
        state: 'Address verified',
        assert: 'Unverified address is refused. No exceptions, no override path',
      },
      { state: 'Approved', assert: 'Balance and limits checked at approval, not just at request' },
      { state: 'Broadcast', assert: 'A retried request never broadcasts twice for one payout id' },
      { state: 'Settled', assert: 'Audit trail records who approved it, when, and to where' },
    ],
  },
]

/* ── failure classes (the animated wall) ──────────────────────────────── */
// Illustrative of the kind of defect this work hunts for — not real tickets.

export const failureWall = {
  kicker: 'What I look for',
  title: 'The bug nobody wrote a test for.',
  line: 'The failure classes that survive a happy-path suite. These are the ones worth hunting.',
  cases: [
    {
      text: 'Refund issued twice on a retried webhook',
      area: 'payments',
      kind: 'Idempotency',
      caught: 'Status flips to paid exactly once, however many times the webhook fires',
    },
    {
      text: 'Invoice expires mid-checkout with no retry path',
      area: 'crypto',
      kind: 'Timing',
      caught: 'An expired invoice issues a fresh one instead of failing silently',
    },
    {
      text: 'Payout accepted for an unverified wallet address',
      area: 'security',
      kind: 'Validation',
      caught: 'Unverified destination is refused. No override path exists',
    },
    {
      text: 'Cashback tier miscounted across a month boundary',
      area: 'logic',
      kind: 'Boundary',
      caught: 'Tier maths asserted on the last and first second of the period',
    },
    {
      text: 'Country dropdown offers more than the allowlist permits',
      area: 'compliance',
      kind: 'Config drift',
      caught: 'The rendered list is diffed against the allowlist, not eyeballed',
    },
    {
      text: 'Rate drifts past tolerance on the fallback path',
      area: 'pricing',
      kind: 'Fallback',
      caught: 'The fallback quote is held to the same tolerance as the primary',
    },
    {
      text: 'DB row and API response disagree after a transfer',
      area: 'data',
      kind: 'Reconciliation',
      caught: 'Every money-moving flow reconciles the ledger against the response',
    },
    {
      text: 'Session desyncs after a host reconnect',
      area: 'realtime',
      kind: 'State',
      caught: 'Reconnect is asserted from both sides, not just the host',
    },
  ],
  stats: [
    { value: 15, suffix: '+', label: 'projects delivered' },
    { value: 7, suffix: ' yrs', label: '4 months in QA' },
    { value: 2300, suffix: '+', label: 'test cases authored' },
  ],
}

/* ── case studies ─────────────────────────────────────────────────────── */
// Outcomes are deliberately qualitative. Add hard numbers when you have them
// that you can stand behind — see the README checklist.

export const caseStudies = [
  {
    id: 'speed',
    title: 'Speed — crypto payment platform',
    role: 'Software Engineer — QA',
    period: '2023 — present',
    // No company link here. The work is described; the employer's site is
    // not advertised from a personal portfolio, and the two identities stay
    // apart on purpose.
    link: '',
    tag: 'Payments',
    summary:
      'Merchant checkout, payment links, refunds and crypto payouts across BTC, ETH, USDT, XAUT and the Lightning Network, plus ERC-20 smart contract testing, e-commerce plugin integrations and localization.',
    problem:
      'Money movement has no safe failure mode. A refund that fires twice, a payout to an unverified address or a rate that drifts on a fallback path are all real losses, and none of them show up on the happy path.',
    approach: [
      'Built regression coverage across the payment modules: Metadata, Customer, Swap, Payout, Instant Payout, Transfer.',
      'Covered BTC and Lightning, ETH, USDT (ERC-20) and XAUT, each with its own confirmation and decimal rules.',
      'Tested ERC-20 smart contract calls. ABI encoding, revert paths, emitted events and access control.',
      'Automated the crypto payout and instant-send workflows end to end, including address verification.',
      'Verified every transaction against the database, not just the UI response.',
      'Load-tested withdrawal and high-volume transaction flows with JMeter.',
      'Checked wallet address verification, audit trails and the KYB/KYC onboarding path.',
      'Validated WooCommerce and e-commerce plugin integrations, plus checkout localization across devices.',
    ],
    outcome: [
      'Payment flows that used to need a manual pass before every release are covered by an automated suite.',
      'Database reconciliation catches the class of bug where the UI reports success and the ledger disagrees.',
      'Regression runs against on-chain and Lightning rails without a person driving them.',
    ],
    stack: ['Playwright', 'Postman / Newman', 'SQL', 'JMeter', 'Appium'],
  },
  {
    id: 'aegis',
    title: 'Aegis-QA — the tooling I built',
    role: 'Creator & maintainer',
    period: 'Nov 2025 — present',
    link: '',
    tag: 'Internal tool',
    summary:
      'An internal platform I built to manage the QA work itself: triggering runs, API testing, Playwright scripts, SQL queries, Datadog lookups and test-case management with automation-script recording, all in one place.',
    problem:
      'The work was spread across a dozen tools. Postman here, a Playwright repo there, SQL in a client, Datadog in a browser tab, test cases in a spreadsheet. Every investigation meant stitching them back together by hand.',
    approach: [
      'One place to trigger and watch runs across UI, API, flow and security layers.',
      'A recorder that turns a real session into a reviewable script instead of hand-written selectors.',
      'API tests, SQL queries and Datadog lookups available next to the run that needs them.',
      'Test-case management tied to the automation that covers it.',
      'Self-healing locators. Proposed and sandbox-verified, never applied without a human saying yes.',
    ],
    outcome: [
      'Investigating a failed run happens in one tool instead of five.',
      'Recorded sessions become maintained scripts, so coverage grows without hand-writing every selector.',
      'It is internal tooling rather than a product. I built it because the off-the-shelf options did not fit how the team works.',
    ],
    stack: ['Python 3.12', 'Playwright', 'asyncio', 'FastAPI', 'Next.js', 'Docker'],
  },
  {
    id: 'kyb',
    title: 'KYB / KYC onboarding',
    role: 'QA Engineer',
    period: '2023 — present',
    link: '',
    tag: 'Compliance',
    summary:
      'Merchant verification through a third-party identity provider. LLC and Corporation flows, document upload, beneficiary checks and liveness.',
    problem:
      'Onboarding sits between your product and a vendor you do not control, across several document types and company structures. The failure modes are slow, stateful and easy to miss.',
    approach: [
      'Covered both LLC and Corporation paths, including multi-beneficiary cases.',
      'Tested document upload, liveness and the vendor iframe handoff.',
      'Cross-checked verification status in the database against what the provider reported.',
      'Built negative cases around the country allowlist and rejected document types.',
    ],
    outcome: [
      'The onboarding path has a repeatable suite instead of being re-tested by hand each release.',
      'Status mismatches between our records and the provider surface as failures rather than support tickets.',
    ],
    stack: ['Playwright', 'SQL', 'Postman'],
  },
]

/* ── Aegis detail (shown in the case-study drawer) ────────────────────── */

export const aegisPipeline = [
  { name: 'Record', line: 'A real session on the real app becomes a structured recording.' },
  {
    name: 'Compile',
    line: 'The recording compiles to readable Gherkin and a runnable Playwright spec.',
  },
  {
    name: 'Run',
    line: 'UI, API, flow and security layers execute together across five runner modes.',
  },
  {
    name: 'Heal',
    line: 'When a locator rots, the run proposes a fix and verifies it in a sandbox.',
  },
  {
    name: 'Learn',
    line: 'Only verified fixes are kept. Everything else stays advisory until a human approves it.',
  },
]

/* ── other work ───────────────────────────────────────────────────────── */

export const otherWork = [
  {
    title: 'TM2 (Teach Me To Online)',
    line: 'E-learning platform. Course upload, purchase flow, secure payment, student dashboards and access control.',
  },
  {
    title: 'NLC (Natural Living Care)',
    line: 'E-commerce with a multi-level bonus system. Cart, checkout, bonus tier calculation and user activity tracking.',
  },
  {
    title: 'OZ Road Code',
    line: 'Ride assessment platform on web and mobile. Video recording, map tracking and real-time speed logs.',
  },
  {
    title: 'Dekabes Domino',
    line: 'Multiplayer game. Real-time stability, AI difficulty and fairness, private tables and invites.',
  },
  {
    title: 'Moana Pasifika',
    line: 'Community app. Purchases, gifting, secure transactions and a shared feed across mobile and web.',
  },
  {
    title: 'E-commerce builds',
    line: 'Multiple storefronts. End-to-end UI/UX validation, cart, checkout, payment success and email notifications.',
  },
]

/* ── money flow ───────────────────────────────────────────────────────── */

export const moneyFlow = {
  title: 'Where the money actually goes',
  line: 'Four hops between a customer paying and a merchant being paid. Each one is a place to lose it.',
  stages: [
    {
      name: 'Payer',
      sub: 'wallet or card',
      verify: 'Amount and asset match the invoice before anything is signed',
    },
    {
      name: 'Rail',
      sub: 'chain or Lightning',
      verify: 'Broadcast confirmed, and confirmations counted for that asset',
    },
    {
      name: 'Ledger',
      sub: 'our record',
      verify: 'One row per payment, written exactly once, reconciled on read',
    },
    {
      name: 'Payout',
      sub: 'merchant out',
      verify: 'Destination verified, approval recorded, retry never double-sends',
    },
  ],
}

/* ── bisect demo ──────────────────────────────────────────────────────── */
// A simulation, not real history. Sixteen commits, one broke payouts.
// The point is the method: binary search finds it in four steps, not sixteen.

export const bisect = {
  title: 'Sixteen commits. One broke payouts.',
  line: 'This is a simulation, but the method is the real one. Click a commit to test it. Binary search finds the culprit in four goes, not sixteen.',
  breakAt: 11,
  commits: [
    'chore: bump test fixtures',
    'feat: add payout status filter',
    'refactor: extract fee calculator',
    'test: cover swap tolerance',
    'fix: timezone on statement export',
    'chore: upgrade http client',
    'feat: batch payout endpoint',
    'style: align payout table',
    'refactor: share retry helper',
    'docs: payout runbook',
    'perf: cache address lookups',
    'refactor: reuse idempotency key across retries',
    'chore: lint config',
    'feat: payout webhook retries',
    'test: add payout smoke test',
    'chore: release prep',
  ],
}

/* ── coverage matrix + latency dial ───────────────────────────────────── */

export const depthIntro = {
  kicker: 'Coverage & conditions',
  title: 'Breadth, then depth.',
  line: 'Which surfaces I have taken through which layers, and what each one does when the network stops behaving.',
}

// Rows are product surfaces, columns are the layers each was taken through.
// Blank means not claimed, which is the honest way to draw a coverage grid.
export const coverageLayers = ['UI', 'API', 'DB', 'Perf', 'Security']

export const coverage = [
  { surface: 'Merchant checkout', done: ['UI', 'API', 'DB', 'Perf'] },
  { surface: 'Payment links', done: ['UI', 'API', 'DB'] },
  { surface: 'Refunds', done: ['UI', 'API', 'DB'] },
  { surface: 'Instant payout', done: ['UI', 'API', 'DB', 'Perf', 'Security'] },
  { surface: 'Swap', done: ['UI', 'API', 'DB'] },
  { surface: 'Transfer', done: ['UI', 'API', 'DB'] },
  { surface: 'Cashback', done: ['UI', 'API', 'DB'] },
  { surface: 'KYB / KYC onboarding', done: ['UI', 'API', 'DB', 'Security'] },
  { surface: 'Smart contract calls', done: ['API', 'Security'] },
  { surface: 'Withdrawals', done: ['UI', 'API', 'Perf'] },
]

// Drag the latency up and the same checkout fails in different ways.
export const latencySteps = [
  {
    ms: 200,
    label: 'Healthy',
    state: 'Checkout completes',
    failure: 'Nothing to catch here. This is the only state most suites ever test.',
    assert: 'Happy path passes. Necessary, and nowhere near sufficient',
    severity: 'ok',
  },
  {
    ms: 1500,
    label: 'Slow',
    state: 'Spinner, user waits',
    failure:
      'The pay button stays live while the request is in flight, so an impatient customer submits twice.',
    assert: 'Button disables on submit; a second click cannot create a second charge',
    severity: 'p1',
  },
  {
    ms: 4000,
    label: 'Degraded',
    state: 'Invoice nearing expiry',
    failure:
      'The quote was locked 4 seconds ago. Pay now and the rate has already moved past tolerance.',
    assert: 'Expiry is visible and enforced; a stale quote is refused, not honoured',
    severity: 'p1',
  },
  {
    ms: 10000,
    label: 'Timeout',
    state: 'Request abandoned',
    failure:
      'The client gives up. The order shows failed, but the payment provider took the money anyway.',
    assert: 'Order stays pending, never failed; the webhook is the source of truth',
    severity: 'p0',
  },
  {
    ms: 30000,
    label: 'Gateway gone',
    state: 'No response at all',
    failure: 'Retries pile up. Each one is a chance to move the same money twice.',
    assert: 'Every retry carries the same idempotency key; exactly one charge exists',
    severity: 'p0',
  },
]

/* ── the route ────────────────────────────────────────────────────────── */
//
// The journey as a road you travel: a marker drives the path while stops
// reveal as it reaches them. Every stop states the QA work and the languages
// used, because that is what a visitor is actually scanning for.

export const roadmapIntro = {
  kicker: 'The route',
  title: 'Seven years, one road.',
  line: 'Scroll to drive it. Each stop is where the work changed and what it was built with.',
}

export const roadmap = [
  {
    year: '2019',
    kind: 'Start',
    title: 'Technical Recruiter',
    org: 'Skillventory · Jan — Apr 2019',
    note: 'Hired engineers before becoming one. Three months of screening them showed me what the job actually was.',
    qa: ['Candidate evaluation', 'Technical screening'],
    tech: ['—'],
  },
  {
    year: '2019',
    kind: 'Role',
    title: 'QA Engineer',
    org: 'Auxano Global Services · Jun 2019 — Apr 2023',
    note: 'Four years, 15+ delivered projects. Where test design stopped being a template and became a skill.',
    qa: ['Manual & exploratory', 'Test case design', 'Regression', 'UAT', 'Defect triage'],
    tech: ['SQL', 'JMeter', 'Postman'],
  },
  {
    year: '2021',
    kind: 'Projects',
    title: 'Games, e-commerce, e-learning',
    org: 'TM2 · NLC · OZ Road Code · Dekabes · Moana Pasifika',
    note: 'Multiplayer stability, bonus-tier maths, course purchase flows, map and speed telemetry.',
    qa: ['Real-time testing', 'Payment flows', 'Cross-device UI/UX', 'Performance'],
    tech: ['JMeter', 'SQL', 'WordPress'],
  },
  {
    year: '2023',
    kind: 'Role',
    title: 'Software Engineer — QA',
    org: 'Openxcell · Speed · Apr 2023 — present',
    note: 'Crypto raised the stakes. Stopped testing screens, started testing state machines. And checking the ledger rather than the toast.',
    qa: [
      'Crypto payments',
      'Smart contracts',
      'KYB / KYC',
      'API contracts',
      'DB reconciliation',
      'Load testing',
    ],
    tech: ['Python', 'Playwright', 'Pytest', 'Appium', 'SQL', 'Newman', 'JMeter'],
  },
  {
    year: '2025',
    kind: 'Built',
    title: 'Aegis-QA',
    org: 'Internal tooling · Creator & maintainer · from Nov 2025',
    note: 'The work was scattered across a dozen tools, so I built one place to hold all of it. Runs, API tests, SQL, Datadog, recorded scripts.',
    qa: ['Run orchestration', 'Session recording', 'Self-healing locators', 'Failure triage'],
    tech: ['Python 3.12', 'asyncio', 'FastAPI', 'Next.js', 'Docker', 'AI tooling'],
  },
  {
    year: 'Now',
    // The hero already says "open to work". Repeating it at the end of the
    // journey closes on a status instead of on an invitation, which is the
    // weaker of the two things this stop can do.
    kind: 'Next',
    title: 'Let’s talk about it',
    org: 'A conversation, not a pitch',
    note: 'If you are building something where quality is load-bearing, like payments or ledgers or anything that must not fail quietly, I would like to hear about it.',
    qa: ['Test architecture', 'Quality strategy'],
    tech: ['Whatever the problem needs'],
    cta: true,
  },
]

/* ── experience ───────────────────────────────────────────────────────── */

export const experience = [
  {
    company: 'Openxcell',
    role: 'Software Engineer — QA',
    period: 'Apr 2023 — Present',
    bullets: [
      'Tested major payment modules including Metadata, Customer, Swap, Payout, Instant Payout and Transfer.',
      'Built and maintain Aegis-QA, internal tooling for runs, API tests, SQL, Datadog and recorded scripts.',
      'Created Appium automation scripts for Android mobile testing.',
      'Built JMeter performance test scripts for withdrawal and transaction flows.',
      'Automated payout and instant send workflows end to end.',
      'Performed Bitcoin and Lightning payment workflow testing.',
      'Validated cashback workflows and transaction accuracy against the database.',
    ],
  },
  {
    company: 'Auxano Global Services',
    role: 'QA Engineer',
    period: 'Jun 2019 — Apr 2023',
    bullets: [
      'Performed manual testing across mobile apps, websites, games and WordPress platforms.',
      'Designed and executed test cases and end-to-end scenarios.',
      'Executed functional, regression and UAT cycles.',
      'Created documentation, reports and defect tracking.',
      'Used JMeter for performance testing.',
      'Delivered testing on 15+ complete projects.',
    ],
  },
  {
    company: 'Skillventory',
    role: 'Technical Recruiter',
    period: 'Jan 2019 — Apr 2019',
    note: 'Before QA · HR',
    bullets: [
      'Handled sourcing, screening and scheduling for technical roles.',
      'Conducted candidate evaluations for skills and cultural fit.',
    ],
  },
]

/* ── toolkit ──────────────────────────────────────────────────────────── */

export const skills = [
  {
    group: 'Automation',
    items: ['Playwright', 'Selenium', 'Appium', 'Pytest', 'Newman / Postman'],
  },
  { group: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'SQL'] },
  {
    group: 'AI tooling',
    items: [
      'Claude',
      'Claude Code (CLI)',
      'ChatGPT',
      'Cursor',
      'GitHub Copilot',
      'Kimi 2.5',
      'Emergent',
      'Datadog AI',
    ],
  },
  { group: 'Performance', items: ['JMeter', 'Load profiling', 'Transaction throughput'] },
  { group: 'Domains', items: ['Crypto payments', 'Fintech', 'KYB / KYC', 'E-commerce', 'Games'] },
  { group: 'Platform', items: ['FastAPI', 'Next.js', 'Docker', 'AWS EC2', 'CI pipelines'] },
]

/* ── chrome ───────────────────────────────────────────────────────────── */

export const marqueeA = [
  'BTC',
  'ETH',
  'USDT',
  'XAUT',
  'Lightning',
  'Smart contracts',
  'Crypto payouts',
  'Playwright',
  'SQL verification',
  'API testing',
]

export const marqueeB = [
  'QA automation engineer',
  'SDET',
  'Fintech QA',
  'Test architecture',
  'Open to work',
]

// `href` starting with / is a page; starting with # is a section of home.
export const nav = [
  { label: 'What I check', href: '/what-i-check' },
  { label: 'How I work', href: '/how-i-work' },
  { label: 'Work', href: '#work' },
  { label: 'The route', href: '/route' },
  { label: 'Proof', href: '/proof' },
  { label: 'Contact', href: '#contact' },
]

/* ── answers, for people and for answer engines ───────────────────────────
 *
 * These are the questions a recruiter asks in a first message, and the
 * questions ChatGPT, Claude, Gemini and Perplexity have to be able to answer
 * before any of them will put my name in a reply. They are rendered as
 * visible page content and mirrored into FAQPage structured data — schema
 * that describes text a visitor cannot see is a Google violation, and a
 * lie besides.
 *
 * Same rule as the rest of this file: nothing goes in that isn't true.
 */
export const faq = [
  {
    q: 'Who is Malay Adalja?',
    a: 'A Software Engineer (QA) based in Ahmedabad, India, with 7 years 4 months in QA since June 2019. He has been at Openxcell since April 2023, testing the Speed crypto payment platform, and before that spent nearly four years at Auxano Global Services. He also built and maintains Aegis-QA, an internal AI-driven test automation platform.',
  },
  {
    q: 'What kind of QA engineer is he?',
    a: 'Both manual and automation, which is deliberate rather than transitional. He designs the test cases, automates the ones worth automating, verifies the result in the database rather than in the UI response, and load-tests the paths where volume is the failure mode. Payments is the domain he knows best.',
  },
  {
    q: 'What can he test that most QA engineers cannot?',
    a: 'Money movement on crypto rails. On-chain BTC, ETH, USDT (ERC-20) and XAUT, plus the Lightning Network. Each has its own confirmation timing and decimal rules. ERC-20 smart contract calls, including ABI encoding, revert paths, emitted events and access control. KYB and KYC onboarding through a third-party identity vendor, both LLC and Corporation structures. And ledger reconciliation, which is the class of bug where the UI reports success and the database disagrees.',
  },
  {
    q: 'Which tools and languages does he use?',
    a: 'Playwright and Pytest for web, Appium for Android, Postman and Newman for API and contract testing, JMeter for load, SQL for database verification, and Datadog for tracing a failed request. Python, JavaScript, TypeScript and SQL. Docker, AWS EC2 and CI pipelines for the plumbing. Claude, Claude Code, Cursor and ChatGPT as daily working tools, not novelties.',
  },
  {
    q: 'What is Aegis-QA?',
    a: 'An internal QA platform he built and maintains. It records a real session on the real application, compiles it to readable Gherkin and a runnable Playwright spec, runs UI, API, flow and security layers across five runner modes, and proposes selector repairs that are verified in a sandbox and never applied without a human approving them. Failed runs are classified and diagnosed automatically. Python 3.12, Playwright, asyncio, FastAPI and Next.js.',
  },
  {
    q: 'Which payment flows has he actually tested?',
    a: 'Merchant checkout, payment links, refunds, crypto payouts and instant payouts, transfers, swaps, cashback, wallet address verification and audit trails, across BTC, Lightning, ETH, USDT and XAUT. Plus WooCommerce and e-commerce plugin integrations, and checkout localization across devices.',
  },
  {
    q: 'Is he available for work, and where?',
    a: 'Open to work, remote or hybrid, from Ahmedabad, Gujarat, India. He is interested in QA engineering and test-automation roles, especially anything with payments in it. Reachable at malayadalja123@gmail.com.',
  },
  {
    q: 'Is he a QA engineer or an AI engineer?',
    a: 'QA, by profession and by choice. AI is the thing he went and learned because the tooling he needed did not exist, and Aegis-QA is the result: a QA platform built with AI rather than bought from a vendor. Claude, Claude Code, Cursor and ChatGPT are daily working tools for him, used for test design, failure triage, scripting and reading unfamiliar code. The QA judgement is his; AI is how one person shipped a platform that would normally take a team.',
  },
  {
    q: 'Why should a QA engineer be trusted with test architecture?',
    a: 'Because the second half of this job is tooling. Seven payment rails with five assertions each, on every release, does not scale by hand. So the useful question is not whether someone can write a test case but whether they can build the thing that runs ten thousand of them and tells you which one matters. This site runs its own accessibility and performance suite against itself, in the visitor’s browser, as a small demonstration of exactly that.',
  },
]

/* ── Aegis-QA, in full ────────────────────────────────────────────────────
 *
 * The product detail for /work/aegis, which opens in its own tab. Same rule
 * as everything else in this file: these are subsystems that exist and run,
 * described at the level you would describe them in an interview. No
 * endpoints, no credentials, no customer data, no invented numbers.
 */
export const aegisRunnerModes = [
  { mode: 'single', line: 'One test, on its own. The loop you use while writing it.' },
  { mode: 'suite', line: 'One layer or a grouped set, for a targeted regression.' },
  { mode: 'flow', line: 'Lifecycle and flow tests, where the output of one step feeds the next.' },
  { mode: 'full', line: 'Every primary layer. The pre-release pass.' },
  { mode: 'all', line: 'Every module, everything. The nightly.' },
]

export const aegisSubsystems = [
  {
    name: 'Session recorder',
    line: 'Records a real session on the real application and keeps the intent, meaning which element, which role and which label, rather than the raw selector that happened to match. The recording is the source of truth; everything downstream is generated from it and can be regenerated.',
  },
  {
    name: 'Compiler',
    line: 'Turns a recording into readable Gherkin and a runnable Playwright spec. Nav clicks, entity IDs and CRUD verbs are recovered from the session, so a generated test reads like one a person wrote.',
  },
  {
    name: 'Execution engine',
    line: 'Runs UI, API, flow and security layers across the five runner modes, headed or headless, locally or on the deployed box, with the run history and its artefacts kept together.',
  },
  {
    name: 'Self-healing locators',
    line: 'When a locator rots, the run proposes a replacement and verifies it in a sandbox before anyone sees it. A sandbox pass is advisory. It never resolves the failure, and never writes itself into the knowledge base on its own. A human approves, or it stays a suggestion.',
  },
  {
    name: 'Failure intelligence',
    line: 'Every failed run is classified, diagnosed, given a fix plan, and where the fix is safe and on an allowlist, executed and verified. Deterministic checks run first and AI runs last, so the cheap and certain answer is never skipped in favour of a guess.',
  },
  {
    name: 'Knowledge graph',
    line: 'A live model of the application built from what has actually been observed running, not from a diagram. It answers which tests cover a change, what a change puts at risk, and which surfaces nothing has ever touched.',
  },
  {
    name: 'API and database verification',
    line: 'Collections and contract checks run beside the UI suite, and saved SQL queries confirm the state a run just produced. This is where the UI-says-success-but-the-ledger-disagrees class of bug gets caught.',
  },
  {
    name: 'Mobile pipeline',
    line: 'The same record-and-compile path for Android over Appium, including the cases where the tappable node and its label are different elements in the view tree.',
  },
  {
    name: 'Trace lookup',
    line: 'Paste a request ID and get the cross-service path it took. Pulled from observability on request, never in the background.',
  },
  {
    name: 'Test case management',
    line: 'Cases tied to the automation that covers them, so a coverage gap is something you can see rather than something you assume.',
  },
]

export const aegisPrinciples = [
  'A generated fix is a proposal until a person approves it. Nothing self-applies.',
  'Deterministic checks run before AI, always. AI is the last resort, not the first.',
  'The recording is immutable. Everything else is derived and can be rebuilt from it.',
  'A sandbox pass proves a fix compiles and runs. It does not prove the bug is gone.',
  'Secrets never enter a recording, a report or a repository.',
]

/**
 * What Aegis replaced.
 *
 * This is the product case, and it is made against the stack this team
 * actually used before — a framework repo, Postman in another window, a SQL
 * client, a spreadsheet and a browser tab of logs. Not against named
 * commercial tools: claiming a win over Testim or mabl would mean asserting
 * things about their behaviour I have not measured, and an unverifiable
 * comparison is worth less than a true one.
 */
export const aegisCompare = [
  {
    need: 'Write a test',
    before: 'Hand-written selectors, rewritten every time the UI moved.',
    after: 'Record the real session. The spec is generated, and regenerable from the recording.',
  },
  {
    need: 'Run it',
    before: 'A framework repo driven from a terminal, results scrolling past in the console.',
    after: 'One place, with the run history and its artefacts kept together.',
  },
  {
    need: 'Check the API',
    before: 'Postman in another window, with its own environment files to keep in sync.',
    after: 'Collections run beside the UI suite, against the same run record.',
  },
  {
    need: 'Confirm the data really changed',
    before: 'A SQL client, queried by hand, when someone remembered to.',
    after:
      'Saved queries against the state the run just produced. This is where the UI-says-success-but-the-ledger-disagrees bug gets caught.',
  },
  {
    need: 'A locator stops matching',
    before: 'Find it, guess a new one, hope it holds until next week.',
    after: 'A proposed replacement, verified in a sandbox, waiting for a human to approve it.',
  },
  {
    need: 'A run fails at 2am',
    before: 'Read the log, then the trace, then the diff, then ask the developer.',
    after:
      'Classified and diagnosed on arrival, with the trace for the failed request pulled in beside it.',
  },
  {
    need: 'Know what is covered',
    before: 'A spreadsheet, out of date the day after it was written.',
    after:
      'Cases tied to the automation that covers them, so a gap is visible rather than assumed.',
  },
  {
    need: 'Test the Android app',
    before: 'A separate project, on a separate framework, that nobody maintained.',
    after: 'The same record-and-compile path, over Appium.',
  },
]

/** The honest limits. A product page without these is a brochure. */
export const aegisLimits = [
  'It is internal tooling for one team, not a commercial product. There is no pricing page and no support line.',
  'It assumes a web or Android application it can drive directly. It is not a unit-test runner.',
  'A sandbox-verified fix proves the change compiles and runs. It does not prove the bug is gone, which is why a human still approves it.',
]

/**
 * The three chapters that moved off the home page, and the way back to them.
 *
 * Kept here rather than in the component so the sitemap generator and the
 * page metadata can read the same titles and lines the page shows.
 */
export const chapterLinks = [
  {
    n: '02',
    href: '/what-i-check',
    title: 'What I check',
    line: 'Seven payment rails with their own state machines, five assertions each, and the coverage grid with the blanks left in.',
  },
  {
    n: '04',
    href: '/how-i-work',
    title: 'How I keep up',
    line: 'Six things done properly, each opening to the tools behind it and one line of evidence.',
  },
  {
    n: '07',
    href: '/proof',
    title: 'Break this page',
    line: 'Six real defects injected into a real page, caught by a real suite. Flip the switch and watch it go red.',
  },
  {
    n: '06',
    href: '/route',
    title: 'The route here',
    line: 'Recruiter to QA engineer to building the tooling. Seven years, one road, and what each stop taught.',
  },
  {
    n: 'Q&A',
    href: '/faq',
    title: 'Straight answers',
    line: 'The questions people ask first, answered in the words I would use in a first message.',
  },
]
