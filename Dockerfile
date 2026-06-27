# Сцена 1: Градење на апликацијата
FROM node:20-alpine AS builder
WORKDIR /app

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

ENV NODE_ENV=production

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start"]