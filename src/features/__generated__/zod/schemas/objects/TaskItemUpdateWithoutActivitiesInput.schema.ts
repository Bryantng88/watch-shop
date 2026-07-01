import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { EnumTaskStatusFieldUpdateOperationsInputObjectSchema as EnumTaskStatusFieldUpdateOperationsInputObjectSchema } from './EnumTaskStatusFieldUpdateOperationsInput.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { EnumTaskPriorityFieldUpdateOperationsInputObjectSchema as EnumTaskPriorityFieldUpdateOperationsInputObjectSchema } from './EnumTaskPriorityFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TaskUpdateOneRequiredWithoutTaskItemsNestedInputObjectSchema as TaskUpdateOneRequiredWithoutTaskItemsNestedInputObjectSchema } from './TaskUpdateOneRequiredWithoutTaskItemsNestedInput.schema';
import { UserUpdateOneWithoutAssignedTaskItemsNestedInputObjectSchema as UserUpdateOneWithoutAssignedTaskItemsNestedInputObjectSchema } from './UserUpdateOneWithoutAssignedTaskItemsNestedInput.schema';
import { TaskExecutionUpdateManyWithoutTaskItemNestedInputObjectSchema as TaskExecutionUpdateManyWithoutTaskItemNestedInputObjectSchema } from './TaskExecutionUpdateManyWithoutTaskItemNestedInput.schema';
import { TaskItemChecklistUpdateManyWithoutTaskItemNestedInputObjectSchema as TaskItemChecklistUpdateManyWithoutTaskItemNestedInputObjectSchema } from './TaskItemChecklistUpdateManyWithoutTaskItemNestedInput.schema';
import { UserUpdateOneWithoutTaskItemsNestedInputObjectSchema as UserUpdateOneWithoutTaskItemsNestedInputObjectSchema } from './UserUpdateOneWithoutTaskItemsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  status: z.union([TaskStatusSchema, z.lazy(() => EnumTaskStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  priority: z.union([TaskPrioritySchema, z.lazy(() => EnumTaskPriorityFieldUpdateOperationsInputObjectSchema)]).optional(),
  dueAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  startedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  completedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  cancelledAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isDone: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  sortOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  task: z.lazy(() => TaskUpdateOneRequiredWithoutTaskItemsNestedInputObjectSchema).optional(),
  assignedToUser: z.lazy(() => UserUpdateOneWithoutAssignedTaskItemsNestedInputObjectSchema).optional(),
  executions: z.lazy(() => TaskExecutionUpdateManyWithoutTaskItemNestedInputObjectSchema).optional(),
  checklists: z.lazy(() => TaskItemChecklistUpdateManyWithoutTaskItemNestedInputObjectSchema).optional(),
  User: z.lazy(() => UserUpdateOneWithoutTaskItemsNestedInputObjectSchema).optional()
}).strict();
export const TaskItemUpdateWithoutActivitiesInputObjectSchema: z.ZodType<Prisma.TaskItemUpdateWithoutActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpdateWithoutActivitiesInput>;
export const TaskItemUpdateWithoutActivitiesInputObjectZodSchema = makeSchema();
