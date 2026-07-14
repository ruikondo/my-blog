import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });

  if (!post || !post.published) notFound();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link href="/" className="text-sm text-gray-500 underline">
        ← 一覧に戻る
      </Link>
      <h1 className="mt-4 text-3xl font-bold">{post.title}</h1>
      <p className="mt-2 text-sm text-gray-500">
        {post.author.name} · {post.publishedAt?.toLocaleDateString("ja-JP")}
      </p>
      <div className="mt-8 whitespace-pre-wrap leading-relaxed">
        {post.body}
      </div>
    </main>
  );
}
