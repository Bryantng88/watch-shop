import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AppTagLinkOrderByRelationAggregateInputObjectSchema as AppTagLinkOrderByRelationAggregateInputObjectSchema } from './AppTagLinkOrderByRelationAggregateInput.schema';
import { WorkflowTemplateOrderByWithRelationInputObjectSchema as WorkflowTemplateOrderByWithRelationInputObjectSchema } from './WorkflowTemplateOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  slug: SortOrderSchema.optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  scope: SortOrderSchema.optional(),
  ownerType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  ownerId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  workflowTemplateId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  links: z.lazy(() => AppTagLinkOrderByRelationAggregateInputObjectSchema).optional(),
  workflowTemplate: z.lazy(() => WorkflowTemplateOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const AppTagOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.AppTagOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagOrderByWithRelationInput>;
export const AppTagOrderByWithRelationInputObjectZodSchema = makeSchema();
