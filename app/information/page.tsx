import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SiteHeader from "@/app/_components/SiteHeader";
import SiteFooter from "@/app/_components/SiteFooter";

export const metadata: Metadata = {
  title: "Information",
  description: "FULLSAIL, inc. からのお知らせ一覧。",
};

// 本文から一覧用の抜粋を作る(サムネイル/抜粋フィールドは持たないため冒頭を切り出す)
function excerpt(body: string, length = 80) {
  const text = body.replace(/\s+/g, " ").trim();
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

export default async function InformationPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#121212] text-white">
        <div className="mx-auto w-full max-w-3xl px-6 py-16">
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-wide text-white">
              Information
            </h1>
            <p className="mt-2 text-sm text-[#26bcdb]">お知らせ</p>
          </div>

          {posts.length === 0 ? (
            <p className="text-gray-400">お知らせはまだありません。</p>
          ) : (
            <ul className="flex flex-col divide-y divide-white/10 border-t border-white/10">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/posts/${post.id}`}
                    className="group block py-6 transition-colors hover:bg-white/5"
                  >
                    <time className="text-xs tracking-wider text-gray-500">
                      {post.publishedAt?.toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </time>
                    <h2 className="mt-1 text-lg font-semibold text-white group-hover:text-[#26bcdb]">
                      {post.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-400">
                      {excerpt(post.body)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
