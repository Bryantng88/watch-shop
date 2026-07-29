import {
  getLegacyManifestSummary,
  importVerifiedLegacyMedia,
  reconcileWatchMediaCanonicalStorage,
  scanLegacyMediaManifest,
} from "../src/domains/media/server/media-reconciliation.service";
import { AudienceSegment } from "@prisma/client";
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

  if (
    command === "watch-canonical-dry-run" ||
    command === "watch-canonical" ||
    command === "watch-canonical-all"
  ) {
    const segmentArg = arg("segment")?.toUpperCase();
    const segment =
      segmentArg &&
      Object.values(AudienceSegment).includes(segmentArg as AudienceSegment)
        ? (segmentArg as AudienceSegment)
        : undefined;
    if (command === "watch-canonical-all") {
      const maxBatches = Math.max(1, Number(arg("max-batches", "100000")));
      let batches = 0;
      let migrated = 0;
      let failed = 0;
      while (batches < maxBatches) {
        const result = await reconcileWatchMediaCanonicalStorage({
          take,
          dryRun: false,
          segment,
        });
        batches += 1;
        migrated += result.migrated;
        failed += result.failed;
        console.log(JSON.stringify({
          batch: batches,
          candidates: result.candidates,
          migrated: result.migrated,
          failed: result.failed,
          totalMigrated: migrated,
          totalFailed: failed,
        }));
        if (result.candidates === 0 || result.migrated === 0) break;
      }
      console.log(JSON.stringify({ complete: true, batches, migrated, failed }));
      return;
    }
    const result = await reconcileWatchMediaCanonicalStorage({
      take,
      dryRun: command !== "watch-canonical",
      segment,
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
