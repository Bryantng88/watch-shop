import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskSourceSchema } from '../enums/TaskSource.schema';
import { TaskKindSchema } from '../enums/TaskKind.schema';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  source: TaskSourceSchema.optional(),
  kind: TaskKindSchema.optional(),
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  dueAt: z.coerce.date().optional().nullable(),
  startedAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  cancelledAt: z.coerce.date().optional().nullable(),
  createdByUserId: z.string().optional().nullable(),
  assignedToUserId: z.string().optional().nullable(),
  completedByUserId: z.string().optional().nullable(),
  cancelledByUserId: z.string().optional().nullable(),
  orderId: z.string().optional().nullable(),
  shipmentId: z.string().optional().nullable(),
  acquisitionId: z.string().optional().nullable(),
  serviceRequestId: z.string().optional().nullable(),
  technicalIssueId: z.string().optional().nullable(),
  paymentId: z.string().optional().nullable(),
<<<<<<< HEAD
  taskTypeId: z.string().optional().nullable(),
=======
  workCaseId: z.string().optional().nullable(),
>>>>>>> a011cbb2d4ad4063b85485297cbe895b7833bd15
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const TaskCreateManyWatchInputObjectSchema: z.ZodType<Prisma.TaskCreateManyWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateManyWatchInput>;
export const TaskCreateManyWatchInputObjectZodSchema = makeSchema();
