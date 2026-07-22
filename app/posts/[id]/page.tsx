import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SiteHeader from "@/app/_components/SiteHeader";
import SiteFooter from "@/app/_components/SiteFooter";

async function getPost(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post || !post.published) return { title: "お知らせ" };
  return { title: post.title };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post || !post.published) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#121212] text-white">
        <div className="mx-auto w-full max-w-3xl px-6 py-16">
          <Link
            href="/information"
            className="text-sm text-gray-400 underline underline-offset-4 hover:text-[#26bcdb]"
          >
            ← Information に戻る
          </Link>

          <article className="mt-8">
            <time className="text-xs tracking-wider text-gray-500">
              {post.publishedAt?.toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </time>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-white">
              {post.title}
            </h1>
            <p className="mt-3 text-sm text-gray-500">{post.author.name}</p>

            <div className="mt-10 whitespace-pre-wrap leading-relaxed text-gray-300">
              {post.body}
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
