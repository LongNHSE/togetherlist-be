# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env ./

RUN npm run build

# Stage 2: Run the application
FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 8000

CMD ["node", "dist/main"]