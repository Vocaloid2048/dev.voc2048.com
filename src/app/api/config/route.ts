/**
 * 網站配置 API — GET (公開) / PUT (認證)。
 * Site config API — GET (public) / PUT (auth).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const configs = await prisma.siteConfig.findMany();
  const result: Record<string, string> = {};
  for (const config of configs) {
    result[config.key] = config.value;
  }
  return NextResponse.json(result);
}

export async function PUT(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const body = await request.json();

  for (const [key, value] of Object.entries(body)) {
    await prisma.siteConfig.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }

  return NextResponse.json({ success: true });
}
