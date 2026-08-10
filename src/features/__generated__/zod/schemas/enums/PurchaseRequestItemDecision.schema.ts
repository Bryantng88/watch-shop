import * as z from 'zod';

export const PurchaseRequestItemDecisionSchema = z.enum(['PENDING', 'SELECTED', 'DECLINED', 'UNAVAILABLE'])

export type PurchaseRequestItemDecision = z.infer<typeof PurchaseRequestItemDecisionSchema>;