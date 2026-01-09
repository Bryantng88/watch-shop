import * as z from 'zod';

export const OrderVerificationStatusSchema = z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED'])

export type OrderVerificationStatus = z.infer<typeof OrderVerificationStatusSchema>;