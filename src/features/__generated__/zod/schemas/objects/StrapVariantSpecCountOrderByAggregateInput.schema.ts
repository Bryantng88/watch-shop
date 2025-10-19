import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  variantId: SortOrderSchema.optional(),
  widthMM: SortOrderSchema.optional(),
  lengthLabel: SortOrderSchema.optional(),
  color: SortOrderSchema.optional(),
  material: SortOrderSchema.optional(),
  quickRelease: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const StrapVariantSpecCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecCountOrderByAggregateInput>;
export const StrapVariantSpecCountOrderByAggregateInputObjectZodSchema = makeSchema();
