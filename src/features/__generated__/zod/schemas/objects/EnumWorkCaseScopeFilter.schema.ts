import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema';
import { NestedEnumWorkCaseScopeFilterObjectSchema as NestedEnumWorkCaseScopeFilterObjectSchema } from './NestedEnumWorkCaseScopeFilter.schema'

const makeSchema = () => z.object({
  equals: WorkCaseScopeSchema.optional(),
  in: WorkCaseScopeSchema.array().optional(),
  notIn: WorkCaseScopeSchema.array().optional(),
  not: z.union([WorkCaseScopeSchema, z.lazy(() => NestedEnumWorkCaseScopeFilterObjectSchema)]).optional()
}).strict();
export const EnumWorkCaseScopeFilterObjectSchema: z.ZodType<Prisma.EnumWorkCaseScopeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkCaseScopeFilter>;
export const EnumWorkCaseScopeFilterObjectZodSchema = makeSchema();
