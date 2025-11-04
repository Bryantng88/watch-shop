import * as z from 'zod';

import { AvailabilityStatusSchema } from '../../enums/AvailabilityStatus.schema';
// prettier-ignore
export const ProductVariantInputSchema = z.object({
    id: z.string(),
    productId: z.string(),
    sku: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    price: z.number().optional().nullable(),
    stockQty: z.number().int(),
    isStockManaged: z.boolean().optional().nullable(),
    maxQtyPerOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    availabilityStatus: AvailabilityStatusSchema,
    acquisitionItem: z.array(z.unknown()),
    invoiceItem: z.array(z.unknown()),
    maintenancePart: z.array(z.unknown()),
    maintenanceRecord: z.array(z.unknown()),
    partSpec: z.unknown().optional().nullable(),
    product: z.unknown(),
    serviceRequest: z.array(z.unknown()),
    strapSpec: z.unknown().optional().nullable()
}).strict();

export type ProductVariantInputType = z.infer<typeof ProductVariantInputSchema>;
