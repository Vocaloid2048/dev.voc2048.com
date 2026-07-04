/**
 * 單一檔案 API — DELETE (認證刪除)。
 * Single file API — DELETE (auth).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { promises as fs } from "fs";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const { id } = await params;
  const file = await prisma.file.findUnique({ where: { id } });

  if (!file) {
    return NextResponse.json({ error: "檔案不存在" }, { status: 404 });
  }

  // 刪除實體檔案
  try {
    await fs.unlink(file.path);
  } catch {
    // 檔案可能已不存在，忽略錯誤
  }

  // 刪除資料庫記錄
  await prisma.file.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
