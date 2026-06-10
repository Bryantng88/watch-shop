import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema'

const nestedenumworkcasescopefilterSchema = z.object({
  equals: WorkCaseScopeSchema.optional(),
  in: WorkCaseScopeSchema.array().optional(),
  notIn: WorkCaseScopeSchema.array().optional(),
  not: z.union([WorkCaseScopeSchema, z.lazy(() => NestedEnumWorkCaseScopeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWorkCaseScopeFilterObjectSchema: z.ZodType<Prisma.NestedEnumWorkCaseScopeFilter> = nestedenumworkcasescopefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWorkCaseScopeFilter>;
export const NestedEnumWorkCaseScopeFilterObjectZodSchema = nestedenumworkcasescopefilterSchema;
