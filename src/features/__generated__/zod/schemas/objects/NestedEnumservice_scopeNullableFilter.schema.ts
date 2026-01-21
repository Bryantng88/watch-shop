import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { service_scopeSchema } from '../enums/service_scope.schema'

const nestedenumservice_scopenullablefilterSchema = z.object({
  equals: service_scopeSchema.optional().nullable(),
  in: service_scopeSchema.array().optional().nullable(),
  notIn: service_scopeSchema.array().optional().nullable(),
  not: z.union([service_scopeSchema, z.lazy(() => NestedEnumservice_scopeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumservice_scopeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumservice_scopeNullableFilter> = nestedenumservice_scopenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumservice_scopeNullableFilter>;
export const NestedEnumservice_scopeNullableFilterObjectZodSchema = nestedenumservice_scopenullablefilterSchema;
