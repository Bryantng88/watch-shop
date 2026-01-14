import * as z from 'zod';

export const PaymentTypeSchema = z.enum(['ORDER', 'SHIPMENT', 'INVOICE', 'ACQUISITION', 'SERVICE', 'OTHER'])

export type PaymentType = z.infer<typeof PaymentTypeSchema>;