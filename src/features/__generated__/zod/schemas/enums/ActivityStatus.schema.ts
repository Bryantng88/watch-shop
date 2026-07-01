import * as z from 'zod';

export const ActivityStatusSchema = z.enum(['OPEN', 'RESOLVED', 'ARCHIVED'])

export type ActivityStatus = z.infer<typeof ActivityStatusSchema>;