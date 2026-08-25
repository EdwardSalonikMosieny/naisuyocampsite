# Naisuyo Campsite website

A pure static site — hand-written HTML, CSS and vanilla JS. No build step, no npm install, no framework. Every page works with JavaScript completely disabled.

## File layout

```
index.html          Home
experiences.html     Safari, wildlife, cultural & relaxation experiences
stay.html            Accommodation, facilities, what to bring
gallery.html         Photo gallery with lightbox
about.html           The Maasai community behind Naisuyo, conservation ethos
contact.html         WhatsApp enquiry builder, directions, photography etiquette
404.html             Custom not-found page

styles.css           All shared styles (design tokens, layout, components)
main.js              Progressive-enhancement JS: mobile nav, lightbox, WhatsApp
                     message builder, scroll-reveal animation

images/              Processed photos actually used on the site (WebP + JPEG,
                     two widths each), plus og-image.jpg for social sharing
images/originals/    Untouched original photos, never published directly

scripts/process-images.py   Re-runnable image processing pipeline
scripts/check-metadata.py   Verifies a processed image has no EXIF/GPS left

IMAGE-MAP.md         Full photo audit: what's used, what's excluded, and why
CONTENT-TODO.md      Every piece of copy that still needs your confirmation
DEPLOY.md            Step-by-step GitHub Pages + DNS deployment instructions

CNAME, .nojekyll, robots.txt, sitemap.xml   Required at the repo root for
                     GitHub Pages and search engines — don't delete or rename.
```

## Editing text (no coding needed)

Each page is a plain HTML file you can open in any text editor (Notepad, VS Code, etc.). The visible text sits between tags like this:

```html
<p>This sentence is what shows up on the page.</p>
```

To change wording: find the sentence in the file (Ctrl+F in most editors), edit the text between the tags, save, and re-deploy (see DEPLOY.md — for GitHub Pages this is just `git add`, `git commit`, `git push`).

Anything you see wrapped like `<!-- TODO: confirm with owner — ... -->` is an internal note that never displays on the actual website (browsers ignore anything inside `<!-- -->`). CONTENT-TODO.md lists every one of these in one place.

**Header and footer are duplicated across all seven pages on purpose** (per the brief — no shared template engine). If you change something in the header/footer (e.g. the WhatsApp number), you need to change it in all seven files. See the placeholder note below for how to do this in one pass.

## Updating the placeholder contact details

Every page currently uses a **placeholder** WhatsApp number (`254700000000` / `+254 700 000 000`) and email (`info@naisuyo.co.ke`). These must be replaced with the real ones before launch — see CONTENT-TODO.md item 1–2.

Because the same values are repeated verbatim everywhere, you can update them with a single find-and-replace across every file:

- Find `254700000000` → replace with your real number (digits only, international format, no `+` or spaces) — this covers every `wa.me/...` link, every `tel:` link, and the `data-wa-number` attribute the enquiry builder reads.
- Find `+254 700 000 000` → replace with the human-readable version of the same number, for the visible text next to those links.
- Find `info@naisuyo.co.ke` → replace with your real email if different.

Most code editors (VS Code, Sublime, Notepad++) have a "Find in Files" / "Replace in Files" feature across a whole folder — use that rather than editing seven files by hand.

## Adding new photos

1. Drop the new photo(s) into `images/originals/` — keep the originals folder as the permanent, untouched backup.
2. Open `scripts/process-images.py` and add a line to the `MAPPING` dictionary near the top:
   ```python
   "your-new-photo.jpeg": "a-descriptive-lowercase-hyphenated-name",
   ```
3. Run the script from the project root:
   ```bash
   python3 scripts/process-images.py
   ```
   This produces four files in `images/` for each entry: `-800.jpg`, `-800.webp`, `-1600.jpg`, `-1600.webp`. It automatically corrects rotation, strips all metadata (including GPS), and keeps each file under the size budget (120KB for the 800px version, 200KB for the 1600px version).
4. Verify metadata really is gone:
   ```bash
   python3 scripts/check-metadata.py images/your-new-photo-1600.jpg
   ```
   Should print `EXIF tags found: 0`.
5. Wire the new image into whichever HTML page you want, following the `<picture>` pattern already used throughout (WebP source + JPEG fallback + explicit `width`/`height`/`alt`). Copy an existing `<picture>` block as a template.
6. If you're adding a photo to `gallery.html`, also add an entry to `IMAGE-MAP.md` so the audit stays accurate.

Requires Python 3 with Pillow (`pip install pillow`) — already used to build the current image set.

## Local preview

No server-side code is required, but browsers block some features (like `fetch`) from `file://` pages, so serve the folder locally instead of double-clicking the HTML files:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in a browser.

## Deployment

See DEPLOY.md for the full GitHub Pages + DNS walkthrough.
