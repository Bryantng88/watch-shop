import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskSourceSchema } from '../enums/TaskSource.schema';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { TaskKindSchema } from '../enums/TaskKind.schema';
import { UserCreateNestedOneWithoutCreatedTasksInputObjectSchema as UserCreateNestedOneWithoutCreatedTasksInputObjectSchema } from './UserCreateNestedOneWithoutCreatedTasksInput.schema';
import { UserCreateNestedOneWithoutAssignedTasksInputObjectSchema as UserCreateNestedOneWithoutAssignedTasksInputObjectSchema } from './UserCreateNestedOneWithoutAssignedTasksInput.schema';
import { UserCreateNestedOneWithoutCancelledTasksInputObjectSchema as UserCreateNestedOneWithoutCancelledTasksInputObjectSchema } from './UserCreateNestedOneWithoutCancelledTasksInput.schema';
import { TaskChecklistItemCreateNestedManyWithoutTaskInputObjectSchema as TaskChecklistItemCreateNestedManyWithoutTaskInputObjectSchema } from './TaskChecklistItemCreateNestedManyWithoutTaskInput.schema';
import { WatchCreateNestedOneWithoutTasksInputObjectSchema as WatchCreateNestedOneWithoutTasksInputObjectSchema } from './WatchCreateNestedOneWithoutTasksInput.schema';
import { OrderCreateNestedOneWithoutTaskInputObjectSchema as OrderCreateNestedOneWithoutTaskInputObjectSchema } from './OrderCreateNestedOneWithoutTaskInput.schema';
import { ShipmentCreateNestedOneWithoutTaskInputObjectSchema as ShipmentCreateNestedOneWithoutTaskInputObjectSchema } from './ShipmentCreateNestedOneWithoutTaskInput.schema';
import { AcquisitionCreateNestedOneWithoutTaskInputObjectSchema as AcquisitionCreateNestedOneWithoutTaskInputObjectSchema } from './AcquisitionCreateNestedOneWithoutTaskInput.schema';
import { ServiceRequestCreateNestedOneWithoutTaskInputObjectSchema as ServiceRequestCreateNestedOneWithoutTaskInputObjectSchema } from './ServiceRequestCreateNestedOneWithoutTaskInput.schema';
import { TechnicalIssueCreateNestedOneWithoutTaskInputObjectSchema as TechnicalIssueCreateNestedOneWithoutTaskInputObjectSchema } from './TechnicalIssueCreateNestedOneWithoutTaskInput.schema';
import { PaymentCreateNestedOneWithoutTaskInputObjectSchema as PaymentCreateNestedOneWithoutTaskInputObjectSchema } from './PaymentCreateNestedOneWithoutTaskInput.schema';
import { WorkCaseCreateNestedOneWithoutTasksInputObjectSchema as WorkCaseCreateNestedOneWithoutTasksInputObjectSchema } from './WorkCaseCreateNestedOneWithoutTasksInput.schema';
import { TaskExecutionCreateNestedManyWithoutTaskInputObjectSchema as TaskExecutionCreateNestedManyWithoutTaskInputObjectSchema } from './TaskExecutionCreateNestedManyWithoutTaskInput.schema';
import { NotificationCreateNestedManyWithoutTaskInputObjectSchema as NotificationCreateNestedManyWithoutTaskInputObjectSchema } from './NotificationCreateNestedManyWithoutTaskInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  source: TaskSourceSchema.optional(),
  taskTypeId: z.string().optional().nullable(),
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  kind: TaskKindSchema.optional(),
  dueAt: z.coerce.date().optional().nullable(),
  startedAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  cancelledAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  taskActionId: z.string().optional().nullable(),
  createdByUser: z.lazy(() => UserCreateNestedOneWithoutCreatedTasksInputObjectSchema).optional(),
  assignedToUser: z.lazy(() => UserCreateNestedOneWithoutAssignedTasksInputObjectSchema).optional(),
  cancelledByUser: z.lazy(() => UserCreateNestedOneWithoutCancelledTasksInputObjectSchema).optional(),
  checklistItems: z.lazy(() => TaskChecklistItemCreateNestedManyWithoutTaskInputObjectSchema).optional(),
  watch: z.lazy(() => WatchCreateNestedOneWithoutTasksInputObjectSchema).optional(),
  order: z.lazy(() => OrderCreateNestedOneWithoutTaskInputObjectSchema).optional(),
  shipment: z.lazy(() => ShipmentCreateNestedOneWithoutTaskInputObjectSchema).optional(),
  acquisition: z.lazy(() => AcquisitionCreateNestedOneWithoutTaskInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestCreateNestedOneWithoutTaskInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueCreateNestedOneWithoutTaskInputObjectSchema).optional(),
  payment: z.lazy(() => PaymentCreateNestedOneWithoutTaskInputObjectSchema).optional(),
  workCase: z.lazy(() => WorkCaseCreateNestedOneWithoutTasksInputObjectSchema).optional(),
  executions: z.lazy(() => TaskExecutionCreateNestedManyWithoutTaskInputObjectSchema).optional(),
  notifications: z.lazy(() => NotificationCreateNestedManyWithoutTaskInputObjectSchema).optional()
}).strict();
export const TaskCreateWithoutCompletedByUserInputObjectSchema: z.ZodType<Prisma.TaskCreateWithoutCompletedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateWithoutCompletedByUserInput>;
export const TaskCreateWithoutCompletedByUserInputObjectZodSchema = makeSchema();
