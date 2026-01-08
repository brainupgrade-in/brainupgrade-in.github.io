#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="brainupgrade/gheware-devops-ai"
IMAGE_TAG="latest"
KIND_CLUSTER="finance"
NAMESPACE="gheware-devops-ai"
MANIFEST_FILE="kubernetes/gheware-devops-ai-manifest.yaml"

echo -e "${BLUE}🚀 Deploying DevOps Gheware Application${NC}"
echo "=========================================="

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

# Check if kind cluster exists
echo -e "${BLUE}Verifying Kind cluster...${NC}"
if ! kind get clusters | grep -q "^${KIND_CLUSTER}$"; then
    print_error "Kind cluster '${KIND_CLUSTER}' not found. Please ensure the cluster exists before running this script."
fi
print_status "Kind cluster '${KIND_CLUSTER}' is available"

# Set kubectl context to kind cluster
echo -e "${BLUE}Setting kubectl context...${NC}"
kubectl config use-context "kind-${KIND_CLUSTER}" || print_error "Failed to set kubectl context"
print_status "kubectl context set to kind-${KIND_CLUSTER}"

# Build Docker image
echo -e "${BLUE}Building Docker image...${NC}"
docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" . || print_error "Docker build failed"
print_status "Docker image built: ${IMAGE_NAME}:${IMAGE_TAG}"

# Load image into kind cluster
echo -e "${BLUE}Loading image into Kind cluster...${NC}"
kind load docker-image "${IMAGE_NAME}:${IMAGE_TAG}" --name "${KIND_CLUSTER}" || print_error "Failed to load image into kind cluster"
print_status "Image loaded into Kind cluster"

# Apply Kubernetes manifests
echo -e "${BLUE}Applying Kubernetes manifests...${NC}"
kubectl apply -f "${MANIFEST_FILE}" || print_error "Failed to apply Kubernetes manifests"
print_status "Kubernetes manifests applied"

# Wait for namespace to be ready
echo -e "${BLUE}Waiting for namespace...${NC}"
sleep 2
kubectl get namespace ${NAMESPACE} > /dev/null 2>&1 || print_error "Namespace ${NAMESPACE} not found"
print_status "Namespace ${NAMESPACE} is ready"

# Force deployment rollout to ensure latest image is used
echo -e "${BLUE}Forcing deployment rollout to use latest image...${NC}"
kubectl rollout restart deployment/gheware-devops-ai -n ${NAMESPACE} || print_error "Failed to restart deployment"
print_status "Deployment rollout initiated"

# Wait for deployment rollout to complete
echo -e "${BLUE}Waiting for deployment rollout to complete...${NC}"
kubectl rollout status deployment/gheware-devops-ai -n ${NAMESPACE} --timeout=300s || print_error "Deployment rollout failed"
print_status "Deployment rollout completed successfully"

# Wait for deployment to be ready
echo -e "${BLUE}Waiting for deployment to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/gheware-devops-ai -n ${NAMESPACE} || print_error "Deployment failed to become ready"
print_status "Deployment is ready"

# Get deployment status
echo -e "${BLUE}Checking application status...${NC}"
echo ""
echo -e "${YELLOW}Pods:${NC}"
kubectl get pods -n ${NAMESPACE} -l app=gheware-devops-ai -o wide

echo ""
echo -e "${YELLOW}Service:${NC}"
kubectl get svc -n ${NAMESPACE}

echo ""
echo -e "${YELLOW}Ingress:${NC}"
kubectl get ingress -n ${NAMESPACE}

# Print success message
echo ""
echo -e "${GREEN}🎉 Application deployment completed successfully!${NC}"
echo "=========================================="
echo -e "Namespace: ${YELLOW}${NAMESPACE}${NC}"
echo -e "Image: ${YELLOW}${IMAGE_NAME}:${IMAGE_TAG}${NC}"
echo -e "Cluster: ${YELLOW}kind-${KIND_CLUSTER}${NC}"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo ""
echo -e "${YELLOW}Check application status:${NC}"
echo "  kubectl get pods -n ${NAMESPACE}"
echo "  kubectl get svc,ingress -n ${NAMESPACE}"
echo ""
echo -e "${YELLOW}View application logs:${NC}"
echo "  kubectl logs -f deployment/gheware-devops-ai -n ${NAMESPACE}"
echo ""
echo -e "${YELLOW}Port-forward to test locally:${NC}"
echo "  kubectl port-forward svc/gheware-devops-ai-service 8080:80 -n ${NAMESPACE}"
echo "  Then visit: http://localhost:8080"
echo ""
echo -e "${YELLOW}Update deployment (after code changes):${NC}"
echo "  ./deploy.sh"
echo ""
echo -e "${YELLOW}Delete the application:${NC}"
echo "  kubectl delete -f ${MANIFEST_FILE}"
