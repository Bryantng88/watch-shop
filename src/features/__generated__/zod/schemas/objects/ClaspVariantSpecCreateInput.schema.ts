import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema';
import { ProductVariantCreateNestedOneWithoutClaspVariantSpecInputObjectSchema as ProductVariantCreateNestedOneWithoutClaspVariantSpecInputObjectSchema } from './ProductVariantCreateNestedOneWithoutClaspVariantSpecInput.schema'

const makeSchema = () => z.object({
  claspType: StrapClaspTypeSchema,
  widthMM: z.number().int(),
  originType: StrapOriginTypeSchema.optional(),
  brandName: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  finish: z.string().optional().nullable(),
  minStockQty: z.number().int().optional(),
  targetStockQty: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  ProductVariant: z.lazy(() => ProductVariantCreateNestedOneWithoutClaspVariantSpecInputObjectSchema)
}).strict();
export const ClaspVariantSpecCreateInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecCreateInput>;
export const ClaspVariantSpecCreateInputObjectZodSchema = makeSchema();
