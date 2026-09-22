import { useState } from 'react'
import { profile } from '../content'
import { goHome } from '../lib/router'
import { useStatic } from '../lib/motion'
import AegisDemo from '../components/AegisDemo'

/**
 * A walkthrough of the Aegis-QA portal, reconstructed.
 *
 * The real portal cannot be shown. It runs against live payment systems and
 * every screen in it carries merchant names, transaction ids and keys, so
 * there is no screenshot of it that is safe to publish — not blurred, not
 * cropped. Describing it in prose was the previous answer and it did not
 * work: nobody forms a picture of a tool from a bulleted list.
 *
 * So this is the interface rebuilt in HTML with invented data. It is the
 * same layout, the same states and the same language as the real thing,
 * and none of the numbers mean anything. Run 1482, ACME Store,
 * ord_4821 — all made up. The banner says so and never scrolls away.
 *
 * Built from DOM rather than screenshots on purpose: it reflows to 320px,
 * stays sharp at any pixel density, weighs nothing next to a PNG, and the
 * text in it is real text a crawler and a screen reader can both read.
 */

const NAV = [
  ['overview', 'Overview', '▦'],
  ['runs', 'Runs', '▸'],
  ['recorder', 'Recorder', '●'],
  ['cases', 'Test cases', '☰'],
  ['coverage', 'Coverage', '▤'],
  ['knowledge', 'Knowledge', '◈'],
]

const RUNS = [
  ['1482', 'suite', 'Checkout · regression', '42/45', 'failed', '6m 12s', '2 min ago'],
  ['1481', 'flow', 'Payout lifecycle', '18/18', 'passed', '4m 02s', '1 hr ago'],
  ['1480', 'full', 'Pre-release · all layers', '211/214', 'failed', '37m 55s', '5 hrs ago'],
  ['1479', 'single', 'refund.partial_amount', '1/1', 'passed', '2.8s', '6 hrs ago'],
  ['1478', 'all', 'Nightly', '486/486', 'passed', '1h 12m', 'yesterday'],
]

const STATS = [
  ['Runs this week', '38'],
  ['Pass rate', '96.4%'],
  ['Locators healed', '11'],
  ['Awaiting approval', '3'],
]

const TREND = [88, 91, 94, 90, 96, 97, 96]
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const CASES = [
  ['TC-2041', 'Guest checkout with a card', 'Automated', 'checkout.guest_card'],
  ['TC-2042', 'Refund a partial amount', 'Automated', 'refund.partial_amount'],
  ['TC-2043', 'Payout retries reuse no key', 'Automated', 'payout.idempotency_key'],
  ['TC-2044', 'Webhook replay is ignored', 'Automated', 'webhook.replay_is_ignored'],
  ['TC-2045', 'Expired invoice reissues', 'Manual', '—'],
]

const SURFACES = [
  ['Merchant checkout', [1, 1, 1, 1, 0]],
  ['Payment links', [1, 1, 1, 0, 0]],
  ['Refunds', [1, 1, 1, 0, 0]],
  ['Instant payout', [1, 1, 1, 1, 1]],
  ['Swap', [1, 1, 1, 0, 0]],
  ['Withdrawals', [0, 1, 0, 1, 0]],
]
const LAYERS = ['UI', 'API', 'DB', 'PERF', 'SEC']

const Pill = ({ state }) => (
  <span
    className={`inline-block px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.08em] ${
      state === 'passed' ? 'bg-navy-500 text-paper' : 'bg-ink text-paper'
    }`}
  >
    {state}
  </span>
)

