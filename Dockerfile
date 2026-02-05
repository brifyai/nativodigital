# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments
ARG NODE_ENV=production
ARG REACT_APP_ENVIRONMENT=production
ARG PORT=3000
ARG REACT_APP_GOOGLE_CLIENT_ID
ARG REACT_APP_SUPABASE_URL
ARG REACT_APP_SUPABASE_ANON_KEY
ARG REACT_APP_GEMINI_API_KEY
ARG GEMINI_API_KEY
ARG CORS_ALLOW_ALL=true
ARG GIT_SHA

# Set environment variables
ENV NODE_ENV=${NODE_ENV}
ENV REACT_APP_ENVIRONMENT=${REACT_APP_ENVIRONMENT}
ENV PORT=${PORT}
ENV REACT_APP_GOOGLE_CLIENT_ID=${REACT_APP_GOOGLE_CLIENT_ID}
ENV REACT_APP_SUPABASE_URL=${REACT_APP_SUPABASE_URL}
ENV REACT_APP_SUPABASE_ANON_KEY=${REACT_APP_SUPABASE_ANON_KEY}
ENV REACT_APP_GEMINI_API_KEY=${REACT_APP_GEMINI_API_KEY}
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ENV CORS_ALLOW_ALL=${CORS_ALLOW_ALL}
ENV GIT_SHA=${GIT_SHA}

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 4000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
