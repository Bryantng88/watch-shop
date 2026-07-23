import * as z from 'zod';

export const MediaLegacyDecisionSchema = z.enum(['PENDING', 'MIGRATE', 'MIGRATED', 'QUARANTINE', 'IGNORE'])

export type MediaLegacyDecision = z.infer<typeof MediaLegacyDecisionSchema>;