import * as z from 'zod';

export const paymentdirectionSchema = z.enum(['IN', 'OUT'])

export type paymentdirection = z.infer<typeof paymentdirectionSchema>;