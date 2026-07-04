/**
 * 分類 API — GET (公開) / POST (認證)。
 * Categories API — GET (public) / POST (auth).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { notes: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const { name, description } = await request.json();
  const category = await prisma.category.create({
    data: { name, description: description || null },
  });

  return NextResponse.json(category, { status: 201 });
}
