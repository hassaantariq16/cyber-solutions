FROM node:20-alpine
WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy source
COPY . .

EXPOSE 5000
CMD ["npm", "start"]
