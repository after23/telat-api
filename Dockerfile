FROM ghcr.io/puppeteer/puppeteer:20.4.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm ci
COPY . .
CMD [ "node", "dist/index.js" ]