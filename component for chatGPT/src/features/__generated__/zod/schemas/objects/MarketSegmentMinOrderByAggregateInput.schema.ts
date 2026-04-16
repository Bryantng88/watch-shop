import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const MarketSegmentMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MarketSegmentMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentMinOrderByAggregateInput>;
export const MarketSegmentMinOrderByAggregateInputObjectZodSchema = makeSchema();
