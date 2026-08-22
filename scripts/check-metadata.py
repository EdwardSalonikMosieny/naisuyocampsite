#!/usr/bin/env python3
"""Quick verification that a processed image carries no EXIF/GPS metadata.
Usage: python3 scripts/check-metadata.py images/elephant-family-with-calf-1600.jpg
"""
import sys
from PIL import Image

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 scripts/check-metadata.py <path-to-image>")
        sys.exit(1)
    path = sys.argv[1]
    im = Image.open(path)
    exif = im.getexif()
    print(f"File: {path}")
    print(f"Size: {im.size}")
    print(f"EXIF tags found: {len(exif)}")
    if len(exif):
        for tag_id, val in exif.items():
            print(f"  tag {tag_id}: {val}")
    else:
        print("  (none — clean)")
    print(f"info dict keys (icc_profile, comment, etc.): {list(im.info.keys())}")

if __name__ == "__main__":
    main()
