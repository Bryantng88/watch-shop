import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionStrategySchema } from '../enums/WorkflowConditionStrategy.schema';
import { NestedEnumWorkflowConditionStrategyWithAggregatesFilterObjectSchema as NestedEnumWorkflowConditionStrategyWithAggregatesFilterObjectSchema } from './NestedEnumWorkflowConditionStrategyWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWorkflowConditionStrategyFilterObjectSchema as NestedEnumWorkflowConditionStrategyFilterObjectSchema } from './NestedEnumWorkflowConditionStrategyFilter.schema'

const makeSchema = () => z.object({
  equals: WorkflowConditionStrategySchema.optional(),
  in: WorkflowConditionStrategySchema.array().optional(),
  notIn: WorkflowConditionStrategySchema.array().optional(),
  not: z.union([WorkflowConditionStrategySchema, z.lazy(() => NestedEnumWorkflowConditionStrategyWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWorkflowConditionStrategyFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWorkflowConditionStrategyFilterObjectSchema).optional()
}).strict();
export const EnumWorkflowConditionStrategyWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWorkflowConditionStrategyWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkflowConditionStrategyWithAggregatesFilter>;
export const EnumWorkflowConditionStrategyWithAggregatesFilterObjectZodSchema = makeSchema();
