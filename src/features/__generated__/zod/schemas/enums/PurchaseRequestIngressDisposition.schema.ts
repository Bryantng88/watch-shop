import * as z from 'zod';

export const PurchaseRequestIngressDispositionSchema = z.enum(['CREATED', 'MERGED'])

export type PurchaseRequestIngressDisposition = z.infer<typeof PurchaseRequestIngressDispositionSchema>;