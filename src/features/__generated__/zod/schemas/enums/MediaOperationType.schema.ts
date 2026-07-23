import * as z from 'zod';

export const MediaOperationTypeSchema = z.enum(['COPY', 'MOVE', 'DELETE', 'VERIFY', 'INGEST', 'EXPORT'])

export type MediaOperationType = z.infer<typeof MediaOperationTypeSchema>;