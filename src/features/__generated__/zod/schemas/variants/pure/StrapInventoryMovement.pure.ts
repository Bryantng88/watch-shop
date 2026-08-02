import * as z from 'zod';

import { StrapInventoryMovementTypeSchema } from '../../enums/StrapInventoryMovementType.schema';
// prettier-ignore
export const StrapInventoryMovementModelSchema = z.object({
    id: z.string(),
    strapVariantId: z.string(),
    movementType: StrapInventoryMovementTypeSchema,
    quantity: z.number().int(),
    balanceAfter: z.number().int().nullable(),
    watchId: z.string().nullable(),
    orderId: z.string().nullable(),
    serviceRequestId: z.string().nullable(),
    actorUserId: z.string().nullable(),
    sourceType: z.string().nullable(),
    sourceId: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date(),
    strapVariant: z.unknown()
}).strict();

export type StrapInventoryMovementPureType = z.infer<typeof StrapInventoryMovementModelSchema>;
