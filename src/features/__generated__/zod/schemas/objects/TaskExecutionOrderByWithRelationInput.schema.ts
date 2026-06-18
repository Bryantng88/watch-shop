import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskOrderByWithRelationInputObjectSchema as TaskOrderByWithRelationInputObjectSchema } from './TaskOrderByWithRelationInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { TaskChecklistItemOrderByWithRelationInputObjectSchema as TaskChecklistItemOrderByWithRelationInputObjectSchema } from './TaskChecklistItemOrderByWithRelationInput.schema';
import { ServiceRequestOrderByWithRelationInputObjectSchema as ServiceRequestOrderByWithRelationInputObjectSchema } from './ServiceRequestOrderByWithRelationInput.schema';
import { TechnicalIssueOrderByWithRelationInputObjectSchema as TechnicalIssueOrderByWithRelationInputObjectSchema } from './TechnicalIssueOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskId: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  actionType: SortOrderSchema.optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdByUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  checklistItemId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceRequestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  technicalIssueId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  task: z.lazy(() => TaskOrderByWithRelationInputObjectSchema).optional(),
  createdByUser: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  checklistItem: z.lazy(() => TaskChecklistItemOrderByWithRelationInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestOrderByWithRelationInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const TaskExecutionOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TaskExecutionOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionOrderByWithRelationInput>;
export const TaskExecutionOrderByWithRelationInputObjectZodSchema = makeSchema();
