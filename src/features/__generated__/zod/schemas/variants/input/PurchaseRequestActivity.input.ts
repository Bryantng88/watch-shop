import * as z from 'zod';

import { PurchaseRequestActivityTypeSchema } from '../../enums/PurchaseRequestActivityType.schema';
// prettier-ignore
export const PurchaseRequestActivityInputSchema = z.object({
    id: z.string(),
    purchaseRequestId: z.string(),
    type: PurchaseRequestActivityTypeSchema,
    note: z.string().optional().nullable(),
    actorUserId: z.string().optional().nullable(),
    followUpAt: z.date().optional().nullable(),
    createdAt: z.date(),
    purchaseRequest: z.unknown(),
    actor: z.unknown().optional().nullable()
}).strict();

export type PurchaseRequestActivityInputType = z.infer<typeof PurchaseRequestActivityInputSchema>;
