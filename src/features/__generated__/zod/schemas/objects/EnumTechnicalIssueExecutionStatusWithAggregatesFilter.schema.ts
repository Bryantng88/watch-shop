import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueExecutionStatusSchema } from '../enums/TechnicalIssueExecutionStatus.schema';
import { NestedEnumTechnicalIssueExecutionStatusWithAggregatesFilterObjectSchema as NestedEnumTechnicalIssueExecutionStatusWithAggregatesFilterObjectSchema } from './NestedEnumTechnicalIssueExecutionStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTechnicalIssueExecutionStatusFilterObjectSchema as NestedEnumTechnicalIssueExecutionStatusFilterObjectSchema } from './NestedEnumTechnicalIssueExecutionStatusFilter.schema'

const makeSchema = () => z.object({
  equals: TechnicalIssueExecutionStatusSchema.optional(),
  in: TechnicalIssueExecutionStatusSchema.array().optional(),
  notIn: TechnicalIssueExecutionStatusSchema.array().optional(),
  not: z.union([TechnicalIssueExecutionStatusSchema, z.lazy(() => NestedEnumTechnicalIssueExecutionStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTechnicalIssueExecutionStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTechnicalIssueExecutionStatusFilterObjectSchema).optional()
}).strict();
export const EnumTechnicalIssueExecutionStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTechnicalIssueExecutionStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalIssueExecutionStatusWithAggregatesFilter>;
export const EnumTechnicalIssueExecutionStatusWithAggregatesFilterObjectZodSchema = makeSchema();
