"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import type { Role } from "@prisma/client";

export async function createUser(formData: FormData) {
  await requireRole("ADMIN");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "EDITOR") as Role;

  if (!name || !email) throw new Error("名前とメールアドレスは必須です");
  if (password.length < 8) throw new Error("パスワードは8文字以上にしてください");

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: role === "ADMIN" ? "ADMIN" : "EDITOR",
    },
  });
  revalidatePath("/admin/users");
}

export async function deleteUser(id: string) {
  const { userId } = await requireRole("ADMIN");
  if (id === userId) throw new Error("自分自身は削除できません");

  const admins = await prisma.user.count({ where: { role: "ADMIN" } });
  const target = await prisma.user.findUniqueOrThrow({ where: { id } });
  if (target.role === "ADMIN" && admins <= 1) {
    throw new Error("最後の管理者は削除できません");
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
