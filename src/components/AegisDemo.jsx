import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStatic } from '../lib/motion'

/**
 * A working demonstration of Aegis-QA, running in the visitor's browser.
 *
 * Nothing here talks to anything. The run is simulated on a timer, the
 * failure is scripted, and every value is invented: run #1482, ord_4821,
 * acme@example.test, a Continue button that moved into a dialog in "build
 * 218". The real tool drives live payment systems, and no capture of that
 * belongs on a public page at any resolution — so this is a reconstruction
 * of the screens rather than a recording of them, and the page says so.
 *
 * It is interactive because a list of features does not answer "what is it
 * actually like". Pressing Run and watching a suite go amber, then green,
 * then red on the payout test does.
 */

const MODES = [
  ['single', 'One test'],
  ['suite', 'One layer'],
  ['flow', 'Lifecycle'],
  ['full', 'All layers'],
  ['all', 'Everything'],
]

const TESTS = [
  ['checkout.guest_card', 'pass', '4.1s'],
  ['checkout.saved_card', 'pass', '2.2s'],
  ['refund.partial_amount', 'pass', '2.8s'],
  ['payout.idempotency_key', 'fail', '9.4s'],
  ['ledger.reconcile_on_read', 'pass', '1.2s'],
  ['webhook.replay_is_ignored', 'pass', '0.9s'],
]

const RECORDING = [
  ['click', 'button "Add to basket"', 'page.get_by_role("button", name="Add to basket").click()'],
  ['fill', 'field "Email" · acme@example.test', 'page.get_by_label("Email").fill(email)'],
  ['click', 'button "Pay now"', 'page.get_by_role("button", name="Pay now").click()'],
  [
    'expect',
    'text "Order ord_4821 confirmed"',
    'expect(page.get_by_text(f"Order {order_id} confirmed")).to_be_visible()',
  ],
]

const TRIAGE = [
  ['Classified', 'Locator no longer matches. This is not a product defect.'],
  ['Diagnosed', 'The Continue button moved inside a dialog in build 218.'],
  ['Fix proposed', 'get_by_role("button", name="Continue") scoped to the dialog.'],
  ['Sandbox verified', 'Runs green in isolation. That is not proof the bug is gone.'],
  ['Waiting for a human', 'Nothing is applied until someone approves it.'],
]

function Shell({ children }) {
  return (
    <div className="min-w-0 overflow-hidden border border-ink/15 bg-paper">
      <div className="flex items-center gap-2.5 border-b border-ink/10 bg-bone px-4 py-2.5">
        <span aria-hidden className="h-2 w-2 rounded-full bg-ink/20" />
        <span aria-hidden className="h-2 w-2 rounded-full bg-ink/20" />
        <span aria-hidden className="h-2 w-2 rounded-full bg-ink/20" />
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink/60">
          aegis · demo
        </span>
      </div>
      <div className="min-w-0 p-4 sm:p-6">{children}</div>
    </div>
  )
}

/* ── 1. run a suite ──────────────────────────────────────────────────── */

