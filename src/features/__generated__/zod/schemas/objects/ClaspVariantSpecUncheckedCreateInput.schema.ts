import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema'

const makeSchema = () => z.object({
  variantId: z.string(),
  claspType: StrapClaspTypeSchema,
  widthMM: z.number().int(),
  originType: StrapOriginTypeSchema.optional(),
  brandName: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  finish: z.string().optional().nullable(),
  minStockQty: z.number().int().optional(),
  targetStockQty: z.number().int().optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const ClaspVariantSpecUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecUncheckedCreateInput>;
export const ClaspVariantSpecUncheckedCreateInputObjectZodSchema = makeSchema();
