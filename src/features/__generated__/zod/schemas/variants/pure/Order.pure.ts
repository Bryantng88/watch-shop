import * as z from 'zod';

import { OrderStatusSchema } from '../../enums/OrderStatus.schema';
import { PaymentStatusSchema } from '../../enums/PaymentStatus.schema';
import { PaymentMethodSchema } from '../../enums/PaymentMethod.schema';
import { ReserveTypeSchema } from '../../enums/ReserveType.schema';
import { OrderSourceSchema } from '../../enums/OrderSource.schema';
import { OrderVerificationStatusSchema } from '../../enums/OrderVerificationStatus.schema';
import { OrderFlowTypeSchema } from '../../enums/OrderFlowType.schema';
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
    shippingAmount: z.number().nullable(),
    status: OrderStatusSchema,
    paymentStatus: PaymentStatusSchema,
    paymentMethod: PaymentMethodSchema.nullable(),
    depositPaymentMethod: PaymentMethodSchema.nullable(),
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
    quick_from_product_id: z.string().nullable(),
    quickFromProductId: z.string().nullable(),
    quickFlowType: OrderFlowTypeSchema,
    Invoice: z.array(z.unknown()),
    customer: z.unknown().nullable(),
    orderItem: z.array(z.unknown()),
    shipments: z.array(z.unknown()),
    Task: z.array(z.unknown())
}).strict();

export type OrderPureType = z.infer<typeof OrderModelSchema>;
