import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagOwnerTypeSchema } from '../enums/AppTagOwnerType.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumAppTagOwnerTypeNullableFilterObjectSchema as NestedEnumAppTagOwnerTypeNullableFilterObjectSchema } from './NestedEnumAppTagOwnerTypeNullableFilter.schema'

const nestedenumapptagownertypenullablewithaggregatesfilterSchema = z.object({
  equals: AppTagOwnerTypeSchema.optional().nullable(),
  in: AppTagOwnerTypeSchema.array().optional().nullable(),
  notIn: AppTagOwnerTypeSchema.array().optional().nullable(),
  not: z.union([AppTagOwnerTypeSchema, z.lazy(() => NestedEnumAppTagOwnerTypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumAppTagOwnerTypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumAppTagOwnerTypeNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumAppTagOwnerTypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumAppTagOwnerTypeNullableWithAggregatesFilter> = nestedenumapptagownertypenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumAppTagOwnerTypeNullableWithAggregatesFilter>;
export const NestedEnumAppTagOwnerTypeNullableWithAggregatesFilterObjectZodSchema = nestedenumapptagownertypenullablewithaggregatesfilterSchema;
