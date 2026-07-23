import * as z from 'zod';

export const MediaObjectAvailabilitySchema = z.enum(['UNVERIFIED', 'AVAILABLE', 'MOVE_PENDING', 'MISSING', 'QUARANTINED', 'DELETED'])

export type MediaObjectAvailability = z.infer<typeof MediaObjectAvailabilitySchema>;