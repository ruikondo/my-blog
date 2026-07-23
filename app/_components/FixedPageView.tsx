import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isFixedPageSlug } from "@/lib/pages";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import ContactForm from "./ContactForm";

// 固定ページ(Service / About)の公開表示。未作成・非固定 slug は 404。
// showContactForm が true のとき本文の下にお問い合わせフォームを表示。
export default async function FixedPageView({
  slug,
  showContactForm = false,
}: {
  slug: string;
  showContactForm?: boolean;
}) {
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

          {showContactForm && (
            <section className="mt-16 border-t border-white/10 pt-12">
              <h2 className="text-2xl font-bold tracking-wide text-white">
                Contact
              </h2>
              <p className="mt-1 mb-8 text-sm text-[#26bcdb]">お問い合わせ</p>
              <ContactForm />
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
