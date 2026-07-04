/**
 * 上傳檔案服務 — 從 uploads 目錄讀取並回傳檔案。
 * Upload file serving — reads and returns files from the uploads directory.
 *
 * 支援圖片、PDF、文字等檔案類型，設定正確的 Content-Type。
 * Supports images, PDFs, text, etc. with correct Content-Type.
 */
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

/** MIME 類型對應。 */
const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".zip": "application/zip",
  ".json": "application/json",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  // 安全檢查：防止路徑穿越攻擊
  const safePath = segments
    .map((s) => path.basename(s))
    .join(path.sep);

  if (!safePath) {
    return NextResponse.json({ error: "無效路徑" }, { status: 400 });
  }

  const filePath = path.join(UPLOAD_DIR, safePath);

  // 確認檔案在 UPLOAD_DIR 內（防止路徑穿越）
  const resolvedUploadDir = path.resolve(UPLOAD_DIR);
  const resolvedFilePath = path.resolve(filePath);
  if (!resolvedFilePath.startsWith(resolvedUploadDir)) {
    return NextResponse.json({ error: "存取被拒" }, { status: 403 });
  }

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";

    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "檔案不存在" }, { status: 404 });
  }
}
