import * as z from 'zod';

export const PaymentPurposeSchema = z.enum(['ORDER_DEPOSIT', 'ORDER_REMAIN', 'ORDER_FULL'])

export type PaymentPurpose = z.infer<typeof PaymentPurposeSchema>;