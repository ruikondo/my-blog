import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isFixedPageSlug } from "@/lib/pages";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

// 固定ページ(Service / About)の公開表示。未作成・非固定 slug は 404。
export default async function FixedPageView({ slug }: { slug: string }) {
  if (!isFixedPageSlug(slug)) notFound();
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#121212] text-white">
        <div className="mx-auto w-full max-w-3xl px-6 py-16">
          <h1 className="text-3xl font-bold tracking-wide text-white">
            {page.title}
          </h1>
          <div className="mt-10 whitespace-pre-wrap leading-relaxed text-gray-300">
            {page.body}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
