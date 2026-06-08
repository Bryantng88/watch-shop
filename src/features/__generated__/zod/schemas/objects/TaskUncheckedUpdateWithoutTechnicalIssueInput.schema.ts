import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { TaskSourceSchema } from '../enums/TaskSource.schema';
import { EnumTaskSourceFieldUpdateOperationsInputObjectSchema as EnumTaskSourceFieldUpdateOperationsInputObjectSchema } from './EnumTaskSourceFieldUpdateOperationsInput.schema';
import { TaskKindSchema } from '../enums/TaskKind.schema';
import { EnumTaskKindFieldUpdateOperationsInputObjectSchema as EnumTaskKindFieldUpdateOperationsInputObjectSchema } from './EnumTaskKindFieldUpdateOperationsInput.schema';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { EnumTaskStatusFieldUpdateOperationsInputObjectSchema as EnumTaskStatusFieldUpdateOperationsInputObjectSchema } from './EnumTaskStatusFieldUpdateOperationsInput.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { EnumTaskPriorityFieldUpdateOperationsInputObjectSchema as EnumTaskPriorityFieldUpdateOperationsInputObjectSchema } from './EnumTaskPriorityFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NotificationUncheckedUpdateManyWithoutTaskNestedInputObjectSchema as NotificationUncheckedUpdateManyWithoutTaskNestedInputObjectSchema } from './NotificationUncheckedUpdateManyWithoutTaskNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  source: z.union([TaskSourceSchema, z.lazy(() => EnumTaskSourceFieldUpdateOperationsInputObjectSchema)]).optional(),
  kind: z.union([TaskKindSchema, z.lazy(() => EnumTaskKindFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([TaskStatusSchema, z.lazy(() => EnumTaskStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  priority: z.union([TaskPrioritySchema, z.lazy(() => EnumTaskPriorityFieldUpdateOperationsInputObjectSchema)]).optional(),
  dueAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  startedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  completedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  cancelledAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdByUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  assignedToUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  completedByUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  cancelledByUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  watchId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  orderId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  shipmentId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  acquisitionId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  serviceRequestId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  paymentId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  taskTypeId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  notifications: z.lazy(() => NotificationUncheckedUpdateManyWithoutTaskNestedInputObjectSchema).optional()
}).strict();
export const TaskUncheckedUpdateWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TaskUncheckedUpdateWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedUpdateWithoutTechnicalIssueInput>;
export const TaskUncheckedUpdateWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
