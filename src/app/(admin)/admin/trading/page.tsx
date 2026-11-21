import { redirect } from "next/navigation";
import { requireAnyPermission } from "@/server/auth/requirePermission";
import { TRADING_READ_PERMISSIONS, tradingEntries } from "@/domains/trading/shared/trading-navigation";

export default async function TradingPage() {
  const user = await requireAnyPermission(TRADING_READ_PERMISSIONS);
  redirect(tradingEntries(user)[0]?.href ?? "/403");
}
