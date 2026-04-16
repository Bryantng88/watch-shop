import * as z from 'zod';

import { AvailabilityStatusSchema } from '../../enums/AvailabilityStatus.schema';
import { DiscountTypeSchema } from '../../enums/DiscountType.schema';
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
    listPrice: z.number().optional().nullable(),
    discountType: DiscountTypeSchema.optional().nullable(),
    discountValue: z.number().optional().nullable(),
    salePrice: z.number().optional().nullable(),
    saleStartsAt: z.date().optional().nullable(),
    saleEndsAt: z.date().optional().nullable(),
    costPrice: z.number().optional().nullable(),
    AcquisitionItem: z.array(z.unknown()),
    InvoiceItem: z.array(z.unknown()),
    MaintenancePart: z.array(z.unknown()),
    MaintenanceRecord: z.array(z.unknown()),
    PartVariantSpec: z.unknown().optional().nullable(),
    Product: z.unknown(),
    ServiceRequest: z.array(z.unknown()),
    StrapVariantSpec: z.unknown().optional().nullable()
}).strict();

export type ProductVariantInputType = z.infer<typeof ProductVariantInputSchema>;
