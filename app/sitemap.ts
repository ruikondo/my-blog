import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site";
import { FIXED_PAGES } from "@/lib/pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  const [posts, pages] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.page.findMany({ select: { slug: true, updatedAt: true } }),
  ]);
  const pageBySlug = new Map(pages.map((p) => [p.slug, p]));

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: pageBySlug.get("home")?.updatedAt ?? new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/information`,
      lastModified: posts[0]?.publishedAt ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // 固定ページ(home はトップ "/" なので除外)。DB に存在するもののみ。
  for (const fixed of FIXED_PAGES) {
    if (fixed.slug === "home") continue;
    const page = pageBySlug.get(fixed.slug);
    if (page) {
      entries.push({
        url: `${base}/${fixed.slug}`,
        lastModified: page.updatedAt,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  // 公開記事
  for (const post of posts) {
    entries.push({
      url: `${base}/posts/${post.id}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
