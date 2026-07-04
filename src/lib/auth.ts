/**
 * 認證工具 — JWT 生成/驗證、密碼雜湊。
 * Auth utilities — JWT generation/verification, password hashing.
 */
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const TOKEN_COOKIE = "auth-token";
const TOKEN_EXPIRY = "7d";

/**
 * 雜湊密碼。
 * Hashes a plain-text password.
 * @param password - 明文密碼 / Plain-text password.
 * @returns bcrypt 雜湊 / bcrypt hash.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * 驗證密碼。
 * Verifies a password against its hash.
 * @param password - 明文密碼 / Plain-text password.
 * @param hash - bcrypt 雜湊 / bcrypt hash.
 * @returns 是否匹配 / Whether it matches.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * 生成 JWT。
 * Generates a JWT token for a user.
 * @param payload - 用戶資訊 / User payload.
 * @returns JWT 字串 / JWT string.
 */
export function generateToken(payload: {
  userId: string;
  username: string;
  role: string;
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * 驗證 JWT。
 * Verifies a JWT token.
 * @param token - JWT 字串 / JWT string.
 * @returns 解碼後的 payload 或 null / Decoded payload or null.
 */
export function verifyToken(token: string): {
  userId: string;
  username: string;
  role: string;
} | null {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string;
      username: string;
      role: string;
    };
  } catch {
    return null;
  }
}

/**
 * 從 Cookie 中取得當前認證用戶。
 * Gets the current authenticated user from the cookie.
 * @returns 用戶 payload 或 null / User payload or null.
 */
export async function getAuthUser(): Promise<{
  userId: string;
  username: string;
  role: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * 設定認證 Cookie。
 * Sets the authentication cookie.
 * @param token - JWT 字串 / JWT string.
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * 清除認證 Cookie。
 * Clears the authentication cookie.
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
}
