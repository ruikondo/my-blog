"use client";

import { useFormStatus } from "react-dom";

// 送信前に確認ダイアログを出す submit ボタン(削除などの取り消せない操作用)。
// <form action={...}> の中に置いて使う。
export default function ConfirmSubmitButton({
  message,
  children,
  className,
  disabled = false,
}: {
  message: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={className}
    >
      {pending ? "処理中…" : children}
    </button>
  );
}
