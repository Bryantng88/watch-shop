import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapSetTypeSchema } from '../enums/WatchStrapSetType.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumWatchStrapSetTypeNullableFilterObjectSchema as NestedEnumWatchStrapSetTypeNullableFilterObjectSchema } from './NestedEnumWatchStrapSetTypeNullableFilter.schema'

const nestedenumwatchstrapsettypenullablewithaggregatesfilterSchema = z.object({
  equals: WatchStrapSetTypeSchema.optional().nullable(),
  in: WatchStrapSetTypeSchema.array().optional().nullable(),
  notIn: WatchStrapSetTypeSchema.array().optional().nullable(),
  not: z.union([WatchStrapSetTypeSchema, z.lazy(() => NestedEnumWatchStrapSetTypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchStrapSetTypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchStrapSetTypeNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumWatchStrapSetTypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchStrapSetTypeNullableWithAggregatesFilter> = nestedenumwatchstrapsettypenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchStrapSetTypeNullableWithAggregatesFilter>;
export const NestedEnumWatchStrapSetTypeNullableWithAggregatesFilterObjectZodSchema = nestedenumwatchstrapsettypenullablewithaggregatesfilterSchema;
