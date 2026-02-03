import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { PriceVisibilitySchema } from '../enums/PriceVisibility.schema';
import { TagSchema } from '../enums/Tag.schema';
import { ProductStatusSchema } from '../enums/ProductStatus.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  slug: z.string().optional().nullable(),
  title: z.string(),
  primaryImageUrl: z.string().optional().nullable(),
  type: ProductTypeSchema,
  priceVisibility: PriceVisibilitySchema.optional(),
  brandId: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  isStockManaged: z.boolean().optional(),
  maxQtyPerOrder: z.number().int().optional(),
  publishedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tag: TagSchema.optional(),
  status: ProductStatusSchema.optional()
}).strict();
export const ProductCreateManyVendorInputObjectSchema: z.ZodType<Prisma.ProductCreateManyVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateManyVendorInput>;
export const ProductCreateManyVendorInputObjectZodSchema = makeSchema();
