import { prisma } from "@/server/db/client";
import { normalizeWatchSpecInput } from "../shared";
import type { UpsertWatchSpecInput } from "../shared";
import { upsertWatchSpecRepo } from "./watch-spec.repo";

export async function updateWatchSpec(input: UpsertWatchSpecInput) {
  const normalized = normalizeWatchSpecInput(input);
  return upsertWatchSpecRepo(prisma as any, normalized);
}