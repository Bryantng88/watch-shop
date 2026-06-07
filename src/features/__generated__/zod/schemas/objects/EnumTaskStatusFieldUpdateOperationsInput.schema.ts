import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskStatusSchema } from '../enums/TaskStatus.schema'

const makeSchema = () => z.object({
  set: TaskStatusSchema.optional()
}).strict();
export const EnumTaskStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTaskStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskStatusFieldUpdateOperationsInput>;
export const EnumTaskStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
