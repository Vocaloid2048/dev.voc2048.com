# 🌸 夜芷冰的星空夜談 — AI Agent 開發規範 (SOP)

> **Identity & Role:** You are an expert full-stack TypeScript developer specializing in Next.js 15 (App Router), PostgreSQL, Prisma ORM, and TailwindCSS v4. You are building a minimalist personal website with a clean admin dashboard, inspired by [Shiro](https://github.com/Innei/Shiro) and [Seria's site](https://www.seria.moe/).

> **Project Root:** `E:\hkust_repo\dev.voc2048.com\`
> **Frontend Domain:** dev.voc2048.com
> **Backend Domain:** ouob.voc2048.com
> **Deployment:** Single-container Docker (Next.js full-stack + PostgreSQL container)

---

## 📌 1. Branching & Git Workflow

You must strictly follow this Git branch and commit strategy. **Never work directly on the production branch.**

### 🌿 Branch Naming & Merge Strategy

* **`main`:** 穩定生產版本 — 僅透過 PR 合併。
* **`dev`:** 開發中版本 — 功能分支合併至此。
* **`feat-<scope>`:** 功能開發分支 (e.g., `feat-home-page`, `feat-admin-dashboard`, `feat-backup-system`)。
* **`fix-<scope>`:** 修復分支 (e.g., `fix-theme-toggle`, `fix-prisma-query`)。

### 🔄 Merge Workflow (PR Logic)

`feat-xxx` → `dev` → `main`

### 🔄 Workflow Execution Loop

1. **Isolate:** Create a dedicated branch only when developing a complete, large-scale module. For minor tasks, stay on the current feature branch.
2. **Micro-Commits:** Within the feature branch, you MUST commit **every time a micro-feature, component, or logical unit is successfully completed**. 切忌一次過一個 git commit。
3. **Merge:** Follow the PR logic above to merge code into `dev`, and finally into `main`, only after thorough local compilation and confirmation.

### 📝 Commit Message Format

You must use **Conventional Commits** in **Traditional Chinese (繁體中文)**.

* *Format:* `<type>(<scope>): <description>`
* *Types:* `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`
* *Examples:*
  * `feat(home): 實作首頁 Hero 區域、引言與置頂作品卡片`
  * `feat(notes): 實作隨筆列表頁類別/標籤/心情篩選與標題搜尋`
  * `feat(admin): 實作儀表盤 PV 折線圖與訪客 IP 列表`
  * `feat(backup): 實作每日自動備份 PostgreSQL 與 uploads 目錄，保留 14 天`
  * `fix(theme): 修復深色模式切換時 DaisyUI 主題未正確套用的問題`
  * `docs(agent): 新增 Agent 開發規範與實施計劃文檔`

### 📦 Commit Scoping Rules

每個 git commit 必須對應一個明確的功能範圍。**禁止將多個不相關的功能混合在同一個 commit 中。** 範例：

| ✅ 正確 | ❌ 錯誤 |
|---------|---------|
| `feat(layout): 實作藥丸型霧化導航列` | `feat: 新增導航列、首頁、關於頁` |
| `feat(effects): 實作櫻花飄落 Canvas 動畫` | (混在同一 commit) |
| `feat(home): 實作首頁 Hero 與引言` | (混在同一 commit) |

---

## 📌 2. Code Architecture & Documentation Standards

### 🏗️ Architecture: Full-Stack Next.js (App Router)

```
src/
├── app/
│   ├── [locale]/           # 國際化路由段 (zh-TW / en)
│   │   ├── layout.tsx      # 全域佈局
│   │   ├── page.tsx        # 首頁
│   │   ├── notes/          # 隨筆頁
│   │   ├── works/          # 作品頁
│   │   ├── about/          # 關於頁
│   │   └── admin/          # 後台管理
│   └── api/                # API Route Handlers
├── components/             # React 組件
│   ├── layout/             # 佈局組件 (Header, Footer)
│   ├── effects/            # 特效組件 (櫻花動畫)
│   ├── notes/              # 隨筆相關組件
│   ├── works/              # 作品相關組件
│   ├── admin/              # 後台組件
│   └── ui/                 # 通用 UI 組件
├── lib/                    # 工具函數與服務
│   ├── prisma.ts           # Prisma 客戶端
│   ├── auth.ts             # 認證工具
│   ├── backup.ts           # 備份復原服務
│   └── utils.ts            # 通用工具
├── i18n/                   # 國際化配置
├── hooks/                  # 自訂 React Hooks
└── types/                  # TypeScript 型別定義
```

### 🌐 Language & Comments

* **語言:** 所有溝通、代碼註釋和文檔必須使用 **繁體中文 (Traditional Chinese)**。
* **JSDoc 要求:** 每個函數、組件和 API Route **必須**包含 JSDoc 註釋。
* *內容:* 清楚說明用途、`@param`、`@returns`。**除非高度複雜**，否則不需要解釋內部邏輯。
* *雙語要求:* 註釋需提供 **繁體中文 + English**。

```typescript
/**
 * 根據 slug 取得已發佈的筆記。
 * Retrieves a published note by its slug.
 *
 * @param slug - 筆記的唯一 URL 識別碼 / The unique URL identifier of the note.
 * @returns 筆記物件，若不存在則返回 null / The note object, or null if not found.
 */
async function getNoteBySlug(slug: string): Promise<Note | null> { ... }
```

### 📚 Documentation Requirements

對於每個新增或修改的功能，必須即時更新以下文件：

* `./docs/agent/todo.md`: 實施計劃與進度追蹤（完成項打勾）。
* `./README.md`: 高層級使用者指南、設定說明和當前功能狀態。
* `./docs/api/`: API 路由文檔（如有重大變更）。

---

## 📌 3. Design & Styling Standards

### 🎨 配色方案

網站使用自訂 DaisyUI 主題 `nightstar-light` 和 `nightstar-dark`：

**淺色主題:**
| 角色 | 色值 | 用途 |
|------|------|------|
| primary | `#D99AA5` | 強調色 (灰粉色) |
| base-100 | `#F2EFDF` | 背景 (暖奶油) |
| base-200 | `#F2E0DC` | 次背景 (淺粉) |
| base-content | `#733232` | 主文字 (深棕紅) |
| accent | `#F2C2C2` | 高亮 (柔和粉) |

**深色主題:**
| 角色 | 色值 | 用途 |
|------|------|------|
| primary | `#f2c1c3` | 強調色 (淺灰粉) |
| base-100 | `#2a1f1f` | 背景 (深棕黑) |
| base-200 | `#231a1a` | 次背景 (更深) |
| base-content | `#f2e0dc` | 主文字 (淺粉) |
| accent | `#8a5560` | 高亮 (暗粉) |

### 📐 設計參考

* **主要參考:** [Shiro](https://github.com/Innei/Shiro) — 極簡主義、Spring 動畫、藥丸型導航
* **CSS/樣式參考:** [Seria's site](https://www.seria.moe/) — 簡潔排版、留白運用、卡片設計
* **導航列:** 藥丸型 (`border-radius: 9999px`) + 霧化背景 (`backdrop-filter: blur(12px)`)
* **圓角風格:** 全站統一使用圓角設計，卡片 `rounded-2xl`，按鈕 `rounded-full`
* **背景:** CSS SVG noise 微紋理 (opacity 0.03)，後台可上傳自訂背景圖

### 🌸 櫻花動畫

* 優先使用現有動畫庫實作花瓣飄落效果。
* 推薦方案: `@tsparticles/react` + `@tsparticles/slim`，使用自訂花瓣形狀。
* 備選方案: 自建 Canvas 粒子系統（若 tsparticles 過重）。
* 花瓣從頂部生成，緩慢下落 + 左右搖擺 (sin 波)。
* 必須尊重 `prefers-reduced-motion`。
* 數量: 桌面 30-40 片，手機 15 片。
* 後台 SiteConfig 可開關 + 調整數量。

### ✨ 動畫庫使用準則

**核心原則: 如果有成熟的第三方庫能達到動畫效果，應優先使用，而非從零自建。**

| 動畫場景 | 推薦庫 | 說明 |
|---------|--------|------|
| 頁面切換 / UI 互動 | `motion` (原 Framer Motion) | Spring 物理動畫 |
| 列表動畫 | `@formkit/auto-animate` | 零配置列表過渡 |
| 花瓣/粒子特效 | `@tsparticles/react` + `@tsparticles/slim` | 粒子系統 |
| 滾動動畫 | `motion` 的 `useScroll` | 滾動觸發動畫 |
| 數字動畫 | `motion` 的 `animate()` | 數字遞增效果 |

---

## 📌 4. Backup & Restore Standards

### 💾 每日自動備份

* **頻率:** 每日凌晨 03:00 (UTC+8) 自動執行。
* **備份內容:**
  1. PostgreSQL 資料庫 (`pg_dump` 完整備份)
  2. `uploads/` 目錄 (所有上傳的圖片與檔案)
* **保留策略:** 最近 14 天的備份，超過 14 天的自動刪除。
* **存儲位置:** `/app/backups/YYYY-MM-DD/` 目錄。
* **實作方式:**
  * 後台 API Route `/api/backup/run` (需認證) 手動觸發
  * Docker cron job 或 Node.js `node-cron` 定時觸發
  * 備份完成後記錄至 `Backup` 表

### 🔄 備份復原

* **後台介面:** `/admin/settings` → 備份管理區塊
* **功能:**
  1. 列出所有可用備份 (日期、大小、類型)
  2. 一鍵復原指定日期的備份
  3. 復原前需二次確認 (確認對話框)
  4. 復原過程: 停止寫入 → 恢復 DB → 恢復 uploads → 重啟
* **安全:** 復原操作僅限 ADMIN 角色，需再次輸入密碼確認。

---

## 📌 5. AI Autonomy, Refactoring & Guardrails

### 🛠️ Refactoring Rules

* **禁止:** 你**不得**盲目重寫或大規模重構現有代碼庫。
* **協議:** 在任何重構之前，你必須向使用者輸出提案，說明：
  1. 當前代碼的確切問題。
  2. 變更的預估影響範圍 (blast radius)。
  3. 等待**明確批准**後才能修改檔案。

### 🧪 Compilation & Testing

* **Build Tool:** `npm run build` (Next.js production build)。
* **型別檢查:** `npx tsc --noEmit` 確保無型別錯誤。
* **Lint:** `npm run lint` 確保 ESLint 通過。
* **核心邏輯:** 任何確定性邏輯 (e.g., 備份保留策略、認證流程、分頁計算) 應有單元測試。

### 🚨 Infinite Loop Guardrail (Deadlock Prevention)

* 如果一個修復失敗或引入新錯誤，你有 **2 次重試機會**自主修復。
* 如果在第 **3 次嘗試 (第 2 次失敗重試)** 時問題仍然存在，你必須**立即停止所有操作**，必要時回滾破壞性變更，並向使用者輸出詳細錯誤報告，詢問是否繼續。

### ⚡ Performance Requirements

* **LightHouse:** 目標 Performance / Best Practice / Accessibility / SEO 均 **≥ 90**。
* **代碼風格:** 簡潔不累墜，避免過度抽象。
* **圖片優化:** 使用 Next.js `<Image>` 組件，支援 lazy loading。
* **代碼分割:** 動態載入重型組件 (e.g., Markdown 編輯器、圖表庫)。

---

## 📌 6. Security Standards

* **認證:** JWT (7天過期) + HttpOnly Cookie + bcrypt 密碼加密。
* **API 保護:** 所有 `/api/admin/*` 和寫入操作需驗證 JWT。
* **檔案上傳:** 限制 MIME 類型、檔案大小 (預設 10MB)、使用 UUID 檔名。
* **SQL 注入:** 使用 Prisma 參數化查詢，**禁止**拼接原始 SQL。
* **XSS:** Markdown 渲染使用 `rehype-sanitize` 過濾危險 HTML。
* **環境變數:** 敏感資訊 (JWT_SECRET, DB_PASSWORD) 僅存於 `.env`，**不得**寫入代碼或提交至 Git。

---

## 📌 7. Quick Reference — Tech Stack

| 層級 | 技術 |
|------|------|
| 框架 | Next.js 15 (App Router, 全棧) |
| 語言 | TypeScript 5 |
| 資料庫 | PostgreSQL 16 |
| ORM | Prisma 6 |
| 樣式 | TailwindCSS v4 + DaisyUI v5 |
| 狀態管理 | Jotai 2 |
| 動畫 | Motion 12 + @tsparticles + @formkit/auto-animate |
| i18n | next-intl 4 |
| Markdown | react-markdown + remark-gfm + rehype-highlight + rehype-sanitize |
| 認證 | JWT + bcrypt + HttpOnly Cookie |
| 圖表 | recharts 3 |
| 地圖 | react-simple-maps + d3-geo |
| 編輯器 | @uiw/react-md-editor 4 |
| 備份 | node-cron + pg_dump |
| 部署 | Docker (單容器) + docker-compose |
