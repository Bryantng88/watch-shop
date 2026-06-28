import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionStrategySchema } from '../enums/WorkflowConditionStrategy.schema'

const nestedenumworkflowconditionstrategyfilterSchema = z.object({
  equals: WorkflowConditionStrategySchema.optional(),
  in: WorkflowConditionStrategySchema.array().optional(),
  notIn: WorkflowConditionStrategySchema.array().optional(),
  not: z.union([WorkflowConditionStrategySchema, z.lazy(() => NestedEnumWorkflowConditionStrategyFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWorkflowConditionStrategyFilterObjectSchema: z.ZodType<Prisma.NestedEnumWorkflowConditionStrategyFilter> = nestedenumworkflowconditionstrategyfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWorkflowConditionStrategyFilter>;
export const NestedEnumWorkflowConditionStrategyFilterObjectZodSchema = nestedenumworkflowconditionstrategyfilterSchema;
