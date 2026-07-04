/**
 * 作品 API — GET (公開列表) / POST (認證新增)。
 * Works API — GET (public list) / POST (auth create).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const works = await prisma.work.findMany({
    where: { isPublished: true },
    orderBy: [{ isPinned: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(works);
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const body = await request.json();
  const work = await prisma.work.create({
    data: {
      title: body.title,
      description: body.description || "",
      content: body.content || null,
      coverImage: body.coverImage || null,
      demoUrl: body.demoUrl || null,
      repoUrl: body.repoUrl || null,
      tags: body.tags || [],
      isPinned: body.isPinned || false,
      isPublished: body.isPublished ?? true,
      sortOrder: body.sortOrder || 0,
      authorId: user.userId,
    },
  });

  return NextResponse.json(work, { status: 201 });
}
