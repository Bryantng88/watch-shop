import * as z from 'zod';

import { ShipmentStatusSchema } from '../../enums/ShipmentStatus.schema';
import { ShippingFeePayerSchema } from '../../enums/ShippingFeePayer.schema';
// prettier-ignore
export const ShipmentInputSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    shipPhone: z.string().optional().nullable(),
    shipAddress: z.string().optional().nullable(),
    shipCity: z.string().optional().nullable(),
    shipDistrict: z.string().optional().nullable(),
    shipWard: z.string().optional().nullable(),
    carrier: z.string().optional().nullable(),
    trackingCode: z.string().optional().nullable(),
    shippingAmount: z.number(),
    currency: z.string(),
    shippedAt: z.date().optional().nullable(),
    deliveredAt: z.date().optional().nullable(),
    notes: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    status: ShipmentStatusSchema,
    shippingFeePayer: ShippingFeePayerSchema.optional().nullable(),
    refNo: z.string().optional().nullable(),
    orderRefNo: z.string().optional().nullable(),
    customerName: z.string().optional().nullable(),
    order: z.unknown(),
    task: z.array(z.unknown()),
    workCase: z.array(z.unknown())
}).strict();

export type ShipmentInputType = z.infer<typeof ShipmentInputSchema>;
