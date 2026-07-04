/**
 * 種子資料 — 初始化管理員帳號與基礎配置。
 * Seed data — initialize admin account and base configs.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 建立管理員帳號
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✓ 管理員帳號已建立:", admin.username);

  // 建立預設分類
  const categories = ["日記", "長文", "好句子"];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✓ 預設分類已建立");

  // 建立預設標籤
  const tags = ["測試", "開發", "生活"];
  for (const name of tags) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✓ 預設標籤已建立");

  // 建立網站配置
  const configs = [
    { key: "site.name", value: "夜芷冰的星空夜談", description: "網站名稱" },
    { key: "site.slogan", value: "變量為何要羨慕常數？", description: "網站標語" },
    { key: "site.quote", value: "讓冷冰冰的軟體，跳出窩心的溫度", description: "首頁引言" },
    { key: "site.background", value: "", description: "自訂背景圖 URL" },
    { key: "effects.cherry_blossom", value: "true", description: "櫻花動畫開關" },
    { key: "effects.cherry_blossom_count", value: "30", description: "櫻花花瓣數量" },
  ];
  for (const config of configs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }
  console.log("✓ 網站配置已建立");

  // 建立示範筆記
  const demoNote = await prisma.note.upsert({
    where: { slug: "hello-world" },
    update: {},
    create: {
      title: "Hello World",
      slug: "hello-world",
      content: "# Hello World\n\n這是第一篇文章。\n\n```typescript\nconsole.log('Hello, Starry Sky!');\n```\n\n歡迎來到**夜芷冰的星空夜談**。",
      excerpt: "歡迎來到夜芷冰的星空夜談",
      type: "ARTICLE",
      isPinned: true,
      authorId: admin.id,
    },
  });
  console.log("✓ 示範筆記已建立:", demoNote.slug);

  // 建立示範作品
  const demoWork = await prisma.work.upsert({
    where: { id: "demo-work" },
    update: {},
    create: {
      id: "demo-work",
      title: "夜芷冰的星空夜談",
      description: "一個極簡主義個人網站，如紙的純淨，似雪的清新。",
      content: "基於 Next.js 15 + TailwindCSS v4 + DaisyUI v5 構建。",
      tags: ["Next.js", "TypeScript", "TailwindCSS"],
      isPinned: true,
      sortOrder: 0,
      authorId: admin.id,
    },
  });
  console.log("✓ 示範作品已建立:", demoWork.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
