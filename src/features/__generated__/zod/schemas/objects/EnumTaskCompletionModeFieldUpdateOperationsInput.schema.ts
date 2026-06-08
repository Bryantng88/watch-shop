import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCompletionModeSchema } from '../enums/TaskCompletionMode.schema'

const makeSchema = () => z.object({
  set: TaskCompletionModeSchema.optional()
}).strict();
export const EnumTaskCompletionModeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTaskCompletionModeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskCompletionModeFieldUpdateOperationsInput>;
export const EnumTaskCompletionModeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
