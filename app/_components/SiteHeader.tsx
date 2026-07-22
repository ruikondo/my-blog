import Link from "next/link";

// 公開側(FULLSAIL コーポレートサイト)の共通ヘッダー。
// Home / Information はこの予行演習の実装対象。Service / About / Contact は
// 今回のスコープ外なので当面はプレースホルダ(将来 固定ページとして実装予定)。
const navItems = [
  { label: "Home", href: "/" },
  { label: "Information", href: "/information" },
  { label: "Service", href: "#" },
  { label: "About", href: "#" },
] as const;

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-wide text-gray-900">
          FULLSAIL
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-600">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#"
            className="rounded-full bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-700"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
