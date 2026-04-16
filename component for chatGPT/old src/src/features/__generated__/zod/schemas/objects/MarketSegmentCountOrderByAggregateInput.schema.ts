import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const MarketSegmentCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MarketSegmentCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentCountOrderByAggregateInput>;
export const MarketSegmentCountOrderByAggregateInputObjectZodSchema = makeSchema();
