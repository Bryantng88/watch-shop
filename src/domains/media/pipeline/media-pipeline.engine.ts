import { AudienceSegment, MediaPipelineKey } from "@prisma/client";
import { prisma, type DB } from "@/server/db/client";
import { requestWatchPhotoshoot } from "@/domains/watch/server/media-work";
import { getMediaPipelineProfile } from "./media-pipeline.profile";

function defaultPipeline(segment: AudienceSegment) {
  if (segment === AudienceSegment.WOMEN) return MediaPipelineKey.WOMEN_LITE;
  if (segment === AudienceSegment.UNISEX) return MediaPipelineKey.UNISEX_STANDARD;
  return MediaPipelineKey.MEN_STANDARD;
}

/**
 * Canonical entry point for sending a Watch into media operations.
 * Callers do not select workspace/work type; the profile owns that decision.
 */
export async function routeWatchToMedia(
  input: {
    watchId: string;
    actorUserId?: string | null;
    reason?: string | null;
  },
  db: DB = prisma,
) {
  const watch = await db.watch.findUnique({
    where: { id: input.watchId },
    select: {
      id: true,
      audienceSegment: true,
      mediaPipelineKey: true,
    },
  });
  if (!watch) throw new Error(`Watch not found: ${input.watchId}`);

  const pipelineKey = watch.mediaPipelineKey || defaultPipeline(watch.audienceSegment);
  const profile = getMediaPipelineProfile(pipelineKey);
  if (profile.segment !== watch.audienceSegment) {
    throw new Error(
      `Watch segment ${watch.audienceSegment} is incompatible with pipeline ${pipelineKey}.`,
    );
  }

  const result = await requestWatchPhotoshoot(
    {
      watchIds: [watch.id],
      actorUserId: input.actorUserId ?? null,
      note: input.reason ?? null,
    },
    db,
  );

  return {
    watchId: watch.id,
    segment: watch.audienceSegment,
    pipelineKey,
    firstStage: profile.stages[0],
    result,
  };
}

export async function routeWatchesToMedia(
  input: {
    watchIds: string[];
    actorUserId?: string | null;
    reason?: string | null;
  },
  db: DB = prisma,
) {
  const watchIds = Array.from(new Set(input.watchIds.map((id) => id.trim()).filter(Boolean)));
  const watches = await db.watch.findMany({
    where: { id: { in: watchIds } },
    select: { id: true, audienceSegment: true, mediaPipelineKey: true },
  });

  for (const watch of watches) {
    const profile = getMediaPipelineProfile(
      watch.mediaPipelineKey || defaultPipeline(watch.audienceSegment),
    );
    if (profile.segment !== watch.audienceSegment) {
      throw new Error(
        `Watch ${watch.id} segment ${watch.audienceSegment} is incompatible with ${profile.key}.`,
      );
    }
  }

  return requestWatchPhotoshoot(
    {
      watchIds,
      actorUserId: input.actorUserId ?? null,
      note: input.reason ?? null,
    },
    db,
  );
}

export function nextMediaStage(input: {
  pipelineKey: MediaPipelineKey;
  currentStage: "photography" | "media-processing" | "publish";
}) {
  const stages = getMediaPipelineProfile(input.pipelineKey).stages;
  const currentIndex = stages.indexOf(input.currentStage);
  return currentIndex < 0 ? null : stages[currentIndex + 1] ?? null;
}
