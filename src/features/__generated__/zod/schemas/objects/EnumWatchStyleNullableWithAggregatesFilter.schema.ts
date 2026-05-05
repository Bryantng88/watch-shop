import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStyleSchema } from '../enums/WatchStyle.schema';
import { NestedEnumWatchStyleNullableWithAggregatesFilterObjectSchema as NestedEnumWatchStyleNullableWithAggregatesFilterObjectSchema } from './NestedEnumWatchStyleNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumWatchStyleNullableFilterObjectSchema as NestedEnumWatchStyleNullableFilterObjectSchema } from './NestedEnumWatchStyleNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchStyleSchema.optional().nullable(),
  in: WatchStyleSchema.array().optional().nullable(),
  notIn: WatchStyleSchema.array().optional().nullable(),
  not: z.union([WatchStyleSchema, z.lazy(() => NestedEnumWatchStyleNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchStyleNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchStyleNullableFilterObjectSchema).optional()
}).strict();
export const EnumWatchStyleNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchStyleNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchStyleNullableWithAggregatesFilter>;
export const EnumWatchStyleNullableWithAggregatesFilterObjectZodSchema = makeSchema();