function RunPane({ still }) {
  const [mode, setMode] = useState('suite')
  const [step, setStep] = useState(still ? TESTS.length : -1)
  const [running, setRunning] = useState(false)
  const timers = useRef([])

  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clear, [])

  const run = useCallback(() => {
    clear()
    setStep(-1)
    setRunning(true)
    timers.current = TESTS.map((_, i) =>
      setTimeout(
        () => {
          setStep(i)
          if (i === TESTS.length - 1) setRunning(false)
        },
        (i + 1) * 520,
      ),
    )
  }, [])

  const shown = TESTS.slice(0, step + 1)
  const passed = shown.filter((t) => t[1] === 'pass').length
  const failed = shown.filter((t) => t[1] === 'fail').length

  return (
    <Shell>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.09em] text-ink/60">
          mode
        </span>
        {MODES.map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            title={label}
            className={`border px-2.5 py-1 font-mono text-[10px] transition-colors ${
              mode === m
                ? 'border-navy-500 bg-navy-500 text-paper'
                : 'border-ink/20 text-ink/60 hover:border-ink'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-paper transition-opacity hover:opacity-85 disabled:opacity-40"
        >
          {running ? 'running…' : '▸ run'}
        </button>
        <p aria-live="polite" className="font-mono text-[11px]">
          <span className="text-navy-500">{passed} passed</span>
          <span className="text-ink/60">
            {' '}
            · {failed} failed · mode {mode}
          </span>
        </p>
      </div>

      <ul className="mt-5 min-h-[232px] border-t border-ink/10">
        {shown.map(([name, state, ms]) => (
          <li key={name} className="flex items-center gap-3 border-b border-ink/10 py-2">
            <span
              aria-hidden
              className={`w-3 shrink-0 font-mono text-[11px] font-bold ${
                state === 'fail' ? 'text-ink' : 'text-navy-500'
              }`}
            >
              {state === 'fail' ? '✗' : '✓'}
            </span>
            <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-ink/85">
              {name}
            </span>
            <span className="shrink-0 font-mono text-[10px] text-ink/60">{ms}</span>
          </li>
        ))}
        {step < 0 && !running && (
          <li className="py-3 font-mono text-[11px] text-ink/60">Press run.</li>
        )}
      </ul>
    </Shell>
  )
}

/* ── 2. record a session ─────────────────────────────────────────────── */

function RecordPane({ still }) {
  const [n, setN] = useState(still ? RECORDING.length : 0)

  return (
    <Shell>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="button"
          onClick={() => setN((v) => (v >= RECORDING.length ? 0 : v + 1))}
          className="bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-paper transition-opacity hover:opacity-85"
        >
          {n >= RECORDING.length ? '↺ start over' : '● record next action'}
        </button>
        <p className="font-mono text-[11px] text-ink/60">
          {n} of {RECORDING.length} captured
        </p>
      </div>

      <div className="mt-6 grid min-h-[232px] gap-6 md:grid-cols-2">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-ink/60">
            What the recorder saw
          </p>
          <ul className="mt-2.5">
            {RECORDING.slice(0, n).map(([verb, what]) => (
              <li key={what} className="border-b border-ink/10 py-2 font-mono text-[11px]">
                <span className="text-navy-500">{verb}</span>
                <span className="text-ink/85"> · {what}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-ink/60">
            What it compiled to
          </p>
          <pre className="mt-2.5 max-w-full overflow-x-auto bg-bone p-3 font-mono text-[10.5px] leading-relaxed text-ink/85">
            {RECORDING.slice(0, n)
              .map((r) => r[2])
              .join('\n') || '# nothing recorded yet'}
          </pre>
        </div>
      </div>
    </Shell>
  )
}

/* ── 3. triage a failure ─────────────────────────────────────────────── */

function TriagePane({ still }) {
  const [n, setN] = useState(still ? TRIAGE.length : 0)
  const done = n >= TRIAGE.length

  return (
    <Shell>
      <p className="font-mono text-[11px] text-ink">✗ payout.idempotency_key</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="button"
          onClick={() => setN((v) => (v >= TRIAGE.length ? 0 : v + 1))}
          className="bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-paper transition-opacity hover:opacity-85"
        >
          {done ? '↺ reset' : n === 0 ? '🔍 investigate' : 'next step'}
        </button>
        {done && (
          <p className="font-mono text-[11px] uppercase tracking-[0.09em] text-navy-500">
            stops here until a human approves
          </p>
        )}
      </div>

      <ol className="mt-6 min-h-[232px]">
        {TRIAGE.slice(0, n).map(([label, line], i) => (
          <li key={label} className="flex gap-3.5 pb-4">
            <span
              aria-hidden
              className={`mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-bold ${
                i === TRIAGE.length - 1
                  ? 'border border-ink/30 text-ink/70'
                  : 'bg-navy-500 text-paper'
              }`}
            >
              {i === TRIAGE.length - 1 ? '!' : '✓'}
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-[0.09em] text-navy-500">
                {label}
              </span>
              <span className="mt-1 block break-words text-[13px] leading-snug text-ink/80">
                {line}
              </span>
            </span>
          </li>
        ))}
        {n === 0 && (
          <li className="font-mono text-[11px] text-ink/60">A test failed. Press investigate.</li>
        )}
      </ol>
    </Shell>
  )
}

/* ── the tour ────────────────────────────────────────────────────────── */

const TABS = [
  ['run', 'Run a suite', RunPane],
  ['record', 'Record a test', RecordPane],
  ['triage', 'Triage a failure', TriagePane],
]

export default function AegisDemo() {
  const still = useStatic()
  const [tab, setTab] = useState('run')

  // Statically every pane renders in its finished state and stacked, so the
  // prerendered HTML carries all three rather than one empty one.
  if (still) {
    return (
      <div>
        <Intro />
        <div className="mt-8 grid gap-8">
          {TABS.map(([id, label, Pane]) => (
            <section key={id}>
              <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-navy-500">
                {label}
              </h3>
              <Pane still />
            </section>
          ))}
        </div>
      </div>
    )
  }

  const Pane = TABS.find(([id]) => id === tab)[2]

  return (
    <div>
      <Intro />

      <div role="tablist" aria-label="Aegis demo" className="mt-8 flex flex-wrap gap-2">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`border px-4 py-2.5 text-[13px] font-semibold transition-colors ${
              tab === id
                ? 'border-ink bg-ink text-paper'
                : 'border-ink/20 text-ink/70 hover:border-ink hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <Pane />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Intro() {
  return (
    <p className="max-w-2xl text-[15px] leading-relaxed text-ink/75 md:text-[17px]">
      A working demonstration, running in your browser. It talks to nothing: the run is on a timer,
      the failure is scripted, and every value is invented. The real tool drives live payment
      systems, and no capture of that belongs on a public page.
    </p>
  )
}
