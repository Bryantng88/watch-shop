import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionTypeSchema } from '../enums/WorkflowActionType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWorkflowActionTypeFilterObjectSchema as NestedEnumWorkflowActionTypeFilterObjectSchema } from './NestedEnumWorkflowActionTypeFilter.schema'

const nestedenumworkflowactiontypewithaggregatesfilterSchema = z.object({
  equals: WorkflowActionTypeSchema.optional(),
  in: WorkflowActionTypeSchema.array().optional(),
  notIn: WorkflowActionTypeSchema.array().optional(),
  not: z.union([WorkflowActionTypeSchema, z.lazy(() => NestedEnumWorkflowActionTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWorkflowActionTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWorkflowActionTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumWorkflowActionTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWorkflowActionTypeWithAggregatesFilter> = nestedenumworkflowactiontypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWorkflowActionTypeWithAggregatesFilter>;
export const NestedEnumWorkflowActionTypeWithAggregatesFilterObjectZodSchema = nestedenumworkflowactiontypewithaggregatesfilterSchema;
