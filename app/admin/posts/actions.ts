"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import { parseJstDateTimeLocal } from "@/lib/datetime";

// 記事の変更後に再検証すべき公開ページ。
// 本番は Full Route Cache が効くため、ここを漏らすと更新が反映されない。
function revalidatePostPages(id?: string) {
  revalidatePath("/admin/posts");
  revalidatePath("/"); // トップの最新お知らせ
  revalidatePath("/information"); // お知らせ一覧
  if (id) revalidatePath(`/posts/${id}`); // 記事詳細
}

export async function createPost(formData: FormData) {
  const { userId } = await requireRole("EDITOR");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  if (!title) throw new Error("タイトルは必須です");

  const post = await prisma.post.create({
    data: { title, body, authorId: userId },
  });
  revalidatePostPages(post.id);
  redirect(`/admin/posts/${post.id}`);
}

export async function updatePost(id: string, formData: FormData) {
  await requireRole("EDITOR");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const publishedAt = parseJstDateTimeLocal(String(formData.get("publishedAt") ?? ""));
  if (!title) throw new Error("タイトルは必須です");

  await prisma.post.update({ where: { id }, data: { title, body, publishedAt } });
  revalidatePostPages(id);
  redirect("/admin/posts");
}

export async function togglePublish(id: string) {
  await requireRole("EDITOR");
  const post = await prisma.post.findUniqueOrThrow({ where: { id } });
  await prisma.post.update({
    where: { id },
    data: {
      published: !post.published,
      // 公開時は手動設定済みの日時を尊重し、未設定なら現在時刻。
      // 非公開化しても日時は保持する(編集した公開日時を失わないため)。
      publishedAt: post.published ? post.publishedAt : (post.publishedAt ?? new Date()),
    },
  });
  revalidatePostPages(id);
}

export async function deletePost(id: string) {
  await requireRole("EDITOR");
  await prisma.post.delete({ where: { id } });
  revalidatePostPages(id);
  redirect("/admin/posts");
}
