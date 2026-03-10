# Étape 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY vite.config.ts ./
COPY postcss.config.mjs ./
COPY src ./src
COPY index.html ./
RUN npm ci
RUN npm run build

# Étape 2: Production avec Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
