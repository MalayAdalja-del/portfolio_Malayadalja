/**
 * Infinite keyword band. Doubles as the transition between a white act and a
 * black one — and every word in it is a term someone might search for.
 */
export default function Marquee({ items, dark = false, slow = false }) {
  const track = [...items, ...items]

  return (
    <div
      aria-hidden
      className={`relative flex overflow-hidden border-y py-5 ${
        dark ? 'invert-section border-white/15' : 'border-ink/15 bg-paper'
      }`}
    >
      <div
        className={`flex w-max shrink-0 ${
          slow ? 'motion-safe:animate-marquee-slow' : 'motion-safe:animate-marquee'
        }`}
      >
        {track.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="flex items-center whitespace-nowrap font-black uppercase tracking-tightest [font-size:clamp(1.4rem,3.4vw,2.6rem)]"
          >
            {word}
            <span className={`mx-7 text-[0.4em] ${dark ? 'text-navy-300' : 'text-navy-500'}`}>
              ●
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
