#!/usr/bin/env python3
"""
validate-template.py — pre-publish blog-post template conformance gate.

Scans docs/blog/posts/*.html and fails if any post is missing the structural
markers defined by the canonical _template.html. This is the automated form of
the manual conformance scan and exists so the 2026-06 template-drift incident
(hand-rolled chrome + a content-writer planning outline leaking into published
HTML) cannot recur.

Skipped:
  * _template.html          (the template itself)
  * any *.html that is an http-equiv="refresh" redirect stub

Required markers (mirrors _template.html):
  * /js/template-loader.js          (shared header/footer/author-bio loader)
  * id="header-placeholder"
  * id="footer-placeholder"
  * /css/premium.css
  * rel="canonical"                 (canonical URL)
  * application/ld+json             (at least one JSON-LD block)
  * author bio                      (author-bio class OR id="author-bio-placeholder")

Exit code: 0 if all posts conform, 1 otherwise.
Usage: python3 docs/scripts/validate-template.py [posts_dir]
"""

import sys
from pathlib import Path

# (label, substring that must appear somewhere in the file)
SIMPLE_MARKERS = [
    ("tmpl-loader", "template-loader.js"),
    ("hdr-PH", 'id="header-placeholder"'),
    ("ftr-PH", 'id="footer-placeholder"'),
    ("premium.css", "premium.css"),
    ("canonical", 'rel="canonical"'),
    ("JSON-LD", "application/ld+json"),
]


def missing_markers(text: str):
    miss = []
    for label, needle in SIMPLE_MARKERS:
        if needle not in text:
            miss.append(label)
    # author bio is satisfied by either form
    if "author-bio" not in text and 'id="author-bio-placeholder"' not in text:
        miss.append("author-bio")
    return miss


def is_redirect_stub(text: str) -> bool:
    return 'http-equiv="refresh"' in text


def main() -> int:
    repo_root = Path(__file__).resolve().parents[2]
    posts_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else repo_root / "docs" / "blog" / "posts"

    if not posts_dir.is_dir():
        print(f"ERROR: posts dir not found: {posts_dir}", file=sys.stderr)
        return 1

    offenders = []
    for path in sorted(posts_dir.glob("*.html")):
        if path.name == "_template.html":
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        if is_redirect_stub(text):
            continue
        miss = missing_markers(text)
        if miss:
            offenders.append((path.name, miss))

    if offenders:
        print("Template conformance check FAILED — non-conforming posts:\n", file=sys.stderr)
        for name, miss in offenders:
            print(f"  {name} -->{''.join(' ' + m for m in miss)}", file=sys.stderr)
        print(
            "\nFix each post against docs/blog/posts/_template.html "
            "(add the missing markers), then re-run.",
            file=sys.stderr,
        )
        return 1

    print(f"Template conformance OK — all posts in {posts_dir} conform.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
