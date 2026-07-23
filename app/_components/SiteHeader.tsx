import Image from "next/image";
import Link from "next/link";

// full-sail.jp の配色(Neve テーマ)に準拠:
//   背景 #121212 / 文字 #ffffff / アクセント #26bcdb(補助 #1f90a6)
const navItems = [
  { label: "Home", href: "/" },
  { label: "Information", href: "/information" },
  { label: "Service", href: "/service" },
  { label: "About", href: "/about" },
] as const;

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#121212]/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/fullsail-logo-white.png"
            alt="FULLSAIL"
            width={40}
            height={40}
            priority
            className="h-9 w-9 object-contain"
          />
          <span className="text-lg font-bold tracking-widest text-white">
            FULLSAIL
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-300">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-[#26bcdb]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
