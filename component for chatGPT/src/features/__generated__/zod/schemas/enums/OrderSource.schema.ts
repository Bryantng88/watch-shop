import * as z from 'zod';

export const OrderSourceSchema = z.enum(['WEB', 'ADMIN'])

export type OrderSource = z.infer<typeof OrderSourceSchema>;