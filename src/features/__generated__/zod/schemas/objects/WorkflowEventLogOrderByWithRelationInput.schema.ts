import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  actorUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const WorkflowEventLogOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WorkflowEventLogOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowEventLogOrderByWithRelationInput>;
export const WorkflowEventLogOrderByWithRelationInputObjectZodSchema = makeSchema();
