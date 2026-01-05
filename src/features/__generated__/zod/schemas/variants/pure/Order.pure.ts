import * as z from 'zod';

import { OrderStatusSchema } from '../../enums/OrderStatus.schema';
import { PaymentStatusSchema } from '../../enums/PaymentStatus.schema';
import { PaymentMethodSchema } from '../../enums/PaymentMethod.schema';
// prettier-ignore
export const OrderModelSchema = z.object({
    id: z.string(),
    refNo: z.string().nullable(),
    customerId: z.string().nullable(),
    shipPhone: z.string(),
    shipAddress: z.string(),
    shipWard: z.string().nullable(),
    shipCity: z.string(),
    subtotal: z.number(),
    shippingFee: z.number().nullable(),
    status: OrderStatusSchema,
    paymentStatus: PaymentStatusSchema,
    paymentMethod: PaymentMethodSchema.nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    customerName: z.string().nullable(),
    notes: z.string().nullable(),
    shipDistrict: z.string().nullable(),
    hasShipment: z.boolean(),
    Invoice: z.array(z.unknown()),
    customer: z.unknown().nullable(),
    items: z.array(z.unknown()),
    Shipment: z.unknown().nullable()
}).strict();

export type OrderPureType = z.infer<typeof OrderModelSchema>;
