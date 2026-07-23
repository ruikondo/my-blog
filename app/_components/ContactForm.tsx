"use client";

import { useActionState } from "react";
import { submitInquiry, type ContactState } from "./contact-actions";

const initialState: ContactState = { ok: false, error: null };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitInquiry,
    initialState,
  );

  if (state.ok) {
    return (
      <div className="rounded border border-[#26bcdb]/40 bg-[#26bcdb]/10 p-6 text-center">
        <p className="font-semibold text-[#26bcdb]">
          お問い合わせを送信しました。
        </p>
        <p className="mt-2 text-sm text-gray-400">
          内容を確認のうえ、担当者よりご連絡いたします。
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <p className="rounded border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-300">
          {state.error}
        </p>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="company" className="text-sm text-gray-300">
          会社名
        </label>
        <input
          id="company"
          name="company"
          required
          className="rounded border border-white/15 bg-white/5 p-2 text-white placeholder-gray-500 focus:border-[#26bcdb] focus:outline-none"
          placeholder="株式会社〇〇"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm text-gray-300">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded border border-white/15 bg-white/5 p-2 text-white placeholder-gray-500 focus:border-[#26bcdb] focus:outline-none"
          placeholder="you@example.com"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm text-gray-300">
          お問い合わせ内容
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className="rounded border border-white/15 bg-white/5 p-2 text-white placeholder-gray-500 focus:border-[#26bcdb] focus:outline-none"
          placeholder="お問い合わせ内容をご記入ください。"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-[#26bcdb] px-6 py-3 text-sm font-medium text-[#0b1416] transition-colors hover:bg-[#1f90a6] disabled:opacity-60"
      >
        {pending ? "送信中…" : "送信する"}
      </button>
    </form>
  );
}
