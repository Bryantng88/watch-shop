import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueExecutionStatusSchema } from '../enums/TechnicalIssueExecutionStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTechnicalIssueExecutionStatusFilterObjectSchema as NestedEnumTechnicalIssueExecutionStatusFilterObjectSchema } from './NestedEnumTechnicalIssueExecutionStatusFilter.schema'

const nestedenumtechnicalissueexecutionstatuswithaggregatesfilterSchema = z.object({
  equals: TechnicalIssueExecutionStatusSchema.optional(),
  in: TechnicalIssueExecutionStatusSchema.array().optional(),
  notIn: TechnicalIssueExecutionStatusSchema.array().optional(),
  not: z.union([TechnicalIssueExecutionStatusSchema, z.lazy(() => NestedEnumTechnicalIssueExecutionStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTechnicalIssueExecutionStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTechnicalIssueExecutionStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumTechnicalIssueExecutionStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTechnicalIssueExecutionStatusWithAggregatesFilter> = nestedenumtechnicalissueexecutionstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTechnicalIssueExecutionStatusWithAggregatesFilter>;
export const NestedEnumTechnicalIssueExecutionStatusWithAggregatesFilterObjectZodSchema = nestedenumtechnicalissueexecutionstatuswithaggregatesfilterSchema;
