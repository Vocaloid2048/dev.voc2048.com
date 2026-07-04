/**
 * Next.js 中間件 — 處理 i18n 路由與管理後台認證。
 * Next.js middleware — handles i18n routing and admin authentication.
 *
 * next-intl v4: 使用 routing 直接作為 middleware 返回值。
 */
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // 排除 API 路由、靜態檔案、_next
  matcher: ["/((?!api|_next|uploads|.*\\..*).*)"],
};
