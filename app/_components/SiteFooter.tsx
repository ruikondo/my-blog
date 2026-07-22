import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0e0e0e]">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-10 text-sm text-gray-400">
        <div className="flex items-center gap-3">
          <Image
            src="/fullsail-logo-white.png"
            alt="FULLSAIL"
            width={32}
            height={32}
            className="h-7 w-7 object-contain"
          />
          <span className="font-bold tracking-widest text-white">FULLSAIL, inc.</span>
        </div>
        <span>貴社のマーケティング課題を解決します。</span>
        <span className="mt-2 text-xs text-gray-500">
          © {new Date().getFullYear()} FULLSAIL, inc.
        </span>
      </div>
    </footer>
  );
}
