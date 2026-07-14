import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-8 text-3xl font-bold">My Blog</h1>
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <article key={post.id} className="border-b pb-4">
            <Link href={`/posts/${post.id}`}>
              <h2 className="text-xl font-semibold underline hover:no-underline">
                {post.title}
              </h2>
            </Link>
            <p className="mt-1 text-sm text-gray-500">
              {post.author.name} ·{" "}
              {post.publishedAt?.toLocaleDateString("ja-JP")}
            </p>
          </article>
        ))}
        {posts.length === 0 && (
          <p className="text-gray-500">公開されている記事はまだありません。</p>
        )}
      </div>
    </main>
  );
}
