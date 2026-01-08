#!/bin/bash
# Docker-based Local Development Server for DevOps Gheware
# Serves the site on http://localhost:8889 with live reload support

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

CONTAINER_NAME="gheware-devops-ai-dev"
DEFAULT_PORT=8889

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    DevOps Gheware - Docker Development Server              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Error: Docker is not running!${NC}"
    echo -e "${YELLOW}  Please start Docker and try again.${NC}"
    exit 1
fi

# Check if docs directory exists
if [ ! -d "docs" ]; then
    echo -e "${RED}✗ Error: 'docs' directory not found!${NC}"
    echo -e "${YELLOW}  Make sure you're running this script from the devops.gheware.com directory.${NC}"
    exit 1
fi

# Stop and remove existing container if running
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${YELLOW}ℹ Stopping existing container...${NC}"
    docker rm -f ${CONTAINER_NAME} > /dev/null 2>&1
fi

# Start new container
echo -e "${GREEN}✓ Starting Docker container...${NC}"
docker run -d \
    --name ${CONTAINER_NAME} \
    -p ${DEFAULT_PORT}:80 \
    -v "$(pwd)/docs:/usr/share/nginx/html:ro" \
    nginx:alpine-slim > /dev/null

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🚀 Server running at: http://localhost:${DEFAULT_PORT}${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Pages available:${NC}"
echo -e "  • Homepage:         ${GREEN}http://localhost:${DEFAULT_PORT}/${NC}"
echo -e "  • Blog:             ${GREEN}http://localhost:${DEFAULT_PORT}/blog/${NC}"
echo -e "  • Privacy Policy:   ${GREEN}http://localhost:${DEFAULT_PORT}/privacy.html${NC}"
echo -e "  • Terms of Service: ${GREEN}http://localhost:${DEFAULT_PORT}/terms.html${NC}"
echo ""
echo -e "${YELLOW}Commands:${NC}"
echo -e "  Stop server:     ${BLUE}docker stop ${CONTAINER_NAME}${NC}"
echo -e "  View logs:       ${BLUE}docker logs -f ${CONTAINER_NAME}${NC}"
echo -e "  Restart server:  ${BLUE}docker restart ${CONTAINER_NAME}${NC}"
echo ""
echo -e "${GREEN}✓ Changes to docs/ folder are automatically reflected (volume mount)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
