import * as z from 'zod';

import { AcquisitionTypeSchema } from '../../enums/AcquisitionType.schema';
import { AcquisitionStatusSchema } from '../../enums/AcquisitionStatus.schema';
// prettier-ignore
export const AcquisitionInputSchema = z.object({
    id: z.string(),
    vendorId: z.string().optional().nullable(),
    customerId: z.string().optional().nullable(),
    type: AcquisitionTypeSchema,
    acquiredAt: z.date(),
    cost: z.number().optional().nullable(),
    currency: z.string().optional().nullable(),
    payoutStatus: z.string().optional().nullable(),
    accquisitionStt: AcquisitionStatusSchema,
    refNo: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    condition: z.string().optional().nullable(),
    warrantyUntil: z.date().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    customer: z.unknown().optional().nullable(),
    vendor: z.unknown().optional().nullable(),
    AcquisitionItem: z.array(z.unknown()),
    Invoice: z.array(z.unknown())
}).strict();

export type AcquisitionInputType = z.infer<typeof AcquisitionInputSchema>;
