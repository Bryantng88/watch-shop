import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { WatchSpecOrderByRelationAggregateInputObjectSchema as WatchSpecOrderByRelationAggregateInputObjectSchema } from './WatchSpecOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  watchSpecs: z.lazy(() => WatchSpecOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const MarketSegmentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.MarketSegmentOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentOrderByWithRelationInput>;
export const MarketSegmentOrderByWithRelationInputObjectZodSchema = makeSchema();
