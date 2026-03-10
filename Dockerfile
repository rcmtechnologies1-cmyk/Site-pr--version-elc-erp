# Étape 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY vite.config.ts ./
COPY postcss.config.mjs ./
COPY src ./src
COPY index.html ./
RUN npm install
RUN npm run build

# Étape 2: Production avec Nginx
FROM nginx:alpine
# Créer la config Nginx directement dans l'image
RUN echo 'server {\n    listen 80;\n    server_name _;\n    root /usr/share/nginx/html;\n    index index.html;\n\n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n\n    # Compression gzip\n    gzip on;\n    gzip_vary on;\n    gzip_min_length 1024;\n    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;\n}' > /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
