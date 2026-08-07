import * as z from 'zod';

export const PurchaseRequestStatusSchema = z.enum(['WAITING', 'PROCESSING', 'COMPLETED'])

export type PurchaseRequestStatus = z.infer<typeof PurchaseRequestStatusSchema>;