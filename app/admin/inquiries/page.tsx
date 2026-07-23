import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BackLink from "../_components/BackLink";

export default async function InquiriesPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") notFound();

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl">
      <BackLink href="/admin" label="ダッシュボードに戻る" />
      <h1 className="mb-4 text-xl font-bold">お問い合わせ一覧</h1>

      {inquiries.length === 0 ? (
        <p className="text-gray-500">お問い合わせはまだありません。</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {inquiries.map((inquiry) => (
            <li key={inquiry.id} className="rounded border p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-semibold">{inquiry.company}</span>
                <time className="text-gray-500">
                  {inquiry.createdAt.toLocaleString("ja-JP")}
                </time>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                <a
                  href={`mailto:${inquiry.email}`}
                  className="underline hover:text-gray-900"
                >
                  {inquiry.email}
                </a>
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                {inquiry.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
