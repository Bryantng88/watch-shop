import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchServiceStageSchema } from '../enums/WatchServiceStage.schema';
import { NestedEnumWatchServiceStageWithAggregatesFilterObjectSchema as NestedEnumWatchServiceStageWithAggregatesFilterObjectSchema } from './NestedEnumWatchServiceStageWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWatchServiceStageFilterObjectSchema as NestedEnumWatchServiceStageFilterObjectSchema } from './NestedEnumWatchServiceStageFilter.schema'

const makeSchema = () => z.object({
  equals: WatchServiceStageSchema.optional(),
  in: WatchServiceStageSchema.array().optional(),
  notIn: WatchServiceStageSchema.array().optional(),
  not: z.union([WatchServiceStageSchema, z.lazy(() => NestedEnumWatchServiceStageWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchServiceStageFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchServiceStageFilterObjectSchema).optional()
}).strict();
export const EnumWatchServiceStageWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchServiceStageWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchServiceStageWithAggregatesFilter>;
export const EnumWatchServiceStageWithAggregatesFilterObjectZodSchema = makeSchema();
