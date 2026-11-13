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
