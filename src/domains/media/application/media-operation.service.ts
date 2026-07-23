import { MediaObjectAvailability, MediaOperationStatus, MediaOperationType } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { normalizeKey } from "@/server/lib/storage-key";
import { mediaStorage, type MediaStorage } from "../storage";

type ExecuteMoveInput = {
  idempotencyKey: string;
  mediaObjectId?: string | null;
  sourceKey: string;
  destinationKey: string;
  deleteSource?: boolean;
  requestedByUserId?: string | null;
};

/**
 * Runs one verified, retryable storage move. All callers must supply a stable
 * idempotency key derived from the business command, never a random request id.
 */
export async function executeMediaMove(
  input: ExecuteMoveInput,
  storage: MediaStorage = mediaStorage,
) {
  const sourceKey = normalizeKey(input.sourceKey);
  const destinationKey = normalizeKey(input.destinationKey);
  if (!input.idempotencyKey.trim()) throw new Error("Media operation idempotencyKey is required.");
  if (!sourceKey || !destinationKey) throw new Error("Media move source and destination are required.");

  const operation = await prisma.mediaOperation.upsert({
    where: { idempotencyKey: input.idempotencyKey },
    create: {
      idempotencyKey: input.idempotencyKey,
      mediaObjectId: input.mediaObjectId ?? null,
      type: MediaOperationType.MOVE,
      status: MediaOperationStatus.PENDING,
      sourceKey,
      destinationKey,
      requestedByUserId: input.requestedByUserId ?? null,
    },
    update: {},
  });

  if (operation.status === MediaOperationStatus.SUCCEEDED) return operation;
  if (operation.sourceKey !== sourceKey || operation.destinationKey !== destinationKey) {
    throw new Error(`Idempotency key ${input.idempotencyKey} was already used for another move.`);
  }

  await prisma.mediaOperation.update({
    where: { id: operation.id },
    data: {
      status: MediaOperationStatus.RUNNING,
      attempts: { increment: 1 },
      startedAt: new Date(),
      lastError: null,
    },
  });

  try {
    const destinationExists = await storage.stat(destinationKey);
    const sourceExists = await storage.stat(sourceKey);

    if (!destinationExists && !sourceExists) {
      throw new Error(`Neither media source nor destination exists: ${sourceKey}`);
    }

    if (
      destinationExists &&
      sourceExists &&
      destinationExists.sizeBytes !== null &&
      sourceExists.sizeBytes !== null &&
      destinationExists.sizeBytes !== sourceExists.sizeBytes
    ) {
      throw new Error(`Existing destination does not match source: ${destinationKey}`);
    }

    if (destinationExists && sourceExists && input.deleteSource !== false) {
      await storage.delete(sourceKey);
    }

    const result = destinationExists
      ? {
          sourceKey,
          destinationKey,
          copied: false,
          sourceDeleted: Boolean(sourceExists && input.deleteSource !== false),
          metadata: destinationExists,
        }
      : await storage.move({
          sourceKey,
          destinationKey,
          deleteSource: input.deleteSource !== false,
        });

    return await prisma.$transaction(async (tx) => {
      if (input.mediaObjectId) {
        await tx.mediaObject.update({
          where: { id: input.mediaObjectId },
          data: {
            storageKey: destinationKey,
            sizeBytes:
              result.metadata.sizeBytes === null ? undefined : BigInt(result.metadata.sizeBytes),
            etag: result.metadata.etag,
            mimeType: result.metadata.contentType,
            availability: MediaObjectAvailability.AVAILABLE,
            verifiedAt: new Date(),
            missingAt: null,
          },
        });
      }

      return tx.mediaOperation.update({
        where: { id: operation.id },
        data: {
          status: MediaOperationStatus.SUCCEEDED,
          completedAt: new Date(),
          lastError: null,
        },
      });
    });
  } catch (error) {
    await prisma.mediaOperation.update({
      where: { id: operation.id },
      data: {
        status: MediaOperationStatus.FAILED,
        lastError: error instanceof Error ? error.message : "Unknown media storage error",
      },
    });
    throw error;
  }
}
