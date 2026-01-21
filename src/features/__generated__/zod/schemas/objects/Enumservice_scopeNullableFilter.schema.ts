import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { service_scopeSchema } from '../enums/service_scope.schema';
import { NestedEnumservice_scopeNullableFilterObjectSchema as NestedEnumservice_scopeNullableFilterObjectSchema } from './NestedEnumservice_scopeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: service_scopeSchema.optional().nullable(),
  in: service_scopeSchema.array().optional().nullable(),
  notIn: service_scopeSchema.array().optional().nullable(),
  not: z.union([service_scopeSchema, z.lazy(() => NestedEnumservice_scopeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const Enumservice_scopeNullableFilterObjectSchema: z.ZodType<Prisma.Enumservice_scopeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.Enumservice_scopeNullableFilter>;
export const Enumservice_scopeNullableFilterObjectZodSchema = makeSchema();
