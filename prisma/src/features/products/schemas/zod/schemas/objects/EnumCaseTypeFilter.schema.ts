import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CaseTypeSchema } from '../enums/CaseType.schema';
import { NestedEnumCaseTypeFilterObjectSchema as NestedEnumCaseTypeFilterObjectSchema } from './NestedEnumCaseTypeFilter.schema'

const makeSchema = () => z.object({
  equals: CaseTypeSchema.optional(),
  in: CaseTypeSchema.array().optional(),
  notIn: CaseTypeSchema.array().optional(),
  not: z.union([CaseTypeSchema, z.lazy(() => NestedEnumCaseTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumCaseTypeFilterObjectSchema: z.ZodType<Prisma.EnumCaseTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCaseTypeFilter>;
export const EnumCaseTypeFilterObjectZodSchema = makeSchema();
