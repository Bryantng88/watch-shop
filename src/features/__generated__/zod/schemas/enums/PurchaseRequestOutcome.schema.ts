import * as z from 'zod';

export const PurchaseRequestOutcomeSchema = z.enum(['CONVERTED', 'REJECTED', 'CANCELLED', 'EXPIRED', 'DUPLICATE'])

export type PurchaseRequestOutcome = z.infer<typeof PurchaseRequestOutcomeSchema>;