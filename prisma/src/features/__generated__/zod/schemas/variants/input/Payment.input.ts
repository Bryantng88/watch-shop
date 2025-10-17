import * as z from 'zod';

import { PaymentMethodSchema } from '../../enums/PaymentMethod.schema';
// prettier-ignore
export const PaymentInputSchema = z.object({
    id: z.string(),
    invoiceId: z.string(),
    method: PaymentMethodSchema,
    amount: z.number(),
    currency: z.string(),
    paidAt: z.date(),
    reference: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    createdAt: z.date(),
    invoice: z.unknown()
}).strict();

export type PaymentInputType = z.infer<typeof PaymentInputSchema>;
