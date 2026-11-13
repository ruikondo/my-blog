"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { verifyTurnstile } from "@/lib/turnstile";

export type ContactState = {
  ok: boolean;
  error: string | null;
};

// 公開のお問い合わせフォーム送信(ログイン不要。Turnstile でロボット判定)。useActionState から呼ぶ。
export async function submitInquiry(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!company || !email || !message) {
    return { ok: false, error: "すべての項目を入力してください。" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "メールアドレスの形式が正しくありません。" };
  }

  // ロボット判定(Cloudflare Turnstile)。入力チェックの後、DB保存の前に検証する
  const token = String(formData.get("cf-turnstile-response") ?? "");
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!(await verifyTurnstile(token, ip))) {
    return {
      ok: false,
      error: "ロボットではないことの確認ができませんでした。もう一度お試しください。",
    };
  }

  await prisma.inquiry.create({ data: { company, email, message } });
  revalidatePath("/admin/inquiries");

  return { ok: true, error: null };
}
