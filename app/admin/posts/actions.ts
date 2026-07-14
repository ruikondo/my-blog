"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export async function createPost(formData: FormData) {
  const { userId } = await requireRole("EDITOR");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  if (!title) throw new Error("タイトルは必須です");

  const post = await prisma.post.create({
    data: { title, body, authorId: userId },
  });
  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${post.id}`);
}

export async function updatePost(id: string, formData: FormData) {
  await requireRole("EDITOR");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  if (!title) throw new Error("タイトルは必須です");

  await prisma.post.update({ where: { id }, data: { title, body } });
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function togglePublish(id: string) {
  await requireRole("EDITOR");
  const post = await prisma.post.findUniqueOrThrow({ where: { id } });
  await prisma.post.update({
    where: { id },
    data: {
      published: !post.published,
      publishedAt: post.published ? null : new Date(),
    },
  });
  revalidatePath("/admin/posts");
  revalidatePath("/");
}

export async function deletePost(id: string) {
  await requireRole("EDITOR");
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}
