import * as z from 'zod';

export const OrderItemKindSchema = z.enum(['PRODUCT', 'SERVICE', 'DISCOUNT'])

export type OrderItemKind = z.infer<typeof OrderItemKindSchema>;