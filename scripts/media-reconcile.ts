import {
  getLegacyManifestSummary,
  importVerifiedLegacyMedia,
  scanLegacyMediaManifest,
} from "../src/domains/media/server/media-reconciliation.service";
import { prisma } from "../src/server/db/client";

function arg(name: string, fallback?: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((item) => item.startsWith(prefix))?.slice(prefix.length) ?? fallback;
}

async function main() {
  const command = process.argv[2] ?? "summary";
  const take = Number(arg("take", "100"));

  if (command === "summary") {
    console.log(JSON.stringify(await getLegacyManifestSummary(), null, 2));
    return;
  }

  if (command === "scan") {
    const result = await scanLegacyMediaManifest({
      cursor: arg("cursor") ?? null,
      take,
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (command === "scan-all") {
    const maxBatches = Math.max(1, Number(arg("max-batches", "100000")));
    let cursor = arg("cursor") ?? null;
    let batches = 0;
    let scanned = 0;
    do {
      const result = await scanLegacyMediaManifest({ cursor, take });
      batches += 1;
      scanned += result.manifestWritten;
      cursor = result.nextCursor;
      console.log(
        JSON.stringify({
          batch: batches,
          scanned,
          cursor,
          summary: result.summary,
        }),
      );
    } while (cursor && batches < maxBatches);
    console.log(JSON.stringify({ complete: !cursor, batches, scanned, nextCursor: cursor }));
    return;
  }

  if (command === "import-dry-run" || command === "import") {
    const result = await importVerifiedLegacyMedia({
      take,
      dryRun: command !== "import",
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
