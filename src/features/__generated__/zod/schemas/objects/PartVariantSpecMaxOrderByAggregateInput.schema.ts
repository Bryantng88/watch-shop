import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  variantId: SortOrderSchema.optional(),
  partType: SortOrderSchema.optional()
}).strict();
export const PartVariantSpecMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PartVariantSpecMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecMaxOrderByAggregateInput>;
export const PartVariantSpecMaxOrderByAggregateInputObjectZodSchema = makeSchema();
