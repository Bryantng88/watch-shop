import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema'

const makeSchema = () => z.object({
  set: TaskPrioritySchema.optional()
}).strict();
export const EnumTaskPriorityFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTaskPriorityFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskPriorityFieldUpdateOperationsInput>;
export const EnumTaskPriorityFieldUpdateOperationsInputObjectZodSchema = makeSchema();
