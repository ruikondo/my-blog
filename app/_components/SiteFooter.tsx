export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-6 py-8 text-sm text-gray-500">
        <span className="font-bold text-gray-900">FULLSAIL, inc.</span>
        <span>貴社のマーケティング課題を解決します。</span>
        <span className="mt-2 text-xs">
          © {new Date().getFullYear()} FULLSAIL, inc.
        </span>
      </div>
    </footer>
  );
}
