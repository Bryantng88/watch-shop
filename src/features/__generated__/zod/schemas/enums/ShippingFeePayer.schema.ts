import * as z from 'zod';

export const ShippingFeePayerSchema = z.enum(['BUSINESS', 'CUSTOMER'])

export type ShippingFeePayer = z.infer<typeof ShippingFeePayerSchema>;