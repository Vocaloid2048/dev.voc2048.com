/**
 * 登出 API — 清除認證 Cookie。
 * Logout API — clears auth cookie.
 */
import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ success: true });
}
