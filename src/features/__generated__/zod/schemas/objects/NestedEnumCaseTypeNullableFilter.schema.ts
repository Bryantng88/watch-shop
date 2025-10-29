import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CaseTypeSchema } from '../enums/CaseType.schema'

const nestedenumcasetypenullablefilterSchema = z.object({
  equals: CaseTypeSchema.optional().nullable(),
  in: CaseTypeSchema.array().optional().nullable(),
  notIn: CaseTypeSchema.array().optional().nullable(),
  not: z.union([CaseTypeSchema, z.lazy(() => NestedEnumCaseTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumCaseTypeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumCaseTypeNullableFilter> = nestedenumcasetypenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumCaseTypeNullableFilter>;
export const NestedEnumCaseTypeNullableFilterObjectZodSchema = nestedenumcasetypenullablefilterSchema;
