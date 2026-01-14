import * as z from 'zod';

import { PaymentMethodSchema } from '../../enums/PaymentMethod.schema';
import { paymentdirectionSchema } from '../../enums/paymentdirection.schema';
import { PaymentStatusSchema } from '../../enums/PaymentStatus.schema';
import { PaymentPurposeSchema } from '../../enums/PaymentPurpose.schema';
import { PaymentTypeSchema } from '../../enums/PaymentType.schema';
// prettier-ignore
export const PaymentModelSchema = z.object({
    id: z.string(),
    method: PaymentMethodSchema,
    amount: z.number(),
    currency: z.string(),
    paidAt: z.date(),
    reference: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date(),
    direction: paymentdirectionSchema.nullable(),
    order_id: z.string().nullable(),
    service_request_id: z.string().nullable(),
    vendor_id: z.string().nullable(),
    acquisition_id: z.string().nullable(),
    status: PaymentStatusSchema,
    purpose: PaymentPurposeSchema,
    shipment_id: z.string().nullable(),
    type: PaymentTypeSchema
}).strict();

export type PaymentPureType = z.infer<typeof PaymentModelSchema>;
