import { prisma } from "@/server/db/client";
import { mapWatchDetail } from "../shared";
import {
  getAdminEditWatchDetail,
  getAdminWatchDetail,
  getAdminWatchRow,
  getLatestWatchVariantForAdmin,
  getOpenServiceWatches,
  getWatchServiceHistory,
  getWatchTradeHistory,
} from "./watch-detail.repo";

export async function getWatchDetail(productId: string) {
  const row = await getAdminWatchDetail(prisma as any, productId);

  if (!row) {
    throw new Error("Không tìm thấy watch");
  }

  return mapWatchDetail(row);
}

export async function getWatchEditDetail(productId: string) {
  const row = await getAdminEditWatchDetail(prisma as any, productId);

  if (!row) {
    throw new Error("Không tìm thấy watch để edit");
  }

  return mapWatchDetail(row);
}

export async function getWatchRow(productId: string) {
  return getAdminWatchRow(prisma as any, productId);
}

export async function getWatchTradeHistoryDetail(productId: string) {
  return getWatchTradeHistory(prisma as any, productId);
}

export async function getWatchServiceHistoryDetail(productId: string) {
  return getWatchServiceHistory(prisma as any, productId);
}

export async function getLatestWatchVariant(productId: string) {
  return getLatestWatchVariantForAdmin(prisma as any, productId);
}

export async function getOpenServiceWatchList() {
  return getOpenServiceWatches(prisma as any);
}