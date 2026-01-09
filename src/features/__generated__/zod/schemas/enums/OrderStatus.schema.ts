import * as z from 'zod';

export const OrderStatusSchema = z.enum(['DRAFT', 'PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'POSTED', 'RESERVED'])

export type OrderStatus = z.infer<typeof OrderStatusSchema>;