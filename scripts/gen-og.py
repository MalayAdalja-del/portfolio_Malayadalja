"""Render scripts/og-card.html to public/og.png at 1200x630.

The card is generated rather than drawn so it cannot drift from the site
again. The one it replaces still showed the headline from the first version
of this portfolio, a typeface treatment that has since been removed, and a
suite count one assertion out of date -- on the single image that every
share, every social preview and every AI answer card displays.

Not part of `npm run build`: it needs a browser and a deploy should not
depend on one. Run it by hand when the hero copy or the suite size changes:

    python scripts/gen-og.py
"""

import pathlib
import sys

from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
CARD = HERE / "og-card.html"
OUT = HERE.parent / "public" / "og.png"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
    page.goto(CARD.as_uri(), wait_until="networkidle")
    page.wait_for_timeout(600)
    page.screenshot(path=str(OUT))
    browser.close()

sys.stdout.reconfigure(encoding="utf-8")
print(f"  og -> public/og.png ({OUT.stat().st_size / 1024:.0f} KB)")
