import * as z from 'zod';

export const MediaOperationStatusSchema = z.enum(['PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED'])

export type MediaOperationStatus = z.infer<typeof MediaOperationStatusSchema>;