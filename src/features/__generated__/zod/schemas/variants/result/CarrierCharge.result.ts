import * as z from 'zod';

import { CarrierChargeKindSchema } from '../../enums/CarrierChargeKind.schema';
import { CarrierSettlementStatusSchema } from '../../enums/CarrierSettlementStatus.schema';
// prettier-ignore
export const CarrierChargeResultSchema = z.object({
    id: z.string(),
    shipmentId: z.string(),
    kind: CarrierChargeKindSchema,
    currency: z.string(),
    estimatedAmount: z.number().nullable(),
    chargedAmount: z.number().nullable(),
    settlementStatus: CarrierSettlementStatusSchema,
    settlementRef: z.string().nullable(),
    settledAt: z.date().nullable(),
    metadataJson: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    shipment: z.unknown()
}).strict();

export type CarrierChargeResultType = z.infer<typeof CarrierChargeResultSchema>;
