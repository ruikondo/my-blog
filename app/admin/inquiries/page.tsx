import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BackLink from "../_components/BackLink";
import ConfirmSubmitButton from "../_components/ConfirmSubmitButton";
import { deleteInquiry } from "./actions";

const PER_PAGE = 20;

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") notFound();

  const params = await searchParams;
  const q = (params.q ?? "").trim();

  // 会社名・メールアドレス・内容の部分一致(大文字小文字は区別しない)
  const where: Prisma.InquiryWhereInput = q
    ? {
        OR: [
          { company: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { message: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const total = await prisma.inquiry.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  // 不正値や、削除で最終ページが無くなった場合は範囲内に丸める
  const requested = Number.parseInt(params.page ?? "1", 10);
  const page = Math.min(Math.max(Number.isNaN(requested) ? 1 : requested, 1), totalPages);

  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PER_PAGE,
    take: PER_PAGE,
  });

  const hrefFor = (p: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (p > 1) sp.set("page", String(p));
    const s = sp.toString();
    return `/admin/inquiries${s ? `?${s}` : ""}`;
  };

  const from = total === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, total);

  return (
    <div className="max-w-4xl">
      <BackLink href="/admin" label="ダッシュボードに戻る" />
      <h1 className="mb-4 text-xl font-bold">お問い合わせ一覧</h1>

      <form action="/admin/inquiries" method="get" className="mb-4 flex flex-wrap gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="会社名・メールアドレス・内容で検索"
          className="min-w-0 flex-1 rounded border p-2 text-sm"
        />
        <button type="submit" className="rounded bg-black px-4 py-2 text-sm text-white hover:opacity-80">
          検索
        </button>
        {q && (
          <Link href="/admin/inquiries" className="self-center text-sm text-gray-500 underline hover:text-gray-900">
            クリア
          </Link>
        )}
      </form>

      <p className="mb-3 text-sm text-gray-500">
        {q && <>「{q}」の検索結果: </>}
        全{total}件{total > 0 && <>中 {from}〜{to}件を表示</>}
      </p>

      {inquiries.length === 0 ? (
        <p className="text-gray-500">
          {q ? "該当するお問い合わせはありません。" : "お問い合わせはまだありません。"}
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {inquiries.map((inquiry) => (
            <li key={inquiry.id} className="rounded border p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-semibold">{inquiry.company}</span>
                <time className="text-gray-500">
                  {inquiry.createdAt.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
                </time>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                <a href={`mailto:${inquiry.email}`} className="underline hover:text-gray-900">
                  {inquiry.email}
                </a>
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                {inquiry.message}
              </p>
              <form action={deleteInquiry.bind(null, inquiry.id)} className="mt-3 text-right">
                <ConfirmSubmitButton
                  message={`「${inquiry.company}」からのお問い合わせを削除します。よろしいですか?`}
                  className="rounded border border-red-500 px-3 py-1 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  削除
                </ConfirmSubmitButton>
              </form>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav aria-label="ページ送り" className="mt-6 flex flex-wrap items-center justify-center gap-1 text-sm">
          <PageLink href={hrefFor(page - 1)} disabled={page <= 1}>
            ← 前へ
          </PageLink>
          {pageNumbers(page, totalPages).map((p, i) =>
            p === null ? (
              <span key={`gap-${i}`} className="px-2 text-gray-400">…</span>
            ) : (
              <PageLink key={p} href={hrefFor(p)} current={p === page}>
                {p}
              </PageLink>
            ),
          )}
          <PageLink href={hrefFor(page + 1)} disabled={page >= totalPages}>
            次へ →
          </PageLink>
        </nav>
      )}
    </div>
  );
}

function PageLink({
  href,
  children,
  current = false,
  disabled = false,
}: {
  href: string;
  children: React.ReactNode;
  current?: boolean;
  disabled?: boolean;
}) {
  const base = "min-w-9 rounded border px-3 py-1 text-center";
  if (disabled) return <span className={`${base} text-gray-300`}>{children}</span>;
  if (current)
    return (
      <span aria-current="page" className={`${base} border-black bg-black text-white`}>
        {children}
      </span>
    );
  return (
    <Link href={href} className={`${base} hover:bg-gray-100`}>
      {children}
    </Link>
  );
}

// 1 … 4 5 [6] 7 8 … 20 のようなページ番号列(null は省略記号)
function pageNumbers(current: number, total: number): (number | null)[] {
  const pages = new Set([1, total]);
  for (let p = current - 2; p <= current + 2; p++) if (p >= 1 && p <= total) pages.add(p);
  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push(null);
    result.push(p);
  });
  return result;
}
