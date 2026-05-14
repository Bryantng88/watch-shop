import { createQuickOrderFromProduct } from "../../server";
import type { QuickOrderFromProductInput } from "../../server/shared";

export async function createQuickOrderFromWatchApplication(input: QuickOrderFromProductInput) {
  return createQuickOrderFromProduct(input);
}
