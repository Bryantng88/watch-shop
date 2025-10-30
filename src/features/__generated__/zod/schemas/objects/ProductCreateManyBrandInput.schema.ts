import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { PriceVisibilitySchema } from '../enums/PriceVisibility.schema';
import { TagSchema } from '../enums/Tag.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  slug: z.string().optional().nullable(),
  title: z.string(),
  primaryImageUrl: z.string().optional().nullable(),
  contentStatus: ContentStatusSchema.optional(),
  type: ProductTypeSchema,
  priceVisibility: PriceVisibilitySchema.optional(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  isStockManaged: z.boolean().optional(),
  maxQtyPerOrder: z.number().int().optional(),
  publishedAt: z.coerce.date().optional().nullable(),
  vendorId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tag: TagSchema.optional()
}).strict();
export const ProductCreateManyBrandInputObjectSchema: z.ZodType<Prisma.ProductCreateManyBrandInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateManyBrandInput>;
export const ProductCreateManyBrandInputObjectZodSchema = makeSchema();
