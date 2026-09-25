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
    lifecycle: { not: MediaBindingLifecycle.REMOVED },
    NOT: {
      ownerType: input.ownerType,
      ownerId: input.ownerId,
    },
    ...(input.ownerType === MediaOwnerType.WATCH
      ? { ownerType: MediaOwnerType.WATCH }
      : { audienceSegment: { not: input.audienceSegment } }),
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
  const ownerBindingKey = {
    mediaObjectId: input.mediaObjectId,
    ownerType: input.ownerType,
    ownerId: input.ownerId,
    role: input.role,
  };
  // Historical drift is repaired separately. Existing owners may still update
  // their own lifecycle, but a new Watch owner can never join a shared object.
  const existingOwnerBinding = await db.mediaBinding.findUnique({
    where: { mediaObjectId_ownerType_ownerId_role: ownerBindingKey },
    select: { id: true },
  });
  const conflictingBinding = existingOwnerBinding
    ? null
    : await db.mediaBinding.findFirst({
        where: conflictingMediaBindingWhere(input),
        select: { id: true, ownerType: true, ownerId: true, audienceSegment: true },
      });
  if (conflictingBinding) {
    throw new Error(
      `Media object is already managed by another ${conflictingBinding.ownerType} owner (${conflictingBinding.ownerId}) in segment ${conflictingBinding.audienceSegment}.`,
    );
  }

  // Segment and pipeline are owner metadata, not storage identity. Only issue
  // the broad owner update when drift actually exists. Besides avoiding an
  // unnecessary write for every image, this prevents concurrent image work
  // from repeatedly locking the same binding set.
  const activeOwnerBindings = await db.mediaBinding.findMany({
    where: activeMediaBindingsForOwnerWhere(input),
    select: { audienceSegment: true, pipelineKey: true },
  });
  const expectedPipelineKey = input.pipelineKey ?? null;
  const ownerMetadataDrifted = activeOwnerBindings.some(
    (binding) =>
      binding.audienceSegment !== input.audienceSegment ||
      binding.pipelineKey !== expectedPipelineKey,
  );

  if (ownerMetadataDrifted) {
    await db.mediaBinding.updateMany({
      where: activeMediaBindingsForOwnerWhere(input),
      data: {
        audienceSegment: input.audienceSegment,
        pipelineKey: expectedPipelineKey,
      },
    });
  }

  return db.mediaBinding.upsert({
    where: {
      mediaObjectId_ownerType_ownerId_role: {
        ...ownerBindingKey,
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
