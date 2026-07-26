import { rebuildProjection } from "@/domains/projection/server/projection.runner";
import { prisma } from "@/server/db/client";

const projectionKeys = [
  "coordination-workspace-summary",
  "admin-dashboard-summary",
  "service-request-list",
] as const;

async function main() {
  const requested = new Set(process.argv.slice(2).map((value) => value.trim()).filter(Boolean));
  const selected = requested.size
    ? projectionKeys.filter((projectionKey) => requested.has(projectionKey))
    : projectionKeys;
  if (!selected.length) {
    throw new Error(`Unknown projection key. Expected one of: ${projectionKeys.join(", ")}`);
  }
  const results = [];
  for (const projectionKey of selected) {
    results.push(await rebuildProjection(prisma, { projectionKey }));
  }
  console.log(JSON.stringify(results, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
