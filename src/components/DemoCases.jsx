import { useState } from 'react'

/**
 * The test-case view of the portal walkthrough.
 *
 * A case in the real tool is not a row in a spreadsheet. It carries the
 * Gherkin it was written as, the Playwright spec it compiled to, the flow
 * it belongs to, and the trace for the request it exercised. That is the
 * whole argument for keeping cases and automation in one place, so the
 * walkthrough has to show all four rather than list a title and a status.
 *
 * Every value here is invented. TC-2043, ord_4821, acme@example.test and a
 * payout that 500s in 9.4 seconds are all made up, and none of this is
 * copied from a running system.
 */

const CASES = [
  {
    id: 'TC-2041',
    title: 'Guest checkout with a card',
    state: 'Automated',
    spec: 'checkout.guest_card',
    gherkin: [
      'Feature: Guest checkout',
      '',
      '  Scenario: A guest pays with a card',
      '    Given a basket holding one item',
      '    When the guest submits a valid card',
      '    Then the order is confirmed exactly once',
      '    And the ledger records a single capture',
    ].join('\n'),
    code: [
      'def test_guest_card(page, order_id):',
      '    page.get_by_role("button", name="Add to basket").click()',
      '    page.get_by_label("Email").fill("acme@example.test")',
      '    page.get_by_role("button", name="Pay now").click()',
      '    expect(page.get_by_text(f"Order {order_id} confirmed")).to_be_visible()',
      '    assert db.captures_for(order_id) == 1',
    ].join('\n'),
    flow: ['Basket', 'Checkout', 'Authorise', 'Capture', 'Ledger write', 'Receipt'],
    trace: ['POST /checkout/session', '201', '84ms'],
  },
  {
    id: 'TC-2043',
    title: 'Payout retries reuse no key',
    state: 'Automated',
    spec: 'payout.idempotency_key',
    gherkin: [
      'Feature: Payout idempotency',
      '',
      '  Scenario: A retried payout is not paid twice',
      '    Given a payout that timed out once',
      '    When the client retries it',
      '    Then the retry carries a fresh idempotency key',
      '    And exactly one payout exists on the ledger',
    ].join('\n'),
    code: [
      'def test_payout_idempotency(api, payout_id):',
      '    api.payout(payout_id, key=new_key())',
      '    retry = api.payout(payout_id, key=new_key())',
      '    assert retry.status == 409',
      '    assert db.payouts_for(payout_id) == 1',
    ].join('\n'),
    flow: ['Requested', 'Address verified', 'Approved', 'Broadcast', 'Confirmed', 'Reconciled'],
    trace: ['POST /payouts', '500', '9.4s'],
  },
  {
    id: 'TC-2045',
    title: 'Expired invoice reissues',
    state: 'Manual',
    spec: 'not automated',
    gherkin: [
      'Feature: Invoice expiry',
      '',
      '  Scenario: An invoice that expires mid-checkout',
      '    Given an invoice past its expiry',
      '    When the payer returns to the page',
      '    Then a fresh invoice is issued',
      '    And the old one can never be paid',
    ].join('\n'),
    code: '# Still a manual case. The Gherkin exists; the spec does not yet.',
    flow: ['Invoice issued', 'Expired', 'Payer returns', 'Reissued'],
    trace: ['GET /invoice/ord_4821', '410', '31ms'],
  },
]

const TABS = [
  ['gherkin', 'Gherkin'],
  ['code', 'Playwright'],
  ['flow', 'Full flow'],
  ['trace', 'Datadog'],
]

const SERVICES = [
  ['api-gateway', 18],
  ['payments-svc', 64],
  ['ledger-svc', 12],
  ['chain-watcher', 6],
]

