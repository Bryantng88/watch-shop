import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueExecutionStatusSchema } from '../enums/TechnicalIssueExecutionStatus.schema'

const nestedenumtechnicalissueexecutionstatusfilterSchema = z.object({
  equals: TechnicalIssueExecutionStatusSchema.optional(),
  in: TechnicalIssueExecutionStatusSchema.array().optional(),
  notIn: TechnicalIssueExecutionStatusSchema.array().optional(),
  not: z.union([TechnicalIssueExecutionStatusSchema, z.lazy(() => NestedEnumTechnicalIssueExecutionStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTechnicalIssueExecutionStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumTechnicalIssueExecutionStatusFilter> = nestedenumtechnicalissueexecutionstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTechnicalIssueExecutionStatusFilter>;
export const NestedEnumTechnicalIssueExecutionStatusFilterObjectZodSchema = nestedenumtechnicalissueexecutionstatusfilterSchema;
