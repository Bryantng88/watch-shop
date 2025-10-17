import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CaseTypeSchema } from '../enums/CaseType.schema';
import { NestedEnumCaseTypeWithAggregatesFilterObjectSchema as NestedEnumCaseTypeWithAggregatesFilterObjectSchema } from './NestedEnumCaseTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumCaseTypeFilterObjectSchema as NestedEnumCaseTypeFilterObjectSchema } from './NestedEnumCaseTypeFilter.schema'

const makeSchema = () => z.object({
  equals: CaseTypeSchema.optional(),
  in: CaseTypeSchema.array().optional(),
  notIn: CaseTypeSchema.array().optional(),
  not: z.union([CaseTypeSchema, z.lazy(() => NestedEnumCaseTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumCaseTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumCaseTypeFilterObjectSchema).optional()
}).strict();
export const EnumCaseTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumCaseTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCaseTypeWithAggregatesFilter>;
export const EnumCaseTypeWithAggregatesFilterObjectZodSchema = makeSchema();
