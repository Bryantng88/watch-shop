import { prisma } from "@/server/db/client";

export async function listPostTargets() {
  return prisma.postTarget.findMany({
    where: { isActive: true },
    orderBy: [{ name: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      name: true,
      platform: true,
      isActive: true,
    },
  });
}
