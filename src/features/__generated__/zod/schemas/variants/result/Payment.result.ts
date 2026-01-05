import * as z from 'zod';

import { PaymentMethodSchema } from '../../enums/PaymentMethod.schema';
import { paymentdirectionSchema } from '../../enums/paymentdirection.schema';
import { paymentstatusSchema } from '../../enums/paymentstatus.schema';
// prettier-ignore
export const PaymentResultSchema = z.object({
    id: z.string(),
    method: PaymentMethodSchema,
    amount: z.number(),
    currency: z.string(),
    paidAt: z.date(),
    reference: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date(),
    direction: paymentdirectionSchema.nullable(),
    status: paymentstatusSchema.nullable(),
    order_id: z.string().nullable(),
    service_request_id: z.string().nullable(),
    vendor_id: z.string().nullable(),
    acquisition_id: z.string().nullable()
}).strict();

export type PaymentResultType = z.infer<typeof PaymentResultSchema>;
