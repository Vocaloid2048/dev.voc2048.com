/**
 * 單筆筆記 API — GET / PUT / DELETE。
 * Single note API — GET (public) / PUT (auth) / DELETE (auth).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/** GET /api/notes/[id] — 取得單筆筆記（依 ID 或 slug）。 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 嘗試以 ID 或 slug 查詢
  const note = await prisma.note.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
    include: { tags: true, category: true, author: { select: { username: true } } },
  });

  if (!note) {
    return NextResponse.json({ error: "筆記不存在" }, { status: 404 });
  }

  return NextResponse.json(note);
}

/** PUT /api/notes/[id] — 更新筆記（需認證）。 */
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

  const note = await prisma.note.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt || null,
      coverImage: body.coverImage || null,
      type: body.type,
      mood: body.mood || null,
      categoryId: body.categoryId || null,
      isPinned: body.isPinned ?? false,
      isPublished: body.isPublished ?? true,
      tags: body.tagIds
        ? { set: body.tagIds.map((tid: string) => ({ id: tid })) }
        : undefined,
    },
    include: { tags: true, category: true },
  });

  return NextResponse.json(note);
}

/** DELETE /api/notes/[id] — 刪除筆記（需認證）。 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.note.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
