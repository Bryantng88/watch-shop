import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchServiceStageSchema } from '../enums/WatchServiceStage.schema';
import { NestedEnumWatchServiceStageNullableWithAggregatesFilterObjectSchema as NestedEnumWatchServiceStageNullableWithAggregatesFilterObjectSchema } from './NestedEnumWatchServiceStageNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumWatchServiceStageNullableFilterObjectSchema as NestedEnumWatchServiceStageNullableFilterObjectSchema } from './NestedEnumWatchServiceStageNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchServiceStageSchema.optional().nullable(),
  in: WatchServiceStageSchema.array().optional().nullable(),
  notIn: WatchServiceStageSchema.array().optional().nullable(),
  not: z.union([WatchServiceStageSchema, z.lazy(() => NestedEnumWatchServiceStageNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchServiceStageNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchServiceStageNullableFilterObjectSchema).optional()
}).strict();
export const EnumWatchServiceStageNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchServiceStageNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchServiceStageNullableWithAggregatesFilter>;
export const EnumWatchServiceStageNullableWithAggregatesFilterObjectZodSchema = makeSchema();
