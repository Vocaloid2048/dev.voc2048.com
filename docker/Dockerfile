FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npx prisma generate
RUN npm run build

# ===== Runtime =====
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 安裝 postgresql-client (pg_dump, psql 用於備份復原)
RUN apk add --no-cache postgresql16-client tar

# 複製 standalone 輸出
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# 自訂 HTTPS server
COPY --from=builder /app/server.js ./server.js

# 上傳與備份目錄
RUN mkdir -p /app/uploads /app/backups
VOLUME ["/app/uploads", "/app/backups"]

# SSL 憑證目錄 (唯讀掛載)
# docker-compose 中透過 volumes 掛載 ./cert:/app/cert:ro

EXPOSE 3000 8443

# 啟動: 自訂 server.js (同時監聽 HTTP + HTTPS)
CMD ["node", "server.js"]
