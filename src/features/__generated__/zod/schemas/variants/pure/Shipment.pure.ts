import * as z from 'zod';

import { shipmentstatusSchema } from '../../enums/shipmentstatus.schema';
// prettier-ignore
export const ShipmentModelSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    shipPhone: z.string().nullable(),
    shipAddress: z.string().nullable(),
    shipCity: z.string().nullable(),
    shipDistrict: z.string().nullable(),
    shipWard: z.string().nullable(),
    carrier: z.string().nullable(),
    trackingCode: z.string().nullable(),
    shippingFee: z.number(),
    currency: z.string(),
    shippedAt: z.date().nullable(),
    deliveredAt: z.date().nullable(),
    notes: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    status: shipmentstatusSchema,
    Order: z.unknown()
}).strict();

export type ShipmentPureType = z.infer<typeof ShipmentModelSchema>;
