# Use nginx:alpine-slim for the smallest possible image
FROM nginx:alpine-slim

# Remove default nginx static assets and config
RUN rm -rf /usr/share/nginx/html/*

# Copy static website files
COPY docs/ /usr/share/nginx/html/

# NOTE: nginx configuration is managed via Kubernetes ConfigMap
# See kubernetes/devops-gheware-manifest.yaml for nginx config

# Expose port 80
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
