import {
  AudienceSegment,
  MediaBindingLifecycle,
  MediaOwnerType,
  MediaPipelineKey,
  MediaRole,
} from "@prisma/client";
import { prisma, type DB } from "@/server/db/client";

export type BindMediaInput = {
  mediaObjectId: string;
  ownerType: MediaOwnerType;
  ownerId: string;
  role: MediaRole;
  sortOrder?: number;
  audienceSegment: AudienceSegment;
  pipelineKey?: MediaPipelineKey | null;
  lifecycle?: MediaBindingLifecycle;
};

export function conflictingMediaBindingWhere(input: BindMediaInput) {
  return {
    mediaObjectId: input.mediaObjectId,
    audienceSegment: { not: input.audienceSegment },
    lifecycle: { not: MediaBindingLifecycle.REMOVED },
    NOT: {
      ownerType: input.ownerType,
      ownerId: input.ownerId,
    },
  };
}

export function activeMediaBindingsForOwnerWhere(input: BindMediaInput) {
  return {
    ownerType: input.ownerType,
    ownerId: input.ownerId,
    lifecycle: { not: MediaBindingLifecycle.REMOVED },
  };
}

export async function bindMedia(input: BindMediaInput, db: DB = prisma) {
  const conflictingBinding = await db.mediaBinding.findFirst({
    where: conflictingMediaBindingWhere(input),
    select: { id: true, ownerType: true, ownerId: true, audienceSegment: true },
  });
  if (conflictingBinding) {
    throw new Error(
      `Media object is already managed by another ${conflictingBinding.ownerType} owner in segment ${conflictingBinding.audienceSegment}.`,
    );
  }

  // Segment and pipeline are owner metadata, not storage identity. A Watch or
  // Acquisition can change segment after its media was first attached. Keep
  // every active binding for that owner aligned before upserting the requested
  // role; otherwise an old binding can reject its own owner on the next save.
  await db.mediaBinding.updateMany({
    where: activeMediaBindingsForOwnerWhere(input),
    data: {
      audienceSegment: input.audienceSegment,
      pipelineKey: input.pipelineKey ?? null,
    },
  });

  return db.mediaBinding.upsert({
    where: {
      mediaObjectId_ownerType_ownerId_role: {
        mediaObjectId: input.mediaObjectId,
        ownerType: input.ownerType,
        ownerId: input.ownerId,
        role: input.role,
      },
    },
    create: {
      mediaObjectId: input.mediaObjectId,
      ownerType: input.ownerType,
      ownerId: input.ownerId,
      role: input.role,
      sortOrder: input.sortOrder ?? 0,
      audienceSegment: input.audienceSegment,
      pipelineKey: input.pipelineKey ?? null,
      lifecycle: input.lifecycle ?? MediaBindingLifecycle.ATTACHED,
    },
    update: {
      mediaObjectId: input.mediaObjectId,
      sortOrder: input.sortOrder ?? 0,
      audienceSegment: input.audienceSegment,
      pipelineKey: input.pipelineKey ?? null,
      lifecycle: input.lifecycle ?? MediaBindingLifecycle.ATTACHED,
    },
  });
}

export async function removeMediaBinding(input: {
  mediaObjectId: string;
  ownerType: MediaOwnerType;
  ownerId: string;
  role: MediaRole;
}) {
  return prisma.mediaBinding.update({
    where: {
      mediaObjectId_ownerType_ownerId_role: input,
    },
    data: { lifecycle: MediaBindingLifecycle.REMOVED },
  });
}
