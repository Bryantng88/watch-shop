import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { TaskSourceSchema } from '../enums/TaskSource.schema';
import { EnumTaskSourceFieldUpdateOperationsInputObjectSchema as EnumTaskSourceFieldUpdateOperationsInputObjectSchema } from './EnumTaskSourceFieldUpdateOperationsInput.schema';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { EnumTaskStatusFieldUpdateOperationsInputObjectSchema as EnumTaskStatusFieldUpdateOperationsInputObjectSchema } from './EnumTaskStatusFieldUpdateOperationsInput.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { EnumTaskPriorityFieldUpdateOperationsInputObjectSchema as EnumTaskPriorityFieldUpdateOperationsInputObjectSchema } from './EnumTaskPriorityFieldUpdateOperationsInput.schema';
import { TaskKindSchema } from '../enums/TaskKind.schema';
import { EnumTaskKindFieldUpdateOperationsInputObjectSchema as EnumTaskKindFieldUpdateOperationsInputObjectSchema } from './EnumTaskKindFieldUpdateOperationsInput.schema';
import { TaskPeriodSchema } from '../enums/TaskPeriod.schema';
import { NullableEnumTaskPeriodFieldUpdateOperationsInputObjectSchema as NullableEnumTaskPeriodFieldUpdateOperationsInputObjectSchema } from './NullableEnumTaskPeriodFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { UserUpdateOneWithoutAssignedTasksNestedInputObjectSchema as UserUpdateOneWithoutAssignedTasksNestedInputObjectSchema } from './UserUpdateOneWithoutAssignedTasksNestedInput.schema';
import { UserUpdateOneWithoutCompletedTasksNestedInputObjectSchema as UserUpdateOneWithoutCompletedTasksNestedInputObjectSchema } from './UserUpdateOneWithoutCompletedTasksNestedInput.schema';
import { UserUpdateOneWithoutCancelledTasksNestedInputObjectSchema as UserUpdateOneWithoutCancelledTasksNestedInputObjectSchema } from './UserUpdateOneWithoutCancelledTasksNestedInput.schema';
import { TaskItemChecklistUpdateManyWithoutTaskNestedInputObjectSchema as TaskItemChecklistUpdateManyWithoutTaskNestedInputObjectSchema } from './TaskItemChecklistUpdateManyWithoutTaskNestedInput.schema';
import { TaskItemUpdateManyWithoutTaskNestedInputObjectSchema as TaskItemUpdateManyWithoutTaskNestedInputObjectSchema } from './TaskItemUpdateManyWithoutTaskNestedInput.schema';
import { WatchUpdateOneWithoutTasksNestedInputObjectSchema as WatchUpdateOneWithoutTasksNestedInputObjectSchema } from './WatchUpdateOneWithoutTasksNestedInput.schema';
import { OrderUpdateOneWithoutTaskNestedInputObjectSchema as OrderUpdateOneWithoutTaskNestedInputObjectSchema } from './OrderUpdateOneWithoutTaskNestedInput.schema';
import { ShipmentUpdateOneWithoutTaskNestedInputObjectSchema as ShipmentUpdateOneWithoutTaskNestedInputObjectSchema } from './ShipmentUpdateOneWithoutTaskNestedInput.schema';
import { AcquisitionUpdateOneWithoutTaskNestedInputObjectSchema as AcquisitionUpdateOneWithoutTaskNestedInputObjectSchema } from './AcquisitionUpdateOneWithoutTaskNestedInput.schema';
import { ServiceRequestUpdateOneWithoutTaskNestedInputObjectSchema as ServiceRequestUpdateOneWithoutTaskNestedInputObjectSchema } from './ServiceRequestUpdateOneWithoutTaskNestedInput.schema';
import { TechnicalIssueUpdateOneWithoutTaskNestedInputObjectSchema as TechnicalIssueUpdateOneWithoutTaskNestedInputObjectSchema } from './TechnicalIssueUpdateOneWithoutTaskNestedInput.schema';
import { PaymentUpdateOneWithoutTaskNestedInputObjectSchema as PaymentUpdateOneWithoutTaskNestedInputObjectSchema } from './PaymentUpdateOneWithoutTaskNestedInput.schema';
import { WorkCaseUpdateOneWithoutTasksNestedInputObjectSchema as WorkCaseUpdateOneWithoutTasksNestedInputObjectSchema } from './WorkCaseUpdateOneWithoutTasksNestedInput.schema';
import { TaskExecutionUpdateManyWithoutTaskNestedInputObjectSchema as TaskExecutionUpdateManyWithoutTaskNestedInputObjectSchema } from './TaskExecutionUpdateManyWithoutTaskNestedInput.schema';
import { NotificationUpdateManyWithoutTaskNestedInputObjectSchema as NotificationUpdateManyWithoutTaskNestedInputObjectSchema } from './NotificationUpdateManyWithoutTaskNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  source: z.union([TaskSourceSchema, z.lazy(() => EnumTaskSourceFieldUpdateOperationsInputObjectSchema)]).optional(),
  taskTypeId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  status: z.union([TaskStatusSchema, z.lazy(() => EnumTaskStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  priority: z.union([TaskPrioritySchema, z.lazy(() => EnumTaskPriorityFieldUpdateOperationsInputObjectSchema)]).optional(),
  kind: z.union([TaskKindSchema, z.lazy(() => EnumTaskKindFieldUpdateOperationsInputObjectSchema)]).optional(),
  periodType: z.union([TaskPeriodSchema, z.lazy(() => NullableEnumTaskPeriodFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  periodKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  dueAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  startedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  completedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  cancelledAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  taskActionId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  assignedToUser: z.lazy(() => UserUpdateOneWithoutAssignedTasksNestedInputObjectSchema).optional(),
  completedByUser: z.lazy(() => UserUpdateOneWithoutCompletedTasksNestedInputObjectSchema).optional(),
  cancelledByUser: z.lazy(() => UserUpdateOneWithoutCancelledTasksNestedInputObjectSchema).optional(),
  checklistItems: z.lazy(() => TaskItemChecklistUpdateManyWithoutTaskNestedInputObjectSchema).optional(),
  taskItems: z.lazy(() => TaskItemUpdateManyWithoutTaskNestedInputObjectSchema).optional(),
  watch: z.lazy(() => WatchUpdateOneWithoutTasksNestedInputObjectSchema).optional(),
  order: z.lazy(() => OrderUpdateOneWithoutTaskNestedInputObjectSchema).optional(),
  shipment: z.lazy(() => ShipmentUpdateOneWithoutTaskNestedInputObjectSchema).optional(),
  acquisition: z.lazy(() => AcquisitionUpdateOneWithoutTaskNestedInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUpdateOneWithoutTaskNestedInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueUpdateOneWithoutTaskNestedInputObjectSchema).optional(),
  payment: z.lazy(() => PaymentUpdateOneWithoutTaskNestedInputObjectSchema).optional(),
  workCase: z.lazy(() => WorkCaseUpdateOneWithoutTasksNestedInputObjectSchema).optional(),
  executions: z.lazy(() => TaskExecutionUpdateManyWithoutTaskNestedInputObjectSchema).optional(),
  notifications: z.lazy(() => NotificationUpdateManyWithoutTaskNestedInputObjectSchema).optional()
}).strict();
export const TaskUpdateWithoutCreatedByUserInputObjectSchema: z.ZodType<Prisma.TaskUpdateWithoutCreatedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateWithoutCreatedByUserInput>;
export const TaskUpdateWithoutCreatedByUserInputObjectZodSchema = makeSchema();
