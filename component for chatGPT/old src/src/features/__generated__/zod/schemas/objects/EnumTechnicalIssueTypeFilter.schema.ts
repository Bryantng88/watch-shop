import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueTypeSchema } from '../enums/TechnicalIssueType.schema';
import { NestedEnumTechnicalIssueTypeFilterObjectSchema as NestedEnumTechnicalIssueTypeFilterObjectSchema } from './NestedEnumTechnicalIssueTypeFilter.schema'

const makeSchema = () => z.object({
  equals: TechnicalIssueTypeSchema.optional(),
  in: TechnicalIssueTypeSchema.array().optional(),
  notIn: TechnicalIssueTypeSchema.array().optional(),
  not: z.union([TechnicalIssueTypeSchema, z.lazy(() => NestedEnumTechnicalIssueTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumTechnicalIssueTypeFilterObjectSchema: z.ZodType<Prisma.EnumTechnicalIssueTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalIssueTypeFilter>;
export const EnumTechnicalIssueTypeFilterObjectZodSchema = makeSchema();
