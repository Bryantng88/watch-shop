import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CaseTypeSchema } from '../enums/CaseType.schema';
import { NestedEnumCaseTypeNullableWithAggregatesFilterObjectSchema as NestedEnumCaseTypeNullableWithAggregatesFilterObjectSchema } from './NestedEnumCaseTypeNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumCaseTypeNullableFilterObjectSchema as NestedEnumCaseTypeNullableFilterObjectSchema } from './NestedEnumCaseTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: CaseTypeSchema.optional().nullable(),
  in: CaseTypeSchema.array().optional().nullable(),
  notIn: CaseTypeSchema.array().optional().nullable(),
  not: z.union([CaseTypeSchema, z.lazy(() => NestedEnumCaseTypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumCaseTypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumCaseTypeNullableFilterObjectSchema).optional()
}).strict();
export const EnumCaseTypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumCaseTypeNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCaseTypeNullableWithAggregatesFilter>;
export const EnumCaseTypeNullableWithAggregatesFilterObjectZodSchema = makeSchema();
