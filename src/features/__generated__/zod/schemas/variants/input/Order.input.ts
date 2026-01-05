import * as z from 'zod';

import { OrderStatusSchema } from '../../enums/OrderStatus.schema';
import { PaymentStatusSchema } from '../../enums/PaymentStatus.schema';
import { PaymentMethodSchema } from '../../enums/PaymentMethod.schema';
import { reservetypeSchema } from '../../enums/reservetype.schema';
// prettier-ignore
export const OrderInputSchema = z.object({
    id: z.string(),
    refNo: z.string().optional().nullable(),
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
    hasShipment: z.boolean(),
    reservetype: reservetypeSchema.optional().nullable(),
    reserveuntil: z.date().optional().nullable(),
    depositqequired: z.number().optional().nullable(),
    depositpaid: z.number().optional().nullable(),
    Invoice: z.array(z.unknown()),
    customer: z.unknown().optional().nullable(),
    items: z.array(z.unknown()),
    Shipment: z.unknown().optional().nullable()
}).strict();

export type OrderInputType = z.infer<typeof OrderInputSchema>;
