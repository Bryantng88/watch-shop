import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { BrandCountOrderByAggregateInputObjectSchema as BrandCountOrderByAggregateInputObjectSchema } from './BrandCountOrderByAggregateInput.schema';
import { BrandAvgOrderByAggregateInputObjectSchema as BrandAvgOrderByAggregateInputObjectSchema } from './BrandAvgOrderByAggregateInput.schema';
import { BrandMaxOrderByAggregateInputObjectSchema as BrandMaxOrderByAggregateInputObjectSchema } from './BrandMaxOrderByAggregateInput.schema';
import { BrandMinOrderByAggregateInputObjectSchema as BrandMinOrderByAggregateInputObjectSchema } from './BrandMinOrderByAggregateInput.schema';
import { BrandSumOrderByAggregateInputObjectSchema as BrandSumOrderByAggregateInputObjectSchema } from './BrandSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  slug: SortOrderSchema.optional(),
  country: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  foundedYear: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  website: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  logoUrl: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isAuthorized: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => BrandCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => BrandAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => BrandMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => BrandMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => BrandSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const BrandOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.BrandOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandOrderByWithAggregationInput>;
export const BrandOrderByWithAggregationInputObjectZodSchema = makeSchema();
