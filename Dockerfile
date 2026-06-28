# Сцена 1: Градење на апликацијата
FROM node:20-alpine AS builder
WORKDIR /app

# 1. Инсталирање на OpenSSL и libc6-compat за Prisma Engine во Alpine (за време на билд)
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
COPY prisma ./prisma/

# Обезбедуваме bcryptjs да биде точно инсталиран за alpine архитектура
RUN npm list bcryptjs || npm install bcryptjs
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build


# Сцена 2: Извршување на апликацијата (продукциски имиџ)
FROM node:20-alpine AS runner
WORKDIR /app

# 2. Истите библиотеки мора да ги има и тука за да работат runtime командите како db push/seed
RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start"]