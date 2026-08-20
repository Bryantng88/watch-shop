import type {
  FinanceChannel,
  FinanceChannelWeight,
  FinanceContribution,
  FinanceContributionInput,
} from "./finance-report.types";

const CHANNELS: FinanceChannel[] = ["MEN", "WOMEN"];

export type CashLedgerEntry = {
  direction: "IN" | "OUT";
  purpose: string;
  status: string;
  amount: number;
  paidAt: Date | null;
  updatedAt: Date;
};

function roundMoney(value: number) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export function allocateOrderContributions(
  items: FinanceContributionInput[],
): FinanceContribution[] {
  const attributable = items.filter((item) => item.channel && item.kind !== "DISCOUNT");
  const shared = items.filter((item) => !item.channel || item.kind === "DISCOUNT");
  const base = attributable.reduce((total, item) => total + Math.max(0, item.revenue), 0);

  if (!attributable.length || base <= 0) {
    return items.map((item) => ({
      ...item,
      allocatedRevenue: roundMoney(item.revenue),
      allocatedCost: roundMoney(item.cost),
    }));
  }

  const sharedRevenue = shared.reduce((total, item) => total + item.revenue, 0);
  const sharedCost = shared.reduce((total, item) => total + item.cost, 0);
  let allocatedRevenue = 0;
  let allocatedCost = 0;

  return attributable.map((item, index) => {
    const last = index === attributable.length - 1;
    const weight = Math.max(0, item.revenue) / base;
    const revenueShare = last
      ? roundMoney(sharedRevenue - allocatedRevenue)
      : roundMoney(sharedRevenue * weight);
    const costShare = last
      ? roundMoney(sharedCost - allocatedCost)
      : roundMoney(sharedCost * weight);
    allocatedRevenue += revenueShare;
    allocatedCost += costShare;

    return {
      ...item,
      allocatedRevenue: roundMoney(item.revenue + revenueShare),
      allocatedCost: roundMoney(item.cost + costShare),
    };
  });
}

export function channelWeightsFromContributions(
  contributions: Array<Pick<FinanceContribution, "channel" | "allocatedRevenue">>,
): FinanceChannelWeight[] {
  const totals = new Map<FinanceChannel, number>(CHANNELS.map((channel) => [channel, 0]));
  for (const item of contributions) {
    if (!item.channel) continue;
    totals.set(item.channel, (totals.get(item.channel) ?? 0) + Math.max(0, item.allocatedRevenue));
  }
  const total = [...totals.values()].reduce((sum, value) => sum + value, 0);
  if (total <= 0) return [];

  let allocated = 0;
  return CHANNELS.flatMap((channel, index) => {
    const value = totals.get(channel) ?? 0;
    if (value <= 0) return [];
    const last = index === CHANNELS.length - 1 || [...totals.entries()].slice(index + 1).every(([, next]) => next <= 0);
    const weight = last ? roundMoney(1 - allocated) : roundMoney(value / total);
    allocated += weight;
    return [{ channel, weight }];
  });
}

export function allocateAmountByChannel(
  amount: number,
  weights: FinanceChannelWeight[],
) {
  let allocated = 0;
  return weights.map((item, index) => {
    const value = index === weights.length - 1
      ? roundMoney(amount - allocated)
      : roundMoney(amount * item.weight);
    allocated += value;
    return { channel: item.channel, amount: value };
  });
}

export function summarizeCashLedger(entries: CashLedgerEntry[], startAt: Date, endAt: Date) {
  const settled = entries.filter((item) => ["PAID", "COLLECTED"].includes(item.status));
  const effectiveDate = (item: CashLedgerEntry) => item.paidAt ?? item.updatedAt;
  const latestOpeningBalance = settled
    .filter((item) => item.purpose === "OPENING_BALANCE" && effectiveDate(item) <= endAt)
    .sort((left, right) => effectiveDate(right).getTime() - effectiveDate(left).getTime())[0] ?? null;
  const ledgerStart = latestOpeningBalance ? effectiveDate(latestOpeningBalance) : null;
  const movements = settled.filter((item) => item.purpose !== "OPENING_BALANCE");
  const afterLedgerStart = (item: CashLedgerEntry) => !ledgerStart || effectiveDate(item) > ledgerStart;
  const inPeriod = movements.filter((item) =>
    effectiveDate(item) >= startAt && effectiveDate(item) <= endAt && afterLedgerStart(item),
  );
  const beforePeriod = movements.filter((item) => effectiveDate(item) < startAt && afterLedgerStart(item));
  const openingBalance = (latestOpeningBalance?.amount ?? 0) + beforePeriod.reduce(
    (sum, item) => sum + (item.direction === "IN" ? item.amount : -item.amount),
    0,
  );
  const cashIn = inPeriod.filter((item) => item.direction === "IN").reduce((sum, item) => sum + item.amount, 0);
  const cashOut = inPeriod.filter((item) => item.direction === "OUT").reduce((sum, item) => sum + item.amount, 0);
  return { openingBalance, cashIn, cashOut, netCashFlow: cashIn - cashOut, closingBalance: openingBalance + cashIn - cashOut };
}
