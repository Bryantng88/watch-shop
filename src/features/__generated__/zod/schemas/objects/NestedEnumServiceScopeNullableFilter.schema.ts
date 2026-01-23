import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema'

const nestedenumservicescopenullablefilterSchema = z.object({
  equals: ServiceScopeSchema.optional().nullable(),
  in: ServiceScopeSchema.array().optional().nullable(),
  notIn: ServiceScopeSchema.array().optional().nullable(),
  not: z.union([ServiceScopeSchema, z.lazy(() => NestedEnumServiceScopeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumServiceScopeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumServiceScopeNullableFilter> = nestedenumservicescopenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumServiceScopeNullableFilter>;
export const NestedEnumServiceScopeNullableFilterObjectZodSchema = nestedenumservicescopenullablefilterSchema;
