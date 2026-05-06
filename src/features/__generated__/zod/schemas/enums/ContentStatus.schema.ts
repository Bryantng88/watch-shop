import * as z from 'zod';

export const ContentStatusSchema = z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ARCHIVED', 'PROCESSING'])

export type ContentStatus = z.infer<typeof ContentStatusSchema>;