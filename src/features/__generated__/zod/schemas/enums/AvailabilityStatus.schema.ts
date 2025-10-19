import * as z from 'zod';

export const AvailabilityStatusSchema = z.enum(['IN_STOCK', 'RESERVED', 'SOLD'])

export type AvailabilityStatus = z.infer<typeof AvailabilityStatusSchema>;