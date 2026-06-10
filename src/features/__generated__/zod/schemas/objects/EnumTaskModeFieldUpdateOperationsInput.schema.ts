import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskModeSchema } from '../enums/TaskMode.schema'

const makeSchema = () => z.object({
  set: TaskModeSchema.optional()
}).strict();
export const EnumTaskModeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTaskModeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskModeFieldUpdateOperationsInput>;
export const EnumTaskModeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
