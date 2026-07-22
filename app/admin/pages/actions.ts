"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import { isFixedPageSlug } from "@/lib/pages";

export async function updatePage(slug: string, formData: FormData) {
  await requireRole("EDITOR");
  if (!isFixedPageSlug(slug)) throw new Error("不正なページです");

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  if (!title) throw new Error("タイトルは必須です");

  // シード未実行でも編集できるよう upsert(固定 slug のみ許可済み)
  await prisma.page.upsert({
    where: { slug },
    update: { title, body },
    create: { slug, title, body },
  });

  revalidatePath("/admin/pages");
  // home の公開先はトップ("/")。それ以外は "/service" などの同名パス
  revalidatePath(slug === "home" ? "/" : `/${slug}`);
  redirect("/admin/pages");
}
