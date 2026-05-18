import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchServiceStageSchema } from '../enums/WatchServiceStage.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWatchServiceStageFilterObjectSchema as NestedEnumWatchServiceStageFilterObjectSchema } from './NestedEnumWatchServiceStageFilter.schema'

const nestedenumwatchservicestagewithaggregatesfilterSchema = z.object({
  equals: WatchServiceStageSchema.optional(),
  in: WatchServiceStageSchema.array().optional(),
  notIn: WatchServiceStageSchema.array().optional(),
  not: z.union([WatchServiceStageSchema, z.lazy(() => NestedEnumWatchServiceStageWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchServiceStageFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchServiceStageFilterObjectSchema).optional()
}).strict();
export const NestedEnumWatchServiceStageWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchServiceStageWithAggregatesFilter> = nestedenumwatchservicestagewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchServiceStageWithAggregatesFilter>;
export const NestedEnumWatchServiceStageWithAggregatesFilterObjectZodSchema = nestedenumwatchservicestagewithaggregatesfilterSchema;
