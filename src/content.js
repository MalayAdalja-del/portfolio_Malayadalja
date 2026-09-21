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
    'I find what breaks payment systems before customers do — then automate it so it stays found.',

  intro:
    'Seven years on crypto payments — BTC, ETH, USDT, XAUT, Lightning, ERC-20 contracts, payouts. Manual and automated. API and database. Web and mobile. When the tooling ran out, I built my own.',

  email: 'malayadalja123@gmail.com',
  linkedin: 'https://in.linkedin.com/in/malay-adalja-261578132',
  github: '',
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
    line: 'The part automation cannot do — reading a spec, finding the case nobody wrote down, and reproducing it reliably.',
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
    line: 'Load and throughput on the flows that actually cost money — withdrawals, transactions, checkout under concurrency.',
    tools: ['JMeter', 'Load profiling', 'Throughput analysis'],
    evidence: 'JMeter scripts for withdrawal and high-volume transaction flows.',
  },
  {
    key: 'ai',
    name: 'AI tooling',
    line: 'I work with these daily — test design, failure triage, scripting, and reading a codebase I did not write. Then I used them to build Aegis-QA, the internal tool that holds all of this together.',
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
      'Used them to build Aegis-QA — runs, API tests, SQL, Datadog and recorded scripts in one place.',
  },
]

/* ── the story ────────────────────────────────────────────────────────── */
//
// The site is an argument, not a list. Each chapter earns the next one, and
// the transitions below are the connective tissue that makes a visitor keep
// scrolling. Read top to bottom, they should still make sense on their own.

export const storyPromise =
  'Six chapters, about two minutes. By the end you will know whether to email me.'

