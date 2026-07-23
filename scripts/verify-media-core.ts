import {
  AudienceSegment,
  MediaObjectAvailability,
  MediaPipelineKey,
} from "@prisma/client";
import { mediaStorage } from "../src/domains/media/storage";
import { prisma } from "../src/server/db/client";

function expectedPipeline(segment: AudienceSegment) {
  if (segment === AudienceSegment.WOMEN) return MediaPipelineKey.WOMEN_LITE;
  if (segment === AudienceSegment.UNISEX) return MediaPipelineKey.UNISEX_STANDARD;
  return MediaPipelineKey.MEN_STANDARD;
}

async function main() {
  const [watches, bindings, objectCount, unavailableCount] = await Promise.all([
    prisma.watch.findMany({
      select: { id: true, audienceSegment: true, mediaPipelineKey: true },
    }),
    prisma.mediaBinding.findMany({
      include: {
        mediaObject: { select: { storageKey: true, availability: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.mediaObject.count(),
    prisma.mediaObject.count({
      where: {
        availability: {
          in: [
            MediaObjectAvailability.MISSING,
            MediaObjectAvailability.QUARANTINED,
            MediaObjectAvailability.DELETED,
          ],
        },
      },
    }),
  ]);

  const pipelineMismatches = watches.filter(
    (watch) => watch.mediaPipelineKey !== expectedPipeline(watch.audienceSegment),
  );
  const segmentMismatches = bindings.filter((binding) => {
    if (!binding.pipelineKey) return false;
    return binding.pipelineKey !== expectedPipeline(binding.audienceSegment);
  });
  const segmentsByObject = new Map<string, Set<AudienceSegment>>();
  bindings.forEach((binding) => {
    const segments = segmentsByObject.get(binding.mediaObjectId) ?? new Set();
    segments.add(binding.audienceSegment);
    segmentsByObject.set(binding.mediaObjectId, segments);
  });
  const crossSegmentObjects = Array.from(segmentsByObject.values()).filter(
    (segments) => segments.size > 1,
  ).length;
  const storageSample = bindings.slice(0, 25);
  const missingSample = (
    await Promise.all(
      storageSample.map(async (binding) => ({
        key: binding.mediaObject.storageKey,
        exists: Boolean(await mediaStorage.stat(binding.mediaObject.storageKey)),
      })),
    )
  ).filter((item) => !item.exists);

  const result = {
    watches: watches.length,
    mediaObjects: objectCount,
    mediaBindings: bindings.length,
    unavailableObjects: unavailableCount,
    pipelineMismatches: pipelineMismatches.length,
    bindingSegmentMismatches: segmentMismatches.length,
    crossSegmentObjects,
    storageSample: storageSample.length,
    missingInStorageSample: missingSample.length,
  };
  console.log(JSON.stringify(result, null, 2));

  if (
    pipelineMismatches.length ||
    segmentMismatches.length ||
    crossSegmentObjects ||
    unavailableCount ||
    missingSample.length
  ) {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
