#!/usr/bin/env python3
"""
Naisuyo Campsite — image processing pipeline.

Takes originals from images/originals/, and for every file listed in
MAPPING below produces, into images/:
  <name>-800.webp   <name>-800.jpg   (~800px wide)
  <name>-1600.webp  <name>-1600.jpg  (~1600px wide)

Every output image:
  - has EXIF orientation applied then stripped (so nothing is sideways,
    and no metadata — especially GPS — survives publication)
  - is re-encoded fresh (no ICC profiles, no camera make/model, no comments)
  - is capped to reasonable size budgets (~120KB for -800, ~200KB for -1600)

Usage:
    1. Drop new source photos into images/originals/
    2. Add a line to MAPPING below: "source-file.jpeg": "new-descriptive-name"
    3. Run: python3 scripts/process-images.py
"""

import os
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT, "images", "originals")
OUT_DIR = os.path.join(ROOT, "images")

WIDTHS = [800, 1600]
JPEG_QUALITY_START = 85
WEBP_QUALITY_START = 82
MAX_BYTES = {800: 120 * 1024, 1600: 200 * 1024}

# original filename (as sitting in images/originals/) -> new descriptive base name
MAPPING = {
    "image1.jpeg":  "maasai-manyatta-painted-hut",
    "image2.jpeg":  "dome-tents-under-acacia-shade",
    "image3.jpeg":  "grevys-zebra-portrait-bush",
    "image4.jpeg":  "warthog-pair-grassland",
    "image5.jpeg":  "zebra-mare-and-foal-nursing",
    "image6.jpeg":  "oryx-and-gerenuk-browsing",
    "image8.jpeg":  "gerenuk-trio-browsing-scrub",
    "image9.jpeg":  "oryx-herd-and-zebra-savannah",
    "image10.jpeg": "oryx-pair-facing-camera",
    "image11.jpeg": "elephant-family-with-calf",
    "image12.jpeg": "cardinal-woodpecker-on-branch",
    "image13.jpeg": "griffon-vulture-treetop",
    "image15.jpeg": "maasai-beaded-jewellery-in-progress",
    "image22.jpeg": "maasai-warriors-ceremonial-headdress",
    "image23.jpeg": "maasai-women-beaded-collars-portrait",
    "image24.jpeg": "maasai-men-ceremony-line-singing",
    "image25.jpeg": "maasai-warriors-profile-ceremony",
    "image27.jpeg": "maasai-elder-and-woman-portrait",
}


def strip_and_orient(im):
    """Apply EXIF orientation, then drop all metadata by rebuilding the image."""
    im = ImageOps.exif_transpose(im)
    clean = Image.new(im.mode if im.mode in ("RGB", "L") else "RGB", im.size)
    if im.mode not in ("RGB", "L"):
        im = im.convert("RGB")
    clean.paste(im)
    return clean


def save_under_budget(im, path, fmt, start_quality, max_bytes):
    quality = start_quality
    while quality >= 40:
        save_kwargs = {"quality": quality}
        if fmt == "JPEG":
            save_kwargs["optimize"] = True
            save_kwargs["progressive"] = True
        else:  # WEBP
            save_kwargs["method"] = 6
        im.save(path, fmt, **save_kwargs)
        if os.path.getsize(path) <= max_bytes or quality <= 40:
            break
        quality -= 5
    return os.path.getsize(path)


def process_one(src_name, base_name):
    src_path = os.path.join(SRC_DIR, src_name)
    if not os.path.exists(src_path):
        print(f"  SKIP  {src_name} not found in images/originals/")
        return

    with Image.open(src_path) as im:
        im = strip_and_orient(im)
        src_w, src_h = im.size

        for width in WIDTHS:
            target_w = min(width, src_w)
            target_h = round(src_h * (target_w / src_w))
            resized = im.resize((target_w, target_h), Image.LANCZOS)

            jpg_path = os.path.join(OUT_DIR, f"{base_name}-{width}.jpg")
            webp_path = os.path.join(OUT_DIR, f"{base_name}-{width}.webp")

            jsize = save_under_budget(resized, jpg_path, "JPEG", JPEG_QUALITY_START, MAX_BYTES[width])
            wsize = save_under_budget(resized, webp_path, "WEBP", WEBP_QUALITY_START, MAX_BYTES[width])

            print(f"  {base_name}-{width}: {target_w}x{target_h}  jpg={jsize//1024}KB  webp={wsize//1024}KB")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    if not os.path.isdir(SRC_DIR):
        print(f"ERROR: {SRC_DIR} does not exist. Put original photos there first.")
        return

    print(f"Processing {len(MAPPING)} image(s)...")
    for src_name, base_name in MAPPING.items():
        process_one(src_name, base_name)
    print("Done. Verify a sample with: python3 scripts/check-metadata.py <file>")


if __name__ == "__main__":
    main()
