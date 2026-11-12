"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export type PasswordState = {
  ok: boolean;
  error: string | null;
};

// ログイン中のユーザー自身のパスワードを変更する(EDITOR以上=全ロール)。
// 対象は常にセッションのユーザーIDで、フォームから他人のIDは受け取らない。
export async function changeOwnPassword(
  _prev: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const { userId } = await requireRole("EDITOR");
  if (!userId) return { ok: false, error: "ログイン情報を確認できません。" };

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!current || !next || !confirm) {
    return { ok: false, error: "すべての項目を入力してください。" };
  }
  if (next.length < 8) {
    return { ok: false, error: "新しいパスワードは8文字以上にしてください。" };
  }
  if (next !== confirm) {
    return { ok: false, error: "新しいパスワード(確認)が一致しません。" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, error: "ユーザーが見つかりません。" };

  const ok = await bcrypt.compare(current, user.passwordHash);
  if (!ok) return { ok: false, error: "現在のパスワードが正しくありません。" };

  if (await bcrypt.compare(next, user.passwordHash)) {
    return { ok: false, error: "現在と異なるパスワードを指定してください。" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await bcrypt.hash(next, 10) },
  });

  return { ok: true, error: null };
}
