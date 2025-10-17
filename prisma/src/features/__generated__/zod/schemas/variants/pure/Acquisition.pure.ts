import * as z from 'zod';

import { AcquisitionTypeSchema } from '../../enums/AcquisitionType.schema';
// prettier-ignore
export const AcquisitionModelSchema = z.object({
    id: z.string(),
    vendorId: z.string().nullable(),
    customerId: z.string().nullable(),
    type: AcquisitionTypeSchema,
    acquiredAt: z.date(),
    cost: z.number().nullable(),
    currency: z.string().nullable(),
    payoutStatus: z.string().nullable(),
    refNo: z.string().nullable(),
    notes: z.string().nullable(),
    condition: z.string().nullable(),
    warrantyUntil: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    customer: z.unknown().nullable(),
    vendor: z.unknown().nullable(),
    AcquisitionItem: z.array(z.unknown()),
    Invoice: z.array(z.unknown())
}).strict();

export type AcquisitionPureType = z.infer<typeof AcquisitionModelSchema>;
