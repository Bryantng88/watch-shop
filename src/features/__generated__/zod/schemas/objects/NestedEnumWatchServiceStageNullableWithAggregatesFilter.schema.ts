import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchServiceStageSchema } from '../enums/WatchServiceStage.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumWatchServiceStageNullableFilterObjectSchema as NestedEnumWatchServiceStageNullableFilterObjectSchema } from './NestedEnumWatchServiceStageNullableFilter.schema'

const nestedenumwatchservicestagenullablewithaggregatesfilterSchema = z.object({
  equals: WatchServiceStageSchema.optional().nullable(),
  in: WatchServiceStageSchema.array().optional().nullable(),
  notIn: WatchServiceStageSchema.array().optional().nullable(),
  not: z.union([WatchServiceStageSchema, z.lazy(() => NestedEnumWatchServiceStageNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchServiceStageNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchServiceStageNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumWatchServiceStageNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchServiceStageNullableWithAggregatesFilter> = nestedenumwatchservicestagenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchServiceStageNullableWithAggregatesFilter>;
export const NestedEnumWatchServiceStageNullableWithAggregatesFilterObjectZodSchema = nestedenumwatchservicestagenullablewithaggregatesfilterSchema;
