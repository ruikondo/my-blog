import Link from "next/link";

// 管理画面共通の戻るリンク
export default function BackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="mb-4 inline-block text-sm text-gray-500 underline underline-offset-2 hover:text-gray-900"
    >
      ← {label}
    </Link>
  );
}
