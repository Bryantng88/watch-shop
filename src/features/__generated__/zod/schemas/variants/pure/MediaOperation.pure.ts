import * as z from 'zod';

import { MediaOperationTypeSchema } from '../../enums/MediaOperationType.schema';
import { MediaOperationStatusSchema } from '../../enums/MediaOperationStatus.schema';
// prettier-ignore
export const MediaOperationModelSchema = z.object({
    id: z.string(),
    idempotencyKey: z.string(),
    mediaObjectId: z.string().nullable(),
    type: MediaOperationTypeSchema,
    status: MediaOperationStatusSchema,
    sourceKey: z.string().nullable(),
    destinationKey: z.string().nullable(),
    attempts: z.number().int(),
    lastError: z.string().nullable(),
    requestedByUserId: z.string().nullable(),
    startedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    mediaObject: z.unknown().nullable()
}).strict();

export type MediaOperationPureType = z.infer<typeof MediaOperationModelSchema>;
