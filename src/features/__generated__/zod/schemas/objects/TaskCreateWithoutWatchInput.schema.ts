import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskSourceSchema } from '../enums/TaskSource.schema';
import { TaskKindSchema } from '../enums/TaskKind.schema';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { UserCreateNestedOneWithoutCreatedTasksInputObjectSchema as UserCreateNestedOneWithoutCreatedTasksInputObjectSchema } from './UserCreateNestedOneWithoutCreatedTasksInput.schema';
import { UserCreateNestedOneWithoutAssignedTasksInputObjectSchema as UserCreateNestedOneWithoutAssignedTasksInputObjectSchema } from './UserCreateNestedOneWithoutAssignedTasksInput.schema';
import { UserCreateNestedOneWithoutCompletedTasksInputObjectSchema as UserCreateNestedOneWithoutCompletedTasksInputObjectSchema } from './UserCreateNestedOneWithoutCompletedTasksInput.schema';
import { UserCreateNestedOneWithoutCancelledTasksInputObjectSchema as UserCreateNestedOneWithoutCancelledTasksInputObjectSchema } from './UserCreateNestedOneWithoutCancelledTasksInput.schema';
import { TaskTypeCreateNestedOneWithoutTasksInputObjectSchema as TaskTypeCreateNestedOneWithoutTasksInputObjectSchema } from './TaskTypeCreateNestedOneWithoutTasksInput.schema';
import { OrderCreateNestedOneWithoutTaskInputObjectSchema as OrderCreateNestedOneWithoutTaskInputObjectSchema } from './OrderCreateNestedOneWithoutTaskInput.schema';
import { ShipmentCreateNestedOneWithoutTaskInputObjectSchema as ShipmentCreateNestedOneWithoutTaskInputObjectSchema } from './ShipmentCreateNestedOneWithoutTaskInput.schema';
import { AcquisitionCreateNestedOneWithoutTaskInputObjectSchema as AcquisitionCreateNestedOneWithoutTaskInputObjectSchema } from './AcquisitionCreateNestedOneWithoutTaskInput.schema';
import { ServiceRequestCreateNestedOneWithoutTaskInputObjectSchema as ServiceRequestCreateNestedOneWithoutTaskInputObjectSchema } from './ServiceRequestCreateNestedOneWithoutTaskInput.schema';
import { TechnicalIssueCreateNestedOneWithoutTaskInputObjectSchema as TechnicalIssueCreateNestedOneWithoutTaskInputObjectSchema } from './TechnicalIssueCreateNestedOneWithoutTaskInput.schema';
import { PaymentCreateNestedOneWithoutTaskInputObjectSchema as PaymentCreateNestedOneWithoutTaskInputObjectSchema } from './PaymentCreateNestedOneWithoutTaskInput.schema';
import { NotificationCreateNestedManyWithoutTaskInputObjectSchema as NotificationCreateNestedManyWithoutTaskInputObjectSchema } from './NotificationCreateNestedManyWithoutTaskInput.schema'

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
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdByUser: z.lazy(() => UserCreateNestedOneWithoutCreatedTasksInputObjectSchema).optional(),
  assignedToUser: z.lazy(() => UserCreateNestedOneWithoutAssignedTasksInputObjectSchema).optional(),
  completedByUser: z.lazy(() => UserCreateNestedOneWithoutCompletedTasksInputObjectSchema).optional(),
  cancelledByUser: z.lazy(() => UserCreateNestedOneWithoutCancelledTasksInputObjectSchema).optional(),
  taskType: z.lazy(() => TaskTypeCreateNestedOneWithoutTasksInputObjectSchema).optional(),
  order: z.lazy(() => OrderCreateNestedOneWithoutTaskInputObjectSchema).optional(),
  shipment: z.lazy(() => ShipmentCreateNestedOneWithoutTaskInputObjectSchema).optional(),
  acquisition: z.lazy(() => AcquisitionCreateNestedOneWithoutTaskInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestCreateNestedOneWithoutTaskInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueCreateNestedOneWithoutTaskInputObjectSchema).optional(),
  payment: z.lazy(() => PaymentCreateNestedOneWithoutTaskInputObjectSchema).optional(),
  notifications: z.lazy(() => NotificationCreateNestedManyWithoutTaskInputObjectSchema).optional()
}).strict();
export const TaskCreateWithoutWatchInputObjectSchema: z.ZodType<Prisma.TaskCreateWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateWithoutWatchInput>;
export const TaskCreateWithoutWatchInputObjectZodSchema = makeSchema();
