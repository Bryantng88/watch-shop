import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AvailabilityStatusSchema } from '../enums/AvailabilityStatus.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  sku: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  stockQty: z.number().int().optional(),
  isStockManaged: z.boolean().optional().nullable(),
  maxQtyPerOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  availabilityStatuts: AvailabilityStatusSchema.optional()
}).strict();
export const ProductVariantCreateManyProductInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateManyProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateManyProductInput>;
export const ProductVariantCreateManyProductInputObjectZodSchema = makeSchema();
