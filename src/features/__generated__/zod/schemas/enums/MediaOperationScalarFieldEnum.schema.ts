import * as z from 'zod';

export const MediaOperationScalarFieldEnumSchema = z.enum(['id', 'idempotencyKey', 'mediaObjectId', 'type', 'status', 'sourceKey', 'destinationKey', 'attempts', 'lastError', 'requestedByUserId', 'startedAt', 'completedAt', 'createdAt', 'updatedAt'])

export type MediaOperationScalarFieldEnum = z.infer<typeof MediaOperationScalarFieldEnumSchema>;