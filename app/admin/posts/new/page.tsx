import { createPost } from "../actions";
import BackLink from "../../_components/BackLink";

export default function NewPostPage() {
  return (
    <div className="max-w-2xl">
      <BackLink href="/admin/posts" label="記事一覧に戻る" />
      <h1 className="mb-4 text-xl font-bold">記事の新規作成</h1>
      <form action={createPost} className="flex flex-col gap-4">
        <input
          name="title"
          required
          placeholder="タイトル"
          className="rounded border p-2"
        />
        <textarea
          name="body"
          rows={12}
          placeholder="本文"
          className="rounded border p-2"
        />
        <button
          type="submit"
          className="self-start rounded bg-black px-4 py-2 text-white hover:opacity-80"
        >
          下書きとして保存
        </button>
      </form>
    </div>
  );
}
