import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumServiceScopeNullableFilterObjectSchema as NestedEnumServiceScopeNullableFilterObjectSchema } from './NestedEnumServiceScopeNullableFilter.schema'

const nestedenumservicescopenullablewithaggregatesfilterSchema = z.object({
  equals: ServiceScopeSchema.optional().nullable(),
  in: ServiceScopeSchema.array().optional().nullable(),
  notIn: ServiceScopeSchema.array().optional().nullable(),
  not: z.union([ServiceScopeSchema, z.lazy(() => NestedEnumServiceScopeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumServiceScopeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumServiceScopeNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumServiceScopeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumServiceScopeNullableWithAggregatesFilter> = nestedenumservicescopenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumServiceScopeNullableWithAggregatesFilter>;
export const NestedEnumServiceScopeNullableWithAggregatesFilterObjectZodSchema = nestedenumservicescopenullablewithaggregatesfilterSchema;
