"use client";

import { useActionState } from "react";
import { changeOwnPassword, type PasswordState } from "./actions";

const initialState: PasswordState = { ok: false, error: null };

const fields = [
  { name: "currentPassword", label: "現在のパスワード", autoComplete: "current-password" },
  { name: "newPassword", label: "新しいパスワード(8文字以上)", autoComplete: "new-password" },
  { name: "confirmPassword", label: "新しいパスワード(確認)", autoComplete: "new-password" },
];

export default function PasswordForm() {
  const [state, formAction, pending] = useActionState(
    changeOwnPassword,
    initialState,
  );

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-3">
      {state.error && (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded border border-green-300 bg-green-50 p-3 text-sm text-green-700">
          パスワードを変更しました。次回のログインから新しいパスワードを使用してください。
        </p>
      )}
      {fields.map((f) => (
        <div key={f.name} className="flex flex-col gap-1">
          <label htmlFor={f.name} className="text-sm">
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            type="password"
            required
            minLength={f.name === "currentPassword" ? undefined : 8}
            autoComplete={f.autoComplete}
            className="rounded border p-2"
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded bg-black px-4 py-2 text-white hover:opacity-80 disabled:opacity-60"
      >
        {pending ? "変更中…" : "変更する"}
      </button>
    </form>
  );
}
