import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SiteHeader from "@/app/_components/SiteHeader";
import SiteFooter from "@/app/_components/SiteFooter";

export default async function HomePage() {
  const latestPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: { id: true, title: true, publishedAt: true },
  });

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* ヒーロー */}
        <section className="border-b border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-5xl px-6 py-28">
            <p className="text-sm font-medium tracking-widest text-gray-400">
              MARKETING SOLUTIONS
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              貴社のマーケティング課題を、
              <br />
              FULLSAIL が解決します。
            </h1>
            <p className="mt-6 max-w-xl text-gray-600">
              マーケティングコンサルティングから、ロング CPE 広告・ASO・インフルエンサー施策まで。
              成果につながるソリューションを提供します。
            </p>
            <Link
              href="#"
              className="mt-8 inline-block rounded-full bg-gray-900 px-6 py-3 text-sm text-white transition-colors hover:bg-gray-700"
            >
              お問い合わせ
            </Link>
          </div>
        </section>

        {/* 最新のお知らせ */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-wide text-gray-900">
                Information
              </h2>
              <p className="mt-1 text-sm text-gray-500">お知らせ</p>
            </div>
            <Link
              href="/information"
              className="text-sm text-gray-500 underline underline-offset-4 hover:text-gray-900"
            >
              一覧を見る →
            </Link>
          </div>

          {latestPosts.length === 0 ? (
            <p className="text-gray-500">お知らせはまだありません。</p>
          ) : (
            <ul className="divide-y divide-gray-200 border-t border-gray-200">
              {latestPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/posts/${post.id}`}
                    className="flex flex-col gap-1 py-5 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:gap-6"
                  >
                    <time className="text-xs tracking-wider text-gray-400 sm:w-28 sm:shrink-0">
                      {post.publishedAt?.toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </time>
                    <span className="font-medium text-gray-900">
                      {post.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
