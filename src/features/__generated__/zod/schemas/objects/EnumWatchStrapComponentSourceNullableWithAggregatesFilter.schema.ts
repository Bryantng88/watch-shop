import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapComponentSourceSchema } from '../enums/WatchStrapComponentSource.schema';
import { NestedEnumWatchStrapComponentSourceNullableWithAggregatesFilterObjectSchema as NestedEnumWatchStrapComponentSourceNullableWithAggregatesFilterObjectSchema } from './NestedEnumWatchStrapComponentSourceNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumWatchStrapComponentSourceNullableFilterObjectSchema as NestedEnumWatchStrapComponentSourceNullableFilterObjectSchema } from './NestedEnumWatchStrapComponentSourceNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchStrapComponentSourceSchema.optional().nullable(),
  in: WatchStrapComponentSourceSchema.array().optional().nullable(),
  notIn: WatchStrapComponentSourceSchema.array().optional().nullable(),
  not: z.union([WatchStrapComponentSourceSchema, z.lazy(() => NestedEnumWatchStrapComponentSourceNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchStrapComponentSourceNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchStrapComponentSourceNullableFilterObjectSchema).optional()
}).strict();
export const EnumWatchStrapComponentSourceNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchStrapComponentSourceNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchStrapComponentSourceNullableWithAggregatesFilter>;
export const EnumWatchStrapComponentSourceNullableWithAggregatesFilterObjectZodSchema = makeSchema();
