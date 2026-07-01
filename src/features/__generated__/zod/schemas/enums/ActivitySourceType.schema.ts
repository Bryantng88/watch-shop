import * as z from 'zod';

export const ActivitySourceTypeSchema = z.enum(['BUSINESS_EVENT', 'DISCUSSION', 'SYSTEM'])

export type ActivitySourceType = z.infer<typeof ActivitySourceTypeSchema>;