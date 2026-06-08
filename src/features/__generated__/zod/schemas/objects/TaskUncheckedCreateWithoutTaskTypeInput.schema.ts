import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskSourceSchema } from '../enums/TaskSource.schema';
import { TaskKindSchema } from '../enums/TaskKind.schema';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { NotificationUncheckedCreateNestedManyWithoutTaskInputObjectSchema as NotificationUncheckedCreateNestedManyWithoutTaskInputObjectSchema } from './NotificationUncheckedCreateNestedManyWithoutTaskInput.schema'

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
  watchId: z.string().optional().nullable(),
  orderId: z.string().optional().nullable(),
  shipmentId: z.string().optional().nullable(),
  acquisitionId: z.string().optional().nullable(),
  serviceRequestId: z.string().optional().nullable(),
  technicalIssueId: z.string().optional().nullable(),
  paymentId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  notifications: z.lazy(() => NotificationUncheckedCreateNestedManyWithoutTaskInputObjectSchema).optional()
}).strict();
export const TaskUncheckedCreateWithoutTaskTypeInputObjectSchema: z.ZodType<Prisma.TaskUncheckedCreateWithoutTaskTypeInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedCreateWithoutTaskTypeInput>;
export const TaskUncheckedCreateWithoutTaskTypeInputObjectZodSchema = makeSchema();
