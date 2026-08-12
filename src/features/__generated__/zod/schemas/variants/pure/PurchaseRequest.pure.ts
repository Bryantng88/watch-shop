import * as z from 'zod';

import { PurchaseRequestStatusSchema } from '../../enums/PurchaseRequestStatus.schema';
import { PurchaseRequestOutcomeSchema } from '../../enums/PurchaseRequestOutcome.schema';
import { PurchaseRequestContactPreferenceSchema } from '../../enums/PurchaseRequestContactPreference.schema';
// prettier-ignore
export const PurchaseRequestModelSchema = z.object({
    id: z.string(),
    reference: z.string(),
    status: PurchaseRequestStatusSchema,
    outcome: PurchaseRequestOutcomeSchema.nullable(),
    channel: z.string(),
    externalRequestId: z.string().nullable(),
    requestKey: z.string(),
    requestHash: z.string(),
    fingerprintHash: z.string(),
    customerName: z.string(),
    phone: z.string(),
    normalizedPhone: z.string(),
    contactPreference: PurchaseRequestContactPreferenceSchema,
    contactHandle: z.string().nullable(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    district: z.string().nullable(),
    ward: z.string().nullable(),
    customerNote: z.string().nullable(),
    processingNote: z.string().nullable(),
    completionReason: z.string().nullable(),
    assignedUserId: z.string().nullable(),
    followUpAt: z.date().nullable(),
    processingStartedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
    orderId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    items: z.array(z.unknown()),
    activities: z.array(z.unknown()),
    ingressReceipts: z.array(z.unknown()),
    order: z.unknown().nullable(),
    assignedUser: z.unknown().nullable()
}).strict();

export type PurchaseRequestPureType = z.infer<typeof PurchaseRequestModelSchema>;
