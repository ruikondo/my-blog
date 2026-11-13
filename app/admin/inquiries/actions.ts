"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

// お問い合わせの削除(ADMINのみ)
export async function deleteInquiry(id: string) {
  await requireRole("ADMIN");
  // 二重クリックなどで既に消えていてもエラーにしない
  await prisma.inquiry.deleteMany({ where: { id } });
  revalidatePath("/admin/inquiries");
}

// 1回の一括削除で受け付ける最大件数(1ページの表示件数より十分大きい値)
const BULK_DELETE_LIMIT = 100;

// チェックしたお問い合わせの一括削除(ADMINのみ)。フォームの ids[] を受け取る
export async function deleteInquiries(formData: FormData) {
  await requireRole("ADMIN");
  const ids = [
    ...new Set(formData.getAll("ids").map(String).filter(Boolean)),
  ];
  if (ids.length === 0) return;
  if (ids.length > BULK_DELETE_LIMIT) {
    throw new Error(`一度に削除できるのは${BULK_DELETE_LIMIT}件までです`);
  }

  await prisma.inquiry.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/inquiries");
}
