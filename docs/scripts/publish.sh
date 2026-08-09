#!/bin/bash
# =============================================================================
# DEV BLOG PUBLISH SCRIPT
# Run after creating/editing a blog post to handle all publishing steps.
# Usage: ./docs/scripts/publish.sh "Commit message" [url1] [url2] ...
# If no URLs are provided, auto-detects new/modified post files from git diff.
# =============================================================================
#
# STEP 1 rebuilds posts-data.json, sitemap.xml, and rss.xml from the HTML
# files in docs/blog/posts/ (the source of truth). Never hand-edit those
# three files — they will be clobbered. Edit posts/ + run this script.
# =============================================================================

set -euo pipefail
REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_DIR"

PYTHON="${PYTHON:-python3}"
BLOG_BASE="https://devops.gheware.com/blog"

COMMIT_MSG="${1:-Auto-publish blog update}"
shift 2>/dev/null || true

echo "=========================================="
echo "📝 DEV BLOG PUBLISH PIPELINE"
echo "=========================================="

# ─── STEP 0: Template conformance gate (abort publish on drift) ──────────────
echo ""
echo "0️⃣  Validating blog-post template conformance..."
if ! $PYTHON docs/scripts/validate-template.py; then
    echo ""
    echo "   ❌ Template conformance check failed — publish aborted."
    echo "   Fix the posts above against docs/blog/posts/_template.html and re-run."
    exit 1
fi

# ─── STEP 0b: No-fabrication gate (abort publish on #88 client attribution) ──
echo ""
echo "0️⃣b Validating no fabricated client attribution (#88)..."
if ! $PYTHON docs/scripts/validate-no-fabrication.py; then
    echo ""
    echo "   ❌ Fabrication check failed — publish aborted."
    echo "   Neutralise the flagged client rosters / invented metrics and re-run."
    exit 1
fi

# ─── STEP 1: Regenerate posts-data.json + sitemap.xml + rss.xml from disk ────
echo ""
echo "1️⃣  Regenerating indexes from docs/blog/posts/..."
$PYTHON docs/scripts/regenerate_indexes.py

# Capture HEAD before commit so we can diff against it to find new posts.
PREV_HEAD="$(git rev-parse HEAD)"

# ─── STEP 2: Git commit & push ───────────────────────────────────────────────
echo ""
echo "2️⃣  Git commit & push..."
git add -A
git commit -m "$COMMIT_MSG" 2>/dev/null && echo "   ✅ Committed: $COMMIT_MSG" || echo "   ℹ️  Nothing new to commit"

# Rebase onto anything that landed upstream since this clone last synced.
# Without this, ONE commit made from another clone diverges this one and every
# subsequent push is rejected — the post stays committed-but-404 with no error
# anywhere. That is exactly how the 2026-08-09 runbook-automation post was
# stranded. The three index files are derived (never hand-edited, see #65), so
# a conflict in them is resolved by regenerating rather than by merging.
echo "   ↻ Syncing with origin/main before push..."
git fetch origin main -q
if ! git rebase origin/main >/dev/null 2>&1; then
    CONFLICTS="$(git diff --name-only --diff-filter=U)"
    DERIVED_ONLY=1
    for f in $CONFLICTS; do
        case "$f" in
            docs/blog/posts-data.json|docs/blog/rss.xml|docs/sitemap.xml) ;;
            *) DERIVED_ONLY=0 ;;
        esac
    done
    if [ -n "$CONFLICTS" ] && [ "$DERIVED_ONLY" = "1" ]; then
        echo "   ↻ Conflict in derived indexes only — regenerating."
        git checkout --ours -- $CONFLICTS 2>/dev/null || true
        $PYTHON docs/scripts/regenerate_indexes.py
        git add $CONFLICTS
        GIT_EDITOR=true git rebase --continue >/dev/null 2>&1 || {
            git rebase --abort 2>/dev/null || true
            echo "   ❌ Could not complete rebase — NOTHING PUSHED, post is not live." >&2
            exit 1
        }
    else
        git rebase --abort 2>/dev/null || true
        echo "   ❌ Rebase onto origin/main conflicts outside the derived indexes:" >&2
        echo "$CONFLICTS" | sed 's/^/        /' >&2
        echo "   ❌ Resolve by hand — NOTHING PUSHED, post is not live." >&2
        exit 1
    fi
fi

# Whatever git decided for the three index files during the rebase, they are
# DERIVED (#65) — a 3-way merge of them is meaningless and leaves artifacts
# (observed: a stale item kept at the tail of rss.xml). Re-derive from the
# posts on disk so the committed indexes always match the corpus exactly.
$PYTHON docs/scripts/regenerate_indexes.py >/dev/null
if ! git diff --quiet -- docs/blog/posts-data.json docs/blog/rss.xml docs/sitemap.xml; then
    git add docs/blog/posts-data.json docs/blog/rss.xml docs/sitemap.xml
    git commit -q --amend --no-edit
    echo "   ↻ Re-derived indexes after rebase."
fi

if ! git push origin main 2>&1 | tail -2; then
    echo "   ❌ git push REJECTED — the post is committed locally but NOT live." >&2
    echo "      Fix the clone, then re-run publish.sh." >&2
    exit 1
fi
echo "   ✅ Pushed to GitHub Pages"

# ─── STEP 3: Collect URLs to submit ──────────────────────────────────────────
URLS=("$@")
if [ ${#URLS[@]} -eq 0 ]; then
    echo ""
    echo "3️⃣  Auto-detecting new/modified post URLs..."
    while IFS= read -r file; do
        if [[ "$file" == docs/blog/posts/*.html ]]; then
            stem="${file#docs/blog/posts/}"
            URLS+=("${BLOG_BASE}/posts/${stem}")
        fi
    done < <(git diff --name-only "$PREV_HEAD" HEAD -- 'docs/blog/posts/*.html' 2>/dev/null)
fi

if [ ${#URLS[@]} -eq 0 ]; then
    echo "   ℹ️  No new post URLs detected. Skipping indexing."
else
    echo "   Found ${#URLS[@]} URL(s) to submit"

    # ─── STEP 4: IndexNow + Google Indexing API ──────────────────────────────
    echo ""
    echo "4️⃣  Submitting to IndexNow + Google Indexing API..."
    $PYTHON docs/scripts/submit_indexing.py "${URLS[@]}" || echo "   ⚠️  Indexing submission had errors (non-blocking)"

    # ─── STEP 5: Yandex sitemap ping (free, no auth) ─────────────────────────
    echo ""
    echo "5️⃣  Yandex sitemap ping..."
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://yandex.com/ping?sitemap=${BLOG_BASE}/../sitemap.xml" --max-time 10)
    echo "   Yandex ping: HTTP $STATUS"
fi

echo ""
echo "=========================================="
echo "✅ PUBLISH PIPELINE COMPLETE"
echo "=========================================="
