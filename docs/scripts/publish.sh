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

# ─── STEP 1: Regenerate posts-data.json + sitemap.xml + rss.xml from disk ────
echo ""
echo "1️⃣  Regenerating indexes from docs/blog/posts/..."
$PYTHON docs/scripts/regenerate_indexes.py

# ─── STEP 2: Git commit & push ───────────────────────────────────────────────
echo ""
echo "2️⃣  Git commit & push..."
git add -A
git commit -m "$COMMIT_MSG" 2>/dev/null && echo "   ✅ Committed: $COMMIT_MSG" || echo "   ℹ️  Nothing new to commit"
git push origin main 2>&1 | tail -2
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
    done < <(git diff --name-only HEAD~1 HEAD -- 'docs/blog/posts/*.html' 2>/dev/null)
fi

if [ ${#URLS[@]} -eq 0 ]; then
    echo "   ℹ️  No new post URLs detected. Skipping indexing."
else
    echo "   Found ${#URLS[@]} URLs to submit"

    # ─── STEP 4: Yandex sitemap ping (IndexNow + Google require secrets) ─────
    echo ""
    echo "4️⃣  Yandex sitemap ping..."
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://yandex.com/ping?sitemap=${BLOG_BASE}/../sitemap.xml" --max-time 10)
    echo "   Yandex ping: HTTP $STATUS"

    echo ""
    echo "   ℹ️  To submit to Google Indexing API / IndexNow, run the agent's"
    echo "      submit-indexnow workflow separately (needs SA key + IndexNow key)."
fi

echo ""
echo "=========================================="
echo "✅ PUBLISH PIPELINE COMPLETE"
echo "=========================================="
