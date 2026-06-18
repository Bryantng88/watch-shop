import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TaskUpdateOneRequiredWithoutChecklistItemsNestedInputObjectSchema as TaskUpdateOneRequiredWithoutChecklistItemsNestedInputObjectSchema } from './TaskUpdateOneRequiredWithoutChecklistItemsNestedInput.schema';
import { TaskExecutionUpdateManyWithoutChecklistItemNestedInputObjectSchema as TaskExecutionUpdateManyWithoutChecklistItemNestedInputObjectSchema } from './TaskExecutionUpdateManyWithoutChecklistItemNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isDone: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  sortOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  task: z.lazy(() => TaskUpdateOneRequiredWithoutChecklistItemsNestedInputObjectSchema).optional(),
  executions: z.lazy(() => TaskExecutionUpdateManyWithoutChecklistItemNestedInputObjectSchema).optional()
}).strict();
export const TaskChecklistItemUpdateInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUpdateInput>;
export const TaskChecklistItemUpdateInputObjectZodSchema = makeSchema();
