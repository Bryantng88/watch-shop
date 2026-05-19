import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSaleStageSchema } from '../enums/WatchSaleStage.schema';
import { NestedEnumWatchSaleStageNullableWithAggregatesFilterObjectSchema as NestedEnumWatchSaleStageNullableWithAggregatesFilterObjectSchema } from './NestedEnumWatchSaleStageNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumWatchSaleStageNullableFilterObjectSchema as NestedEnumWatchSaleStageNullableFilterObjectSchema } from './NestedEnumWatchSaleStageNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchSaleStageSchema.optional().nullable(),
  in: WatchSaleStageSchema.array().optional().nullable(),
  notIn: WatchSaleStageSchema.array().optional().nullable(),
  not: z.union([WatchSaleStageSchema, z.lazy(() => NestedEnumWatchSaleStageNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchSaleStageNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchSaleStageNullableFilterObjectSchema).optional()
}).strict();
export const EnumWatchSaleStageNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchSaleStageNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchSaleStageNullableWithAggregatesFilter>;
export const EnumWatchSaleStageNullableWithAggregatesFilterObjectZodSchema = makeSchema();
