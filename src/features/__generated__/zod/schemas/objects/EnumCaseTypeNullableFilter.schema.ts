import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CaseTypeSchema } from '../enums/CaseType.schema';
import { NestedEnumCaseTypeNullableFilterObjectSchema as NestedEnumCaseTypeNullableFilterObjectSchema } from './NestedEnumCaseTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: CaseTypeSchema.optional().nullable(),
  in: CaseTypeSchema.array().optional().nullable(),
  notIn: CaseTypeSchema.array().optional().nullable(),
  not: z.union([CaseTypeSchema, z.lazy(() => NestedEnumCaseTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumCaseTypeNullableFilterObjectSchema: z.ZodType<Prisma.EnumCaseTypeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCaseTypeNullableFilter>;
export const EnumCaseTypeNullableFilterObjectZodSchema = makeSchema();
