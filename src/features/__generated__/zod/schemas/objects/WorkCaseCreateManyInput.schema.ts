import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema';
import { WorkCaseStatusSchema } from '../enums/WorkCaseStatus.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  refNo: z.string().optional().nullable(),
  title: z.string(),
  description: z.string().optional().nullable(),
  scope: WorkCaseScopeSchema.optional(),
  status: WorkCaseStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  watchId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  orderId: z.string().optional().nullable(),
  shipmentId: z.string().optional().nullable(),
  raisedByUserId: z.string().optional().nullable(),
  assignedToUserId: z.string().optional().nullable(),
  triagedAt: z.coerce.date().optional().nullable(),
  resolvedAt: z.coerce.date().optional().nullable(),
  cancelledAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const WorkCaseCreateManyInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateManyInput>;
export const WorkCaseCreateManyInputObjectZodSchema = makeSchema();
