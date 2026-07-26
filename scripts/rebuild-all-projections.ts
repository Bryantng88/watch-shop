import { listProjectionBuilders } from "@/domains/projection/server/projection.registry";
import { rebuildProjection } from "@/domains/projection/server/projection.runner";
import { prisma } from "@/server/db/client";

async function main() {
  const requested = new Set(
    process.argv.slice(2).map((value) => value.trim()).filter(Boolean),
  );
  const builders = listProjectionBuilders();
  const selected = requested.size
    ? builders.filter((builder) => requested.has(builder.key))
    : builders;
  const unknown = [...requested].filter(
    (projectionKey) => !builders.some((builder) => builder.key === projectionKey),
  );

  if (unknown.length) {
    throw new Error(`Unknown projection key(s): ${unknown.join(", ")}`);
  }

  const results = [];
  for (const builder of selected) {
    const startedAt = Date.now();
    console.log(`[projection:rebuild] ${builder.key}: started`);
    const result = await rebuildProjection(prisma, {
      projectionKey: builder.key,
    });
    results.push(result);
    console.log(
      `[projection:rebuild] ${builder.key}: ${result.ok ? "done" : "failed"} in ${Date.now() - startedAt}ms`,
    );
    if (!result.ok) {
      throw new Error(
        `Projection rebuild failed: ${builder.key}: ${result.reason ?? "UNKNOWN"}`,
      );
    }
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
