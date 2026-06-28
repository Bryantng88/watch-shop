import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkflowTemplateCountOrderByAggregateInputObjectSchema as WorkflowTemplateCountOrderByAggregateInputObjectSchema } from './WorkflowTemplateCountOrderByAggregateInput.schema';
import { WorkflowTemplateMaxOrderByAggregateInputObjectSchema as WorkflowTemplateMaxOrderByAggregateInputObjectSchema } from './WorkflowTemplateMaxOrderByAggregateInput.schema';
import { WorkflowTemplateMinOrderByAggregateInputObjectSchema as WorkflowTemplateMinOrderByAggregateInputObjectSchema } from './WorkflowTemplateMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  strategy: SortOrderSchema.optional(),
  ownerType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  ownerId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isSystem: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => WorkflowTemplateCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WorkflowTemplateMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WorkflowTemplateMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateOrderByWithAggregationInput>;
export const WorkflowTemplateOrderByWithAggregationInputObjectZodSchema = makeSchema();
