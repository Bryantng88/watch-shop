import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { NestedEnumContentStatusNullableWithAggregatesFilterObjectSchema as NestedEnumContentStatusNullableWithAggregatesFilterObjectSchema } from './NestedEnumContentStatusNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumContentStatusNullableFilterObjectSchema as NestedEnumContentStatusNullableFilterObjectSchema } from './NestedEnumContentStatusNullableFilter.schema'

const makeSchema = () => z.object({
  equals: ContentStatusSchema.optional().nullable(),
  in: ContentStatusSchema.array().optional().nullable(),
  notIn: ContentStatusSchema.array().optional().nullable(),
  not: z.union([ContentStatusSchema, z.lazy(() => NestedEnumContentStatusNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumContentStatusNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumContentStatusNullableFilterObjectSchema).optional()
}).strict();
export const EnumContentStatusNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumContentStatusNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumContentStatusNullableWithAggregatesFilter>;
export const EnumContentStatusNullableWithAggregatesFilterObjectZodSchema = makeSchema();
