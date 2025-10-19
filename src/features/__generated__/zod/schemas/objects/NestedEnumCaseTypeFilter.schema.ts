import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CaseTypeSchema } from '../enums/CaseType.schema'

const nestedenumcasetypefilterSchema = z.object({
  equals: CaseTypeSchema.optional(),
  in: CaseTypeSchema.array().optional(),
  notIn: CaseTypeSchema.array().optional(),
  not: z.union([CaseTypeSchema, z.lazy(() => NestedEnumCaseTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumCaseTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumCaseTypeFilter> = nestedenumcasetypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumCaseTypeFilter>;
export const NestedEnumCaseTypeFilterObjectZodSchema = nestedenumcasetypefilterSchema;
