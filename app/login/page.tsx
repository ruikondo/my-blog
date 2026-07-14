import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/admin",
      });
    } catch (e) {
      if (e instanceof AuthError) {
        redirect("/login?error=1");
      }
      throw e;
    }
  }

  return (
    <main className="mx-auto mt-24 max-w-sm p-6">
      <h1 className="mb-6 text-2xl font-bold">管理画面ログイン</h1>
      {error && (
        <p className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
          メールアドレスまたはパスワードが違います
        </p>
      )}
      <form action={login} className="flex flex-col gap-4">
        <input
          name="email"
          type="email"
          required
          placeholder="メールアドレス"
          className="rounded border p-2"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="パスワード"
          className="rounded border p-2"
        />
        <button
          type="submit"
          className="rounded bg-black p-2 text-white hover:opacity-80"
        >
          ログイン
        </button>
      </form>
    </main>
  );
}
