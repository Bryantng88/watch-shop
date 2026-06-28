import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkflowTemplateOrderByWithRelationInputObjectSchema as WorkflowTemplateOrderByWithRelationInputObjectSchema } from './WorkflowTemplateOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  workflowId: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortOrder: SortOrderSchema.optional(),
  configJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  workflow: z.lazy(() => WorkflowTemplateOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const WorkflowConditionOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WorkflowConditionOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionOrderByWithRelationInput>;
export const WorkflowConditionOrderByWithRelationInputObjectZodSchema = makeSchema();
