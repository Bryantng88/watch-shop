import * as z from 'zod';

export const CarrierRequestStatusSchema = z.enum(['PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED'])

export type CarrierRequestStatus = z.infer<typeof CarrierRequestStatusSchema>;