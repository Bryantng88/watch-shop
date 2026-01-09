import * as z from 'zod';

import { OrderStatusSchema } from '../../enums/OrderStatus.schema';
import { PaymentStatusSchema } from '../../enums/PaymentStatus.schema';
import { PaymentMethodSchema } from '../../enums/PaymentMethod.schema';
import { ReserveTypeSchema } from '../../enums/ReserveType.schema';
import { OrderSourceSchema } from '../../enums/OrderSource.schema';
import { OrderVerificationStatusSchema } from '../../enums/OrderVerificationStatus.schema';
// prettier-ignore
export const OrderResultSchema = z.object({
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
    reserveType: ReserveTypeSchema.nullable(),
    reserveUntil: z.date().nullable(),
    depositRequired: z.number().nullable(),
    depositPaid: z.number().nullable(),
    source: OrderSourceSchema,
    verificationStatus: OrderVerificationStatusSchema,
    Invoice: z.array(z.unknown()),
    customer: z.unknown().nullable(),
    items: z.array(z.unknown()),
    Shipment: z.unknown().nullable()
}).strict();

export type OrderResultType = z.infer<typeof OrderResultSchema>;
