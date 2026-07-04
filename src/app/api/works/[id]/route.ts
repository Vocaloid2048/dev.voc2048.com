/**
 * 單筆作品 API — GET / PUT / DELETE。
 * Single work API — GET (public) / PUT (auth) / DELETE (auth).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/** GET /api/works/[id] — 取得單筆作品。 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const work = await prisma.work.findUnique({ where: { id } });

  if (!work) {
    return NextResponse.json({ error: "作品不存在" }, { status: 404 });
  }

  return NextResponse.json(work);
}

/** PUT /api/works/[id] — 更新作品（需認證）。 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const work = await prisma.work.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      content: body.content || null,
      coverImage: body.coverImage || null,
      demoUrl: body.demoUrl || null,
      repoUrl: body.repoUrl || null,
      tags: body.tags || [],
      isPinned: body.isPinned ?? false,
      isPublished: body.isPublished ?? true,
      sortOrder: body.sortOrder ?? 0,
    },
  });

  return NextResponse.json(work);
}

/** DELETE /api/works/[id] — 刪除作品（需認證）。 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.work.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
