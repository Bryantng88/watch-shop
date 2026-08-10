import * as z from 'zod';

import { PurchaseRequestStatusSchema } from '../../enums/PurchaseRequestStatus.schema';
import { PurchaseRequestOutcomeSchema } from '../../enums/PurchaseRequestOutcome.schema';
import { PurchaseRequestContactPreferenceSchema } from '../../enums/PurchaseRequestContactPreference.schema';
// prettier-ignore
export const PurchaseRequestInputSchema = z.object({
    id: z.string(),
    reference: z.string(),
    status: PurchaseRequestStatusSchema,
    outcome: PurchaseRequestOutcomeSchema.optional().nullable(),
    channel: z.string(),
    externalRequestId: z.string().optional().nullable(),
    requestKey: z.string(),
    requestHash: z.string(),
    fingerprintHash: z.string(),
    customerName: z.string(),
    phone: z.string(),
    contactPreference: PurchaseRequestContactPreferenceSchema,
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    district: z.string().optional().nullable(),
    ward: z.string().optional().nullable(),
    customerNote: z.string().optional().nullable(),
    processingNote: z.string().optional().nullable(),
    completionReason: z.string().optional().nullable(),
    assignedUserId: z.string().optional().nullable(),
    followUpAt: z.date().optional().nullable(),
    processingStartedAt: z.date().optional().nullable(),
    completedAt: z.date().optional().nullable(),
    orderId: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    items: z.array(z.unknown()),
    activities: z.array(z.unknown()),
    order: z.unknown().optional().nullable(),
    assignedUser: z.unknown().optional().nullable()
}).strict();

export type PurchaseRequestInputType = z.infer<typeof PurchaseRequestInputSchema>;
