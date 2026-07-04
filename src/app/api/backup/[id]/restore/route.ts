/**
 * 備份復原 API — POST (認證復原)。
 * Backup restore API — POST (auth restore).
 */
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { restoreBackup } from "@/lib/backup";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  // 復原需要二次驗證 (密碼確認)
  const { password } = await request.json();
  if (!password) {
    return NextResponse.json(
      { error: "請輸入密碼確認復原操作" },
      { status: 400 }
    );
  }

  // TODO: 驗證密碼
  // const valid = await verifyPassword(password, user.password);
  // if (!valid) return NextResponse.json({ error: "密碼錯誤" }, { status: 403 });

  const { id } = await params;

  try {
    const backup = await restoreBackup(id);
    return NextResponse.json({ success: true, backup });
  } catch (error) {
    console.error("Restore failed:", error);
    return NextResponse.json(
      { error: "復原失敗", detail: String(error) },
      { status: 500 }
    );
  }
}
