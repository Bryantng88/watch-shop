import type {
  FinanceChannel,
  FinanceChannelWeight,
  FinanceContribution,
  FinanceContributionInput,
} from "./finance-report.types";

const CHANNELS: FinanceChannel[] = ["MEN", "WOMEN"];

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
