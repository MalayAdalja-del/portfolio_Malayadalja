import { navigate } from '../lib/router'
import { MaskedWords } from '../lib/motion'

/**
 * The frame every chapter page shares.
 *
 * The home page ran to 21,000 pixels, which is about nine full screens on a
 * phone before the contact details. Three of its chapters are now pages of
 * their own, and each one needs the same three things: a way back that is a
 * real link, a heading that states what the page is, and a next step at the
 * bottom so a visitor who reaches the end is not stranded.
 */
export default function SubPage({ eyebrow, title, intro, children, next }) {
  return (
    <main className="bg-paper pt-[92px]">
      <header className="shell pb-10 pt-12 md:pb-16 md:pt-20">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
          className="eyebrow inline-block text-ink/60 transition-colors hover:text-ink"
        >
          ← Back
        </a>

        <p className="eyebrow mt-8 text-navy-500">{eyebrow}</p>
        <h1 className="display mt-4 max-w-4xl">
          <MaskedWords text={title} />
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink/75 md:text-[18px]">
          {intro}
        </p>
      </header>

      {children}

      {next && (
        <section className="invert-section">
          <div className="shell py-20 md:py-28">
            <p className="eyebrow text-white/60">Next</p>
            <a
              href={next.href}
              onClick={(e) => {
                e.preventDefault()
                navigate(next.href)
              }}
              className="group mt-4 block"
            >
              <span className="display block transition-opacity duration-300 group-hover:opacity-70">
                {next.title} →
              </span>
            </a>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75">{next.line}</p>
          </div>
        </section>
      )}
    </main>
  )
}
