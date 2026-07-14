import { auth } from "@/auth";
import type { Role } from "@prisma/client";

const roleLevel: Record<Role, number> = { EDITOR: 1, ADMIN: 2 };

export async function requireRole(required: Role) {
  const session = await auth();
  const role = (session?.user as { role?: Role } | undefined)?.role;
  if (!session?.user || !role || roleLevel[role] < roleLevel[required]) {
    throw new Error("この操作を行う権限がありません");
  }
  return { session, userId: session.user.id as string, role };
}
