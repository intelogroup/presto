# Dockerfile for Node.js application
FROM node:18.16.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Expose application port
EXPOSE 3004

# Run application
CMD [ "node", "server.js" ]