function Overview() {
  return (
    <div>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map(([label, value]) => (
          <div key={label} className="border border-ink/12 p-4">
            <dt className="font-mono text-[9.5px] uppercase tracking-[0.09em] text-ink/60">
              {label}
            </dt>
            <dd className="mt-2 text-2xl font-black tabular-nums tracking-tightest">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="border border-ink/12 p-4 sm:p-5">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/60">
            Pass rate · last 7 days
          </h3>
          <div className="mt-5 flex h-36 items-end gap-2">
            {TREND.map((v, i) => (
              <div key={DAYS[i] + i} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <span className="w-full bg-navy-500" style={{ height: `${(v - 80) * 6}px` }} />
                <span className="font-mono text-[9px] text-ink/60">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-ink/12 p-4 sm:p-5">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/60">
            Waiting for approval
          </h3>
          <ul className="mt-4">
            {[
              ['payout.idempotency_key', 'locator moved into a dialog'],
              ['checkout.saved_card', 'label renamed in build 218'],
              ['swap.rate_drift', 'tolerance widened by 0.2%'],
            ].map(([name, why]) => (
              <li key={name} className="border-t border-ink/10 py-3">
                <p className="truncate font-mono text-[11px] text-ink/85">{name}</p>
                <p className="mt-1 text-[12.5px] text-ink/60">{why}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.09em] text-navy-500">
            nothing applies itself
          </p>
        </section>
      </div>
    </div>
  )
}

function Runs() {
  const [open, setOpen] = useState('1482')
  const run = RUNS.find((r) => r[0] === open) || RUNS[0]
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[430px] border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/15">
              {['Run', 'Mode', 'Suite', 'Result', 'Took'].map((h) => (
                <th
                  key={h}
                  className="py-2 pr-3 font-mono text-[9.5px] uppercase tracking-[0.09em] text-ink/60"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RUNS.map(([id, mode, suite, ratio, state, took]) => (
              <tr
                key={id}
                onClick={() => setOpen(id)}
                className={`cursor-pointer border-b border-ink/10 transition-colors ${
                  open === id ? 'bg-bone' : 'hover:bg-bone/60'
                }`}
              >
                <td className="py-2.5 pr-3 font-mono text-[11px]">#{id}</td>
                <td className="py-2.5 pr-3 font-mono text-[11px] text-navy-500">{mode}</td>
                <td className="max-w-[9rem] truncate py-2.5 pr-3 text-[12.5px]">{suite}</td>
                <td className="whitespace-nowrap py-2.5 pr-3">
                  <span className="font-mono text-[11px] tabular-nums">{ratio}</span>{' '}
                  <Pill state={state} />
                </td>
                <td className="py-2.5 font-mono text-[10.5px] text-ink/60">{took}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <aside className="min-w-0 border border-ink/12 p-4 sm:p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/60">
          Run #{run[0]} · {run[1]}
        </p>
        <p className="mt-2 text-[17px] font-bold tracking-tight">{run[2]}</p>
        <p className="mt-1 font-mono text-[11px] text-ink/60">
          {run[3]} · {run[5]} · {run[6]}
        </p>
        <ul className="mt-5">
          {[
            ['✓', 'checkout.guest_card', '4.1s'],
            ['✓', 'refund.partial_amount', '2.8s'],
            ['✗', 'payout.idempotency_key', '9.4s'],
            ['✓', 'ledger.reconcile_on_read', '1.2s'],
          ].map(([mark, name, ms]) => (
            <li key={name} className="flex items-center gap-3 border-t border-ink/10 py-2">
              <span
                aria-hidden
                className={`font-mono text-[11px] font-bold ${
                  mark === '✗' ? 'text-ink' : 'text-navy-500'
                }`}
              >
                {mark}
              </span>
              <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-ink/85">
                {name}
              </span>
              <span className="font-mono text-[10px] text-ink/60">{ms}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-l-2 border-navy-500 pl-4 text-[12.5px] leading-relaxed text-ink/75">
          A retried payout reused one idempotency key, so the second attempt was accepted instead of
          rejected. Caught in DB, not in the UI response.
        </p>
      </aside>
    </div>
  )
}

function Cases() {
  return (
    <div className="min-w-0 overflow-x-auto">
      <table className="w-full min-w-[430px] border-collapse text-left">
        <thead>
          <tr className="border-b border-ink/15">
            {['ID', 'Title', 'State', 'Covered by'].map((h) => (
              <th
                key={h}
                className="py-2 pr-3 font-mono text-[9.5px] uppercase tracking-[0.09em] text-ink/60"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CASES.map(([id, title, state, spec]) => (
            <tr key={id} className="border-b border-ink/10">
              <td className="py-2.5 pr-3 font-mono text-[11px] text-navy-500">{id}</td>
              <td className="py-2.5 pr-3 text-[12.5px]">{title}</td>
              <td className="py-2.5 pr-3">
                <span
                  className={`font-mono text-[9.5px] uppercase tracking-[0.08em] ${
                    state === 'Automated' ? 'text-navy-500' : 'text-ink/60'
                  }`}
                >
                  {state}
                </span>
              </td>
              <td className="max-w-[11rem] truncate py-2.5 font-mono text-[10.5px] text-ink/70">
                {spec}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Coverage() {
  return (
    <div>
      <div className="grid grid-cols-[minmax(0,2.4fr)_repeat(5,minmax(1.4rem,1fr))] gap-x-1.5 gap-y-2">
        <span />
        {LAYERS.map((l) => (
          <span
            key={l}
            className="pb-1 text-center font-mono text-[9px] uppercase tracking-[0.07em] text-ink/60"
          >
            {l}
          </span>
        ))}
        {SURFACES.map(([name, cells]) => (
          <div key={name} className="contents">
            <span className="flex min-w-0 items-center break-words py-1 pr-2 text-[12px] leading-tight text-ink/85">
              {name}
            </span>
            {cells.map((on, i) => (
              <div
                key={LAYERS[i]}
                title={`${name} · ${LAYERS[i]}${on ? '' : ' — not claimed'}`}
                className={`h-8 border border-ink/10 ${on ? 'bg-navy-500' : ''}`}
              >
                <span className="sr-only">
                  {name} {LAYERS[i]} {on ? 'covered' : 'not claimed'}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.09em] text-ink/60">
        Blank means not claimed
      </p>
    </div>
  )
}

function Knowledge() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="border border-ink/12 p-4 sm:p-5">
        <h3 className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/60">
          What this change touches
        </h3>
        <p className="mt-3 font-mono text-[11px] text-ink/85">checkout/PaymentButton.tsx</p>
        <ul className="mt-4">
          {[
            ['4 tests cover this', 'navy'],
            ['2 flows pass through it', 'navy'],
            ['1 surface has no DB assertion', 'ink'],
          ].map(([line, tone]) => (
            <li key={line} className="flex gap-3 border-t border-ink/10 py-2.5">
              <span
                aria-hidden
                className={`font-mono text-[11px] font-bold ${
                  tone === 'navy' ? 'text-navy-500' : 'text-ink'
                }`}
              >
                {tone === 'navy' ? '✓' : '!'}
              </span>
              <span className="text-[12.5px] text-ink/80">{line}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="border border-ink/12 p-4 sm:p-5">
        <h3 className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/60">
          Known failures
        </h3>
        <ul className="mt-3">
          {[
            ['Dialog moved the Continue button', 'seen 4× · fixed 4×'],
            ['Dynamic id in the payout table', 'seen 7× · fixed 7×'],
            ['Rate drifts on the fallback path', 'seen 2× · open'],
          ].map(([what, meta]) => (
            <li key={what} className="border-t border-ink/10 py-2.5">
              <p className="text-[12.5px] text-ink/85">{what}</p>
              <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.08em] text-ink/60">
                {meta}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.09em] text-navy-500">
          only verified fixes are kept
        </p>
      </section>
    </div>
  )
}

const VIEWS = {
  overview: Overview,
  runs: Runs,
  recorder: () => <AegisDemo />,
  cases: Cases,
  coverage: Coverage,
  knowledge: Knowledge,
}

export default function AegisDemoPage() {
  const still = useStatic()
  const [view, setView] = useState('overview')
  const View = VIEWS[view]

  return (
    <main className="bg-paper">
      {/* Never scrolls away. Somebody will screenshot this page and the
          screenshot has to carry the disclaimer with it. */}
      <div className="sticky top-0 z-[70] border-b border-ink/10 bg-bone/95 backdrop-blur">
        <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/75">
            Demo · every value on this page is invented
          </p>
          <a
            href="/work/aegis"
            onClick={(e) => {
              e.preventDefault()
              goHome('')
              window.history.pushState(null, '', '/work/aegis')
              window.dispatchEvent(new Event('routechange'))
            }}
            className="font-mono text-[10px] uppercase tracking-[0.1em] text-navy-500 underline-offset-4 hover:underline"
          >
            ← back to the write-up
          </a>
        </div>
      </div>

      <div className="shell pb-8 pt-10 md:pt-14">
        <h1 className="display max-w-3xl">The Aegis-QA portal</h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/75 md:text-[17px]">
          The real one drives live payment systems, so every screen in it carries merchant names,
          transaction ids and keys. None of that can be published, blurred or otherwise. This is the
          same interface rebuilt with invented data: same layout, same states, same language, and
          not one number that means anything.
        </p>
      </div>

      {/* the app shell */}
      <div className="shell pb-24">
        <div className="overflow-hidden border border-ink/15">
          <div className="flex items-center justify-between gap-4 border-b border-ink/12 bg-ink px-4 py-3 text-paper">
            <p className="font-mono text-[11px] font-bold tracking-tight">aegis</p>
            <p className="min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.09em] text-paper/60">
              ACME Store · staging
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-paper/60">
              {profile.name.split(' ')[0].toLowerCase()}
            </p>
          </div>

          <div className="grid md:grid-cols-[minmax(0,168px)_minmax(0,1fr)]">
            <nav
              aria-label="Portal sections"
              className="flex gap-1 overflow-x-auto border-b border-ink/12 bg-bone p-2 md:flex-col md:overflow-visible md:border-b-0 md:border-r"
            >
              {NAV.map(([id, label, glyph]) => {
                const on = still || view === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setView(id)}
                    aria-current={view === id ? 'page' : undefined}
                    className={`flex shrink-0 items-center gap-2.5 px-3 py-2 text-left font-mono text-[11px] transition-colors md:shrink ${
                      view === id
                        ? 'bg-ink text-paper'
                        : 'text-ink/70 hover:bg-ink/[0.06] hover:text-ink'
                    }`}
                  >
                    <span aria-hidden className="opacity-70">
                      {glyph}
                    </span>
                    {label}
                  </button>
                )
              })}
            </nav>

            <div className="min-w-0 p-4 sm:p-6">
              {still ? (
                <div className="grid gap-12">
                  {Object.entries(VIEWS).map(([id, V]) => (
                    <section key={id}>
                      <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-navy-500">
                        {NAV.find((n) => n[0] === id)?.[1] || id}
                      </h2>
                      <V />
                    </section>
                  ))}
                </div>
              ) : (
                <View />
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-[13px] leading-relaxed text-ink/60">
          Built from HTML rather than screenshots, so it reflows on a phone, stays sharp on any
          display and costs nothing to load. Nothing here connects to anything.
        </p>
      </div>
    </main>
  )
}