export const chapters = [
  { id: 'failures', n: '01', name: 'What breaks' },
  { id: 'rails', n: '02', name: 'What I check' },
  { id: 'skills', n: '03', name: 'How I keep up' },
  { id: 'work', n: '04', name: 'Where I did it' },
  { id: 'experience', n: '05', name: 'The journey' },
  { id: 'proof', n: '06', name: 'Why it matters' },
  { id: 'contact', n: '07', name: 'Talk to me' },
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
    sub: 'That does not scale by hand. So the second half of this job is tooling — and knowing which tool to reach for.',
  },
  toWork: {
    lead: 'That is the method.',
    emph: 'Here is where it ran.',
    sub: 'Three projects, opened in full — the problem, what I actually did, and what changed because of it.',
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
        assert: 'Order stays pending — one confirmation is not settlement',
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
        assert: 'Checkout holds state — no double-submit while the HTLC is pending',
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
      { state: 'Mined', assert: 'Receipt status is 1 — a mined revert is not a payment' },
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
        assert: 'Transfer log parsed from the right contract — not a lookalike token',
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
        assert: 'Fractional units handled — gold trades in fractions of an ounce',
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
    note: 'Money leaving — the scary one',
    steps: [
      {
        state: 'Payout requested',
        assert: 'Destination address checksum-valid for the chosen chain',
      },
      {
        state: 'Address verified',
        assert: 'Unverified address is refused — no exceptions, no override path',
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
    { text: 'Refund issued twice on a retried webhook', area: 'payments', kind: 'Idempotency' },
    { text: 'Invoice expires mid-checkout with no retry path', area: 'crypto', kind: 'Timing' },
    {
      text: 'Payout accepted for an unverified wallet address',
      area: 'security',
      kind: 'Validation',
    },
    { text: 'Cashback tier miscounted across a month boundary', area: 'logic', kind: 'Boundary' },
    {
      text: 'Country dropdown offers more than the allowlist permits',
      area: 'compliance',
      kind: 'Config drift',
    },
    { text: 'Rate drifts past tolerance on the fallback path', area: 'pricing', kind: 'Fallback' },
    {
      text: 'DB row and API response disagree after a transfer',
      area: 'data',
      kind: 'Reconciliation',
    },
    { text: 'Session desyncs after a host reconnect', area: 'realtime', kind: 'State' },
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
    link: 'https://www.tryspeed.com/',
    tag: 'Payments',
    summary:
      'Merchant checkout, payment links, refunds and crypto payouts across BTC, ETH, USDT, XAUT and the Lightning Network — plus ERC-20 smart contract testing, e-commerce plugin integrations and localization.',
    problem:
      'Money movement has no safe failure mode. A refund that fires twice, a payout to an unverified address or a rate that drifts on a fallback path are all real losses, and none of them show up on the happy path.',
    approach: [
      'Built regression coverage across the payment modules — Metadata, Customer, Swap, Payout, Instant Payout, Transfer.',
      'Covered BTC and Lightning, ETH, USDT (ERC-20) and XAUT, each with its own confirmation and decimal rules.',
      'Tested ERC-20 smart contract calls — ABI encoding, revert paths, emitted events and access control.',
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
    period: '2024 — present',
    link: '',
    tag: 'Internal tool',
    summary:
      'An internal platform I built to manage the QA work itself: triggering runs, API testing, Playwright scripts, SQL queries, Datadog lookups and test-case management with automation-script recording — in one place.',
    problem:
      'The work was spread across a dozen tools. Postman here, a Playwright repo there, SQL in a client, Datadog in a browser tab, test cases in a spreadsheet. Every investigation meant stitching them back together by hand.',
    approach: [
      'One place to trigger and watch runs across UI, API, flow and security layers.',
      'A recorder that turns a real session into a reviewable script instead of hand-written selectors.',
      'API tests, SQL queries and Datadog lookups available next to the run that needs them.',
      'Test-case management tied to the automation that covers it.',
      'Self-healing locators — proposed and sandbox-verified, never applied without a human saying yes.',
    ],
    outcome: [
      'Investigating a failed run happens in one tool instead of five.',
      'Recorded sessions become maintained scripts, so coverage grows without hand-writing every selector.',
      'It is internal tooling, not a product — built because the off-the-shelf options did not fit how the team works.',
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
      'Merchant verification through a third-party identity provider — LLC and Corporation flows, document upload, beneficiary checks and liveness.',
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

export const aegisModules = [
  {
    name: 'Run manager',
    line: 'Trigger a run, watch it live, and keep the history — UI, API, flow and security layers, five runner modes.',
  },
  {
    name: 'API testing',
    line: 'Collections and contract checks run next to the UI suite instead of in a separate tool.',
  },
  {
    name: 'Playwright scripts',
    line: 'The generated specs live with the runs that execute them, versioned and editable.',
  },
  {
    name: 'SQL queries',
    line: 'Saved queries to verify the database state a run just produced, without leaving the tool.',
  },
  {
    name: 'Datadog lookups',
    line: 'Pull the trace for a failed request straight from the run that failed it.',
  },
  {
    name: 'Test case management',
    line: 'Cases tied to the automation that covers them, so coverage gaps are visible rather than assumed.',
  },
  {
    name: 'Session recorder',
    line: 'Record a real session on the real app and get a reviewable script back — intent captured, not raw selectors.',
  },
]

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
    line: 'E-learning platform — course upload, purchase flow, secure payment, student dashboards and access control.',
  },
  {
    title: 'NLC (Natural Living Care)',
    line: 'E-commerce with a multi-level bonus system — cart, checkout, bonus tier calculation and user activity tracking.',
  },
  {
    title: 'OZ Road Code',
    line: 'Ride assessment platform on web and mobile — video recording, map tracking and real-time speed logs.',
  },
  {
    title: 'Dekabes Domino',
    line: 'Multiplayer game — real-time stability, AI difficulty and fairness, private tables and invites.',
  },
  {
    title: 'Moana Pasifika',
    line: 'Community app — purchases, gifting, secure transactions and a shared feed across mobile and web.',
  },
  {
    title: 'E-commerce builds',
    line: 'Multiple storefronts — end-to-end UI/UX validation, cart, checkout, payment success and email notifications.',
  },
]

/* ── the journey, as a changelog ──────────────────────────────────────── */
//
// A career is a versioned thing: you ship, you break compatibility with who
// you were, you deprecate habits. Keep-a-Changelog is the one format every
// engineer reads fluently and no portfolio uses. MAJOR bumps are the moments
// the job itself changed, not the job title.

export const journeyIntro = {
  kicker: 'The journey',
  title: 'Seven years. Four releases. One unreleased.',
  line: 'Told the way engineers actually read history. Major versions are where the work fundamentally changed — not where the title did.',
}

export const releases = [
  {
    version: '1.0.0',
    codename: 'The switch',
    date: '2019-01 → 2019-04',
    org: 'Skillventory · Technical Recruiter',
    breaking: 'Left recruitment for the work I was recruiting for.',
    note: 'I started by hiring engineers. Three months of screening them taught me what the job actually was — and that I wanted to do it rather than staff it.',
    changes: [
      { t: 'add', text: 'An understanding of what teams actually hire for' },
      { t: 'add', text: 'The vocabulary to read a technical role from the outside' },
      { t: 'rm', text: 'A career in recruitment' },
    ],
  },
  {
    version: '2.0.0',
    codename: 'Learning the craft',
    date: '2019-06 → 2023-04',
    org: 'Auxano Global Services · QA Engineer',
    breaking: '',
    note: 'Four years and 15+ delivered projects — mobile apps, websites, multiplayer games, WordPress. Where test design stopped being a template and became a skill.',
    changes: [
      { t: 'add', text: 'Test design, exploratory testing, regression strategy, UAT' },
      { t: 'add', text: 'First JMeter performance scripts' },
      { t: 'add', text: 'A reusable test-case library across projects' },
      { t: 'chg', text: 'From executing someone else’s cases to writing my own' },
      { t: 'fix', text: 'Reporting a bug without a reliable reproduction' },
    ],
  },
  {
    version: '3.0.0',
    codename: 'Into payments',
    date: '2023-04 → present',
    org: 'Openxcell · Speed · Software Engineer — QA',
    breaking: 'A bug stopped being a bad experience and started being somebody’s money.',
    note: 'Crypto raised the stakes. I stopped testing screens and started testing state machines — and checking the ledger, not the toast.',
    changes: [
      { t: 'add', text: 'BTC, Lightning, ETH, USDT and XAUT settlement rules' },
      { t: 'add', text: 'ERC-20 smart contract testing — ABI, reverts, events, access control' },
      { t: 'add', text: 'Playwright, Appium, Newman and JMeter suites in CI' },
      { t: 'add', text: 'SQL reconciliation on every money-moving flow' },
      { t: 'chg', text: 'From testing the screen to testing the state machine behind it' },
      { t: 'fix', text: 'Idempotency, reorg handling and decimal precision blind spots' },
      { t: 'rm', text: 'Trusting a green toast as proof of settlement' },
    ],
  },
  {
    version: '4.0.0',
    codename: 'Becoming a builder',
    date: '2024 → present',
    org: 'Aegis-QA · Creator & maintainer',
    breaking: 'Stopped only using the tools and started shipping one.',
    note: 'The work was scattered across a dozen tools. So I used the AI tooling I had been learning — Claude, Claude Code, Cursor, Copilot — and built one place to hold all of it.',
    changes: [
      { t: 'add', text: 'Python, asyncio, FastAPI and Next.js' },
      { t: 'add', text: 'Run manager across UI, API, flow and security layers' },
      { t: 'add', text: 'Session recorder → reviewable Playwright scripts' },
      { t: 'add', text: 'SQL queries and Datadog lookups beside the failing run' },
      { t: 'add', text: 'Self-healing locators — sandbox-verified, human-approved' },
      { t: 'chg', text: 'From consuming QA tooling to designing it' },
      { t: 'rm', text: 'Stitching five tools together by hand for every investigation' },
    ],
  },
]

export const unreleased = {
  version: 'Unreleased',
  codename: 'What I am looking for',
  note: 'Seven years in, the pattern has not changed: find the thing that breaks, then make it impossible to ship again. I want a team where that is treated as engineering, not paperwork.',
  planned: [
    'A team that treats quality as a design constraint, not a gate at the end',
    'Payments, fintech, or anything where being wrong is expensive',
    'Room to keep building the tooling, not just running it',
  ],
}

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

export const nav = [
  { label: 'What I do', href: '#skills' },
  { label: 'Work', href: '#work' },
  { label: 'Rails', href: '#rails' },
  { label: 'Experience', href: '#experience' },
  { label: 'Proof', href: '#proof' },
  { label: 'Contact', href: '#contact' },
]
