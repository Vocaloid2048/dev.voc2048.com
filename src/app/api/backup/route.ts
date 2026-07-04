/**
 * 備份 API — POST (認證手動觸發) / GET (認證列表)。
 * Backup API — POST (auth trigger) / GET (auth list).
 */
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { performBackup, listBackups } from "@/lib/backup";

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  try {
    const backup = await performBackup("manual");
    return NextResponse.json(backup, { status: 201 });
  } catch (error) {
    console.error("Backup failed:", error);
    return NextResponse.json(
      { error: "備份失敗", detail: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const backups = await listBackups();
  return NextResponse.json(backups);
}
