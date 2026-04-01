import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueTypeSchema } from '../enums/TechnicalIssueType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTechnicalIssueTypeFilterObjectSchema as NestedEnumTechnicalIssueTypeFilterObjectSchema } from './NestedEnumTechnicalIssueTypeFilter.schema'

const nestedenumtechnicalissuetypewithaggregatesfilterSchema = z.object({
  equals: TechnicalIssueTypeSchema.optional(),
  in: TechnicalIssueTypeSchema.array().optional(),
  notIn: TechnicalIssueTypeSchema.array().optional(),
  not: z.union([TechnicalIssueTypeSchema, z.lazy(() => NestedEnumTechnicalIssueTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTechnicalIssueTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTechnicalIssueTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumTechnicalIssueTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTechnicalIssueTypeWithAggregatesFilter> = nestedenumtechnicalissuetypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTechnicalIssueTypeWithAggregatesFilter>;
export const NestedEnumTechnicalIssueTypeWithAggregatesFilterObjectZodSchema = nestedenumtechnicalissuetypewithaggregatesfilterSchema;
