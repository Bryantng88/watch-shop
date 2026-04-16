import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueTypeSchema } from '../enums/TechnicalIssueType.schema'

const nestedenumtechnicalissuetypefilterSchema = z.object({
  equals: TechnicalIssueTypeSchema.optional(),
  in: TechnicalIssueTypeSchema.array().optional(),
  notIn: TechnicalIssueTypeSchema.array().optional(),
  not: z.union([TechnicalIssueTypeSchema, z.lazy(() => NestedEnumTechnicalIssueTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTechnicalIssueTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumTechnicalIssueTypeFilter> = nestedenumtechnicalissuetypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumTechnicalIssueTypeFilter>;
export const NestedEnumTechnicalIssueTypeFilterObjectZodSchema = nestedenumtechnicalissuetypefilterSchema;
