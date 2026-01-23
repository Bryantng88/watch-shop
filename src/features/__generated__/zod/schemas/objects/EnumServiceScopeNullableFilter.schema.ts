import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema';
import { NestedEnumServiceScopeNullableFilterObjectSchema as NestedEnumServiceScopeNullableFilterObjectSchema } from './NestedEnumServiceScopeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: ServiceScopeSchema.optional().nullable(),
  in: ServiceScopeSchema.array().optional().nullable(),
  notIn: ServiceScopeSchema.array().optional().nullable(),
  not: z.union([ServiceScopeSchema, z.lazy(() => NestedEnumServiceScopeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumServiceScopeNullableFilterObjectSchema: z.ZodType<Prisma.EnumServiceScopeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumServiceScopeNullableFilter>;
export const EnumServiceScopeNullableFilterObjectZodSchema = makeSchema();
