import BackLink from "../_components/BackLink";
import PasswordForm from "./PasswordForm";

// ログイン中のユーザー自身のパスワード変更(管理者・編集者とも利用可)。
// 未ログインは admin/layout.tsx で /login へ redirect される。
export default function PasswordPage() {
  return (
    <div className="max-w-3xl">
      <BackLink href="/admin" label="ダッシュボードに戻る" />
      <h1 className="mb-4 text-xl font-bold">パスワード変更</h1>
      <PasswordForm />
    </div>
  );
}
