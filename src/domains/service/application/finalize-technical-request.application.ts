import type { DB } from "@/server/db/client";
import * as repo from "../server/repository/service-request.repo";

export async function finalizeTechnicalRequestApplication(tx: DB, input: { productId: string }) {
  const openCount = await repo.countOpenTechnicalRequests(tx, input.productId);
  if (openCount === 0) await repo.markProductPosted(tx, input.productId);
}
