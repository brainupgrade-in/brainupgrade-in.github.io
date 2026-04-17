#!/usr/bin/env python3
"""Regenerate posts-data.json, rss.xml, and the blog portion of sitemap.xml
from docs/blog/posts/*.html.

The HTML files are the source of truth; every index artefact is derived. Run
this after creating/editing/deleting any post. scripts/publish.sh does this
automatically; .github/workflows/validate-indexes.yml enforces it in CI.

Safe to run repeatedly — output is deterministic for a given input tree.
"""
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

# docs/scripts/regenerate_indexes.py -> docs/
DOCS = Path(__file__).resolve().parent.parent
POSTS_DIR = DOCS / "blog/posts"
JSON_PATH = DOCS / "blog/posts-data.json"
RSS_PATH = DOCS / "blog/rss.xml"
SITEMAP_PATH = DOCS / "sitemap.xml"

BASE = "https://devops.gheware.com"
SKIP_STEMS = {"_template"}

# SEO/AEO lint thresholds. See --strict flag below.
# Matches values agreed in the 2026-04-17 blog review.
TITLE_MAX = 65
DESC_MAX = 170
DESC_MIN = 120


def extract_meta(html, attr, value):
    pat1 = rf'<meta\s+{attr}="{re.escape(value)}"\s+content="([^"]*)"'
    pat2 = rf'<meta\s+content="([^"]*)"\s+{attr}="{re.escape(value)}"'
    m = re.search(pat1, html) or re.search(pat2, html)
    return m.group(1) if m else None


def extract_meta_all(html, attr, value):
    pat1 = rf'<meta\s+{attr}="{re.escape(value)}"\s+content="([^"]*)"'
    pat2 = rf'<meta\s+content="([^"]*)"\s+{attr}="{re.escape(value)}"'
    return re.findall(pat1, html) + re.findall(pat2, html)


def html_unescape(s):
    if s is None:
        return s
    return (
        s.replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", '"')
        .replace("&#39;", "'")
        .replace("&#x27;", "'")
    )


def xml_escape(s):
    if s is None:
        return ""
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def is_redirect_stub(html):
    return bool(re.search(r'<meta\s+http-equiv="refresh"', html[:500], re.IGNORECASE))


def build_entry(slug, html, existing=None):
    """Build one posts-data.json entry from post HTML."""
    existing = existing or {}

    og_title = extract_meta(html, "property", "og:title")
    title = html_unescape(og_title) if og_title else slug.replace("-", " ").title()

    desc = extract_meta(html, "name", "description") or extract_meta(
        html, "property", "og:description"
    )
    desc = html_unescape(desc) if desc else existing.get("excerpt", "")

    iso = extract_meta(html, "property", "article:published_time")
    if not iso:
        m = re.search(r'"datePublished"\s*:\s*"([^"]+)"', html)
        if m:
            iso = m.group(1)
    if not iso:
        iso = existing.get("_isoDate") or "2026-01-01"
    iso_date = iso[:10]

    try:
        published_date = datetime.strptime(iso_date, "%Y-%m-%d").strftime("%B %-d, %Y")
    except ValueError:
        published_date = iso_date

    read_time_match = re.search(r"(\d+)\s*min\s*read", html, re.IGNORECASE)
    read_time = (
        f"{read_time_match.group(1)} min read"
        if read_time_match
        else existing.get("readTime", "10 min read")
    )

    section = (
        extract_meta(html, "property", "article:section") or existing.get("category") or "DevOps"
    )
    tags = extract_meta_all(html, "property", "article:tag") or existing.get("tags", [])

    keywords = existing.get("keywords", [])

    return {
        "title": title,
        "url": f"/blog/posts/{slug}.html",
        "excerpt": desc,
        "category": section,
        "tags": tags,
        "author": "Rajesh Gheware",
        "publishedDate": published_date,
        "_isoDate": iso_date,
        "readTime": read_time,
        "keywords": keywords,
    }


def load_existing_by_slug():
    if not JSON_PATH.exists():
        return {}
    with open(JSON_PATH) as f:
        data = json.load(f)
    result = {}
    for p in data.get("posts", []):
        slug = p["url"].split("/")[-1].replace(".html", "")
        result[slug] = p
    return result


