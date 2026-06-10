import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionActionTypeSchema } from '../enums/TaskExecutionActionType.schema'

const makeSchema = () => z.object({
  set: TaskExecutionActionTypeSchema.optional()
}).strict();
export const EnumTaskExecutionActionTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTaskExecutionActionTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskExecutionActionTypeFieldUpdateOperationsInput>;
export const EnumTaskExecutionActionTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
