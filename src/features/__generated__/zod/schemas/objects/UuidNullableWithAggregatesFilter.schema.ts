import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { QueryModeSchema } from '../enums/QueryMode.schema';
import { NestedUuidNullableWithAggregatesFilterObjectSchema as NestedUuidNullableWithAggregatesFilterObjectSchema } from './NestedUuidNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedStringNullableFilterObjectSchema as NestedStringNullableFilterObjectSchema } from './NestedStringNullableFilter.schema'

const makeSchema = () => z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  mode: QueryModeSchema.optional(),
  not: z.union([z.string(), z.lazy(() => NestedUuidNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterObjectSchema).optional()
}).strict();
export const UuidNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.UuidNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.UuidNullableWithAggregatesFilter>;
export const UuidNullableWithAggregatesFilterObjectZodSchema = makeSchema();