def regenerate_posts_json():
    existing_by_slug = load_existing_by_slug()
    entries = []
    for post_file in sorted(POSTS_DIR.glob("*.html")):
        slug = post_file.stem
        if slug in SKIP_STEMS:
            continue
        html = post_file.read_text(encoding="utf-8")
        if is_redirect_stub(html):
            continue
        entries.append(build_entry(slug, html, existing_by_slug.get(slug)))
    entries.sort(key=lambda e: e["_isoDate"], reverse=True)
    JSON_PATH.write_text(
        json.dumps({"posts": entries}, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return entries


def regenerate_rss(entries):
    # lastBuildDate uses the newest post's date (not wall-clock time) so that
    # running the regenerator twice on the same tree is a no-op. The CI drift
    # check relies on determinism.
    if entries:
        try:
            dt = datetime.strptime(entries[0]["_isoDate"], "%Y-%m-%d")
            now = dt.strftime("%a, %d %b %Y 00:00:00 +0000")
        except ValueError:
            now = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S +0000")
    else:
        now = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S +0000")
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        "    <channel>",
        "        <title>Gheware DevOps AI Blog</title>",
        f"        <link>{BASE}/blog/</link>",
        "        <description>Kubernetes tutorials, Docker guides, CI/CD best practices, AI agent engineering, and cloud-native insights for DevOps engineers.</description>",
        "        <language>en-us</language>",
        f"        <lastBuildDate>{now}</lastBuildDate>",
        f'        <atom:link href="{BASE}/blog/rss.xml" rel="self" type="application/rss+xml"/>',
        "        <image>",
        f"            <url>{BASE}/favicon.svg</url>",
        "            <title>Gheware DevOps AI Blog</title>",
        f"            <link>{BASE}/blog/</link>",
        "        </image>",
    ]
    for e in entries[:50]:
        try:
            dt = datetime.strptime(e["_isoDate"], "%Y-%m-%d")
            pub_date = dt.strftime("%a, %d %b %Y 00:00:00 +0000")
        except ValueError:
            pub_date = now
        url = f"{BASE}{e['url']}"
        lines.extend(
            [
                "        <item>",
                f"            <title>{xml_escape(e['title'])}</title>",
                f"            <link>{url}</link>",
                f"            <guid>{url}</guid>",
                f"            <description>{xml_escape(e.get('excerpt',''))}</description>",
                f"            <category>{xml_escape(e.get('category',''))}</category>",
                "            <author>rajesh@gheware.com (Rajesh Gheware)</author>",
                f"            <pubDate>{pub_date}</pubDate>",
                "        </item>",
            ]
        )
    lines.append("    </channel>")
    lines.append("</rss>")
    lines.append("")
    RSS_PATH.write_text("\n".join(lines), encoding="utf-8")


def regenerate_sitemap(entries):
    """Regenerate blog-post entries + blog index lastmod; preserve every
    other <url> block verbatim (homepage, training pages, agentgrow, etc.).
    """
    if not SITEMAP_PATH.exists():
        print(f"warn: {SITEMAP_PATH} missing, writing blog-only sitemap", file=sys.stderr)
        existing_urls = []
    else:
        content = SITEMAP_PATH.read_text(encoding="utf-8")
        existing_urls = re.findall(r"<url>[\s\S]*?</url>", content)

    newest = entries[0]["_isoDate"] if entries else "2026-01-01"

    # Parse each existing block into a dict of field -> value so we can
    # re-emit with consistent formatting. Preserve non-blog-post entries;
    # refresh /blog/ and / lastmods to today's newest-post date.
    def parse_block(block):
        d = {}
        for field in ("loc", "lastmod", "changefreq", "priority"):
            m = re.search(rf"<{field}>([^<]+)</{field}>", block)
            if m:
                d[field] = m.group(1)
        return d

    def format_block(d):
        out = ["    <url>", f"        <loc>{d['loc']}</loc>"]
        for field in ("lastmod", "changefreq", "priority"):
            if field in d:
                out.append(f"        <{field}>{d[field]}</{field}>")
        out.append("    </url>")
        return "\n".join(out)

    preserved = []
    for block in existing_urls:
        d = parse_block(block)
        if not d.get("loc"):
            continue
        loc = d["loc"]
        if "/blog/posts/" in loc:
            continue  # regenerate these from disk
        if loc == f"{BASE}/blog/" or loc == f"{BASE}/":
            d["lastmod"] = newest
        preserved.append(format_block(d))

    # Build post entries in the same format
    post_blocks = []
    for e in entries:
        post_blocks.append(
            format_block(
                {
                    "loc": f"{BASE}{e['url']}",
                    "lastmod": e["_isoDate"],
                    "changefreq": "monthly",
                    "priority": "0.8",
                }
            )
        )

    out_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    out_lines.extend(preserved)
    out_lines.extend(post_blocks)
    out_lines.append("</urlset>")
    out_lines.append("")
    SITEMAP_PATH.write_text("\n".join(out_lines), encoding="utf-8")


def lint_post(slug, html):
    """Return list of (severity, message) for SEO/AEO issues.

    severity: "warn" by default. main() escalates to error with --strict.
    Covers: <title>, meta description, BlogPosting JSON-LD, FAQPage JSON-LD,
    related-reading internal-links block. Extend here, not in main().
    """
    issues = []

    t_match = re.search(r"<title>([^<]+)</title>", html)
    if t_match:
        title_text = html_unescape(t_match.group(1)).strip()
        if len(title_text) > TITLE_MAX:
            issues.append(
                ("warn", f"<title> is {len(title_text)} chars (max {TITLE_MAX}); SERP will truncate")
            )
    else:
        issues.append(("warn", "no <title> tag"))

    desc = extract_meta(html, "name", "description")
    if desc is None:
        issues.append(("warn", 'meta name="description" missing'))
    else:
        desc_text = html_unescape(desc)
        if len(desc_text) > DESC_MAX:
            issues.append(
                ("warn", f'meta description is {len(desc_text)} chars (max {DESC_MAX}); SERP will truncate')
            )
        elif len(desc_text) < DESC_MIN:
            issues.append(
                ("warn", f'meta description is {len(desc_text)} chars (min {DESC_MIN}); under-using the snippet')
            )

    if not re.search(r'"@type"\s*:\s*"BlogPosting"', html):
        issues.append(("warn", 'missing JSON-LD {"@type":"BlogPosting"}'))

    if not re.search(r'"@type"\s*:\s*"FAQPage"', html):
        issues.append(("warn", 'missing FAQPage schema (AEO / AI Overview eligibility)'))

    if not re.search(r'internal-links|Related reading', html) \
       and "📚 Related reading" not in html:
        issues.append(("warn", "no internal-links / Related reading block (hurts discovery + PageRank flow)"))

    return issues


def main():
    strict = "--strict" in sys.argv
    entries = regenerate_posts_json()
    regenerate_rss(entries)
    regenerate_sitemap(entries)

    # Validation
    required = ("title", "url", "excerpt", "category", "_isoDate", "readTime")
    missing = [
        (e["url"], [k for k in required if not e.get(k)])
        for e in entries
        if not all(e.get(k) for k in required)
    ]
    if missing:
        print("ERROR: entries missing required fields:", file=sys.stderr)
        for url, miss in missing:
            print(f"  {url}: {miss}", file=sys.stderr)
        sys.exit(2)

    # Catch future-dated datePublished typos. A post stamped e.g. 2026-06-01
    # on 2026-03-05 pins the blog index for months until someone notices.
    # Hard fail so the agent/CI stops the push. If you really need to
    # pre-commit a scheduled post, stage it on a branch — main should only
    # carry live-ready dates.
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    future = [(e["url"], e["_isoDate"]) for e in entries if e["_isoDate"] > today]
    if future:
        print(f"ERROR: {len(future)} post(s) have datePublished in the future (today={today}):", file=sys.stderr)
        for url, date in future:
            print(f"  {date}  {url}", file=sys.stderr)
        print("Fix the article:published_time / JSON-LD datePublished in the post HTML.", file=sys.stderr)
        sys.exit(2)

    print(f"posts-data.json: {len(entries)} entries (newest {entries[0]['_isoDate']})")
    print(f"rss.xml        : {min(50, len(entries))} items")
    print(f"sitemap.xml    : {len(entries)} post URLs + static pages")

    # ---------------- SEO/AEO lint pass ----------------
    lint_totals = {"post_issues": 0, "issues": 0}
    per_check = {}
    for post_file in sorted(POSTS_DIR.glob("*.html")):
        slug = post_file.stem
        if slug in SKIP_STEMS:
            continue
        html = post_file.read_text(encoding="utf-8")
        if is_redirect_stub(html):
            continue
        issues = lint_post(slug, html)
        if issues:
            lint_totals["post_issues"] += 1
            lint_totals["issues"] += len(issues)
            for sev, msg in issues:
                key = re.sub(r"\d+", "N", msg.split(";")[0])
                per_check[key] = per_check.get(key, 0) + 1
                prefix = "::warning file=docs/blog/posts/{slug}.html::".format(slug=slug) if os.environ.get("GITHUB_ACTIONS") else f"  warn  {slug}: "
                print(f"{prefix}{msg}", file=sys.stderr)

    if lint_totals["issues"]:
        print(
            f"\nSEO/AEO lint: {lint_totals['issues']} issue(s) across {lint_totals['post_issues']} post(s)",
            file=sys.stderr,
        )
        for k, v in sorted(per_check.items(), key=lambda x: -x[1]):
            print(f"  {v:3d}  {k}", file=sys.stderr)
        if strict:
            print("--strict set; failing.", file=sys.stderr)
            sys.exit(3)
    else:
        print("SEO/AEO lint: clean ✓")


if __name__ == "__main__":
    main()
