import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionTypeSchema } from '../enums/WorkflowActionType.schema'

const nestedenumworkflowactiontypefilterSchema = z.object({
  equals: WorkflowActionTypeSchema.optional(),
  in: WorkflowActionTypeSchema.array().optional(),
  notIn: WorkflowActionTypeSchema.array().optional(),
  not: z.union([WorkflowActionTypeSchema, z.lazy(() => NestedEnumWorkflowActionTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWorkflowActionTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumWorkflowActionTypeFilter> = nestedenumworkflowactiontypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWorkflowActionTypeFilter>;
export const NestedEnumWorkflowActionTypeFilterObjectZodSchema = nestedenumworkflowactiontypefilterSchema;
