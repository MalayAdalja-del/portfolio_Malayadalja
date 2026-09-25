"""Render one social card per route into public/og/.

Every page shared the same og.png, so a link to /work/aegis or /proof
previewed as the home page. Each route gets its own card now, built from
the same title the page carries, so the preview and the page agree.

The cards are rendered from HTML rather than drawn in a design tool, using
the site's own fonts and the same three colours. Generated, so they cannot
drift the way the old one did -- it was still advertising the first version
of this portfolio weeks after that version was gone.

Two layouts. Most pages get the type card. The two Aegis pages get a card
with a miniature of the run panel beside the type, because a link to a
product page should preview as the product. Every value in that miniature
is invented, as everywhere else on this site.

Not part of `npm run build`: it needs a browser, and a deploy should not
depend on one. Run it by hand after changing a page title:

    python scripts/gen-og.py
"""

import pathlib
import sys

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent / "public" / "og"
TEMPLATE = HERE / "og-card.html"

# (slug, eyebrow, lead, accent, variant)
CARDS = [
    ("index", "Software engineer — QA · Ahmedabad, India",
     "I find what breaks payments", "before customers do.", "type"),
    ("what-i-check", "Ch.02 · What I check",
     "Seven rails.", "Five assertions each.", "type"),
    ("how-i-work", "Ch.04 · How I keep up",
     "Six things,", "done properly.", "type"),
    ("proof", "Ch.07 · Why it matters",
     "Break this page.", "Six real defects, caught live.", "type"),
    ("route", "Ch.06 · The route",
     "Seven years,", "one road.", "type"),
    ("faq", "Q&A · Straight answers",
     "What people", "ask first.", "type"),
    ("work-speed", "Case study · Payments",
     "Crypto payments,", "tested end to end.", "type"),
    ("work-kyb", "Case study · Compliance",
     "KYB and KYC,", "start to verified.", "type"),
    ("work-aegis", "Internal tool · from Nov 2025",
     "Aegis-QA", "the tooling I built.", "panel"),
    ("aegis-demo", "Interactive walkthrough",
     "The Aegis-QA portal", "every value invented.", "panel"),
]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
        page.goto(TEMPLATE.as_uri(), wait_until="networkidle")

        for slug, eyebrow, lead, accent, variant in CARDS:
            page.evaluate(
                "([e, l, a, v]) => window.render(e, l, a, v)",
                [eyebrow, lead, accent, variant],
            )
            page.wait_for_timeout(200)
            target = OUT / f"{slug}.png"
            page.screenshot(path=str(target))
            print(f"  og -> public/og/{slug}.png ({target.stat().st_size / 1024:.0f} KB)")

        # The home card doubles as the site-wide fallback.
        (OUT.parent / "og.png").write_bytes((OUT / "index.png").read_bytes())
        print("  og -> public/og.png (fallback = home card)")
        browser.close()


main()
