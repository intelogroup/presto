FROM node:20-slim

# Chrome headless dependencies
RUN apt-get update && apt-get install -y \
  libglib2.0-0 \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libpango-1.0-0 \
  libcairo2 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxext6 \
  fonts-liberation \
  wget \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Pre-download Remotion's Chrome headless shell
RUN npx remotion browser ensure

COPY . .

RUN mkdir -p /tmp/renders && chown -R node:node /tmp/renders /app

USER node

EXPOSE 3000

CMD ["node", "server.js"]
