"""Render the marketing artwork in scripts/art/ to public/art/.

These are product shots, drawn from the same components the site uses and
tilted in 3D, so the artwork cannot claim anything the product does not.
Every value in them is invented.

Rendered at 2x and written as PNG. Run by hand:

    python scripts/gen-art.py
"""

import pathlib
import sys

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")

HERE = pathlib.Path(__file__).resolve().parent
ART = HERE / "art"
OUT = HERE.parent / "public" / "art"
# The 2400px masters stay out of public/ — Vite copies that folder verbatim
# and a 1.6 MB PNG nobody requests would ship on every deploy.
MASTERS = HERE / "art" / "_masters"

SCENES = [
    ("home-hero", 2400, 1350),
    ("aegis-hero", 2400, 1350),
    ("rails-hero", 2400, 1350),
    ("proof-hero", 2400, 1350),
    ("route-hero", 2400, 1350),
    ("skills-hero", 2400, 1350),
]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    MASTERS.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for name, w, h in SCENES:
            page = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
            page.goto((ART / f"{name}.html").as_uri(), wait_until="networkidle")
            page.wait_for_timeout(700)
            target = MASTERS / f"{name}.png"
            page.screenshot(path=str(target))
            print(f"  art -> master {name}.png  {w}x{h}  ({target.stat().st_size / 1024:.0f} KB)")

            # A 2400px PNG is 1.6 MB and cannot go on a page. The site ships
            # the WebP; the PNG stays as the master to re-derive from.
            from PIL import Image

            img = Image.open(target)
            img.thumbnail((1600, 1600), Image.LANCZOS)
            web = OUT / f"{name}.webp"
            img.save(web, "WEBP", quality=86, method=6)
            print(
                f"  art -> public/art/{name}.webp {img.width}x{img.height}"
                f"  ({web.stat().st_size / 1024:.0f} KB)"
            )
            page.close()
        browser.close()


main()
