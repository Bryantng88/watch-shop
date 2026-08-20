import { prisma } from "../src/server/db/client";

async function main() {
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1_000);
  const result = await prisma.storefrontAnalyticsEvent.deleteMany({ where: { occurredAt: { lt: cutoff } } });
  console.log(`Deleted ${result.count} storefront analytics events older than ${cutoff.toISOString()}.`);
}

main().finally(() => prisma.$disconnect());
