/**
 * Next.js 中間件 — 處理 i18n 路由與後台認證。
 * Next.js middleware — handles i18n routing and dashboard authentication.
 *
 * 職責：
 * 1. next-intl i18n 路由
 * 2. /dashboard/* 認證保護（排除 login 和 setup）
 * 3. 未登入 → redirect /dashboard/login
 * 4. 無管理員帳號 → redirect /dashboard/setup
 */
import { NextRequest, NextResponse } from "next/server";

/** 不需要認證的後台路徑。 */
const PUBLIC_DASHBOARD_PATHS = ["/dashboard/login", "/dashboard/setup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ===== 後台認證保護 =====
  if (pathname.startsWith("/dashboard")) {
    const isPublic = PUBLIC_DASHBOARD_PATHS.some((p) => pathname.startsWith(p));

    if (!isPublic) {
      const token = request.cookies.get("auth-token")?.value;

      if (!token) {
        const loginUrl = new URL("/dashboard/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // ===== i18n 處理 =====
  // 根路徑不需要 locale 前綴（因為 localePrefix: "never"）
  // next-intl 會自動處理語言偵測

  return NextResponse.next();
}

export const config = {
  // 排除 API 路由、靜態檔案、_next
  matcher: ["/((?!api|_next|uploads|assets|.*\\..*).*)"],
};
