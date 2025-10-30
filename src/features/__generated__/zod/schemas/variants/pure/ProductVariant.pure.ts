import * as z from 'zod';

import { AvailabilityStatusSchema } from '../../enums/AvailabilityStatus.schema';
// prettier-ignore
export const ProductVariantModelSchema = z.object({
    id: z.string(),
    productId: z.string(),
    sku: z.string().nullable(),
    name: z.string().nullable(),
    price: z.number().nullable(),
    stockQty: z.number().int(),
    isStockManaged: z.boolean().nullable(),
    maxQtyPerOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    availabilityStatuts: AvailabilityStatusSchema,
    AcquisitionItem: z.array(z.unknown()),
    InvoiceItem: z.array(z.unknown()),
    MaintenancePart: z.array(z.unknown()),
    MaintenanceRecord: z.array(z.unknown()),
    partSpec: z.unknown().nullable(),
    product: z.unknown(),
    ServiceRequest: z.array(z.unknown()),
    strapSpec: z.unknown().nullable()
}).strict();

export type ProductVariantPureType = z.infer<typeof ProductVariantModelSchema>;
