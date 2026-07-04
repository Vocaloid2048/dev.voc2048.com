# 夜芷冰的星空夜談 — 實施計劃 (TODO)

> **項目根目錄:** `E:\hkust_repo\dev.voc2048.com\`
> **前端域名:** dev.voc2048.com | **後端域名:** ouob.voc2048.com
> **參考:** [Shiro](https://github.com/Innei/Shiro) · [Seria's site](https://www.seria.moe/)

---

## 技術棧

| 層級 | 技術 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router, 全棧) | 15.x |
| 語言 | TypeScript | 5.x |
| 資料庫 | PostgreSQL | 16 |
| ORM | Prisma | 6.x |
| 樣式 | TailwindCSS + DaisyUI | v4 + v5 |
| 狀態 | Jotai | 2.x |
| 動畫 | Motion (原 Framer Motion) + @tsparticles + @formkit/auto-animate | 12.x |
| i18n | next-intl | 4.x |
| Markdown | react-markdown + remark-gfm + rehype-highlight + rehype-sanitize | latest |
| 認證 | JWT + bcrypt + HttpOnly Cookie | — |
| 圖表 | recharts | 3.x |
| 地圖 | react-simple-maps + d3-geo | 3.x |
| 編輯器 | @uiw/react-md-editor | 4.x |
| 備份 | node-cron + pg_dump | — |
| 部署 | Docker (單容器全棧 + PostgreSQL 容器) | — |

---

## 頁面結構

```
src/app/[locale]/
├── layout.tsx                    # 全域佈局 (Header + Footer + 櫻花特效 + ThemeProvider)
├── page.tsx                      # 首頁
├── notes/
│   ├── page.tsx                  # 隨筆列表 (統一展示日記/長文/好句子)
│   └── [slug]/
│       └── page.tsx              # 文章詳情 (TOC + 閱讀進度條)
├── works/
│   └── page.tsx                  # 作品展示 (卡片式)
├── about/
│   └── page.tsx                  # 關於
└── admin/
    ├── layout.tsx                # 後台佈局 (側邊欄)
    ├── login/
    │   └── page.tsx              # 登入頁
    ├── page.tsx                  # 儀表盤 (流量/IP/熱力圖/日誌)
    ├── notes/
    │   ├── page.tsx              # 筆記管理列表
    │   └── [id]/
    │       └── page.tsx          # 編輯筆記 (Markdown 編輯器)
    ├── works/
    │   ├── page.tsx              # 作品管理列表
    │   └── [id]/
    │       └── page.tsx          # 編輯作品
    ├── files/
    │   └── page.tsx              # 檔案管理 (上傳/刪除)
    └── settings/
        └── page.tsx              # 網站設置 (背景圖/櫻花開關/備份管理)
