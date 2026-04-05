import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueExecutionStatusSchema } from '../enums/TechnicalIssueExecutionStatus.schema';
import { NestedEnumTechnicalIssueExecutionStatusFilterObjectSchema as NestedEnumTechnicalIssueExecutionStatusFilterObjectSchema } from './NestedEnumTechnicalIssueExecutionStatusFilter.schema'

const makeSchema = () => z.object({
  equals: TechnicalIssueExecutionStatusSchema.optional(),
  in: TechnicalIssueExecutionStatusSchema.array().optional(),
  notIn: TechnicalIssueExecutionStatusSchema.array().optional(),
  not: z.union([TechnicalIssueExecutionStatusSchema, z.lazy(() => NestedEnumTechnicalIssueExecutionStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumTechnicalIssueExecutionStatusFilterObjectSchema: z.ZodType<Prisma.EnumTechnicalIssueExecutionStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalIssueExecutionStatusFilter>;
export const EnumTechnicalIssueExecutionStatusFilterObjectZodSchema = makeSchema();
