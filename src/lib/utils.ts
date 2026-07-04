/**
 * 通用工具函數。
 * General utility functions.
 */

/**
 * 格式化檔案大小。
 * Formats file size to human-readable string.
 * @param bytes - 位元組數 / Byte count.
 * @returns 格式化後的字串 / Formatted string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/**
 * 生成 URL slug。
 * Generates a URL-friendly slug from a string.
 * @param text - 原始文字 / Original text.
 * @returns slug 字串 / slug string.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * 生成 UUID 檔名。
 * Generates a UUID-based filename.
 * @param originalName - 原始檔名 / Original filename.
 * @returns UUID 檔名 / UUID filename.
 */
export function generateStoredName(originalName: string): string {
  const ext = originalName.split(".").pop() || "";
  const uuid = crypto.randomUUID();
  return ext ? `${uuid}.${ext}` : uuid;
}

/**
 * 取得客戶端 IP。
 * Gets the client IP from request headers.
 * @param headers - 請求標頭 / Request headers.
 * @returns IP 位址 / IP address.
 */
export function getClientIP(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

/**
 * 允許的 MIME 類型。
 * Allowed MIME types for file upload.
 */
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
  "application/zip",
];

/**
 * 最大上傳大小 (10MB)。
 * Maximum upload size (10MB).
 */
export const MAX_UPLOAD_SIZE = parseInt(
  process.env.MAX_UPLOAD_SIZE || "10485760",
  10
);
