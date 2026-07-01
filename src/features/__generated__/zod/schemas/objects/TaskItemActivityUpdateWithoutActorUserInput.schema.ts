import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { ActivitySourceTypeSchema } from '../enums/ActivitySourceType.schema';
import { EnumActivitySourceTypeFieldUpdateOperationsInputObjectSchema as EnumActivitySourceTypeFieldUpdateOperationsInputObjectSchema } from './EnumActivitySourceTypeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { ActivityStatusSchema } from '../enums/ActivityStatus.schema';
import { EnumActivityStatusFieldUpdateOperationsInputObjectSchema as EnumActivityStatusFieldUpdateOperationsInputObjectSchema } from './EnumActivityStatusFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TaskItemUpdateOneRequiredWithoutActivitiesNestedInputObjectSchema as TaskItemUpdateOneRequiredWithoutActivitiesNestedInputObjectSchema } from './TaskItemUpdateOneRequiredWithoutActivitiesNestedInput.schema';
import { TaskItemActivityReplyUpdateManyWithoutActivityNestedInputObjectSchema as TaskItemActivityReplyUpdateManyWithoutActivityNestedInputObjectSchema } from './TaskItemActivityReplyUpdateManyWithoutActivityNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  sourceType: z.union([ActivitySourceTypeSchema, z.lazy(() => EnumActivitySourceTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  sourceId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  body: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  status: z.union([ActivityStatusSchema, z.lazy(() => EnumActivityStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  occurredAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  taskItem: z.lazy(() => TaskItemUpdateOneRequiredWithoutActivitiesNestedInputObjectSchema).optional(),
  replies: z.lazy(() => TaskItemActivityReplyUpdateManyWithoutActivityNestedInputObjectSchema).optional()
}).strict();
export const TaskItemActivityUpdateWithoutActorUserInputObjectSchema: z.ZodType<Prisma.TaskItemActivityUpdateWithoutActorUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityUpdateWithoutActorUserInput>;
export const TaskItemActivityUpdateWithoutActorUserInputObjectZodSchema = makeSchema();
