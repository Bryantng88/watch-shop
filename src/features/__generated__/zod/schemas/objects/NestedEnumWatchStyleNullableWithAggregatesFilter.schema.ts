import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStyleSchema } from '../enums/WatchStyle.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumWatchStyleNullableFilterObjectSchema as NestedEnumWatchStyleNullableFilterObjectSchema } from './NestedEnumWatchStyleNullableFilter.schema'

const nestedenumwatchstylenullablewithaggregatesfilterSchema = z.object({
  equals: WatchStyleSchema.optional().nullable(),
  in: WatchStyleSchema.array().optional().nullable(),
  notIn: WatchStyleSchema.array().optional().nullable(),
  not: z.union([WatchStyleSchema, z.lazy(() => NestedEnumWatchStyleNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchStyleNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchStyleNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumWatchStyleNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchStyleNullableWithAggregatesFilter> = nestedenumwatchstylenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchStyleNullableWithAggregatesFilter>;
export const NestedEnumWatchStyleNullableWithAggregatesFilterObjectZodSchema = nestedenumwatchstylenullablewithaggregatesfilterSchema;
