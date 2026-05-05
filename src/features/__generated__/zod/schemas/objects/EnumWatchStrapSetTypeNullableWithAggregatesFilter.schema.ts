import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapSetTypeSchema } from '../enums/WatchStrapSetType.schema';
import { NestedEnumWatchStrapSetTypeNullableWithAggregatesFilterObjectSchema as NestedEnumWatchStrapSetTypeNullableWithAggregatesFilterObjectSchema } from './NestedEnumWatchStrapSetTypeNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumWatchStrapSetTypeNullableFilterObjectSchema as NestedEnumWatchStrapSetTypeNullableFilterObjectSchema } from './NestedEnumWatchStrapSetTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchStrapSetTypeSchema.optional().nullable(),
  in: WatchStrapSetTypeSchema.array().optional().nullable(),
  notIn: WatchStrapSetTypeSchema.array().optional().nullable(),
  not: z.union([WatchStrapSetTypeSchema, z.lazy(() => NestedEnumWatchStrapSetTypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchStrapSetTypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchStrapSetTypeNullableFilterObjectSchema).optional()
}).strict();
export const EnumWatchStrapSetTypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchStrapSetTypeNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchStrapSetTypeNullableWithAggregatesFilter>;
export const EnumWatchStrapSetTypeNullableWithAggregatesFilterObjectZodSchema = makeSchema();
