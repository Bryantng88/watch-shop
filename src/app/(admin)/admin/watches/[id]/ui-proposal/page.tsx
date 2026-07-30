import { notFound } from "next/navigation";

import { PERMISSIONS } from "@/constants/permissions";
import WatchDetailUiProposal from "@/domains/watch/ui/proposal/WatchDetailUiProposal";
import {
  getWatchEditDetail,
  getWatchServiceProjectionDetail,
  getWatchTradeHistoryDetail,
} from "@/domains/watch/server";
import { requirePermission } from "@/server/auth/requirePermission";

type AuthUser = {
  roles?: Array<string | { name?: string; code?: string; key?: string }> | null;
  permissions?: Array<string | { name?: string; code?: string; key?: string }> | null;
} | null;

function authValues(items: AuthUser extends null ? never : NonNullable<AuthUser>["roles"]) {
  return (items ?? []).map((item) =>
    String(
      typeof item === "string"
        ? item
        : item.name ?? item.code ?? item.key ?? "",
    ).toUpperCase(),
  );
}

function serialize(value: unknown) {
  return JSON.parse(JSON.stringify(value));
}

function hideFinancials(tradeHistory: Record<string, unknown>) {
  const summary =
    tradeHistory.costSummary && typeof tradeHistory.costSummary === "object"
      ? tradeHistory.costSummary as Record<string, unknown>
      : null;
  return {
    ...tradeHistory,
    costLedger: [],
    serviceFees: [],
    shipmentFees: [],
    costSummary: summary
      ? Object.fromEntries(Object.keys(summary).map((key) => [key, null]))
      : null,
  };
}

export default async function WatchDetailUiProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePermission(PERMISSIONS.PRODUCT_VIEW) as AuthUser;
  const { id } = await params;
  const [detail, service, tradeHistory] = await Promise.all([
    getWatchEditDetail(id),
    getWatchServiceProjectionDetail(id),
    getWatchTradeHistoryDetail(id),
  ]);

  if (!detail) notFound();

  const access = [...authValues(user?.roles), ...authValues(user?.permissions)];
  const canViewFinancials = access.includes("ADMIN");
  const serializedTrade = serialize(tradeHistory) as Record<string, unknown>;

  return (
    <WatchDetailUiProposal
      detail={serialize(detail)}
      service={serialize(service)}
      tradeHistory={
        canViewFinancials ? serializedTrade : hideFinancials(serializedTrade)
      }
      canViewFinancials={canViewFinancials}
    />
  );
}
