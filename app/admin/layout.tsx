import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <div>
      <header className="flex items-center justify-between border-b px-6 py-3">
        <span className="font-bold">ブログ管理画面</span>
        <div className="flex items-center gap-4 text-sm">
          <span>
            {session.user.name}(
            {(session.user as { role?: string }).role === "ADMIN"
              ? "管理者"
              : "編集者"}
            )
          </span>
          <form action={logout}>
            <button type="submit" className="rounded border px-3 py-1 hover:bg-gray-100">
              ログアウト
            </button>
          </form>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
