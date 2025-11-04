import * as z from 'zod';

import { AcquisitionTypeSchema } from '../../enums/AcquisitionType.schema';
import { AcquisitionStatusSchema } from '../../enums/AcquisitionStatus.schema';
// prettier-ignore
export const AcquisitionResultSchema = z.object({
    id: z.string(),
    vendorId: z.string().nullable(),
    customerId: z.string().nullable(),
    type: AcquisitionTypeSchema,
    acquiredAt: z.date(),
    cost: z.number().nullable(),
    currency: z.string().nullable(),
    payoutStatus: z.string().nullable(),
    accquisitionStt: AcquisitionStatusSchema,
    refNo: z.string().nullable(),
    notes: z.string().nullable(),
    condition: z.string().nullable(),
    warrantyUntil: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    customer: z.unknown().nullable(),
    vendor: z.unknown().nullable(),
    acquisitionItem: z.array(z.unknown()),
    invoice: z.array(z.unknown())
}).strict();

export type AcquisitionResultType = z.infer<typeof AcquisitionResultSchema>;
