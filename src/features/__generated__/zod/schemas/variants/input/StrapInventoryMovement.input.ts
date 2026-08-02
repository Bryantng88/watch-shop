import * as z from 'zod';

import { StrapInventoryMovementTypeSchema } from '../../enums/StrapInventoryMovementType.schema';
// prettier-ignore
export const StrapInventoryMovementInputSchema = z.object({
    id: z.string(),
    strapVariantId: z.string(),
    movementType: StrapInventoryMovementTypeSchema,
    quantity: z.number().int(),
    balanceAfter: z.number().int().optional().nullable(),
    watchId: z.string().optional().nullable(),
    orderId: z.string().optional().nullable(),
    serviceRequestId: z.string().optional().nullable(),
    actorUserId: z.string().optional().nullable(),
    sourceType: z.string().optional().nullable(),
    sourceId: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    createdAt: z.date(),
    strapVariant: z.unknown()
}).strict();

export type StrapInventoryMovementInputType = z.infer<typeof StrapInventoryMovementInputSchema>;
