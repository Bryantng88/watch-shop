import {
  AudienceSegment,
  Gender,
  MediaPipelineKey,
} from "@prisma/client";

import { prisma } from "../src/server/db/client";

async function main() {
  const before = await prisma.watch.count({
    where: {
      OR: [
        { gender: Gender.UNISEX },
        { audienceSegment: AudienceSegment.UNISEX },
        { mediaPipelineKey: MediaPipelineKey.UNISEX_STANDARD },
      ],
    },
  });

  const result = await prisma.$transaction(async (tx) =>
    tx.watch.updateMany({
      where: {
        OR: [
          { gender: Gender.UNISEX },
          { audienceSegment: AudienceSegment.UNISEX },
          { mediaPipelineKey: MediaPipelineKey.UNISEX_STANDARD },
        ],
      },
      data: {
        gender: Gender.MEN,
        audienceSegment: AudienceSegment.MEN,
        mediaPipelineKey: MediaPipelineKey.MEN_STANDARD,
      },
    }),
  );

  const [men, women, unisex] = await Promise.all([
    prisma.watch.count({ where: { audienceSegment: AudienceSegment.MEN } }),
    prisma.watch.count({ where: { audienceSegment: AudienceSegment.WOMEN } }),
    prisma.watch.count({
      where: {
        OR: [
          { gender: Gender.UNISEX },
          { audienceSegment: AudienceSegment.UNISEX },
          { mediaPipelineKey: MediaPipelineKey.UNISEX_STANDARD },
        ],
      },
    }),
  ]);

  console.log(JSON.stringify({
    matchedBefore: before,
    updated: result.count,
    countsAfter: { men, women, unisex },
  }, null, 2));

  if (unisex !== 0 || result.count !== before) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
