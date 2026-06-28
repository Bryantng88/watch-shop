import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionStrategySchema } from '../enums/WorkflowConditionStrategy.schema';
import { NestedEnumWorkflowConditionStrategyFilterObjectSchema as NestedEnumWorkflowConditionStrategyFilterObjectSchema } from './NestedEnumWorkflowConditionStrategyFilter.schema'

const makeSchema = () => z.object({
  equals: WorkflowConditionStrategySchema.optional(),
  in: WorkflowConditionStrategySchema.array().optional(),
  notIn: WorkflowConditionStrategySchema.array().optional(),
  not: z.union([WorkflowConditionStrategySchema, z.lazy(() => NestedEnumWorkflowConditionStrategyFilterObjectSchema)]).optional()
}).strict();
export const EnumWorkflowConditionStrategyFilterObjectSchema: z.ZodType<Prisma.EnumWorkflowConditionStrategyFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkflowConditionStrategyFilter>;
export const EnumWorkflowConditionStrategyFilterObjectZodSchema = makeSchema();
