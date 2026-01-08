#!/bin/bash
# Local Development Server for DevOps Gheware
# Serves the site on http://localhost:8889 for faster development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         DevOps Gheware - Local Development Server          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if docs directory exists
if [ ! -d "docs" ]; then
    echo -e "${RED}✗ Error: 'docs' directory not found!${NC}"
    echo -e "${YELLOW}  Make sure you're running this script from the devops.gheware.com directory.${NC}"
    exit 1
fi

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to find available port
find_port() {
    local start_port=$1
    local port=$start_port

    while check_port $port; do
        echo -e "${YELLOW}⚠ Port $port is already in use${NC}"
        port=$((port + 1))
    done

    echo $port
}

# Default port (different from www-gheware to avoid conflicts)
DEFAULT_PORT=8889
PORT=$(find_port $DEFAULT_PORT)

if [ $PORT -ne $DEFAULT_PORT ]; then
    echo -e "${YELLOW}ℹ Using port $PORT instead of $DEFAULT_PORT${NC}"
    echo ""
fi

# Check for Python (most systems have it)
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✓ Using Python 3 HTTP server${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🚀 Server running at: http://localhost:$PORT${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}Pages available:${NC}"
    echo -e "  • Homepage:         ${GREEN}http://localhost:$PORT/${NC}"
    echo -e "  • Blog:             ${GREEN}http://localhost:$PORT/blog/${NC}"
    echo -e "  • Privacy Policy:   ${GREEN}http://localhost:$PORT/privacy.html${NC}"
    echo -e "  • Terms of Service: ${GREEN}http://localhost:$PORT/terms.html${NC}"
    echo -e "  • Sitemap:          ${GREEN}http://localhost:$PORT/sitemap.xml${NC}"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    cd docs
    python3 -m http.server $PORT

elif command -v php &> /dev/null; then
    echo -e "${GREEN}✓ Using PHP built-in server${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🚀 Server running at: http://localhost:$PORT${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    echo ""

    cd docs
    php -S localhost:$PORT

elif command -v npx &> /dev/null; then
    echo -e "${GREEN}✓ Using npx http-server${NC}"
    echo -e "${YELLOW}ℹ Installing http-server if needed...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🚀 Server running at: http://localhost:$PORT${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    npx http-server docs -p $PORT

else
    echo -e "${RED}✗ Error: No suitable HTTP server found!${NC}"
    echo ""
    echo -e "${YELLOW}Please install one of the following:${NC}"
    echo -e "  • Python 3:  ${BLUE}sudo apt install python3${NC}"
    echo -e "  • PHP:       ${BLUE}sudo apt install php${NC}"
    echo -e "  • Node.js:   ${BLUE}sudo apt install nodejs npm${NC}"
    echo ""
    echo -e "${YELLOW}Or use Docker:${NC}"
    echo -e "  ${BLUE}docker run -d -p 8889:80 -v \$(pwd)/docs:/usr/share/nginx/html:ro nginx:alpine${NC}"
    exit 1
fi
