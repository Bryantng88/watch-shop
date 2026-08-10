import * as z from 'zod';

import { PurchaseRequestActivityTypeSchema } from '../../enums/PurchaseRequestActivityType.schema';
// prettier-ignore
export const PurchaseRequestActivityModelSchema = z.object({
    id: z.string(),
    purchaseRequestId: z.string(),
    type: PurchaseRequestActivityTypeSchema,
    note: z.string().nullable(),
    actorUserId: z.string().nullable(),
    followUpAt: z.date().nullable(),
    createdAt: z.date(),
    purchaseRequest: z.unknown(),
    actor: z.unknown().nullable()
}).strict();

export type PurchaseRequestActivityPureType = z.infer<typeof PurchaseRequestActivityModelSchema>;
