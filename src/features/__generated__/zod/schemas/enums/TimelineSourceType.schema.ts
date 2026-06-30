import * as z from 'zod';

export const TimelineSourceTypeSchema = z.enum(['BUSINESS_EVENT', 'BUSINESS_FEEDBACK', 'USER_COMMENT', 'WORKFLOW_ACTION', 'NOTIFICATION', 'SYSTEM'])

export type TimelineSourceType = z.infer<typeof TimelineSourceTypeSchema>;