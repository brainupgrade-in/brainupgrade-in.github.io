#!/usr/bin/env python3
"""
validate-no-fabrication.py — pre-publish gate against fabricated client
attribution (issue/gotcha #88).

Scans docs/blog/posts/*.html and exits NON-ZERO if any post contains a
HIGH-CONFIDENCE fabrication signature. The signatures are deliberately
conservative (low false-positive): they target the families that the
2026-06-20 audit found saturating Dev's blog, NOT every number or company
mention.

What is allowed to stay (TRUE anchors — never flagged):
  * "rated 4.91/5.0 on Oracle University" / "4.91/5.0 at Oracle"
  * Rajesh Gheware's employment history (JPMorgan / Deutsche Bank /
    Morgan Stanley) when in a "25+ years" / bio / background context.
  * "5,000+ trained" / "119 labs" as standalone numbers.
  * Stats attributed to real third parties (Gartner, IBM, DORA, CNCF,
    GitHub, SANS, OWASP) — those are cited claims, not our fabrication.

What is flagged (fabrication):
  1. The literal "used by Fortune 500 teams" lead-magnet boilerplate.
  2. A named non-founder enterprise within ~60 chars of a client/trainee/
     usage verb (trained at / teams at / trusted by / deployed / etc.).
     The founder trio is excluded ONLY in a bio/background context.
  3. Invented-study phrases (State of LLM Operations report, 6-month study
     of, surveying 1,200, analysis of 35 production deployments).
  4. The fabricated persona token "FinTrust".

Skipped: _template.html and http-equiv=refresh redirect stubs.

Exit code: 0 if clean, 1 otherwise (prints file + matched text).
Usage: python3 docs/scripts/validate-no-fabrication.py [posts_dir]
"""

import re
import sys
from pathlib import Path

# Companies that have NO legitimate use in this blog — any client/usage-context
# mention is fabricated. (Oracle handled separately: legit only as the rating.)
NON_FOUNDER = (
    "Deloitte", "Ericsson", "Comcast", "Bank of America", "Goldman Sachs",
    "Goldman", "Standard Chartered", "ADNOC", "Infosys", "HDFC", "Accenture",
    "Snowflake", "Stripe", "Walmart", "Intercom", "MetLife", "Royal Bank",
    "Citibank", "Citigroup", "Citi",
)
# Founder employers — TRUE as background, fabricated as clients.
FOUNDER = ("JPMorgan", "JP Morgan", "Deutsche Bank", "Morgan Stanley")

# Client / trainee / usage verbs.
CLIENT_CTX = re.compile(
    r"(trained|training rooms?|trainees?|trusted by|workshops?\s+for|"
    r"clients?\b|customers?\b|deployed|rolled out|roll(ing)? out|"
    r"teams?\s+at|teams?\s+like|are using|is using|we (built|rebuilt|"
    r"deployed|ran|helped)|running\s+\w+\s+for|batches?\s+at|"
    r"engineers?\s+(at|from)|by engineers from|across .{0,20}batches)",
    re.IGNORECASE,
)
# Bio / background context that legitimises the founder trio.
BIO_CTX = re.compile(
    r"(25\+?\s*years|\d+\s*years (at|building|of)|years at|background|"
    r"past employ|career|building .{0,40}(systems?|platforms?|gateways?)|"
    r"payment gateway|architect.{0,20}at|spent .{0,20}at|formerly|"
    r"ex-|veteran)",
    re.IGNORECASE,
)
# Oracle rating context that legitimises Oracle.
ORACLE_OK = re.compile(r"(4\.91|Oracle University|rating|rated)", re.IGNORECASE)

STUDY_PHRASES = re.compile(
    r"(State of LLM Operations report|\d+-month study of|surveying 1,?200|"
    r"analysis of 35 production deployments|study of 2,?400 (developers|engineers))",
    re.IGNORECASE,
)

WINDOW = 60  # chars on each side of a company mention


def _strip_tags(s: str) -> str:
    return re.sub(r"<[^>]+>", " ", s)


def find_violations(text: str):
    """Return list of (label, snippet) high-confidence fabrication hits."""
    hits = []
    plain = _strip_tags(text)

    # 1. Fortune 500 boilerplate
    for m in re.finditer(r"used by Fortune 500 teams", plain, re.IGNORECASE):
        hits.append(("fortune500", plain[max(0, m.start() - 30): m.end() + 20]))

    # 2a. Non-founder enterprises near a client verb
    for company in NON_FOUNDER:
        for m in re.finditer(re.escape(company), plain):
            lo, hi = max(0, m.start() - WINDOW), m.end() + WINDOW
            window = plain[lo:hi]
            if CLIENT_CTX.search(window):
                hits.append(("named-client", window.strip()))
                break  # one hit per company per file is enough signal

    # 2b. Oracle near a client verb but NOT in the rating context
    for m in re.finditer(r"Oracle", plain):
        lo, hi = max(0, m.start() - WINDOW), m.end() + WINDOW
        window = plain[lo:hi]
        if CLIENT_CTX.search(window) and not ORACLE_OK.search(window):
            hits.append(("oracle-client", window.strip()))
            break

    # 2c. Founder trio in client (non-bio) context
    for company in FOUNDER:
        for m in re.finditer(re.escape(company), plain):
            lo, hi = max(0, m.start() - WINDOW), m.end() + WINDOW
            window = plain[lo:hi]
            if CLIENT_CTX.search(window) and not BIO_CTX.search(window):
                hits.append(("founder-as-client", window.strip()))
                break

    # 3. Invented studies
    for m in STUDY_PHRASES.finditer(plain):
        hits.append(("invented-study", plain[max(0, m.start() - 25): m.end() + 25]))

    # 4. Persona token
    for m in re.finditer(r"FinTrust", plain):
        hits.append(("persona", plain[max(0, m.start() - 25): m.end() + 25]))

    return hits


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
        hits = find_violations(text)
        if hits:
            offenders.append((path.name, hits))

    if offenders:
        print("Fabrication check FAILED — posts with #88 client-attribution signatures:\n",
              file=sys.stderr)
        for name, hits in offenders:
            print(f"  {name}", file=sys.stderr)
            for label, snippet in hits:
                snip = re.sub(r"\s+", " ", snippet)[:160]
                print(f"      [{label}] …{snip}…", file=sys.stderr)
        print(f"\n{len(offenders)} post(s) flagged. Neutralise per #88 "
              "(strip the client roster / invented metric; keep real anchors).",
              file=sys.stderr)
        return 1

    print(f"No-fabrication check OK — all posts in {posts_dir} clean.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
