import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FIXED_PAGES } from "@/lib/pages";
import BackLink from "../_components/BackLink";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany();
  const bySlug = new Map(pages.map((p) => [p.slug, p]));

  return (
    <div className="max-w-3xl">
      <BackLink href="/admin" label="ダッシュボードに戻る" />
      <h1 className="mb-4 text-xl font-bold">固定ページの管理</h1>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">ページ</th>
            <th className="p-2">タイトル</th>
            <th className="p-2">状態</th>
            <th className="p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {FIXED_PAGES.map((fixed) => {
            const page = bySlug.get(fixed.slug);
            return (
              <tr key={fixed.slug} className="border-b">
                <td className="p-2 font-medium">{fixed.label}</td>
                <td className="p-2">{page?.title ?? "—"}</td>
                <td className="p-2">
                  {page ? (
                    <span className="text-green-600">公開中</span>
                  ) : (
                    <span className="text-gray-500">未作成</span>
                  )}
                </td>
                <td className="p-2">
                  <Link
                    href={`/admin/pages/${fixed.slug}`}
                    className="underline"
                  >
                    編集
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
