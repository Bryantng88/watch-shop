import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { PartVariantSpecCountOrderByAggregateInputObjectSchema as PartVariantSpecCountOrderByAggregateInputObjectSchema } from './PartVariantSpecCountOrderByAggregateInput.schema';
import { PartVariantSpecMaxOrderByAggregateInputObjectSchema as PartVariantSpecMaxOrderByAggregateInputObjectSchema } from './PartVariantSpecMaxOrderByAggregateInput.schema';
import { PartVariantSpecMinOrderByAggregateInputObjectSchema as PartVariantSpecMinOrderByAggregateInputObjectSchema } from './PartVariantSpecMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  variantId: SortOrderSchema.optional(),
  partType: SortOrderSchema.optional(),
  _count: z.lazy(() => PartVariantSpecCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => PartVariantSpecMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => PartVariantSpecMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const PartVariantSpecOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.PartVariantSpecOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecOrderByWithAggregationInput>;
export const PartVariantSpecOrderByWithAggregationInputObjectZodSchema = makeSchema();