```

### 頁面內容詳述

**首頁 (/)** — Hero + Quote + PinnedWorks + Footer
- Hero: 網站名稱「夜芷冰的星空夜談」+ 標語「變量為何要羨慕常數？」+ 簡短自我介紹
- 引言: **「讓冷冰冰的軟體，跳出窩心的溫度」**
- PinnedWorks: 橫向卡片展示置頂作品 (最多 3-5 個)
- Footer: CC BY-NC-ND 4.0 版權聲明 + 網站口號 (所有頁面共享)

**隨筆 (/notes)** — 統一內容流
- 三種內容類型混合展示: 日記 (DIARY) / 長文 (ARTICLE) / 好句子 (SENTENCE)
- 篩選器: 類別、標籤、心情
- 搜尋欄: 搜尋標題 + 內容 (僅此頁面)
- 文章詳情頁: 自動生成 TOC 側邊欄 + 頂部閱讀進度條 + 返回頂部浮動按鈕

**作品 (/works)** — 卡片式網格
- 響應式網格 (1/2/3 欄)
- 每張卡片: 封面圖 + 標題 + 簡述 + 技術棧標籤 + Demo/Repo 連結

**關於 (/about)** — 個人資訊
- 個人簡介、技能棧展示、聯繫方式

**後台 (/admin)** — 需登入
- 儀表盤: PV 趨勢折線圖 + 訪客 IP 列表 + 世界熱力圖 (仿 Cloudflare) + 系統日誌
- 內容管理: Markdown 編輯器創建/編輯筆記、作品
- 檔案管理: 圖片/檔案上傳與管理
- 系統設置: 背景圖上傳、櫻花特效開關、網站配置、**備份與復原管理**

---

## 配色方案

### 淺色主題 (nightstar-light)

| 變數 | 色值 | 用途 |
|------|------|------|
| `--color-primary` | #D99AA5 | 強調色 (灰粉色) |
| `--color-base-100` | #F2EFDF | 背景 (暖奶油) |
| `--color-base-200` | #F2E0DC | 次背景 (淺粉) |
| `--color-base-content` | #733232 | 主文字 (深棕紅) |
| `--color-accent` | #F2C2C2 | 高亮 (柔和粉) |

### 深色主題 (nightstar-dark)

| 變數 | 色值 | 用途 |
|------|------|------|
| `--color-primary` | #f2c1c3 | 強調色 (淺灰粉) |
| `--color-base-100` | #2a1f1f | 背景 (深棕黑) |
| `--color-base-200` | #231a1a | 次背景 (更深) |
| `--color-base-content` | #f2e0dc | 主文字 (淺粉) |
| `--color-accent` | #8a5560 | 高亮 (暗粉) |

### 背景紋理
- 預設: CSS SVG noise 微紋理 (opacity 0.03)
- 自訂: 後台可上傳背景圖片，存儲於 SiteConfig

### 導航列
- 藥丸型 (border-radius: 9999px)
- 霧化背景 (backdrop-filter: blur(12px) + semi-transparent)
- 語言切換 + 主題切換按鈕 (右上角，藥丸型)

---

## 資料庫 Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String   // bcrypt hash
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  notes     Note[]
  works     Work[]
  files     File[]
}

enum Role { ADMIN EDITOR }

model Note {
  id          String   @id @default(cuid())
  title       String                    // 長文必填，日記/好句子可選
  slug        String   @unique
  content     String                    // Markdown
  excerpt     String?                   // 摘要
  coverImage  String?
  type        NoteType @default(ARTICLE)
  mood        String?                   // 心情: happy/anxious/sad/calm...
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])
  tags        Tag[]    @relation("NoteTags")
  isPinned    Boolean  @default(false)
  isPublished Boolean  @default(true)
  viewCount   Int      @default(0)
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  publishedAt DateTime @default(now())

  @@index([slug, type, isPublished, createdAt])
}

enum NoteType { DIARY ARTICLE SENTENCE }

model Work {
  id          String   @id @default(cuid())
  title       String
  description String
  content     String?                  // Markdown 詳細描述
  coverImage  String?
  demoUrl     String?
  repoUrl     String?
  tags        String[]                 // ["React", "Next.js"]
  isPinned    Boolean  @default(false)
  isPublished Boolean  @default(true)
  sortOrder   Int      @default(0)
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([isPublished, sortOrder])
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  color String?
  notes Note[] @relation("NoteTags")
}

model Category {
  id          String  @id @default(cuid())
  name        String  @unique
  description String?
  notes       Note[]
}

model VisitLog {
  id        String   @id @default(cuid())
  ip        String
  userAgent String?
  path      String
  referer   String?
  country   String?
  city      String?
  lat       Float?
  lng       Float?
  timestamp DateTime @default(now())

  @@index([timestamp, ip, path])
}

model File {
  id         String   @id @default(cuid())
  filename   String                  // 原始檔名
  storedName String   @unique        // UUID 檔名
  mimeType   String
  size       Int
  url        String
  path       String
  width      Int?
  height     Int?
  uploaderId String
  uploader   User     @relation(fields: [uploaderId], references: [id])
  uploadedAt DateTime @default(now())
}

model SiteConfig {
  id          String   @id @default(cuid())
  key         String   @unique
  value       String                  // JSON string
  description String?
  updatedAt   DateTime @updatedAt
}

model Backup {
  id        String   @id @default(cuid())
  filename  String   @unique         // 備份檔名
  size      Int                       // 備份大小 (bytes)
  type      BackupType @default(FULL)
  status    BackupStatus @default(COMPLETED)
  dbDumpPath  String?                 // pg_dump 檔案路徑
  assetsPath  String?                 // uploads 壓縮檔路徑
  triggeredBy String                 // "cron" | "manual"
  createdAt   DateTime @default(now())

  @@index([createdAt, status])
}

enum BackupType { FULL PARTIAL }
enum BackupStatus { PENDING COMPLETED FAILED }
```

