/**
 * Next.js 中間件 — 處理 i18n 路由與管理後台認證。
 * Next.js middleware — handles i18n routing and admin authentication.
 */
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 先處理 i18n
  const intlResponse = intlMiddleware(request);

  // 檢查是否為 admin 路由 (排除 login 頁面)
  const isAdminRoute =
    pathname.includes("/admin") && !pathname.includes("/admin/login");

  if (isAdminRoute) {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      const locale = pathname.split("/")[1] || "zh-TW";
      const loginUrl = new URL(
        `/${locale}/admin/login`,
        request.url
      );
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlResponse;
}

export const config = {
  // 排除 API 路由、靜態檔案、_next
  matcher: ["/((?!api|_next|uploads|.*\\..*).*)"],
};
