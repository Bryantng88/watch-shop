import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { EnumTaskExecutionTargetTypeFieldUpdateOperationsInputObjectSchema as EnumTaskExecutionTargetTypeFieldUpdateOperationsInputObjectSchema } from './EnumTaskExecutionTargetTypeFieldUpdateOperationsInput.schema';
import { TaskExecutionActionTypeSchema } from '../enums/TaskExecutionActionType.schema';
import { EnumTaskExecutionActionTypeFieldUpdateOperationsInputObjectSchema as EnumTaskExecutionActionTypeFieldUpdateOperationsInputObjectSchema } from './EnumTaskExecutionActionTypeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TaskUpdateOneRequiredWithoutExecutionsNestedInputObjectSchema as TaskUpdateOneRequiredWithoutExecutionsNestedInputObjectSchema } from './TaskUpdateOneRequiredWithoutExecutionsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetType: z.union([TaskExecutionTargetTypeSchema, z.lazy(() => EnumTaskExecutionTargetTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  actionType: z.union([TaskExecutionActionTypeSchema, z.lazy(() => EnumTaskExecutionActionTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  task: z.lazy(() => TaskUpdateOneRequiredWithoutExecutionsNestedInputObjectSchema).optional()
}).strict();
export const TaskExecutionUpdateWithoutCreatedByUserInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateWithoutCreatedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateWithoutCreatedByUserInput>;
export const TaskExecutionUpdateWithoutCreatedByUserInputObjectZodSchema = makeSchema();