---

## API 路由

```
src/app/api/
├── auth/
│   ├── login/route.ts        POST   公開  登入
│   ├── logout/route.ts       POST   公開  登出
│   └── me/route.ts           GET    認證  當前用戶
├── notes/
│   ├── route.ts              GET(公開) / POST(認證)
│   └── [id]/route.ts         GET(公開) / PUT(認證) / DELETE(認證)
├── works/
│   ├── route.ts              GET(公開) / POST(認證)
│   └── [id]/route.ts         GET(公開) / PUT(認證) / DELETE(認證)
├── tags/route.ts             GET(公開) / POST(認證)
├── categories/route.ts       GET(公開) / POST(認證)
├── upload/
│   ├── route.ts              POST(認證) / GET(認證)
│   └── [id]/route.ts         DELETE(認證)
├── stats/route.ts            GET(認證) PV/UV 趨勢
├── visit-logs/
│   ├── route.ts              POST(公開) / GET(認證)
│   └── map/route.ts          GET(認證) 地理分布
├── config/
│   ├── route.ts              GET(公開) / PUT(認證)
│   └── all/route.ts          GET(認證)
└── backup/
    ├── run/route.ts          POST(認證) 手動觸發備份
    ├── list/route.ts         GET(認證) 列出所有備份
    ├── [id]/
    │   ├── restore/route.ts  POST(認證) 復原指定備份
    │   └── route.ts          DELETE(認證) 刪除指定備份
    └── download/route.ts     GET(認證) 下載備份檔案
```

**GET /api/notes 查詢參數:**
```
?type=DIARY|ARTICLE|SENTENCE
&category=xxx&tags=tag1,tag2&mood=happy
&search=keyword&page=1&limit=10
&sort=createdAt&order=desc&pinned=true
```

---

## 櫻花飄落動畫

**技術方案:** 優先使用 `@tsparticles/react` + `@tsparticles/slim`，自訂花瓣形狀粒子。

**實現要點:**
- 花瓣從頂部生成，緩慢下落 + 左右搖擺 (sin 波)
- 數量: 桌面 30-40 片，手機 15 片
- 主題適配: 淺色主題用 #F2C2C2 粉色花瓣，深色主題用 #f2c1c3 半透明花瓣
- 尊重 `prefers-reduced-motion`: 若用戶設定減少動畫則不啟動
- 後台 SiteConfig 可開關 + 調整數量
- 備選方案: 若 tsparticles 過重，改用自建 Canvas 粒子系統

---

## 備份與復原系統

### 每日自動備份
- **頻率:** 每日凌晨 03:00 (UTC+8) 自動執行 (node-cron)
- **備份內容:**
  1. PostgreSQL 資料庫 (`pg_dump` 完整備份)
  2. `uploads/` 目錄 (tar.gz 壓縮)
- **保留策略:** 最近 14 天，超過自動刪除
- **存儲位置:** `/app/backups/YYYY-MM-DD/`
- **記錄:** 每次備份記錄至 `Backup` 表 (檔名、大小、狀態、觸發方式)

### 備份復原
- **後台介面:** `/admin/settings` → 備份管理區塊
- **功能:**
  1. 列出所有可用備份 (日期、大小、類型、狀態)
  2. 一鍵復原指定日期的備份
  3. 復原前需二次確認 (確認對話框)
  4. 復原過程: 停止寫入 → 恢復 DB (pg_restore) → 恢復 uploads → 驗證
- **安全:** 復原操作僅限 ADMIN 角色，需再次輸入密碼確認
- **API:**
  - `POST /api/backup/run` — 手動觸發備份
  - `GET /api/backup/list` — 列出所有備份
  - `POST /api/backup/[id]/restore` — 復原指定備份
  - `DELETE /api/backup/[id]` — 刪除指定備份
  - `GET /api/backup/download` — 下載備份檔案

