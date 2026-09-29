/**
 * Tells Bing the site changed, instead of waiting to be crawled.
 *
 * This exists for one reason: ChatGPT's search reaches for Bing, and Bing
 * crawls a small personal site slowly. A page nobody has crawled cannot be
 * cited by an assistant, so the gap between "deployed" and "indexed" is the
 * gap where the answer about him is still whatever a directory says.
 *
 * IndexNow is a shared endpoint — submitting once reaches Bing, Yandex,
 * Seznam and Naver. Google does not participate; Search Console is the only
 * route there, and it is a manual one.
 *
 * The key is not a secret. It is published at the URL below on purpose: that
 * is how the endpoint proves the submitter controls the domain.
 *
 * Run after a deploy has finished, not before — the endpoint fetches the
 * URLs, and submitting pages that are not live yet wastes the submission:
 *
 *   node scripts/indexnow.mjs
 */
import { readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ROUTES } from '../src/lib/router.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const PUBLIC = resolve(HERE, '..', 'public')

const HOST = 'www.malayadalja.in'
const SITE = `https://${HOST}`

/** The key is whichever 32-hex .txt file sits in public/. */
const keyFile = readdirSync(PUBLIC).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))
if (!keyFile) {
  console.error('indexnow: no key file in public/ — expected one named <32 hex>.txt')
  process.exit(1)
}
const key = keyFile.replace('.txt', '')

const urlList = [
  ...ROUTES.map((r) => `${SITE}${r}`),
  `${SITE}/sitemap.xml`,
  `${SITE}/llms.txt`,
  `${SITE}/llms-full.txt`,
]

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `${SITE}/${keyFile}`,
    urlList,
  }),
})

// 200 and 202 both mean accepted; 422 is the one that matters, and it means
// the key file did not verify, usually because the deploy has not landed.
console.log(`indexnow: ${res.status} ${res.statusText} — ${urlList.length} URLs submitted`)
if (!res.ok) console.log(await res.text())
