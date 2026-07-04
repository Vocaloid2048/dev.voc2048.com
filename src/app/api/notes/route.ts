/**
 * 筆記 API — GET (公開列表) / POST (認證新增)。
 * Notes API — GET (public list) / POST (auth create).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || undefined;
  const category = searchParams.get("category") || undefined;
  const tags = searchParams.get("tags")?.split(",").filter(Boolean) || undefined;
  const mood = searchParams.get("mood") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const pinned = searchParams.get("pinned") === "true";

  const where: Record<string, unknown> = { isPublished: true };
  if (type) where.type = type;
  if (category) where.category = { name: category };
  if (mood) where.mood = mood;
  if (tags) where.tags = { some: { name: { in: tags } } };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }
  if (pinned) where.isPinned = true;

  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: { tags: true, category: true },
    }),
    prisma.note.count({ where }),
  ]);

  return NextResponse.json({
    notes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const body = await request.json();
  const slug = body.slug || generateSlug(body.title || `note-${Date.now()}`);

  const note = await prisma.note.create({
    data: {
      title: body.title || "",
      slug,
      content: body.content || "",
      excerpt: body.excerpt || null,
      coverImage: body.coverImage || null,
      type: body.type || "ARTICLE",
      mood: body.mood || null,
      categoryId: body.categoryId || null,
      isPinned: body.isPinned || false,
      isPublished: body.isPublished ?? true,
      authorId: user.userId,
      tags: body.tagIds
        ? { connect: body.tagIds.map((id: string) => ({ id })) }
        : undefined,
    },
    include: { tags: true, category: true },
  });

  return NextResponse.json(note, { status: 201 });
}
