import * as z from 'zod';

import { ShipmentStatusSchema } from '../../enums/ShipmentStatus.schema';
import { ShippingFeePayerSchema } from '../../enums/ShippingFeePayer.schema';
// prettier-ignore
export const ShipmentResultSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    shipPhone: z.string().nullable(),
    shipAddress: z.string().nullable(),
    shipCity: z.string().nullable(),
    shipDistrict: z.string().nullable(),
    shipWard: z.string().nullable(),
    carrier: z.string().nullable(),
    trackingCode: z.string().nullable(),
    shippingAmount: z.number(),
    currency: z.string(),
    shippedAt: z.date().nullable(),
    deliveredAt: z.date().nullable(),
    notes: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    status: ShipmentStatusSchema,
    shippingFeePayer: ShippingFeePayerSchema.nullable(),
    refNo: z.string().nullable(),
    orderRefNo: z.string().nullable(),
    customerName: z.string().nullable(),
    order: z.unknown(),
    task: z.array(z.unknown()),
    workCase: z.array(z.unknown())
}).strict();

export type ShipmentResultType = z.infer<typeof ShipmentResultSchema>;
