/**
 * A rendered scene, placed on a page.
 *
 * `width` and `height` are always set. An image without them is the classic
 * way to reintroduce layout shift: the browser reserves nothing, paints the
 * text, then pushes it down when the bytes land. This site holds CLS at
 * 0.0000 and adding pictures is not a reason to give that up.
 *
 * `loading` defaults to lazy because every one of these sits below the
 * fold. The one exception would be a scene directly under an h1, which
 * should be eager — pass it explicitly rather than guessing here.
 */
export default function Art({ src, alt, caption, width = 1600, height = 900, loading = 'lazy' }) {
  return (
    <figure className="my-12 md:my-16">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className="block h-auto w-full border border-ink/10 bg-ink"
      />
      {caption && (
        <figcaption className="mt-3 text-[13px] leading-relaxed text-ink/60">{caption}</figcaption>
      )}
    </figure>
  )
}
