import {
  AudienceSegment,
  MediaBindingLifecycle,
  MediaOwnerType,
  MediaPipelineKey,
  MediaRole,
} from "@prisma/client";
import { prisma } from "@/server/db/client";

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

export async function bindMedia(input: BindMediaInput) {
  const conflictingBinding = await prisma.mediaBinding.findFirst({
    where: {
      mediaObjectId: input.mediaObjectId,
      audienceSegment: { not: input.audienceSegment },
      lifecycle: { not: MediaBindingLifecycle.REMOVED },
    },
    select: { id: true, audienceSegment: true },
  });
  if (conflictingBinding) {
    throw new Error(
      `Media object is already managed by segment ${conflictingBinding.audienceSegment}.`,
    );
  }

  return prisma.mediaBinding.upsert({
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
