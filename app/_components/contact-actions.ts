"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ContactState = {
  ok: boolean;
  error: string | null;
};

// 公開のお問い合わせフォーム送信(認証不要)。useActionState から呼ぶ。
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

  await prisma.inquiry.create({ data: { company, email, message } });
  revalidatePath("/admin/inquiries");

  return { ok: true, error: null };
}
