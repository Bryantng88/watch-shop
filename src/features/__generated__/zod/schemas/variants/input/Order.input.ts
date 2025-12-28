import * as z from 'zod';

import { OrderStatusSchema } from '../../enums/OrderStatus.schema';
import { PaymentStatusSchema } from '../../enums/PaymentStatus.schema';
import { PaymentMethodSchema } from '../../enums/PaymentMethod.schema';
// prettier-ignore
export const OrderInputSchema = z.object({
    id: z.string(),
    refNo: z.string(),
    customerId: z.string().optional().nullable(),
    shipPhone: z.string(),
    shipAddress: z.string(),
    shipWard: z.string().optional().nullable(),
    shipCity: z.string(),
    subtotal: z.number(),
    shippingFee: z.number().optional().nullable(),
    status: OrderStatusSchema,
    paymentStatus: PaymentStatusSchema,
    paymentMethod: PaymentMethodSchema.optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    customerName: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    shipDistrict: z.string().optional().nullable(),
    Invoice: z.array(z.unknown()),
    customer: z.unknown().optional().nullable(),
    items: z.array(z.unknown())
}).strict();

export type OrderInputType = z.infer<typeof OrderInputSchema>;
