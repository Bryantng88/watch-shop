import * as z from 'zod';

import { ContentStatusSchema } from '../../enums/ContentStatus.schema';
import { ProductTypeSchema } from '../../enums/ProductType.schema';
import { PriceVisibilitySchema } from '../../enums/PriceVisibility.schema';
import { TagSchema } from '../../enums/Tag.schema';
// prettier-ignore
export const ProductModelSchema = z.object({
    id: z.string(),
    slug: z.string().nullable(),
    title: z.string(),
    primaryImageUrl: z.string().nullable(),
    contentStatus: ContentStatusSchema,
    type: ProductTypeSchema,
    priceVisibility: PriceVisibilitySchema,
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

export type ProductPureType = z.infer<typeof ProductModelSchema>;
