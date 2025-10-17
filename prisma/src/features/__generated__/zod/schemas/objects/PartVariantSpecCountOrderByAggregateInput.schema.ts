import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  variantId: SortOrderSchema.optional(),
  partType: SortOrderSchema.optional()
}).strict();
export const PartVariantSpecCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PartVariantSpecCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecCountOrderByAggregateInput>;
export const PartVariantSpecCountOrderByAggregateInputObjectZodSchema = makeSchema();
