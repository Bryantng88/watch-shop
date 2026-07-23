import * as z from 'zod';

import { AcquisitionTypeSchema } from '../../enums/AcquisitionType.schema';
import { AcquisitionStatusSchema } from '../../enums/AcquisitionStatus.schema';
import { AudienceSegmentSchema } from '../../enums/AudienceSegment.schema';
// prettier-ignore
export const AcquisitionInputSchema = z.object({
    id: z.string(),
    vendorId: z.string().optional().nullable(),
    customerId: z.string().optional().nullable(),
    type: AcquisitionTypeSchema,
    acquiredAt: z.date(),
    totalAmount: z.number().optional().nullable(),
    currency: z.string().optional().nullable(),
    payoutStatus: z.string().optional().nullable(),
    accquisitionStt: AcquisitionStatusSchema,
    refNo: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    condition: z.string().optional().nullable(),
    warrantyUntil: z.date().optional().nullable(),
    audienceSegment: AudienceSegmentSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
    sentAt: z.date().optional().nullable(),
    returnedAt: z.date().optional().nullable(),
    customer: z.unknown().optional().nullable(),
    vendor: z.unknown().optional().nullable(),
    acquisitionItem: z.array(z.unknown()),
    Invoice: z.array(z.unknown()),
    Task: z.array(z.unknown())
}).strict();

export type AcquisitionInputType = z.infer<typeof AcquisitionInputSchema>;
