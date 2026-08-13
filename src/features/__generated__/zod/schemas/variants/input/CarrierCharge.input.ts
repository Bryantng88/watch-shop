import * as z from 'zod';

import { CarrierChargeKindSchema } from '../../enums/CarrierChargeKind.schema';
import { CarrierSettlementStatusSchema } from '../../enums/CarrierSettlementStatus.schema';
// prettier-ignore
export const CarrierChargeInputSchema = z.object({
    id: z.string(),
    shipmentId: z.string(),
    kind: CarrierChargeKindSchema,
    currency: z.string(),
    estimatedAmount: z.number().optional().nullable(),
    chargedAmount: z.number().optional().nullable(),
    settlementStatus: CarrierSettlementStatusSchema,
    settlementRef: z.string().optional().nullable(),
    settledAt: z.date().optional().nullable(),
    metadataJson: z.unknown().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    shipment: z.unknown()
}).strict();

export type CarrierChargeInputType = z.infer<typeof CarrierChargeInputSchema>;
