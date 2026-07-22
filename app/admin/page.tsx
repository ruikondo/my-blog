import Link from "next/link";
import { auth } from "@/auth";

export default async function AdminHomePage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <div>
      <h1 className="text-xl font-bold">ダッシュボード</h1>
      <ul className="mt-4 list-disc pl-5">
        <li>
          <Link href="/admin/posts" className="underline">
            記事の管理
          </Link>
        </li>
        <li>
          <Link href="/admin/pages" className="underline">
            固定ページの管理
          </Link>
        </li>
        {role === "ADMIN" && (
          <li>
            <Link href="/admin/users" className="underline">
              ユーザー管理
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
