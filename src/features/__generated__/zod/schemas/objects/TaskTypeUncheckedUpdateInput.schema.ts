import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { TaskDomainSchema } from '../enums/TaskDomain.schema';
import { EnumTaskDomainFieldUpdateOperationsInputObjectSchema as EnumTaskDomainFieldUpdateOperationsInputObjectSchema } from './EnumTaskDomainFieldUpdateOperationsInput.schema';
import { TaskKindSchema } from '../enums/TaskKind.schema';
import { EnumTaskKindFieldUpdateOperationsInputObjectSchema as EnumTaskKindFieldUpdateOperationsInputObjectSchema } from './EnumTaskKindFieldUpdateOperationsInput.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { EnumTaskPriorityFieldUpdateOperationsInputObjectSchema as EnumTaskPriorityFieldUpdateOperationsInputObjectSchema } from './EnumTaskPriorityFieldUpdateOperationsInput.schema';
import { TaskCompletionModeSchema } from '../enums/TaskCompletionMode.schema';
import { EnumTaskCompletionModeFieldUpdateOperationsInputObjectSchema as EnumTaskCompletionModeFieldUpdateOperationsInputObjectSchema } from './EnumTaskCompletionModeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TaskUncheckedUpdateManyWithoutTaskTypeNestedInputObjectSchema as TaskUncheckedUpdateManyWithoutTaskTypeNestedInputObjectSchema } from './TaskUncheckedUpdateManyWithoutTaskTypeNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  domain: z.union([TaskDomainSchema, z.lazy(() => EnumTaskDomainFieldUpdateOperationsInputObjectSchema)]).optional(),
  legacyKind: z.union([TaskKindSchema, z.lazy(() => EnumTaskKindFieldUpdateOperationsInputObjectSchema)]).optional(),
  defaultPriority: z.union([TaskPrioritySchema, z.lazy(() => EnumTaskPriorityFieldUpdateOperationsInputObjectSchema)]).optional(),
  completionMode: z.union([TaskCompletionModeSchema, z.lazy(() => EnumTaskCompletionModeFieldUpdateOperationsInputObjectSchema)]).optional(),
  completionRuleKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isActive: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  sortOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  tasks: z.lazy(() => TaskUncheckedUpdateManyWithoutTaskTypeNestedInputObjectSchema).optional()
}).strict();
export const TaskTypeUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.TaskTypeUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeUncheckedUpdateInput>;
export const TaskTypeUncheckedUpdateInputObjectZodSchema = makeSchema();
