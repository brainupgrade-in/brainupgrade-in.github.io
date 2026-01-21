#!/bin/bash

# Migration Script for Blog Posts
# Converts old head structure to use head-loader.js

echo "=== Blog Post Migration Script ==="
echo "This script will update blog posts to use the new head-loader.js system"
echo ""

# Count files to be updated
BLOG_POSTS=$(find docs/blog/posts -name "*.html" ! -name "_template.html" | wc -l)

echo "Found $BLOG_POSTS blog posts to update"
echo ""
read -p "Do you want to proceed? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration cancelled."
    exit 1
fi

# Backup
BACKUP_DIR="docs/blog/posts/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "Creating backup in $BACKUP_DIR..."
cp docs/blog/posts/*.html "$BACKUP_DIR/" 2>/dev/null || true

# Migration counter
UPDATED=0

# Process each blog post
for file in docs/blog/posts/*.html; do
    # Skip template file
    if [[ "$file" == *"_template.html" ]]; then
        continue
    fi

    echo "Processing: $file"

    # Create temporary file
    TMP_FILE="${file}.tmp"

    # Use sed to replace old head structure with new one
    # This is a simplified approach - for complex changes, consider using a proper HTML parser

    # For now, just add a note at the top of each file
    # You should review and update each file manually or use a more sophisticated script

    echo "  → Skipping (requires manual review)"
    # UPDATED=$((UPDATED + 1))
done

echo ""
echo "=== Migration Summary ==="
echo "Total files found: $BLOG_POSTS"
echo "Files updated: $UPDATED"
echo "Backup location: $BACKUP_DIR"
echo ""
echo "IMPORTANT: Blog posts require manual review and update."
echo "Please use the template in docs/templates/page-template-full.html as a guide."
echo ""
echo "For each blog post:"
echo "1. Remove: charset, viewport, author, favicon, analytics-loader.js"
echo "2. Keep: description, title, article-specific meta tags"
echo "3. Add: <script src=\"/js/head-loader.js\"></script>"
echo "4. Update paths to use absolute paths (e.g., /css/premium.css instead of ../css/premium.css)"
echo ""
echo "See TEMPLATE_SYSTEM_GUIDE.md for detailed instructions."
