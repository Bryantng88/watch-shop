import * as z from 'zod';

import { OrderStatusSchema } from '../../enums/OrderStatus.schema';
import { PaymentStatusSchema } from '../../enums/PaymentStatus.schema';
import { PaymentMethodSchema } from '../../enums/PaymentMethod.schema';
// prettier-ignore
export const OrderModelSchema = z.object({
    id: z.string(),
    orderCode: z.string(),
    customerId: z.string().nullable(),
    shipName: z.string(),
    shipPhone: z.string(),
    shipEmail: z.string(),
    shipAddress: z.string(),
    shipWard: z.string().nullable(),
    shipCity: z.string(),
    subtotal: z.number(),
    shippingFee: z.number().nullable(),
    total: z.number(),
    status: OrderStatusSchema,
    paymentStatus: PaymentStatusSchema,
    paymentMethod: PaymentMethodSchema.nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    Invoice: z.array(z.unknown()),
    customer: z.unknown().nullable(),
    items: z.array(z.unknown())
}).strict();

export type OrderPureType = z.infer<typeof OrderModelSchema>;
