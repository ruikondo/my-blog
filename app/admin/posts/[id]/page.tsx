import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePost, deletePost } from "../actions";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">記事の編集</h1>
      <form action={updatePost.bind(null, post.id)} className="flex flex-col gap-4">
        <input
          name="title"
          required
          defaultValue={post.title}
          className="rounded border p-2"
        />
        <textarea
          name="body"
          rows={12}
          defaultValue={post.body}
          className="rounded border p-2"
        />
        <button
          type="submit"
          className="self-start rounded bg-black px-4 py-2 text-white hover:opacity-80"
        >
          更新する
        </button>
      </form>
      <form action={deletePost.bind(null, post.id)} className="mt-8 border-t pt-4">
        <button type="submit" className="rounded border border-red-500 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
          この記事を削除
        </button>
      </form>
    </div>
  );
}
