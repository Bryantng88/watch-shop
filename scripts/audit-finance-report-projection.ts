import { queryFinanceReportProjection } from "../src/domains/report/finance/finance-report.projection";
import { prisma } from "../src/server/db/client";

function near(left: number, right: number) {
  return Math.abs(left - right) < 0.01;
}

async function main() {
  const data = await queryFinanceReportProjection(prisma);
  if (!data) throw new Error("FINANCE_REPORT_PROJECTION_NOT_READY");
  const all = data.channels.find((item) => item.channel === "ALL");
  const men = data.channels.find((item) => item.channel === "MEN");
  const women = data.channels.find((item) => item.channel === "WOMEN");
  if (!all || !men || !women) throw new Error("FINANCE_REPORT_CHANNEL_MISSING");

  const mismatches: string[] = [];
  for (const allPeriod of all.periods) {
    const menPeriod = men.periods.find((item) => item.key === allPeriod.key);
    const womenPeriod = women.periods.find((item) => item.key === allPeriod.key);
    if (!menPeriod || !womenPeriod) {
      mismatches.push(`${allPeriod.key}:period-missing`);
      continue;
    }
    for (const metric of [
      "revenue",
      "otherIncome",
      "collected",
      "cost",
      "profit",
      "openingBalance",
      "cashIn",
      "cashOut",
      "netCashFlow",
      "closingBalance",
    ] as const) {
      if (!near(allPeriod[metric], menPeriod[metric] + womenPeriod[metric])) {
        mismatches.push(`${allPeriod.key}:${metric}`);
      }
    }
  }
  if (data.quality.settlementDateFallbackCount > 0) {
    mismatches.push(`settlement-date-fallback:${data.quality.settlementDateFallbackCount}`);
  }

  const output = {
    ok: mismatches.length === 0,
    formulaVersion: data.formulaVersion,
    generatedAt: data.generatedAt,
    quality: data.quality,
    mismatches,
    periods: all.periods.map((period) => ({
      key: period.key,
      revenue: period.revenue,
      collected: period.collected,
      otherIncome: period.otherIncome,
      cost: period.cost,
      profit: period.profit,
      openingBalance: period.openingBalance,
      cashIn: period.cashIn,
      cashOut: period.cashOut,
      netCashFlow: period.netCashFlow,
      closingBalance: period.closingBalance,
      transactionCount: period.transactionCount,
    })),
    pending: {
      in: all.pendingPayments.in,
      out: all.pendingPayments.out,
    },
  };
  console.log(JSON.stringify(output, null, 2));
  if (!output.ok) throw new Error("FINANCE_REPORT_CHANNEL_INVARIANT_FAILED");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
