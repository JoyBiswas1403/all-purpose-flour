# backend/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app /app
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package*.json ./
# Needed at runtime for sqlite and migrations
COPY .env.example ./.env.example
RUN npm pkg delete devDependencies && npm ci --omit=dev --prefer-offline
EXPOSE 3000
CMD ["node", "dist/index.js"]
