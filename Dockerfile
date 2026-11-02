# Use Node.js 18 alpine as base image
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_BASE_URL=https://api.allcarematch.tech
ARG VITE_SOCKET_URL=https://api.allcarematch.tech
ARG REACT_APP_URL=https://allcarematch.tech/caregiver
ARG VITE_ASSETS_BASE_PATH=https://d2oci7d1h2jgu0.cloudfront.net

# Set environment variables for build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV REACT_APP_URL=$REACT_APP_URL
ENV VITE_ASSETS_BASE_PATH=$VITE_ASSETS_BASE_PATH

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
