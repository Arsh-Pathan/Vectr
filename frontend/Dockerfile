# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# We must ensure the frontend knows it's being served from the root domain,
# and it hits the relative /api path so the local NGINX proxy catches it.
ENV VITE_API_URL=/api
RUN npm run build

# Production Stage
FROM nginx:alpine
# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/
# Copy built static assets
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
