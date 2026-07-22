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
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <Link
          href="/information"
          className="text-sm text-gray-500 underline underline-offset-4 hover:text-gray-900"
        >
          ← Information に戻る
        </Link>

        <article className="mt-8">
          <time className="text-xs tracking-wider text-gray-400">
            {post.publishedAt?.toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </time>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-gray-900">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-gray-500">{post.author.name}</p>

          <div className="mt-10 whitespace-pre-wrap leading-relaxed text-gray-800">
            {post.body}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
