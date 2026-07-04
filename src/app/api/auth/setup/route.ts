/**
 * 初始化設定 API — 首次建立管理員帳號與網站配置。
 * Setup API — creates the first admin account and site config.
 *
 * POST /api/auth/setup
 * 若已存在管理員帳號則返回 403。
 * Returns 403 if an admin account already exists.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // 檢查是否已有管理員帳號
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "系統已完成初始化設定" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      username,
      email,
      password,
      confirmPassword,
      avatar,
      siteName,
      siteSlogan,
      seoDescription,
      favicon,
    } = body;

    // 驗證必填欄位
    if (!username || !password) {
      return NextResponse.json(
        { error: "請填寫帳號和密碼" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "兩次密碼不一致" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "密碼至少需要 6 個字元" },
        { status: 400 }
      );
    }

    // 建立管理員帳號
    const hashedPassword = await hashPassword(password);
    const admin = await prisma.user.create({
      data: {
        username,
        email: email || null,
        password: hashedPassword,
        avatar: avatar || null,
        role: "ADMIN",
      },
    });

    // 寫入網站配置
    const configs: Array<{ key: string; value: string; description: string }> = [
      { key: "site.name", value: siteName || "夜芷冰的星空夜談", description: "網站名稱" },
      { key: "site.slogan", value: siteSlogan || "變量為何要羨慕常數？", description: "網站標語" },
      { key: "site.quote", value: "讓冷冰冰的軟體，跳出窩心的溫度", description: "首頁引言" },
      { key: "site.seo_description", value: seoDescription || "", description: "搜尋引擎描述" },
      { key: "site.favicon", value: favicon || "", description: "網站 Favicon URL" },
      { key: "effects.cherry_blossom", value: "true", description: "櫻花動畫開關" },
      { key: "effects.cherry_blossom_count", value: "30", description: "櫻花花瓣數量" },
    ];

    for (const config of configs) {
      await prisma.siteConfig.upsert({
        where: { key: config.key },
        update: { value: config.value },
        create: config,
      });
    }

    // 建立預設分類
    for (const name of ["日記", "長文", "好句子"]) {
      await prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }

    // 生成 JWT 並設定 Cookie
    const token = generateToken({
      userId: admin.id,
      username: admin.username,
      role: admin.role,
    });
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: { username: admin.username, role: admin.role },
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "初始化設定失敗" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/setup — 檢查是否需要初始化。
 * Checks whether setup is needed.
 */
export async function GET() {
  const adminCount = await prisma.user.count({
    where: { role: "ADMIN" },
  });

  return NextResponse.json({ needsSetup: adminCount === 0 });
}
