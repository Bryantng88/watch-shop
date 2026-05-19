import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStockStageSchema } from '../enums/WatchStockStage.schema';
import { NestedEnumWatchStockStageNullableWithAggregatesFilterObjectSchema as NestedEnumWatchStockStageNullableWithAggregatesFilterObjectSchema } from './NestedEnumWatchStockStageNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumWatchStockStageNullableFilterObjectSchema as NestedEnumWatchStockStageNullableFilterObjectSchema } from './NestedEnumWatchStockStageNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchStockStageSchema.optional().nullable(),
  in: WatchStockStageSchema.array().optional().nullable(),
  notIn: WatchStockStageSchema.array().optional().nullable(),
  not: z.union([WatchStockStageSchema, z.lazy(() => NestedEnumWatchStockStageNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchStockStageNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchStockStageNullableFilterObjectSchema).optional()
}).strict();
export const EnumWatchStockStageNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchStockStageNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchStockStageNullableWithAggregatesFilter>;
export const EnumWatchStockStageNullableWithAggregatesFilterObjectZodSchema = makeSchema();
