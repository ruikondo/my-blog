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
      <main className="flex-1 bg-[#121212] text-white">
        {/* ヒーロー */}
        <section className="relative overflow-hidden border-b border-white/10">
          {/* シアンのアクセントグロー */}
          <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#26bcdb]/20 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-6 py-32">
            <p className="text-sm font-medium tracking-[0.3em] text-[#26bcdb]">
              MARKETING SOLUTIONS
            </p>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl">
              貴社のマーケティング課題を、
              <br />
              FULLSAIL が解決します。
            </h1>
            <p className="mt-6 max-w-xl text-gray-400">
              マーケティングコンサルティングから、ロング CPE 広告・ASO・インフルエンサー施策まで。
              成果につながるソリューションを提供します。
            </p>
            <Link
              href="#"
              className="mt-9 inline-block rounded-full bg-[#26bcdb] px-6 py-3 text-sm font-medium text-[#0b1416] transition-colors hover:bg-[#1f90a6]"
            >
              お問い合わせ
            </Link>
          </div>
        </section>

        {/* 最新のお知らせ */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-wide text-white">
                Information
              </h2>
              <p className="mt-1 text-sm text-[#26bcdb]">お知らせ</p>
            </div>
            <Link
              href="/information"
              className="text-sm text-gray-400 underline underline-offset-4 hover:text-[#26bcdb]"
            >
              一覧を見る →
            </Link>
          </div>

          {latestPosts.length === 0 ? (
            <p className="text-gray-400">お知らせはまだありません。</p>
          ) : (
            <ul className="divide-y divide-white/10 border-t border-white/10">
              {latestPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/posts/${post.id}`}
                    className="flex flex-col gap-1 py-5 transition-colors hover:bg-white/5 sm:flex-row sm:items-center sm:gap-6"
                  >
                    <time className="text-xs tracking-wider text-gray-500 sm:w-28 sm:shrink-0">
                      {post.publishedAt?.toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </time>
                    <span className="font-medium text-white">
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
