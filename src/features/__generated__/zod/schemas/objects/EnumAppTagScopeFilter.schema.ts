import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagScopeSchema } from '../enums/AppTagScope.schema';
import { NestedEnumAppTagScopeFilterObjectSchema as NestedEnumAppTagScopeFilterObjectSchema } from './NestedEnumAppTagScopeFilter.schema'

const makeSchema = () => z.object({
  equals: AppTagScopeSchema.optional(),
  in: AppTagScopeSchema.array().optional(),
  notIn: AppTagScopeSchema.array().optional(),
  not: z.union([AppTagScopeSchema, z.lazy(() => NestedEnumAppTagScopeFilterObjectSchema)]).optional()
}).strict();
export const EnumAppTagScopeFilterObjectSchema: z.ZodType<Prisma.EnumAppTagScopeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumAppTagScopeFilter>;
export const EnumAppTagScopeFilterObjectZodSchema = makeSchema();
