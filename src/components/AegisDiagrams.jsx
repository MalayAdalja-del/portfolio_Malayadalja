import { Reveal } from '../lib/motion'

/**
 * Illustrations of the Aegis interface.
 *
 * These are drawings, not screenshots, and the page says so. Two reasons.
 * A real capture of this tool would carry live payment data — merchants,
 * transaction ids, tokens — and none of that belongs on a public site at
 * any resolution. And a screenshot is a fixed-width image that goes blurry
 * on a retina phone and costs an LCP budget to load.
 *
 * Every value below is invented. "Acme Store", "ord_4821", run #1482 — none
 * of it corresponds to anything real, and nothing here was copied from a
 * running system.
 *
 * They are built from DOM rather than SVG or PNG on purpose: they reflow at
 * 320px, the text in them is selectable and crawlable, they stay sharp at
 * any density, and they weigh nothing.
 */

function Frame({ title, children, caption }) {
  return (
    <figure className="min-w-0">
      <div className="overflow-hidden border border-ink/15 bg-paper">
        <div className="flex items-center gap-2.5 border-b border-ink/10 bg-bone px-4 py-2.5">
          <span aria-hidden className="h-2 w-2 rounded-full bg-ink/20" />
          <span aria-hidden className="h-2 w-2 rounded-full bg-ink/20" />
          <span aria-hidden className="h-2 w-2 rounded-full bg-ink/20" />
          <span className="ml-2 min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.1em] text-ink/60">
            {title}
          </span>
        </div>
        <div className="min-w-0 p-4 sm:p-5">{children}</div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-ink/60">{caption}</figcaption>
    </figure>
  )
}

const Chip = ({ on, children }) => (
  <span
    className={`inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.08em] ${
      on ? 'border-navy-500 bg-navy-500 text-paper' : 'border-ink/20 text-ink/60'
    }`}
  >
    <span aria-hidden>{on ? '●' : '○'}</span>
    {children}
  </span>
)

function RunManager() {
  const rows = [
    ['checkout.guest_card', 'pass', '4.1s'],
    ['refund.partial_amount', 'pass', '2.8s'],
    ['payout.idempotency_key', 'fail', '9.4s'],
    ['ledger.reconcile_on_read', 'pass', '1.2s'],
  ]
  return (
    <Frame
      title="Run manager"
      caption="A run, its layers and its results in one place — with the history kept, not scrolled past."
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <p className="font-mono text-[12px] font-bold">RUN #1482</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-ink/60">
          mode: suite · 6m 12s
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Chip on>UI</Chip>
        <Chip on>API</Chip>
        <Chip on>DB</Chip>
        <Chip>Security</Chip>
      </div>

      <p className="mt-4 font-mono text-[11px]">
        <span className="text-navy-500">42 passed</span>
        <span className="text-ink/60"> · 3 failed · 1 healed</span>
      </p>

      <ul className="mt-4 border-t border-ink/10">
        {rows.map(([name, state, ms]) => (
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
      </ul>
    </Frame>
  )
}

function Triage() {
  const steps = [
    ['Classified', 'Locator no longer matches — not a product defect', true],
    ['Diagnosed', 'The Continue button moved into a dialog in build 218', true],
    ['Fix proposed', 'get_by_role("button", name="Continue") inside the dialog', true],
    ['Sandbox verified', 'Runs green in isolation. Does not prove the bug is gone', true],
    ['Waiting for a human', 'Nothing is applied until someone approves it', false],
  ]
  return (
    <Frame
      title="Failure triage"
      caption="Every failed run is classified and diagnosed on arrival. The fix is a proposal — it waits."
    >
      <p className="font-mono text-[11px]">
        <span className="text-ink">✗ payout.idempotency_key</span>
      </p>
      <ol className="mt-4">
        {steps.map(([label, line, done], i) => (
          <li key={label} className="flex gap-3.5 pb-4 last:pb-0">
            <span
              aria-hidden
              className={`mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-bold ${
                done ? 'bg-navy-500 text-paper' : 'border border-ink/25 text-ink/60'
              }`}
            >
              {done ? '✓' : i + 1}
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-[0.09em] text-navy-500">
                {label}
              </span>
              <span className="mt-1 block break-words text-[12.5px] leading-snug text-ink/75">
                {line}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </Frame>
  )
}

function RecorderToSpec() {
  return (
    <Frame
      title="Recorder → spec"
      caption="The recording keeps the intent — role and label — so the generated spec reads like one a person wrote."
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-ink/60">Captured</p>
      <ul className="mt-2 font-mono text-[11px] leading-relaxed text-ink/85">
        <li>click · button "Add to basket"</li>
        <li>fill · field "Email" · acme@example.test</li>
        <li>click · button "Pay now"</li>
        <li>wait · text "Order ord_4821 confirmed"</li>
      </ul>

      <p aria-hidden className="my-4 text-center font-mono text-[13px] text-navy-500">
        ↓
      </p>

      <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-ink/60">Generated</p>
      <pre className="mt-2 max-w-full overflow-x-auto bg-bone p-3 font-mono text-[10.5px] leading-relaxed text-ink/85">
        {`page.get_by_role("button", name="Add to basket").click()
page.get_by_label("Email").fill(email)
page.get_by_role("button", name="Pay now").click()
expect(page.get_by_text(f"Order {order_id} confirmed")).to_be_visible()`}
      </pre>
    </Frame>
  )
}

export default function AegisDiagrams() {
  return (
    <div>
      <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-ink/75 md:text-[17px]">
        Drawn, not captured. The real interface runs against live payment data, and none of that
        belongs on a public page — so these are illustrations of the same screens, with every value
        invented.
      </p>

      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        <Reveal className="min-w-0">
          <RunManager />
        </Reveal>
        <Reveal className="min-w-0" delay={0.06}>
          <Triage />
        </Reveal>
        <Reveal className="min-w-0" delay={0.12}>
          <RecorderToSpec />
        </Reveal>
      </div>
    </div>
  )
}
