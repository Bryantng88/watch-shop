import * as z from 'zod';

export const AvailabilityStatusSchema = z.enum(['INACTIVE', 'ACTIVE', 'HIDDEN', 'RESERVED', 'SOLD', 'HOLD'])

export type AvailabilityStatus = z.infer<typeof AvailabilityStatusSchema>;