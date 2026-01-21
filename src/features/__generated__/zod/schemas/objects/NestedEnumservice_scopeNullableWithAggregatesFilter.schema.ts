import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { service_scopeSchema } from '../enums/service_scope.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumservice_scopeNullableFilterObjectSchema as NestedEnumservice_scopeNullableFilterObjectSchema } from './NestedEnumservice_scopeNullableFilter.schema'

const nestedenumservice_scopenullablewithaggregatesfilterSchema = z.object({
  equals: service_scopeSchema.optional().nullable(),
  in: service_scopeSchema.array().optional().nullable(),
  notIn: service_scopeSchema.array().optional().nullable(),
  not: z.union([service_scopeSchema, z.lazy(() => NestedEnumservice_scopeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumservice_scopeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumservice_scopeNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumservice_scopeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumservice_scopeNullableWithAggregatesFilter> = nestedenumservice_scopenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumservice_scopeNullableWithAggregatesFilter>;
export const NestedEnumservice_scopeNullableWithAggregatesFilterObjectZodSchema = nestedenumservice_scopenullablewithaggregatesfilterSchema;
