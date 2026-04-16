import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const MarketSegmentOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.MarketSegmentOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentOrderByRelationAggregateInput>;
export const MarketSegmentOrderByRelationAggregateInputObjectZodSchema = makeSchema();
