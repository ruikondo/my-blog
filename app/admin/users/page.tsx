import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createUser, deleteUser } from "./actions";
import BackLink from "../_components/BackLink";

export default async function UsersPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") notFound();

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="max-w-3xl">
      <BackLink href="/admin" label="ダッシュボードに戻る" />
      <h1 className="mb-4 text-xl font-bold">ユーザー管理</h1>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">名前</th>
            <th className="p-2">メールアドレス</th>
            <th className="p-2">権限</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role === "ADMIN" ? "管理者" : "編集者"}</td>
              <td className="p-2 text-right">
                <form action={deleteUser.bind(null, user.id)}>
                  <button type="submit" className="rounded border border-red-500 px-3 py-1 text-red-600 hover:bg-red-50">
                    削除
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-10 mb-3 text-lg font-bold">ユーザーを追加</h2>
      <form action={createUser} className="flex max-w-md flex-col gap-3">
        <input name="name" required placeholder="名前" className="rounded border p-2" />
        <input name="email" type="email" required placeholder="メールアドレス" className="rounded border p-2" />
        <input name="password" type="password" required minLength={8} placeholder="パスワード(8文字以上)" className="rounded border p-2" />
        <select name="role" className="rounded border p-2">
          <option value="EDITOR">編集者</option>
          <option value="ADMIN">管理者</option>
        </select>
        <button type="submit" className="self-start rounded bg-black px-4 py-2 text-white hover:opacity-80">
          追加する
        </button>
      </form>
    </div>
  );
}
