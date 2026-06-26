import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AppTagCountOrderByAggregateInputObjectSchema as AppTagCountOrderByAggregateInputObjectSchema } from './AppTagCountOrderByAggregateInput.schema';
import { AppTagMaxOrderByAggregateInputObjectSchema as AppTagMaxOrderByAggregateInputObjectSchema } from './AppTagMaxOrderByAggregateInput.schema';
import { AppTagMinOrderByAggregateInputObjectSchema as AppTagMinOrderByAggregateInputObjectSchema } from './AppTagMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  slug: SortOrderSchema.optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  scope: SortOrderSchema.optional(),
  ownerType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  ownerId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => AppTagCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AppTagMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AppTagMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const AppTagOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.AppTagOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagOrderByWithAggregationInput>;
export const AppTagOrderByWithAggregationInputObjectZodSchema = makeSchema();
