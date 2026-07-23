import * as z from 'zod';

import { MediaOperationTypeSchema } from '../../enums/MediaOperationType.schema';
import { MediaOperationStatusSchema } from '../../enums/MediaOperationStatus.schema';
// prettier-ignore
export const MediaOperationInputSchema = z.object({
    id: z.string(),
    idempotencyKey: z.string(),
    mediaObjectId: z.string().optional().nullable(),
    type: MediaOperationTypeSchema,
    status: MediaOperationStatusSchema,
    sourceKey: z.string().optional().nullable(),
    destinationKey: z.string().optional().nullable(),
    attempts: z.number().int(),
    lastError: z.string().optional().nullable(),
    requestedByUserId: z.string().optional().nullable(),
    startedAt: z.date().optional().nullable(),
    completedAt: z.date().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    mediaObject: z.unknown().optional().nullable()
}).strict();

export type MediaOperationInputType = z.infer<typeof MediaOperationInputSchema>;
