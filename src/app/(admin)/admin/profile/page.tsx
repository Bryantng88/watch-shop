import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { prisma } from "@/server/db/client";
import { redirect } from "next/navigation";
import ProfileWorkspace from "./_client/ProfileWorkspace";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const catalog = await prisma.permission.findMany({ where: { code: { in: user.permissions } }, select: { code: true, description: true } });
  const descriptions = new Map(catalog.map(p => [p.code, p.description]));
  const permissions = [...user.permissions].sort().map(code => ({ code, description: descriptions.get(code) ?? null }));
  return <ProfileWorkspace user={user} permissions={permissions} />;
}
