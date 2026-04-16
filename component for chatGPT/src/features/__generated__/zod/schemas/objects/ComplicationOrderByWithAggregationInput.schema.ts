import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ComplicationCountOrderByAggregateInputObjectSchema as ComplicationCountOrderByAggregateInputObjectSchema } from './ComplicationCountOrderByAggregateInput.schema';
import { ComplicationMaxOrderByAggregateInputObjectSchema as ComplicationMaxOrderByAggregateInputObjectSchema } from './ComplicationMaxOrderByAggregateInput.schema';
import { ComplicationMinOrderByAggregateInputObjectSchema as ComplicationMinOrderByAggregateInputObjectSchema } from './ComplicationMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  _count: z.lazy(() => ComplicationCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ComplicationMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ComplicationMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ComplicationOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ComplicationOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationOrderByWithAggregationInput>;
export const ComplicationOrderByWithAggregationInputObjectZodSchema = makeSchema();
