import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { togglePublish } from "./actions";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">記事一覧</h1>
        <Link
          href="/admin/posts/new"
          className="rounded bg-black px-4 py-2 text-sm text-white hover:opacity-80"
        >
          新規作成
        </Link>
      </div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">タイトル</th>
            <th className="p-2">著者</th>
            <th className="p-2">状態</th>
            <th className="p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b">
              <td className="p-2">
                <Link href={`/admin/posts/${post.id}`} className="underline">
                  {post.title}
                </Link>
              </td>
              <td className="p-2">{post.author.name}</td>
              <td className="p-2">
                {post.published ? (
                  <span className="text-green-600">公開中</span>
                ) : (
                  <span className="text-gray-500">下書き</span>
                )}
              </td>
              <td className="p-2">
                <form action={togglePublish.bind(null, post.id)}>
                  <button type="submit" className="rounded border px-3 py-1 hover:bg-gray-100">
                    {post.published ? "非公開にする" : "公開する"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                記事がまだありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
