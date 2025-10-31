import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AvailabilityStatusSchema } from '../enums/AvailabilityStatus.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  productId: z.string(),
  sku: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  stockQty: z.number().int().optional(),
  isStockManaged: z.boolean().optional().nullable(),
  maxQtyPerOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  availabilityStatus: AvailabilityStatusSchema.optional()
}).strict();
export const ProductVariantCreateManyInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateManyInput>;
export const ProductVariantCreateManyInputObjectZodSchema = makeSchema();