export default function DemoCases({ still }) {
  const [pick, setPick] = useState(CASES[1].id)
  const [tab, setTab] = useState('gherkin')
  const c = CASES.find((x) => x.id === pick) || CASES[0]

  // Statically, show every tab of every case stacked, so the prerendered
  // page carries all of it instead of one open tab.
  if (still) {
    return (
      <div className="grid gap-10">
        {CASES.map((x) => (
          <article key={x.id}>
            <h3 className="font-mono text-[10.5px] uppercase tracking-[0.09em] text-navy-500">
              {x.id} · {x.state} · covered by {x.spec}
            </h3>
            <p className="mt-1 text-[14px] font-bold">{x.title}</p>
            <Pane c={x} tab="gherkin" />
            <Pane c={x} tab="code" />
            <Pane c={x} tab="flow" />
            <Pane c={x} tab="trace" />
          </article>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,250px)_minmax(0,1fr)]">
      <ul className="min-w-0">
        {CASES.map((x) => (
          <li key={x.id}>
            <button
              type="button"
              onClick={() => setPick(x.id)}
              className={`w-full border-b border-ink/10 px-3 py-3 text-left transition-colors ${
                pick === x.id ? 'bg-bone' : 'hover:bg-bone/60'
              }`}
            >
              <span className="flex items-baseline gap-2.5">
                <span className="font-mono text-[10.5px] text-navy-500">{x.id}</span>
                <span
                  className={`font-mono text-[9px] uppercase tracking-[0.08em] ${
                    x.state === 'Automated' ? 'text-navy-500' : 'text-ink/60'
                  }`}
                >
                  {x.state}
                </span>
              </span>
              <span className="mt-1 block text-[12.5px] leading-snug text-ink/85">{x.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="min-w-0 border border-ink/12">
        <div className="flex flex-wrap gap-1 border-b border-ink/12 bg-bone p-2">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-pressed={tab === id}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors ${
                tab === id ? 'bg-ink text-paper' : 'text-ink/70 hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="min-w-0 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-ink/60">
            {c.id} · covered by {c.spec}
          </p>
          <Pane c={c} tab={tab} />
        </div>
      </div>
    </div>
  )
}

function Pane({ c, tab }) {
  if (tab === 'gherkin' || tab === 'code') {
    return (
      <pre className="mt-3 max-w-full overflow-x-auto bg-bone p-3 font-mono text-[10.5px] leading-relaxed text-ink/85">
        {tab === 'gherkin' ? c.gherkin : c.code}
      </pre>
    )
  }

  if (tab === 'flow') {
    return (
      <ol className="mt-3">
        {c.flow.map((name, i) => (
          <li key={name} className="flex items-center gap-3 border-b border-ink/10 py-2">
            <span
              aria-hidden
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-500 font-mono text-[9px] font-bold text-paper"
            >
              {i + 1}
            </span>
            <span className="min-w-0 text-[12.5px] text-ink/85">{name}</span>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border border-ink/12 p-3">
        <span className="min-w-0 truncate font-mono text-[11px] text-ink/85">{c.trace[0]}</span>
        <span
          className={`font-mono text-[10px] font-bold ${
            c.trace[1].startsWith('2') ? 'text-navy-500' : 'text-ink'
          }`}
        >
          {c.trace[1]}
        </span>
        <span className="font-mono text-[10px] text-ink/60">{c.trace[2]}</span>
      </div>
      <div className="mt-3 space-y-1.5">
        {SERVICES.map(([svc, pct]) => (
          <div key={svc} className="flex items-center gap-3">
            <span className="w-24 shrink-0 truncate font-mono text-[10px] text-ink/70 sm:w-28">
              {svc}
            </span>
            <span className="h-3 min-w-0 flex-1 bg-bone">
              <span className="block h-3 bg-navy-500" style={{ width: `${pct}%` }} />
            </span>
            <span className="w-9 shrink-0 text-right font-mono text-[9.5px] text-ink/60">
              {pct}%
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.09em] text-ink/60">
        pulled from the dashboard for this request
      </p>
    </div>
  )
}
