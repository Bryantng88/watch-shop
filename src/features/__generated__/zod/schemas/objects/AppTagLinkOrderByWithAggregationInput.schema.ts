import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { AppTagLinkCountOrderByAggregateInputObjectSchema as AppTagLinkCountOrderByAggregateInputObjectSchema } from './AppTagLinkCountOrderByAggregateInput.schema';
import { AppTagLinkMaxOrderByAggregateInputObjectSchema as AppTagLinkMaxOrderByAggregateInputObjectSchema } from './AppTagLinkMaxOrderByAggregateInput.schema';
import { AppTagLinkMinOrderByAggregateInputObjectSchema as AppTagLinkMinOrderByAggregateInputObjectSchema } from './AppTagLinkMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  tagId: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => AppTagLinkCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AppTagLinkMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AppTagLinkMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const AppTagLinkOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.AppTagLinkOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkOrderByWithAggregationInput>;
export const AppTagLinkOrderByWithAggregationInputObjectZodSchema = makeSchema();
