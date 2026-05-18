import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStockStageSchema } from '../enums/WatchStockStage.schema';
import { NestedEnumWatchStockStageWithAggregatesFilterObjectSchema as NestedEnumWatchStockStageWithAggregatesFilterObjectSchema } from './NestedEnumWatchStockStageWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWatchStockStageFilterObjectSchema as NestedEnumWatchStockStageFilterObjectSchema } from './NestedEnumWatchStockStageFilter.schema'

const makeSchema = () => z.object({
  equals: WatchStockStageSchema.optional(),
  in: WatchStockStageSchema.array().optional(),
  notIn: WatchStockStageSchema.array().optional(),
  not: z.union([WatchStockStageSchema, z.lazy(() => NestedEnumWatchStockStageWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchStockStageFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchStockStageFilterObjectSchema).optional()
}).strict();
export const EnumWatchStockStageWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchStockStageWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchStockStageWithAggregatesFilter>;
export const EnumWatchStockStageWithAggregatesFilterObjectZodSchema = makeSchema();
