import * as z from 'zod';

import { ProductStatusSchema } from '../../enums/ProductStatus.schema';
import { ProductTypeSchema } from '../../enums/ProductType.schema';
import { TagSchema } from '../../enums/Tag.schema';
// prettier-ignore
export const ProductResultSchema = z.object({
    id: z.string(),
    slug: z.string().nullable(),
    title: z.string(),
    status: ProductStatusSchema,
    primaryImageUrl: z.string().nullable(),
    type: ProductTypeSchema,
    brandId: z.string().nullable(),
    seoTitle: z.string().nullable(),
    seoDescription: z.string().nullable(),
    isStockManaged: z.boolean(),
    maxQtyPerOrder: z.number().int(),
    publishedAt: z.date().nullable(),
    vendorId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tag: TagSchema,
    AcquisitionItem: z.array(z.unknown()),
    InvoiceItem: z.array(z.unknown()),
    maintenanceRecords: z.array(z.unknown()),
    orderItems: z.array(z.unknown()),
    brand: z.unknown().nullable(),
    vendor: z.unknown().nullable(),
    image: z.array(z.unknown()),
    variants: z.array(z.unknown()),
    Reservation: z.array(z.unknown()),
    ServiceRequest: z.array(z.unknown()),
    watchSpec: z.unknown().nullable()
}).strict();

export type ProductResultType = z.infer<typeof ProductResultSchema>;
