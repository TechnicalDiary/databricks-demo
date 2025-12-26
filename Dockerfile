# ===============================
# Base image
# ===============================
FROM node:20-alpine

# ===============================
# App working directory
# ===============================
WORKDIR /app

# ===============================
# Install backend dependencies
# ===============================
COPY package.json package-lock.json* ./
RUN npm install --production

# ===============================
# Copy backend source
# ===============================
COPY . .

# ===============================
# Build React frontend
# ===============================
WORKDIR /app/client
RUN npm install
RUN npm run build

# ===============================
# Switch back to root
# ===============================
WORKDIR /app

# ===============================
# Databricks Apps use 8080
# ===============================
EXPOSE 8080

# ===============================
# Start server
# ===============================
CMD ["npm", "start"]
