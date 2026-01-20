import * as z from 'zod';

import { shipmentstatusSchema } from '../../enums/shipmentstatus.schema';
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
    shippingFee: z.number(),
    currency: z.string(),
    shippedAt: z.date().optional().nullable(),
    deliveredAt: z.date().optional().nullable(),
    notes: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    status: shipmentstatusSchema,
    refNo: z.string().optional().nullable(),
    orderRefNo: z.string().optional().nullable(),
    customerName: z.string().optional().nullable(),
    Order: z.unknown()
}).strict();

export type ShipmentInputType = z.infer<typeof ShipmentInputSchema>;
