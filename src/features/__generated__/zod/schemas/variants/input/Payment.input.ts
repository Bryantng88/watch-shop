import * as z from 'zod';

import { PaymentMethodSchema } from '../../enums/PaymentMethod.schema';
import { paymentdirectionSchema } from '../../enums/paymentdirection.schema';
import { PaymentStatusSchema } from '../../enums/PaymentStatus.schema';
import { PaymentPurposeSchema } from '../../enums/PaymentPurpose.schema';
import { PaymentTypeSchema } from '../../enums/PaymentType.schema';
// prettier-ignore
export const PaymentInputSchema = z.object({
    id: z.string(),
    method: PaymentMethodSchema,
    amount: z.number(),
    currency: z.string(),
    paidAt: z.date(),
    reference: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    createdAt: z.date(),
    direction: paymentdirectionSchema.optional().nullable(),
    order_id: z.string().optional().nullable(),
    service_request_id: z.string().optional().nullable(),
    vendor_id: z.string().optional().nullable(),
    acquisition_id: z.string().optional().nullable(),
    status: PaymentStatusSchema,
    purpose: PaymentPurposeSchema,
    shipment_id: z.string().optional().nullable(),
    type: PaymentTypeSchema
}).strict();

export type PaymentInputType = z.infer<typeof PaymentInputSchema>;
