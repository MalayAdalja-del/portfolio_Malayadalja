/**
 * True only inside the build-time SSR bundle.
 *
 * Vite defines `import.meta.env.SSR`, so this folds to a literal `false` in
 * the browser bundle and every branch behind it is dropped. It costs the
 * shipped site nothing.
 */
export const IS_STATIC = Boolean(import.meta.env && import.meta.env.SSR)
