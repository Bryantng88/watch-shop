import { prisma } from "@/server/db/client";
import { upsertWatchSpecRepo } from "./watch-spec.repo";

export async function updateWatchSpec(input: any) {
  return prisma.$transaction(async (tx) => upsertWatchSpecRepo(tx as any, input));
}
