/**
 * 標籤 API — GET (公開) / POST (認證)。
 * Tags API — GET (public) / POST (auth).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { notes: true } } },
  });
  return NextResponse.json(tags);
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const { name, color } = await request.json();
  const tag = await prisma.tag.create({
    data: { name, color: color || null },
  });

  return NextResponse.json(tag, { status: 201 });
}