---

## Docker 部署

### 架構: app 容器 (Next.js 全棧) + db 容器 (PostgreSQL)

### `docker/Dockerfile`
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# 自訂 HTTPS server
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/cert ./cert

# 上傳與備份目錄
RUN mkdir -p /app/uploads /app/backups
VOLUME ["/app/uploads", "/app/backups"]

EXPOSE 3000 8443
CMD ["node", "server.js"]
```

### `docker/docker-compose.yml`
```yaml
services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    container_name: nightstar-app
    ports:
      - "3000:3000"    # HTTP (重定向到 HTTPS)
      - "8443:8443"    # HTTPS
    environment:
      - DATABASE_URL=postgresql://nightstar:${DB_PASSWORD}@db:5432/nightstar
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
      - SSL_CERT_PATH=/app/cert/fullchain.pem
      - SSL_KEY_PATH=/app/cert/privkey.pem
      - UPLOAD_DIR=/app/uploads
      - BACKUP_DIR=/app/backups
    volumes:
      - ../uploads:/app/uploads
      - ../backups:/app/backups
      - ../cert:/app/cert:ro
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    container_name: nightstar-db
    environment:
      - POSTGRES_USER=nightstar
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=nightstar
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nightstar"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:
```

### HTTPS 自訂 Server (`server.js`)
```javascript
const { createServer } = require('https');
const { parse } = require('url');
const fs = require('fs');
const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // HTTPS server (主)
  const httpsOptions = {
    cert: fs.readFileSync(process.env.SSL_CERT_PATH || './cert/fullchain.pem'),
    key: fs.readFileSync(process.env.SSL_KEY_PATH || './cert/privkey.pem'),
  };
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(8443);

  // HTTP server (重定向到 HTTPS)
  require('http').createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  }).listen(3000);
});
```

---

## 檔案儲存

- 上傳目錄: `/app/uploads/` (Docker volume 掛載)
- 訪問路徑: `/uploads/[storedName]`
- 支援圖片 (jpg/png/webp/gif/svg) 和任意檔案
- 檔案記錄存入 File 表，含 UUID 檔名、MIME、尺寸等
- 限制: 預設 10MB

---

## 認證方案

- **方式:** 帳號密碼 → JWT (7天過期) → HttpOnly Cookie
- **密碼加密:** bcrypt (10 rounds)
- **中間件:** `middleware.ts` 攔截 `/admin/*` (排除 `/admin/login`)，驗證 JWT
- **API 保護:** Route Handler 中透過 `verifyAuth()` 檢查 JWT

---

## i18n 配置

- `next-intl` App Router 模式
- 語言: `zh-TW` (預設) + `en`
- 路由前綴: `/zh-TW/notes`, `/en/notes`
- 語言切換: 藥丸型按鈕，右上角
- 翻譯文件: `src/i18n/messages/zh-TW.json` + `src/i18n/messages/en.json`

---

## 實施階段

### Phase 1: 前端 MVP (核心頁面 + 基礎功能)

- [ ] 1.1 專案初始化: Next.js 15 + TypeScript + TailwindCSS v4 + DaisyUI v5 + ESLint
- [ ] 1.2 Prisma Schema 編寫 + 資料庫遷移 + 種子資料
- [ ] 1.3 next-intl 國際化配置 + 翻譯文件 (zh-TW + en)
- [ ] 1.4 自訂 DaisyUI 主題 (nightstar-light / nightstar-dark) + 主題切換
- [ ] 1.5 全域佈局: Header (藥丸型霧化導航) + Footer + 櫻花動畫
- [ ] 1.6 首頁: Hero + 引言 + PinnedWorks
- [ ] 1.7 隨筆頁: 列表 + 篩選 + 搜尋 + 文章詳情 (TOC + 進度條 + Markdown 渲染)
- [ ] 1.8 作品頁: 卡片網格
- [ ] 1.9 關於頁: 個人簡介 + 技能 + 聯繫
- [ ] 1.10 返回頂部按鈕 + Spring 動畫

### Phase 2: 後台管理系統

- [ ] 2.1 認證系統: JWT + 登入頁 + middleware 保護
- [ ] 2.2 後台佈局: 側邊欄 + 頂部導航
- [ ] 2.3 儀表盤: PV 折線圖 (recharts) + IP 列表 + 系統日誌
- [ ] 2.4 世界熱力圖: react-simple-maps + VisitLog 地理數據
- [ ] 2.5 筆記管理: 列表 + Markdown 編輯器 + CRUD
- [ ] 2.6 作品管理: 列表 + CRUD + 封面上傳
- [ ] 2.7 檔案管理: 上傳 + 列表 + 刪除
- [ ] 2.8 系統設置: 背景圖上傳 + 櫻花開關 + 網站配置

### Phase 3: 備份與復原系統

- [ ] 3.1 Backup Prisma Model + 遷移
- [ ] 3.2 備份服務模組 (`src/lib/backup.ts`): pg_dump + uploads tar.gz
- [ ] 3.3 node-cron 定時任務: 每日凌晨 03:00 自動備份
- [ ] 3.4 14 天保留策略: 自動清理過期備份
- [ ] 3.5 復原服務模組: pg_restore + uploads 解壓
- [ ] 3.6 後台備份管理介面: 列表 + 復原 + 刪除 + 下載
- [ ] 3.7 復原安全驗證: 二次密碼確認

### Phase 4: 優化與打磨

- [ ] 4.1 Spring 動畫調優 (頁面切換、滾動、互動)
- [ ] 4.2 響應式適配 (手機/平板/大屏)
- [ ] 4.3 LightHouse 90+ 優化 (圖片懶載入、代碼分割、字體優化)
- [ ] 4.4 瀏覽器兼容測試 (Chrome/Firefox/Safari/Edge)
- [ ] 4.5 Docker 部署測試 + SSL 憑證配置
- [ ] 4.6 README 文檔

**未來規劃 (不在本次範圍):**
- WebSocket 即時通知 (發文後用戶自動收到)
- SEO 優化 (SSG/SSR、Meta、Sitemap)
- 多語言文章內容

---

## 環境變數

```env
# 資料庫
DATABASE_URL=postgresql://nightstar:password@localhost:5432/nightstar

# 認證
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# 網站
NEXT_PUBLIC_APP_URL=https://dev.voc2048.com
NEXT_PUBLIC_API_URL=https://ouob.voc2048.com

# SSL (Docker 部署用)
SSL_CERT_PATH=./cert/fullchain.pem
SSL_KEY_PATH=./cert/privkey.pem

# 檔案上傳
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=10485760  # 10MB

# 備份
BACKUP_DIR=./backups
BACKUP_RETENTION_DAYS=14
```

---

## 關鍵檔案清單

| 檔案路徑 | 用途 |
|---------|------|
| `src/app/[locale]/layout.tsx` | 全域佈局 |
| `src/app/[locale]/page.tsx` | 首頁 |
| `src/app/[locale]/notes/page.tsx` | 隨筆列表 |
| `src/app/[locale]/notes/[slug]/page.tsx` | 文章詳情 |
| `src/app/[locale]/works/page.tsx` | 作品頁 |
| `src/app/[locale]/about/page.tsx` | 關於頁 |
| `src/app/[locale]/admin/**` | 後台所有頁面 |
| `src/app/api/**` | 所有 API 路由 |
| `src/components/layout/Header.tsx` | 藥丸型導航列 |
| `src/components/layout/Footer.tsx` | 頁腳 |
| `src/components/effects/CherryBlossom.tsx` | 櫻花動畫 |
| `src/components/notes/MarkdownRenderer.tsx` | Markdown 渲染 |
| `src/components/notes/TableOfContents.tsx` | 自動目錄 |
| `src/lib/prisma.ts` | Prisma 客戶端 |
| `src/lib/auth.ts` | 認證工具 |
| `src/lib/backup.ts` | 備份復原服務 |
| `prisma/schema.prisma` | 資料庫 Schema |
| `middleware.ts` | i18n + 認證中間件 |
| `next.config.ts` | Next.js 配置 |
| `server.js` | HTTPS 自訂 Server |
| `docker/Dockerfile` | Docker 構建 |
| `docker/docker-compose.yml` | Docker Compose |
| `.env.example` | 環境變數範例 |
