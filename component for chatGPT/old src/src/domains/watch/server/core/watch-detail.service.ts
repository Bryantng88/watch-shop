import { prisma } from "@/server/db/client";
import {
  getAdminEditWatchDetail,
  getAdminWatchDetail,
  getAdminWatchRow,
  getLatestWatchVariantForAdmin,
  getWatchServiceHistory,
  getWatchTradeHistory,
  getOpenServiceWatches,
} from "./watch-detail.repo";

export async function getWatchDetail(productId: string) {
  return getAdminWatchDetail(prisma as any, productId);
}

export async function getWatchEditDetail(productId: string) {
  return getAdminEditWatchDetail(prisma as any, productId);
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
