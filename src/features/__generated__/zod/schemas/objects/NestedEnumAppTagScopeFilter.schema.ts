import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagScopeSchema } from '../enums/AppTagScope.schema'

const nestedenumapptagscopefilterSchema = z.object({
  equals: AppTagScopeSchema.optional(),
  in: AppTagScopeSchema.array().optional(),
  notIn: AppTagScopeSchema.array().optional(),
  not: z.union([AppTagScopeSchema, z.lazy(() => NestedEnumAppTagScopeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumAppTagScopeFilterObjectSchema: z.ZodType<Prisma.NestedEnumAppTagScopeFilter> = nestedenumapptagscopefilterSchema as unknown as z.ZodType<Prisma.NestedEnumAppTagScopeFilter>;
export const NestedEnumAppTagScopeFilterObjectZodSchema = nestedenumapptagscopefilterSchema;
