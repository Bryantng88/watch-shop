import * as z from 'zod';

export const PaymentPurposeSchema = z.enum(['ORDER_DEPOSIT', 'ORDER_REMAIN', 'ORDER_FULL', 'SERVICE_REQUEST', 'MAINTENANCE_COST', 'SERVICE_FEE', 'ACQUISITION_DEPOSIT', 'ACQUISITION_REMAIN', 'ACQUISITION_FULL', 'SHIPMENT_COST'])

export type PaymentPurpose = z.infer<typeof PaymentPurposeSchema>;