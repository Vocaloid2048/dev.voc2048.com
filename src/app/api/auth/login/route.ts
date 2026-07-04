/**
 * 登入 API — 驗證帳號密碼，設定 JWT Cookie。
 * Login API — verifies credentials, sets JWT cookie.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "請輸入帳號和密碼" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "帳號或密碼錯誤" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "帳號或密碼錯誤" },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: { username: user.username, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "登入失敗" },
      { status: 500 }
    );
  }
}
