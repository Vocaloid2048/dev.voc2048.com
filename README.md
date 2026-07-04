# 夜芷冰的星空夜談 (Night Zhi Bing's Starry Sky Night Talk)

> 變量為何要羨慕常數？讓冷冰冰的軟體，跳出窩心的溫度。

一個極簡主義個人網站，靈感來自 [Shiro](https://github.com/Innei/Shiro)。

## 技術棧

- **框架**: Next.js 15 (App Router, 全棧)
- **語言**: TypeScript 5
- **資料庫**: PostgreSQL 16 + Prisma 6
- **樣式**: TailwindCSS v4 + DaisyUI v5
- **動畫**: Motion (Framer Motion) + Canvas 櫻花粒子
- **i18n**: next-intl (繁中 + 英文)
- **部署**: Docker (單容器全棧)

## 快速開始

### 本地開發

```bash
# 1. 安裝依賴
npm install --legacy-peer-deps

# 2. 複製環境變數
cp .env.example .env
# 編輯 .env 設定 DATABASE_URL 和 JWT_SECRET

# 3. 生成 Prisma 客戶端
npx prisma generate

# 4. 執行資料庫遷移
npx prisma db push

# 5. 種子資料
npx tsx prisma/seed.ts

# 6. 啟動開發伺服器
npm run dev
```

### Docker 部署

```bash
# 1. 建立環境變數
export DB_PASSWORD=your-db-password
export JWT_SECRET=your-jwt-secret

# 2. 放置 SSL 憑證
mkdir -p cert
cp /path/to/fullchain.pem cert/
cp /path/to/privkey.pem cert/

# 3. 啟動
cd docker
docker compose up -d

# 4. 執行資料庫遷移
docker exec nightstar-app npx prisma db push
docker exec nightstar-app npx tsx prisma/seed.ts
```

## 預設管理員帳號

- 用戶名: `admin`
- 密碼: `admin123`
- **請於首次登入後立即修改密碼**

## 功能

### 前端
- 首頁: Hero + 引言 + 置頂作品
- 隨筆: 日記/長文/好句子統一展示，篩選 + 搜尋
- 作品: 卡片式網格展示
- 關於: 個人簡介、技能棧、聯繫方式
- 明暗雙主題切換
- 繁中/英文切換
- 櫻花飄落動畫
- Spring 物理動畫

### 後台
- JWT 認證 (帳號密碼)
- 儀表盤: PV 趨勢、訪客 IP、世界熱力圖、系統日誌
- 筆記管理: Markdown 編輯器 CRUD
- 作品管理: CRUD + 封面上傳
- 檔案管理: 圖片/檔案上傳
- 系統設置: 背景圖、櫻花開關
- 備份管理: 每日自動備份 (14天保留)、手動備份、復原

### 備份系統
- 每日 03:00 (UTC+8) 自動備份 PostgreSQL + uploads
- 保留最近 14 天
- 後台一鍵復原

## 授權

GPL v3 (跟隨 Shiro 原始授權)

內容版權: CC BY-NC-ND 4.0
