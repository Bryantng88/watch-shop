import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSaleStageSchema } from '../enums/WatchSaleStage.schema';
import { NestedEnumWatchSaleStageWithAggregatesFilterObjectSchema as NestedEnumWatchSaleStageWithAggregatesFilterObjectSchema } from './NestedEnumWatchSaleStageWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWatchSaleStageFilterObjectSchema as NestedEnumWatchSaleStageFilterObjectSchema } from './NestedEnumWatchSaleStageFilter.schema'

const makeSchema = () => z.object({
  equals: WatchSaleStageSchema.optional(),
  in: WatchSaleStageSchema.array().optional(),
  notIn: WatchSaleStageSchema.array().optional(),
  not: z.union([WatchSaleStageSchema, z.lazy(() => NestedEnumWatchSaleStageWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchSaleStageFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchSaleStageFilterObjectSchema).optional()
}).strict();
export const EnumWatchSaleStageWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchSaleStageWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchSaleStageWithAggregatesFilter>;
export const EnumWatchSaleStageWithAggregatesFilterObjectZodSchema = makeSchema();
