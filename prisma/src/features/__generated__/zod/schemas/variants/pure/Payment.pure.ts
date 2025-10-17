import * as z from 'zod';

import { PaymentMethodSchema } from '../../enums/PaymentMethod.schema';
// prettier-ignore
export const PaymentModelSchema = z.object({
    id: z.string(),
    invoiceId: z.string(),
    method: PaymentMethodSchema,
    amount: z.number(),
    currency: z.string(),
    paidAt: z.date(),
    reference: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date(),
    invoice: z.unknown()
}).strict();

export type PaymentPureType = z.infer<typeof PaymentModelSchema>;
