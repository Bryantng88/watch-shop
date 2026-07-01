import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TaskItemActivityUpdateOneRequiredWithoutRepliesNestedInputObjectSchema as TaskItemActivityUpdateOneRequiredWithoutRepliesNestedInputObjectSchema } from './TaskItemActivityUpdateOneRequiredWithoutRepliesNestedInput.schema';
import { UserUpdateOneWithoutActivityRepliesNestedInputObjectSchema as UserUpdateOneWithoutActivityRepliesNestedInputObjectSchema } from './UserUpdateOneWithoutActivityRepliesNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  body: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  activity: z.lazy(() => TaskItemActivityUpdateOneRequiredWithoutRepliesNestedInputObjectSchema).optional(),
  actorUser: z.lazy(() => UserUpdateOneWithoutActivityRepliesNestedInputObjectSchema).optional()
}).strict();
export const TaskItemActivityReplyUpdateInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUpdateInput>;
export const TaskItemActivityReplyUpdateInputObjectZodSchema = makeSchema();
