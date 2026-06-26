import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagOwnerTypeSchema } from '../enums/AppTagOwnerType.schema';
import { NestedEnumAppTagOwnerTypeNullableWithAggregatesFilterObjectSchema as NestedEnumAppTagOwnerTypeNullableWithAggregatesFilterObjectSchema } from './NestedEnumAppTagOwnerTypeNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumAppTagOwnerTypeNullableFilterObjectSchema as NestedEnumAppTagOwnerTypeNullableFilterObjectSchema } from './NestedEnumAppTagOwnerTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: AppTagOwnerTypeSchema.optional().nullable(),
  in: AppTagOwnerTypeSchema.array().optional().nullable(),
  notIn: AppTagOwnerTypeSchema.array().optional().nullable(),
  not: z.union([AppTagOwnerTypeSchema, z.lazy(() => NestedEnumAppTagOwnerTypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumAppTagOwnerTypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumAppTagOwnerTypeNullableFilterObjectSchema).optional()
}).strict();
export const EnumAppTagOwnerTypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumAppTagOwnerTypeNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumAppTagOwnerTypeNullableWithAggregatesFilter>;
export const EnumAppTagOwnerTypeNullableWithAggregatesFilterObjectZodSchema = makeSchema();
