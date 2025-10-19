import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { MarketSegmentCountOrderByAggregateInputObjectSchema as MarketSegmentCountOrderByAggregateInputObjectSchema } from './MarketSegmentCountOrderByAggregateInput.schema';
import { MarketSegmentMaxOrderByAggregateInputObjectSchema as MarketSegmentMaxOrderByAggregateInputObjectSchema } from './MarketSegmentMaxOrderByAggregateInput.schema';
import { MarketSegmentMinOrderByAggregateInputObjectSchema as MarketSegmentMinOrderByAggregateInputObjectSchema } from './MarketSegmentMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  _count: z.lazy(() => MarketSegmentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => MarketSegmentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => MarketSegmentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const MarketSegmentOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.MarketSegmentOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentOrderByWithAggregationInput>;
export const MarketSegmentOrderByWithAggregationInputObjectZodSchema = makeSchema();
