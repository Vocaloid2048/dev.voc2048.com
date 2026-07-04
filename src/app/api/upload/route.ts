/**
 * 檔案上傳 API — POST (認證上傳) / GET (認證列表)。
 * File upload API — POST (auth upload) / GET (auth list).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { generateStoredName, ALLOWED_MIME_TYPES, MAX_UPLOAD_SIZE } from "@/lib/utils";
import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "未提供檔案" }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `不支援的檔案類型: ${file.type}` },
      { status: 400 }
    );
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return NextResponse.json(
      { error: "檔案大小超過限制 (10MB)" },
      { status: 400 }
    );
  }

  const storedName = generateStoredName(file.name);
  const filePath = path.join(UPLOAD_DIR, storedName);

  // 確保目錄存在
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  // 寫入檔案
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  // 取得圖片尺寸 (若是圖片)
  let width: number | null = null;
  let height: number | null = null;

  // 記錄到資料庫
  const fileRecord = await prisma.file.create({
    data: {
      filename: file.name,
      storedName,
      mimeType: file.type,
      size: file.size,
      url: `/uploads/${storedName}`,
      path: filePath,
      width,
      height,
      uploaderId: user.userId,
    },
  });

  return NextResponse.json(fileRecord, { status: 201 });
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const files = await prisma.file.findMany({
    orderBy: { uploadedAt: "desc" },
    take: 100,
  });

  return NextResponse.json(files);
}
