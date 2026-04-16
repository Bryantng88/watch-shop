import * as z from 'zod';

import { AvailabilityStatusSchema } from '../../enums/AvailabilityStatus.schema';
import { DiscountTypeSchema } from '../../enums/DiscountType.schema';
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
    availabilityStatus: AvailabilityStatusSchema,
    listPrice: z.number().nullable(),
    discountType: DiscountTypeSchema.nullable(),
    discountValue: z.number().nullable(),
    salePrice: z.number().nullable(),
    saleStartsAt: z.date().nullable(),
    saleEndsAt: z.date().nullable(),
    costPrice: z.number().nullable(),
    acquisitionItem: z.array(z.unknown()),
    invoiceItem: z.array(z.unknown()),
    maintenancePart: z.array(z.unknown()),
    maintenanceRecord: z.array(z.unknown()),
    partSpec: z.unknown().nullable(),
    product: z.unknown(),
    serviceRequest: z.array(z.unknown()),
    strapSpec: z.unknown().nullable()
}).strict();

export type ProductVariantPureType = z.infer<typeof ProductVariantModelSchema>;
