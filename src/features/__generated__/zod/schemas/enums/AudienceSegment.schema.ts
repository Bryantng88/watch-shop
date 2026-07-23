import * as z from 'zod';

export const AudienceSegmentSchema = z.enum(['MEN', 'WOMEN', 'UNISEX'])

export type AudienceSegment = z.infer<typeof AudienceSegmentSchema>;