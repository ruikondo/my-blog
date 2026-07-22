import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isFixedPageSlug, fixedPageLabel } from "@/lib/pages";
import { updatePage } from "../actions";
import BackLink from "../../_components/BackLink";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isFixedPageSlug(slug)) notFound();

  const page = await prisma.page.findUnique({ where: { slug } });

  return (
    <div className="max-w-2xl">
      <BackLink href="/admin/pages" label="固定ページの管理に戻る" />
      <h1 className="mb-4 text-xl font-bold">
        固定ページの編集({fixedPageLabel(slug)})
      </h1>
      <form
        action={updatePage.bind(null, slug)}
        className="flex flex-col gap-4"
      >
        <input
          name="title"
          required
          defaultValue={page?.title ?? fixedPageLabel(slug)}
          placeholder="タイトル"
          className="rounded border p-2"
        />
        <textarea
          name="body"
          rows={16}
          defaultValue={page?.body ?? ""}
          placeholder="本文"
          className="rounded border p-2"
        />
        <button
          type="submit"
          className="self-start rounded bg-black px-4 py-2 text-white hover:opacity-80"
        >
          更新する
        </button>
      </form>
    </div>
  );
}
