# Use Node.js LTS image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Copy the wait-for-it.sh script
COPY wait-for-it.sh ./

# Expose backend port (change if your backend uses a different port)
EXPOSE 5000

# Make wait-for-it.sh executable
RUN chmod +x wait-for-it.sh

# Start the backend server only after DB is ready
CMD ["./wait-for-it.sh", "db", "3306", "--", "node", "server.js"]
