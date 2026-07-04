/**
 * Assets 靜態檔案服務 — 從 assets 目錄讀取並回傳檔案。
 * Assets static file serving — reads and returns files from the assets directory.
 *
 * 用於服務 dashboard_image / login_image 等自訂背景圖。
 * Used for dashboard_image / login_image custom backgrounds.
 */
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ASSETS_DIR = path.resolve(process.cwd(), "assets");

/** MIME 類型對應。 */
const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
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

  const filePath = path.join(ASSETS_DIR, safePath);

  // 確認檔案在 ASSETS_DIR 內
  const resolvedFilePath = path.resolve(filePath);
  if (!resolvedFilePath.startsWith(ASSETS_DIR)) {
    return NextResponse.json({ error: "存取被拒" }, { status: 403 });
  }

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";

    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "檔案不存在" }, { status: 404 });
  }
}
