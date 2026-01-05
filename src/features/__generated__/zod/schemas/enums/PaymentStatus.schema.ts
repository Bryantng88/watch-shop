import * as z from 'zod';

export const paymentstatusSchema = z.enum(['PENDING', 'PAID', 'CANCELLED'])

export type paymentstatus = z.infer<typeof paymentstatusSchema>;